/**
 * =====================================================
 * 화면명 : swiperManager.js
 * 작성자 : 김기호
 * 작성일: 2025.05.07
 * 설명: 스와이퍼 관리 모듈
 * =====================================================
 */

import { createVideoSlide } from './templates/videoSlideTemplate.js';
import { createImageSlide } from './templates/imageSlideTemplate.js';
import { API_URLS } from '../config/constants.js';
export class SwiperManager {
    constructor(options = {}) {
        console.log('SwiperManager initialized');
        this.isPreview = options.isPreview || false;
        this.swiper = null;
        // TO-DO : API 연동을 통해 가져옴
        this.slides = [];

        // this.slides = [
        //     // 비디오 슬라이드
        //     {
        //         type: 'video',
        //         src: "https://prod-usp-logs.s3.ap-northeast-2.amazonaws.com/test_media/video_01.mp4",
        //         title: "컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
        //         username: "user1234",
        //         profileImage: "https://www.w3schools.com/w3images/avatar4.png",
        //         hashtags: ["#태그글자", "#네글자로", "#들어가요", "#태그수는", "#최대몇개"],
        //         liked: true,
        //         thumbnail: "./video1_0_frame.png",
        //         productName: "유라클 상품1",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-1"
        //     },
        //     {
        //         type: 'video',
        //         src: "https://prod-usp-logs.s3.ap-northeast-2.amazonaws.com/test_media/video_02.mp4",
        //         title: "지속적인 촉촉함",
        //         username: "soyoung1234",
        //         profileImage: "https://www.w3schools.com/w3images/avatar4.png",
        //         hashtags: ["#촉촉함", "#클렌징", "#필링"],
        //         liked: false,
        //         thumbnail: "./video2_0_frame.png",
        //         productName: "유라클 상품2",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-2",
        //         titleColor: "fc-green",
        //         textColor: "fc-pink"
        //     },
        //     {
        //         type: 'video',
        //         src: "https://prod-usp-logs.s3.ap-northeast-2.amazonaws.com/test_media/video_03.mp4",
        //         title: "지속적인 촉촉함",
        //         username: "soyoung1234",
        //         profileImage: "https://www.w3schools.com/w3images/avatar4.png",
        //         hashtags: ["#촉촉함", "#클렌징", "#필링"],
        //         liked: false,
        //         thumbnail: "./video3_0_frame.png",
        //         productName: "유라클 상품3",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-2",
        //         titleColor: "fc-pink",
        //         textColor: "fc-pink"
        //     },
        //     // 이미지 슬라이드
        //     {
        //         type: 'fade',
        //         title: "페이드 인/아웃 슬라이더",
        //         images: [
        //             "./assets/img/test/image_01.png",
        //             "./assets/img/test/image_02.png",
        //             "./assets/img/test/image_03.jpg",
        //             "./assets/img/test/image_04.png",
        //             "./assets/img/test/image_05.jpg"
        //         ],
        //         hashtags: ["#촉촉함", "#클렌징", "#필링", "#필링", "#필링"],
        //         productName: "유라클 상품4",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-1",
        //         titleColor: "fc-pink",
        //         textColor: "fc-pink",
        //         contentClass: "pb-0"
        //     },
        //     {
        //         type: 'basic',
        //         title: "기본 가로 슬라이더",
        //         images: [
        //             "./assets/img/test/image_01.png",
        //             "./assets/img/test/image_02.png",
        //             "./assets/img/test/image_03.jpg",
        //             "./assets/img/test/image_04.png",
        //             "./assets/img/test/image_05.jpg"
        //         ],
        //         hashtags: ["#촉촉함", "#클렌징", "#필링", "#필링", "#필링"],
        //         productName: "유라클 상품5",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-1",
        //         titleColor: "fc-pink",
        //         textColor: "fc-pink",
        //         contentClass: "pb-0"
        //     },
        //     {
        //         type: 'cube',
        //         title: "큐브 박스 슬라이더",
        //         images: [
        //             "./assets/img/test/image_01.png",
        //             "./assets/img/test/image_02.png",
        //             "./assets/img/test/image_03.jpg",
        //             "./assets/img/test/image_04.png",
        //             "./assets/img/test/image_05.jpg"
        //         ],
        //         hashtags: ["#촉촉함", "#클렌징", "#필링", "#필링", "#필링"],
        //         productName: "유라클 상품6",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-1",
        //         titleColor: "fc-pink",
        //         textColor: "fc-pink",
        //         contentClass: "pb-0"
        //     },
        //     {
        //         type: 'flip',
        //         title: "플립 이펙트 슬라이더",
        //         images: [
        //             "./assets/img/test/image_01.png",
        //             "./assets/img/test/image_02.png",
        //             "./assets/img/test/image_03.jpg",
        //             "./assets/img/test/image_04.png",
        //             "./assets/img/test/image_05.jpg"
        //         ],
        //         hashtags: ["#촉촉함", "#클렌징", "#필링", "#필링", "#필링"],
        //         productName: "유라클 상품7",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-1",
        //         titleColor: "fc-pink",
        //         textColor: "fc-pink",
        //         contentClass: "pb-0"
        //     },
        //     {
        //         type: 'card',
        //         title: "카드 이펙트 슬라이더",
        //         images: [
        //             "./assets/img/test/image_01.png",
        //             "./assets/img/test/image_02.png",
        //             "./assets/img/test/image_03.jpg",
        //             "./assets/img/test/image_04.png",
        //             "./assets/img/test/image_05.jpg"
        //         ],
        //         hashtags: ["#촉촉함", "#클렌징", "#필링", "#필링", "#필링"],
        //         productName: "유라클 상품8",
        //         shortsIdx:"1",
        //         description: "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
        //         layout: "layout-1",
        //         titleColor: "fc-pink",
        //         textColor: "fc-pink",
        //         contentClass: "pb-0"
        //     }
        // ];
        this.init();
    }

