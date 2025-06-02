/**
 * =====================================================
 * 화면명 : main.js
 * 작성자 : 김기호
 * 작성일: 2025.05.07
 * 설명: 메인 어플리케이션 진입
 * =====================================================
 */

import { SwiperManager } from './modules/swiperManager.js';
import { ShareModal } from './modules/shareModal.js';
import { Analytics } from './modules/analytics.js';
import { Chatbot } from './modules/chatbot.js';
class ShortsPlayer {
    constructor() {
        // URL 파라미터 처리
        this.urlParams = this.getUrlParams();
        
        // Plyr가 로드되었는지 확인
        if (typeof Plyr === 'undefined') {
            console.error('Plyr is not loaded');
            return;
        }

        console.log('Plyr is loaded');
        console.log('URL Parameters:', this.urlParams);
        this.init();
    }

    // URL 파라미터 추출
    getUrlParams() {
        const searchParams = new URLSearchParams(window.location.search);
        return {
            // 미리보기 일때 받는 변수들
            previewYn: searchParams.get('previewYn') || 'N',             // 프리뷰 모드 (Y or N)
            closeButtonYn: searchParams.get('closeButtonYn') || 'Y',     // X 버튼 표시 여부 (Y or N)
            idx: searchParams.get('idx'),                                // 숏츠 또는 숏폼 컨텐츠 고유 ID
            type: searchParams.get('type'),                              // 타입 (shortform or shorts)
            closeBtnEvent : searchParams.get('closeBtnEvent') || 'N',   //닫기버튼 이벤트 전달 필요 (Y or N)
            // 일반보기 일때 받는 변수
            sendKey: searchParams.get('sendKey')                        // 숏폼 컨텐츠 전송 키
        };
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }

    init() {
        // PC/모바일 환경과 URL 파라미터에 따른 X 버튼 표시 설정
        const closeButton = document.getElementById('closeButton');
        if (closeButton) {
            const shouldShowButton = !this.isMobile() && this.urlParams.closeButtonYn === 'Y';
            closeButton.style.display = shouldShowButton ? 'block' : 'none';
        }

        // 전역 함수 등록
        this.registerGlobalFunctions();

        // preview 모드 확인
        const isPreviewMode = this.urlParams.previewYn === 'Y';
        console.log('Preview Mode:', isPreviewMode);

        // Swiper 초기화 (preview 모드 전달)
        this.swiperManager = new SwiperManager({
            isPreview: isPreviewMode,
            idx: this.urlParams.idx,
            type: this.urlParams.type,
            sendKey: this.urlParams.sendKey
        });

        // 공유 모달 초기화
        this.shareModal = new ShareModal();

        // 애널리틱스 초기화
        this.analytics = new Analytics({
            isPreviewMode: isPreviewMode
        });

        // 챗봇 초기화
        this.chatbot = new Chatbot();
    }

    registerGlobalFunctions() {
        // 현재 슬라이드 인덱스 전역 변수
        window.currentSlideIndex = 0;

        // 슬라이드 데이터 전역 변수
        window.slidesData = null;

        window.cuid = null;

        window.shortsSendSeq = null;

        // 슬라이드 인덱스 업데이트 함수
        window.updateCurrentSlideIndex = (index) => {
            window.currentSlideIndex = index;
            this.analytics.trackData('SHORTS');
        };

        // 슬라이드 데이터 업데이트 함수
        window.updateSlidesData = (data) => {
            window.slidesData = data;
            // 슬라이드 데이터 업데이트 후 analytics 초기화
            if (this.analytics) {
                this.analytics.init();
            }
        };

        window.updateCuid = (cuid) => {
            window.cuid = cuid;
        };

        window.updateShortsSendSeq = (shortsSendSeq) => {
            window.shortsSendSeq = shortsSendSeq;
        };

        // 공유 모달 열기
        window.openPopup = () => this.shareModal.openPopup();

        // 공유 모달 닫기
        window.closePopup = () => this.shareModal.closePopup();

        // 챗봇 열기
        window.openChatbot = () => {
            this.chatbot.open();
            this.analytics.trackData('CHAT');
        };

        // 챗봇 닫기
        window.closeChatbot = () => this.chatbot.close();

        // 좋아요 클릭 처리
        window.onLikeClick = (index) => {
            console.log('onLikeClick', index);
            this.analytics.trackData('FINE');
            this.swiperManager.handleLikeClick(index);
        };

        // 상품 클릭 처리
        window.onProductClick = (index) => {
            this.analytics.trackData('PLINK');
            this.swiperManager.handleProductClick(index);
        };

        // 공유 클릭 처리
        window.onShareClick = (data) => {
            this.analytics.trackData(data);
        };

        // 해시태그 클릭 처리
        window.onHashtagClick = (tag) => {
            console.log('onHashtagClick', tag);
            this.swiperManager.handleHashTagClick(tag);
            this.analytics.trackData({
                type : 'RV',
                value : tag
            });
        };

        // X 버튼 클릭 이벤트
        const closeButton = document.getElementById('closeButton');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                // 페이지 닫기 시도 (스크립트로 연 창에서만 작동)
                if (window.opener) {
                    window.close();
                }else if(this.urlParams.previewYn === "N" || this.urlParams.closeBtnEvent === "Y"){ // 고객사 홈페이지에서 호출 했을 경우 닫기 버튼 동작
                    window.parent.postMessage({ type: 'iframeClose' }, '*');
                }else {
                    // 일반 탭인 경우 이전 페이지로 이동
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        // 이전 페이지가 없는 경우 특정 URL로 리다이렉트
                        window.location.href = '/';
                    }
                }
            });
        }
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    // Plyr가 로드되었는지 확인
    if (typeof Plyr !== 'undefined') {
        new ShortsPlayer();
    } else {
        console.error('Plyr is not loaded');
    }
});