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
        this.idx = options.idx || '';
        this.type = options.type || '';
        this.swiper = null;
        this.slides = [];
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

        // 슬라이드 데이터 접근을 위한 전역 함수 등록
        window.getAllSlidesData = () => this.getAllSlidesData();
    }

    // API로 슬라이드 데이터 가져오기
    async fetchSlidesData() {
        try {
            console.log('Fetching slides data from API...');
            let url = API_URLS.GET_SHORT_FORM_CONTENT;

            // 프리뷰 모드일 경우 프리뷰 URL로 변경
            if (this.isPreview) {
                url = `${url}preview/${this.type}/${this.idx}`;
            } else {
                // url = `${url}${this.type}/${this.idx}`;
                url = `${url}preview/${this.type}/${this.idx}`
            }

            console.log('Fetching content from:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }

            const result = await response.json();
            console.log('API response:', result);

            // API 응답 데이터 유효성 검사
            if (!result || !result.data || !Array.isArray(result.data.shortsList)) {
                console.warn('Invalid API response format, using test data');
                throw new Error('Invalid API response format');
            }

            this.slides = result.data.shortsList;

            // cuid와 shortsSendSeq 업데이트
            // if (result.data.cuid) {
            //     window.updateCuid(result.data.cuid);
            // }
            // if (result.data.shortsSendSeq) {
            //     window.updateShortsSendSeq(result.data.shortsSendSeq);
            // }

            window.updateCuid("testUserId");
            window.updateShortsSendSeq(100025);
        } catch (error) {
            console.error('API Error:', error);
            console.log('Falling back to test data...');

            // 테스트 데이터로 폴백
            window.updateCuid("testUserId");
            window.updateShortsSendSeq(100025);

            // 테스트 데이터 사용
            this.slides = [
                {
                    "shortsIdx": 100086,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품1",
                    "productUrl": "https://google.com",
                    "contentTop": "상단 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentTopFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "contentMid": "중간 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentMidFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "mediaTp": "M",
                    "reviewInfo": [{
                        "tag": "배송",
                        "content": "배송이 빠르고 편리하다는 평가가 많습니다|제품의 품질도 만족스럽다는 의견이 많습니다|많은 고객들이 빠른 배송에 대해 감사의 뜻을 전하고 있습니다",
                        "count": 35
                    },
                    {
                        "tag": "품질",
                        "content": "이 제품의 품질은 매우 우수합니다|작년에 이어 올해도 구매하는 것이 적절하다고 생각합니다|단, 제품이 생각보다 얇아 두툼한 것을 원했던 사용자에게는 다소 실망스러울 수 있습니다",
                        "count": 5
                    },
                    {
                        "tag": "가격",
                        "content": "제품의 가격 대비 품질이 매우 우수하다고 평가받고 있습니다|많은 사용자들이 저렴한 가격에 만족스러운 제품을 구매했다고 언급했습니다|가격 대비 성능이 뛰어나다는 점에서 가성비가 좋다고 느껴진다는 의견이 많습니다",
                        "count": 41
                    },
                    {
                        "tag": "디자인",
                        "content": "디자인이 깔끔하고 예쁘다고 평가받았습니다. 색상이 무난하고 좋으며, 세탁 후에도 늘어지지 않아 만족스러운 품질로 여겨집니다.",
                        "count": 6
                    }],
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/video/video_01.mp4",
                            "thumbnailPath": "/resources/messageai/sample/video/thumbnail_video_01.png",
                            "orderNo": 0
                        }
                    ],
                    "reviewYn": "Y",
                    "content": "등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출 등록된 보조 설명글 있을 경우 노출",
                    "contentFont": "color:#ee5050;font-family:'Dotum', '돋움';",
                    "chatbotYn": "N"
                },
                {
                    "shortsIdx": 100087,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품2",
                    "productUrl": "https://google.com",
                    "contentTop": "상단 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentTopFont": "font-family:'Pretendard', sans-serif;font-size:20px;font-weight:600;font-style:normal;color:#333333;",
                    "contentMid": "",
                    "contentMidFont": "",
                    "mediaTp": "M",
                    "reviewInfo": ["#태그글자", "#네글자로", "#들어가요", "#태그수는", "#최대몇개"],
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
                    "contentFont": "font-family:'Pretendard', sans-serif;color:#ee5050;",
                    "chatbotYn": "Y"
                },
                {
                    "shortsIdx": 100088,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품3",
                    "productUrl": "https://google.com",
                    "contentTop": "",
                    "contentTopFont": "",
                    "contentMid": "중간 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentMidFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "mediaTp": "M",
                    "reviewInfo": ["#태그글자", "#네글자로", "#들어가요", "#태그수는", "#최대몇개"],
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
                    "contentFont": "font-family:'Pretendard', sans-serif;color:#ee5050;",
                    "chatbotYn": "N"
                },
                {
                    "shortsIdx": 100094,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품3",
                    "productUrl": "https://google.com",
                    "contentTop": "상단 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentTopFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "contentMid": "중간 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentMidFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "mediaTp": "P",
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_01.png",
                            "orderNo": 0
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_02.png",
                            "orderNo": 1
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_03.png",
                            "orderNo": 2
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_04.png",
                            "orderNo": 3
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_05.png",
                            "orderNo": 4
                        }
                    ],
                    "imgDisplayTp": "fadeSlider",
                    "reviewYn": "Y",
                    "contentOrg": "있을 수도 있고 없을 수도",
                    "content": "있을 수도 있고 없을 수도",
                    "reviewInfo": [
                        {
                            "tag": "태그글자",
                            "content": "배송이 빠르고 편리하다는 평가가 많습니다|제품의 품질도 만족스럽다는 의견이 많습니다|많은 고객들이 빠른 배송에 대해 감사의 뜻을 전하고 있습니다",
                            "count": 1
                        },
                        {
                            "tag": "네글자로",
                            "content": "이 제품의 품질은 매우 우수합니다|작년에 이어 올해도 구매하는 것이 적절하다고 생각합니다|단, 제품이 생각보다 얇아 두툼한 것을 원했던 사용자에게는 다소 실망스러울 수 있습니다",
                            "count": 2
                        },
                        {
                            "tag": "들어가요",
                            "content": "제품의 가격 대비 품질이 매우 우수하다고 평가받고 있습니다|많은 사용자들이 저렴한 가격에 만족스러운 제품을 구매했다고 언급했습니다|가격 대비 성능이 뛰어나다는 점에서 가성비가 좋다고 느껴진다는 의견이 많습니다",
                            "count": 3
                        },
                        {
                            "tag": "태그수는",
                            "content": "디자인이 깔끔하고 예쁘다고 평가받았습니다. 색상이 무난하고 좋으며, 세탁 후에도 늘어지지 않아 만족스러운 품질로 여겨집니다.",
                            "count": 4
                        },
                        {
                            "tag": "최대몇개",
                            "content": "디자인이 깔끔하고 예쁘다고 평가받았습니다. 색상이 무난하고 좋으며, 세탁 후에도 늘어지지 않아 만족스러운 품질로 여겨집니다.",
                            "count": 5
                        }
                    ],
                    "contentFont": "color:#ee5050;font-family:'Dotum', '돋움';",
                    "chatbotYn": "N"
                },
                {
                    "shortsIdx": 100095,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품3",
                    "productUrl": "https://google.com",
                    "contentTop": "",
                    "contentTopFont": "",
                    "contentMid": "",
                    "contentMidFont": "",
                    "mediaTp": "P",
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_01.png",
                            "orderNo": 0
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_02.png",
                            "orderNo": 1
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_03.png",
                            "orderNo": 2
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_04.png",
                            "orderNo": 3
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_05.png",
                            "orderNo": 4
                        }
                    ],
                    "imgDisplayTp": "basicSlider",
                    "reviewYn": "Y",
                    "contentOrg": "있을 수도 있고 없을 수도",
                    "content": "있을 수도 있고 없을 수도",
                    "reviewInfo": [
                        {
                            "tag": "촉촉함",
                            "content": "배송이 빠르고 편리하다는 평가가 많습니다|제품의 품질도 만족스럽다는 의견이 많습니다|많은 고객들이 빠른 배송에 대해 감사의 뜻을 전하고 있습니다",
                            "count": 1
                        },
                        {
                            "tag": "클렌징",
                            "content": "이 제품의 품질은 매우 우수합니다|작년에 이어 올해도 구매하는 것이 적절하다고 생각합니다|단, 제품이 생각보다 얇아 두툼한 것을 원했던 사용자에게는 다소 실망스러울 수 있습니다",
                            "count": 2
                        },
                        {
                            "tag": "필링",
                            "content": "제품의 가격 대비 품질이 매우 우수하다고 평가받고 있습니다|많은 사용자들이 저렴한 가격에 만족스러운 제품을 구매했다고 언급했습니다|가격 대비 성능이 뛰어나다는 점에서 가성비가 좋다고 느껴진다는 의견이 많습니다",
                            "count": 3
                        }
                    ],
                    "contentFont": "color:#ee5050;font-family:'Dotum', '돋움';",
                    "chatbotYn": "N"
                },
                {
                    "shortsIdx": 100096,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품3",
                    "productUrl": "https://google.com",
                    "contentTop": "상단 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentTopFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "contentMid": "중간 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentMidFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "mediaTp": "P",
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_01.png",
                            "orderNo": 0
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_02.png",
                            "orderNo": 1
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_03.png",
                            "orderNo": 2
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_04.png",
                            "orderNo": 3
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_05.png",
                            "orderNo": 4
                        }
                    ],
                    "imgDisplayTp": "cubeSlider",
                    "reviewYn": "Y",
                    "contentOrg": "있을 수도 있고 없을 수도",
                    "content": "있을 수도 있고 없을 수도",
                    "contentFont": "color:#ee5050;font-family:'Dotum', '돋움';",
                    "chatbotYn": "N"
                },
                {
                    "shortsIdx": 100097,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품3",
                    "productUrl": "https://google.com",
                    "contentTop": "",
                    "contentTopFont": "",
                    "contentMid": "중간 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentMidFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "mediaTp": "P",
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_01.png",
                            "orderNo": 0
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_02.png",
                            "orderNo": 1
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_03.png",
                            "orderNo": 2
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_04.png",
                            "orderNo": 3
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_05.png",
                            "orderNo": 4
                        }
                    ],
                    "imgDisplayTp": "flipCard",
                    "reviewYn": "Y",
                    "contentOrg": "있을 수도 있고 없을 수도",
                    "content": "있을 수도 있고 없을 수도",
                    "reviewInfo": [
                        {
                            "tag": "촉촉함",
                            "content": "배송이 빠르고 편리하다는 평가가 많습니다|제품의 품질도 만족스럽다는 의견이 많습니다|많은 고객들이 빠른 배송에 대해 감사의 뜻을 전하고 있습니다",
                            "count": 1
                        },
                        {
                            "tag": "클렌징",
                            "content": "이 제품의 품질은 매우 우수합니다|작년에 이어 올해도 구매하는 것이 적절하다고 생각합니다|단, 제품이 생각보다 얇아 두툼한 것을 원했던 사용자에게는 다소 실망스러울 수 있습니다",
                            "count": 2
                        },
                        {
                            "tag": "필링",
                            "content": "제품의 가격 대비 품질이 매우 우수하다고 평가받고 있습니다|많은 사용자들이 저렴한 가격에 만족스러운 제품을 구매했다고 언급했습니다|가격 대비 성능이 뛰어나다는 점에서 가성비가 좋다고 느껴진다는 의견이 많습니다",
                            "count": 3
                        },
                        {
                            "tag": "태그수는",
                            "content": "디자인이 깔끔하고 예쁘다고 평가받았습니다. 색상이 무난하고 좋으며, 세탁 후에도 늘어지지 않아 만족스러운 품질로 여겨집니다.",
                            "count": 4
                        },
                        {
                            "tag": "최대몇개",
                            "content": "디자인이 깔끔하고 예쁘다고 평가받았습니다. 색상이 무난하고 좋으며, 세탁 후에도 늘어지지 않아 만족스러운 품질로 여겨집니다.",
                            "count": 5
                        }
                    ],
                    "contentFont": "color:#ee5050;font-family:'Dotum', '돋움';",
                    "chatbotYn": "N"
                },
                {
                    "shortsIdx": 100098,
                    "productCateIdx": 1,
                    "productNm": "유라클 상품3",
                    "productUrl": "https://google.com",
                    "contentTop": "상단 컨텐츠 타이틀 들어갑니다 최대 두 줄 가능합니다",
                    "contentTopFont": "font-family:'Dotum', '돋움';font-size:24px;font-weight:bold;font-style:normal;color:#ee5050;",
                    "contentMid": "",
                    "contentMidFont": "",
                    "mediaTp": "P",
                    "mediaList": [
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_01.png",
                            "orderNo": 0
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_02.png",
                            "orderNo": 1
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_03.png",
                            "orderNo": 2
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_04.png",
                            "orderNo": 3
                        },
                        {
                            "serverUrl": "https://insure.anetworks.co.kr",
                            "filePath": "/resources/messageai/sample/image/image_05.png",
                            "orderNo": 4
                        }
                    ],
                    "imgDisplayTp": "cardSlider",
                    "reviewYn": "Y",
                    "contentOrg": "있을 수도 있고 없을 수도",
                    "content": "있을 수도 있고 없을 수도",
                    "reviewInfo": [
                        {
                            "tag": "촉촉함",
                            "content": "배송이 빠르고 편리하다는 평가가 많습니다|제품의 품질도 만족스럽다는 의견이 많습니다|많은 고객들이 빠른 배송에 대해 감사의 뜻을 전하고 있습니다",
                            "count": 1
                        },
                        {
                            "tag": "클렌징",
                            "content": "이 제품의 품질은 매우 우수합니다|작년에 이어 올해도 구매하는 것이 적절하다고 생각합니다|단, 제품이 생각보다 얇아 두툼한 것을 원했던 사용자에게는 다소 실망스러울 수 있습니다",
                            "count": 2
                        },
                        {
                            "tag": "필링",
                            "content": "제품의 가격 대비 품질이 매우 우수하다고 평가받고 있습니다|많은 사용자들이 저렴한 가격에 만족스러운 제품을 구매했다고 언급했습니다|가격 대비 성능이 뛰어나다는 점에서 가성비가 좋다고 느껴진다는 의견이 많습니다",
                            "count": 3
                        },
                        {
                            "tag": "필링",
                            "content": "디자인이 깔끔하고 예쁘다고 평가받았습니다. 색상이 무난하고 좋으며, 세탁 후에도 늘어지지 않아 만족스러운 품질로 여겨집니다.",
                            "count": 4
                        },
                        {
                            "tag": "필링",
                            "content": "디자인이 깔끔하고 예쁘다고 평가받았습니다. 색상이 무난하고 좋으며, 세탁 후에도 늘어지지 않아 만족스러운 품질로 여겨집니다.",
                            "count": 5
                        }
                    ],
                    "contentFont": "color:#ee5050;font-family:'Dotum', '돋움';",
                    "chatbotYn": "N"
                }
            ];
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
                controls: ['play', 'progress', 'current-time', 'mute'],
                autoplay: false,
                muted: true,
            });

            // 비디오 컨테이너에 클릭 이벤트 추가
            const videoContainer = player.closest('.video-wrapper');
            const thumbnail = document.getElementById(`thumbnail-${index}`);
            const loadingSpinner = document.getElementById(`loading-${index}`);

            // 비디오 로딩 상태 관리
            const showLoading = () => {
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'block';
                }
                if (thumbnail) {
                    thumbnail.style.display = 'block';
                }
            };

            const hideLoading = () => {
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'none';
                }
                if (thumbnail) {
                    thumbnail.style.display = 'none';
                }
            };

            // 비디오 로딩 시작
            player.addEventListener('loadstart', () => {
                console.log('Video loadstart event');
                showLoading();
            });

            // 비디오 데이터 로드 완료
            player.addEventListener('loadeddata', () => {
                console.log('Video loadeddata event');
                if (plyr.playing) {
                    hideLoading();
                }
            });

            // 비디오 버퍼링 중
            player.addEventListener('waiting', () => {
                console.log('Video waiting event');
                showLoading();
            });

            // 썸네일 이미지 요소 찾기
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
                            hideLoading();
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
                                    hideLoading();
                                } else {
                                    this.updateVideoStatus(videoContainer, 'pause');
                                    showLoading();
                                }
                            }, 50);
                        }
                    });
                }
            });

            // 재생 이벤트
            plyr.on('play', () => {
                console.log('Video play event');
                if (videoContainer) {
                    videoContainer.classList.remove('paused', 'ended', 'error');
                    videoContainer.classList.add('playing');
                }
                hideLoading();
            });

            // 일시정지 이벤트
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
                }

                // 비디오를 처음부터 다시 재생
                player.currentTime = 0;
                const playPromise = player.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Video replay started');
                        if (videoContainer) {
                            videoContainer.classList.remove('ended');
                            videoContainer.classList.add('playing');
                        }
                        // 재생 시작 시 로딩 UI 숨기기
                        const loadingSpinner = document.getElementById(`loading-${index}`);
                        const thumbnail = document.getElementById(`thumbnail-${index}`);
                        if (loadingSpinner) loadingSpinner.style.display = 'none';
                        if (thumbnail) thumbnail.style.display = 'none';
                    }).catch(error => {
                        console.error('Error replaying video:', error);
                    });
                }
            });

            // 에러 이벤트
            plyr.on('error', () => {
                console.log('Video error event');
                if (videoContainer) {
                    videoContainer.classList.remove('playing', 'paused', 'ended');
                    videoContainer.classList.add('error');
                }
                showLoading();
            });
        });

        // 리소스 로딩 상태 추적을 위한 변수
        let resourcesLoaded = false;
        let uiInitialized = false;

        // 리소스 로딩 함수
        const loadResources = () => {
            return Promise.all([
                ...Array.from(wrapper.querySelectorAll('img')).map(img => {
                    if (img.complete) {
                        return Promise.resolve();
                    }
                    return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                }),
                ...Array.from(wrapper.querySelectorAll('video')).map(video => {
                    return new Promise(resolve => {
                        if (video.readyState >= 2) {
                            resolve();
                        } else {
                            video.addEventListener('loadeddata', resolve, { once: true });
                            video.addEventListener('error', resolve, { once: true });
                        }
                    });
                })
            ]);
        };

        // UI 초기화 함수
        const initializeUIWithRetry = (retryCount = 0) => {
            if (uiInitialized) return;

            if (typeof window.initializeUI === 'function') {
                try {
                    console.log('Initializing UI...');
                    window.initializeUI();
                    uiInitialized = true;
                    console.log('UI initialization completed');
                } catch (error) {
                    console.error('Error during UI initialization:', error);
                    if (retryCount < 3) {  // 최대 3번까지 재시도
                        console.log(`Retrying UI initialization (${retryCount + 1}/3)...`);
                        setTimeout(() => initializeUIWithRetry(retryCount + 1), 500);
                    }
                }
            } else {
                console.warn('initializeUI function not found, retrying...');
                if (retryCount < 3) {
                    setTimeout(() => initializeUIWithRetry(retryCount + 1), 500);
                }
            }
        };

        // 리소스 로딩 시작
        loadResources()
            .then(() => {
                console.log('All resources loaded');
                resourcesLoaded = true;
                initializeUIWithRetry();
            })
            .catch(error => {
                console.error('Error loading resources:', error);
                // 에러가 발생해도 UI 초기화 시도
                resourcesLoaded = true;
                initializeUIWithRetry();
            });

        // 안전장치: 5초 후에도 초기화가 안 되면 강제로 시도
        setTimeout(() => {
            if (!uiInitialized) {
                console.warn('UI initialization timeout, forcing initialization...');
                initializeUIWithRetry();
            }
        }, 5000);
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

        // 모든 비디오 일시정지 및 로딩 상태 초기화
        document.querySelectorAll("video").forEach((video, index) => {
            video.pause();
            const loadingSpinner = document.getElementById(`loading-${index}`);
            const thumbnail = document.getElementById(`thumbnail-${index}`);
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (thumbnail) thumbnail.style.display = 'block';
        });

        // mediaTp가 'M'인 경우 비디오 슬라이드 처리
        if (currentSlide.mediaTp === 'M') {
            this.handleVideoSlide(currentIndex);
        }
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
                playPromise.then(() => {
                    // 재생이 시작되면 로딩 UI 숨기기
                    const loadingSpinner = document.getElementById(`loading-${currentIndex}`);
                    const thumbnail = document.getElementById(`thumbnail-${currentIndex}`);
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                    if (thumbnail) thumbnail.style.display = 'none';
                }).catch(error => {
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
            const contentElement = currentSlide.querySelector('.cont-text');

            if (clickedElement && contentElement) {
                // 클릭된 해시태그가 이미 활성화되어 있는지 확인
                const isAlreadyActive = clickedElement.classList.contains('active');

                // 모든 해시태그에서 active 클래스 제거
                allHashtagElements.forEach(element => {
                    element.classList.remove('active');
                });

                // 클릭된 해시태그가 활성화되어 있지 않았다면 활성화
                if (!isAlreadyActive) {
                    clickedElement.classList.add('active');
                    // content 표시 및 업데이트
                    contentElement.style.display = 'block';
                    contentElement.textContent = clickedElement.dataset.content;
                    // 슬라이드 데이터에 활성화된 해시태그 저장
                    this.slides[currentIndex].activeHashtag = tag;
                    console.log(`Hashtag ${tag} activated`);
                } else {
                    // 이미 활성화된 해시태그를 다시 클릭하면 비활성화
                    contentElement.style.display = 'none';
                    this.slides[currentIndex].activeHashtag = null;
                    console.log(`Hashtag ${tag} deactivated`);
                }
            }
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

    getAllSlidesData() {
        return this.slides;
    }
}