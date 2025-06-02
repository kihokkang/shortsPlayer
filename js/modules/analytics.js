/**
 * =====================================================
 * 화면명 : analytics.js
 * 작성자 : 김기호
 * 작성일: 2025.04.30
 * 설명: 사용자 이벤트 트랙킹을 위한 분석 관리 모듈
 * =====================================================
 */

import { API_URLS } from '../config/constants.js';

export class Analytics {
    constructor(options = {}) {
        this.isPreviewMode = options.isPreviewMode || false;
        this.interactionMap = new Map();
    }

    // 외부에서 호출할 수 있는 init 메서드
    init() {
        if(!this.isPreviewMode) {
            this.initAnalytics();
            this.startActionLogTimer();
        }
    }

    initAnalytics() {
        // 분석 초기화 로직
        console.log('Analytics initialized');
        console.log('window.cuid : ', window.cuid);
        console.log('window.shortsSendSeq : ', window.shortsSendSeq);
        
        // 초기 데이터 설정
        if (window.slidesData && window.currentSlideIndex !== undefined) {
            const currentSlide = window.slidesData[window.currentSlideIndex];
            if (currentSlide) {
                const key = `${currentSlide.shortsIdx}_${window.cuid}_${window.shortsSendSeq || 0}_SHORTS_`;
                this.interactionMap.set(key, {
                    shortsIdx: currentSlide.shortsIdx,
                    cuid: window.cuid,
                    shortsSendSeq: window.shortsSendSeq || 0,
                    actTp: 'SHORTS',
                    actExt: '',
                    actCnt: 1
                });
            }
        }
    }

    trackInteraction(shortsIdx, cuid, shortsSendSeq, actTp, actExt, actCnt) {
        const key = `${shortsIdx}_${cuid}_${shortsSendSeq}_${actTp}_${actExt || ''}`;
        const interaction = {
            shortsIdx: shortsIdx,              // 쇼츠 인덱스
            cuid: cuid,                        // 유저 정보
            shortsSendSeq: shortsSendSeq,      // UMS Send 시퀀스
            actTp: actTp,                      // 액션 타입 (SHORTS(슬라이드당), FINE(좋아요), PLINK(상품), SNS(공유하기), CHAT(챗봇), RV(리뷰))
            actExt: actExt,                    // 액션 상세 (RV : keyword , SNS : [ U, K, F ])
            actCnt: actCnt                     // 액션 카운트
        };
        this.interactionMap.set(key, interaction);
        console.log('Added interaction:', this.interactionMap);
    }

    getInteractionData() {
        return Array.from(this.interactionMap.values());
    }

    clearInteractionData() {
        this.interactionMap.clear();
    }

    trackData(data) {
        // 해시태그 클릭 이벤트 추적
        console.log('analytics : ', data);
        // data가 객체인 경우 type 값을 사용
        const actionType = typeof data === 'object' ? data.type : data;
        // 수집 데이터 항목 (화면 진입, 좋아요, 상품, 공유, 챗봇, 해시태그)
        switch(actionType) {
            case 'SHORTS':
                this.trackInteraction(window.slidesData[window.currentSlideIndex].shortsIdx, window.cuid, window.shortsSendSeq, 'SHORTS', '', 1);
                break;
            case 'FINE':
                this.trackInteraction(window.slidesData[window.currentSlideIndex].shortsIdx, window.cuid, window.shortsSendSeq, 'FINE', '', 1);
                break;
            case 'PLINK':
                this.trackInteraction(window.slidesData[window.currentSlideIndex].shortsIdx, window.cuid, window.shortsSendSeq, 'PLINK', '', 1);
                // 즉시 API 호출 (숏츠플레이어 창이 바로 종료될꺼라 기존 데이터와 함께 바로 전송)
                this.sendActionLog();
                break;
            case 'SNS':
                this.trackInteraction(window.slidesData[window.currentSlideIndex].shortsIdx, window.cuid, window.shortsSendSeq, 'SNS', data.value, 1);
                break;
            case 'CHAT':
                this.trackInteraction(window.slidesData[window.currentSlideIndex].shortsIdx, window.cuid, window.shortsSendSeq, 'CHAT', '', 1);
                break;
            case 'RV':
                // RV 이벤트 추가
                this.trackInteraction(window.slidesData[window.currentSlideIndex].shortsIdx, window.cuid, window.shortsSendSeq, 'RV', data.value, 1);
                break;
            default:
                break;
        }
    }

    startActionLogTimer() {
        // 기존 타이머가 있다면 제거
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // 5초마다 데이터 전송
        this.timer = setInterval(() => {
            if (this.interactionMap.size > 0) {
                console.log('Sending action log every 5 seconds...');
                this.sendActionLog();
            }
        }, 5000);
    }

    stopActionLogTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // 서버로 action log 전송
    sendActionLog() {
        const actionLog = this.getInteractionData();
        
        // 데이터가 없으면 전송하지 않음
        if (actionLog.length === 0) {
            console.log('No data to send');
            return;
        }

        console.log('Action log:', actionLog);
        fetch(API_URLS.SEND_ACTION_LOG, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actionLog)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // 전송 성공 후 데이터 초기화
            this.clearInteractionData();
        })
        .catch(error => {
            console.error('Error sending action log:', error);
        });
    }

    // 컴포넌트가 제거될 때 타이머 정리
    destroy() {
        this.stopActionLogTimer();
    }
}