    async init() {

        // API로부터 데이터 가져오기
        await this.fetchSlidesData();

        this.initSlides();
        this.initSwiper();
        this.initControls();

        // Swiper 초기화 후에 슬라이드 데이터를 전역으로 업데이트
        if (typeof window.updateSlidesData === 'function') {
            window.updateSlidesData(this.slides);
        } else {
            console.warn('updateSlidesData function is not available yet');
        }
    }

    // API로 슬라이드 데이터 가져오기
    async fetchSlidesData() {
        try {
            console.log('Fetching slides data from API...');
            let url = API_URLS.GET_SHORT_FORM_CONTENT;

            // campaignId가 존재하면 URL에 추가
            if (this.campaignId) {
                url = url.replace('100000', this.campaignId);
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response:', data);

            this.slides = [
                {
                    "shortsIdx": 100086,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품1",
                    "productUrl": "https://google.com",
                    "title": "컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "titleColor": "fc-green",
                    "titlePosition": "U",
                    "mediaTp": "M",
                    "hashtags": ["#태그글자", "#네글자로", "#들어가요", "#태그수는", "#최대몇개"],
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/video/video_01.mp4",
                            "thumbnailPath": "/resources/messageai/sample/video/thumbnail_video_01.png",
                            "orderNo": 0
                        }
                    ],
                    "reviewYn": "N",
                    "content": "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
                    "contentColor": "fc-white",
                    "chatbotYn": "N"
                },
                {
                    "shortsIdx": 100087,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품2",
                    "productUrl": "https://google.com",
                    "title": "지속적인 촉촉함",
                    "titleColor": "fc-green",
                    "titlePosition": "D",
                    "mediaTp": "M",
                    "hashtags": ["#태그글자", "#네글자로", "#들어가요", "#태그수는", "#최대몇개"],
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/video/video_02.mp4",
                            "thumbnailPath": "/resources/messageai/sample/video/thumbnail_video_02.png",
                            "orderNo": 0
                        }
                    ],
                    "reviewYn": "N",
                    "content": "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
                    "contentColor": "fc-pink",
                    "chatbotYn": "Y"
                },
                {
                    "shortsIdx": 100088,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품3",
                    "productUrl": "https://google.com",
                    "title": "컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "titleColor": "fc-pink",
                    "titlePosition": "D",
                    "mediaTp": "M",
                    "hashtags": ["#태그글자", "#네글자로", "#들어가요", "#태그수는", "#최대몇개"],
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/video/video_03.mp4",
                            "thumbnailPath": "/resources/messageai/sample/video/thumbnail_video_03.png",
                            "orderNo": 0
                        }
                    ],
                    "reviewYn": "N",
                    "content": "등록된 보조 설명글 있을 경우 노출 등록된",
                    "contentColor": "fc-pink",
                    "chatbotYn": "N"
                }
            ]

            // // API 응답 형식에 따라 이 부분은 조정 필요
            // if (data && data.data && Array.isArray(data.data.contents)) {
            //     this.slides = data.data.contents.map(item => this.mapApiDataToSlide(item));
            // } else {
            //     console.error('Invalid API response format');
            // }
        } catch (error) {
            console.error('Error fetching slides data:', error);
        }
    }

    // 슬라이드 초기화
    initSlides() {
        const wrapper = document.getElementById('swiper-wrapper');
        if (!wrapper) {
            console.error('Swiper wrapper element not found');
            return;
        }

        // 먼저 모든 슬라이드의 HTML을 생성
        const slidesHTML = this.slides.map((slideData, index) => {
            // mediaTp 값이 M일 경우 비디오 슬라이드, 그 외 이미지 슬라이드
            if (slideData.mediaTp === 'M') {
                return createVideoSlide(index, slideData);
            } else {
                return createImageSlide(index, slideData);
            }
        }).join('');

        // HTML을 한번에 삽입
        wrapper.innerHTML = slidesHTML;

        // Preview 모드일 때 컨트롤 버튼들 숨기기
        if (this.isPreview) {
            this.hidePreviewControls();
        }

        // Plyr 초기화 및 이벤트 바인딩
        document.querySelectorAll('.plyr').forEach((player, index) => {
            console.log('Plyr 초기화 :', player.id);
            const plyr = new Plyr(player, {
                controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen'],
                autoplay: false,
                muted: true,
            });

            // 비디오 컨테이너에 클릭 이벤트 추가
            const videoContainer = player.closest('.video-wrapper');
            if (videoContainer) {
                videoContainer.addEventListener('click', (e) => {
                    // 컨트롤 버튼 클릭은 제외
                    if (!e.target.closest('.plyr__controls')) {
                        console.log('Video container clicked');

                        // 현재 재생 상태 확인하고 토글
                        if (plyr.playing) {
                            plyr.pause();
                            // 수동 일시정지 시 상태 업데이트
                            this.updateVideoStatus(videoContainer, 'pause');
                        } else {
                            plyr.play();
                            // 수동 재생 시 상태 업데이트
                            this.updateVideoStatus(videoContainer, 'play');
                        }
                    }
                });
            }

            // Plyr 컨트롤 버튼 클릭 감지
            plyr.on('ready', () => {
                const controls = player.querySelector('.plyr__controls');
                if (controls) {
                    controls.addEventListener('click', (e) => {
                        const button = e.target.closest('button');
                        if (button && button.getAttribute('data-plyr') === 'play') {
                            console.log('Play button clicked');
                            // 버튼 클릭 후 상태 확인 (약간의 지연 필요)
                            setTimeout(() => {
                                if (plyr.playing) {
                                    this.updateVideoStatus(videoContainer, 'play');
                                } else {
                                    this.updateVideoStatus(videoContainer, 'pause');
                                }
                            }, 50);
                        }
                    });
                }
            });

            // 재생 이벤트 (상태 클래스 업데이트 제거)
            plyr.on('play', () => {
                console.log('Video play event');
                if (videoContainer) {
                    videoContainer.classList.remove('paused', 'ended', 'error');
                    videoContainer.classList.add('playing');
                }
            });

            // 일시정지 이벤트 (상태 클래스 업데이트 제거)
            plyr.on('pause', () => {
                console.log('Video pause event');
                if (videoContainer) {
                    videoContainer.classList.remove('playing', 'ended', 'error');
                    videoContainer.classList.add('paused');
                }
            });

            // 재생 완료 이벤트
            plyr.on('ended', () => {
                console.log('Video ended event');
                if (videoContainer) {
                    videoContainer.classList.remove('playing', 'paused', 'error');
                    videoContainer.classList.add('ended');

                    // 비디오를 처음부터 다시 재생
                    setTimeout(() => {
                        player.currentTime = 0;
                        const playPromise = player.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.error('Error replaying video:', error);
                            });
                        }
                    }, 100);
                }
            });

            // 에러 이벤트
            plyr.on('error', () => {
                console.log('Video error event');
                if (videoContainer) {
                    videoContainer.classList.remove('playing', 'paused', 'ended');
                    videoContainer.classList.add('error');
                }
            });
        });
    }

    // 비디오 상태 업데이트 메서드 추가
    updateVideoStatus(videoContainer, action) {
        const statusElement = videoContainer.querySelector('.video-status');
        if (statusElement) {
            console.log(`Updating video status to: ${action}`);
            statusElement.classList.remove('status-play', 'status-pause');
            statusElement.classList.add(`status-${action}`);
        }
    }

    // Swiper 초기화
    initSwiper() {
        console.log('initSwiper started');
        this.swiper = new Swiper('.swiper', {
            direction: 'vertical',
            mousewheel: false,
            on: {
                slideChange: () => this.handleSlideChange()
            }
        });

        // 첫 번째 비디오 자동 재생
        let firstVideo = document.getElementById('shorts-video-0');
        if (firstVideo) {
            firstVideo.play();
        }
    }
    // 컨트롤 초기화
    initControls() {
        // 좋아요 버튼 이벤트 바인딩
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                window.onLikeClick(index);
            });
        });

        // 상품 버튼 이벤트 바인딩
        document.querySelectorAll('.product-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                window.onProductClick(index);
            });
        });

        // 공유 버튼 이벤트 바인딩
        document.querySelectorAll('.share-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.currentTarget.dataset.index;
                this.handleShareClick(index);
            });
        });

        // 챗봇 버튼 이벤트 바인딩
        document.querySelectorAll('.chatbot-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.currentTarget.dataset.index;
                this.handleChatbotClick(index);
            });
        });
    }

    // 슬라이드 변경 이벤트 처리
    handleSlideChange() {
        console.log('handleSlideChange');
        const currentIndex = this.swiper.activeIndex;
        const currentSlide = this.slides[currentIndex];

        // 현재 슬라이드 인덱스를 전역 변수에 업데이트
        window.updateCurrentSlideIndex(currentIndex);

        console.log('Current active slide index:', currentIndex);
        console.log('Current slide media type:', currentSlide.mediaTp);

        // 모든 비디오 일시정지
        document.querySelectorAll("video").forEach(video => video.pause());

        // mediaTp가 'M'인 경우 비디오 슬라이드 처리
        if (currentSlide.mediaTp === 'M') {
            this.handleVideoSlide(currentIndex);
        }

        // 컨트롤 상태 업데이트
        this.updateControlsState(currentIndex);
    }

    // 비디오 슬라이드 처리
    handleVideoSlide(currentIndex) {
        const currentVideo = document.querySelector(`#shorts-video-${currentIndex}`);
        if (currentVideo) {
            // 비디오를 처음부터 재생
            currentVideo.currentTime = 0;

            // 비디오 재생
            const playPromise = currentVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Error playing video:', error);
                });
            }
        }
    }

    // 좋아요 클릭 이벤트 처리
    handleLikeClick(index) {
        const likeButton = document.querySelector(`.like-button[data-index="${index}"]`);
        if (likeButton) {
            likeButton.classList.toggle('active');
            // 좋아요 상태 업데이트
            this.slides[index].liked = !this.slides[index].liked;
            console.log(`Like toggled for slide ${index}:`, this.slides[index].liked);
        }
    }

    // 상품 클릭 이벤트 처리
    handleProductClick(index) {
        console.log('Product clicked for index:', index);
        // 상품 상세 정보 표시 로직 추가
        const productCateIdx = this.slides[index].productCateIdx;
        const productNm = this.slides[index].productNm;
        const productUrl = this.slides[index].productUrl;

        if (productCateIdx) {
            // 상품 정보 표시 로직
            console.log('Product info:', productCateIdx, productNm, productUrl);
        }
    }

    // 공유 클릭 처리
    handleShareClick(index) {
        console.log('Share clicked for index:', index);
        // 공유 모달 표시
        if (window.openPopup) {
            window.openPopup();
        }
    }

    // 챗봇 클릭 처리
    handleChatbotClick(index) {
        console.log('Chatbot clicked for index:', index);
        // 챗봇 열기
        if (window.openChatbot) {
            window.openChatbot();
        }
    }

    // 해시태그 클릭 처리
    handleHashTagClick(tag) {
        console.log('HashTag clicked for tag:', tag);

        const currentIndex = this.swiper ? this.swiper.activeIndex : 0;
        const currentSlide = document.querySelector(`.swiper-slide:nth-child(${currentIndex + 1})`);

        if (currentSlide) {
            // 현재 슬라이드의 모든 해시태그 요소 찾기
            const allHashtagElements = currentSlide.querySelectorAll('.hashtags span');
            const clickedElement = currentSlide.querySelector(`.hashtags span[data-tag="${tag}"]`);

            if (clickedElement) {
                // 클릭된 해시태그가 이미 활성화되어 있는지 확인
                const isAlreadyActive = clickedElement.classList.contains('active');

                // 모든 해시태그에서 active 클래스 제거
                allHashtagElements.forEach(element => {
                    element.classList.remove('active');
                });

                // 클릭된 해시태그가 활성화되어 있지 않았다면 활성화
                if (!isAlreadyActive) {
                    clickedElement.classList.add('active');
                    // 슬라이드 데이터에 활성화된 해시태그 저장
                    this.slides[currentIndex].activeHashtag = tag;
                    console.log(`Hashtag ${tag} activated`);
                } else {
                    // 이미 활성화된 해시태그를 다시 클릭하면 비활성화
                    this.slides[currentIndex].activeHashtag = null;
                    console.log(`Hashtag ${tag} deactivated`);
                }
            }
        }
    }

    // 슬라이드 변경 시 컨트롤 상태 업데이트
    updateControlsState(index) {
        const slide = this.slides[index];
        if (!slide) return;

        // 좋아요 버튼 상태 업데이트
        const likeButton = document.querySelector(`.like-button[data-index="${index}"]`);
        if (likeButton) {
            likeButton.classList.toggle('active', slide.liked);
        }

        // 상품 버튼 상태 업데이트 (필요한 경우)
        const productButton = document.querySelector(`.product-button[data-index="${index}"]`);
        if (productButton && slide.productInfo) {
            productButton.classList.toggle('active', true);
        }
    }

    // Preview 모드일 때 컨트롤 비활성화
    hidePreviewControls() {
        const controlsToDisable = [
            '.like-button',
            '.product-button',
            '.share-button',
            '.chatbot-button'
        ];

        controlsToDisable.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // display: none 대신 disabled 클래스 추가
                element.classList.add('disabled');
                // 클릭 이벤트 방지
                element.style.pointerEvents = 'none';
                // 시각적 피드백을 위한 스타일
                element.style.opacity = '0.5';
            });
        });
    }
}