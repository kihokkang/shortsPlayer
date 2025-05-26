/**
 * =====================================================
 * 화면명 : shareModal.js
 * 작성자 : 김기호
 * 작성일: 2025.05.07
 * 설명: 공유 모달 관리 모듈
 * =====================================================
 */

import { CONSTANTS } from '../config/constants.js';

export class ShareModal {
    shareItems = [
        { name: "카카오톡", className:"icon-kakao"},
        { name: "Facebook", className: "icon-facebook" }
    ];

    // Third-Party SDK 초기화
    constructor() {
        // 카카오 초기화
        Kakao.init(CONSTANTS.KAKAO_SDK_KEY);
    }

    getCurrentSlideInfo() {
        const currentIndex = window.currentSlideIndex;
        const currentSlide = window.slidesData[currentIndex];

        const title = currentSlide.productNm;
        const shareUrl = currentSlide.productUrl || "https://nain.co.kr/shop/shopdetail.html?branduid=2311410&search=&xcode=003&mcode=000&scode=&special=1&GfDT=bmp6W1w%3D";
        const imageUrl = currentSlide.mediaTp == "M"
            ? `${currentSlide.mediaList[0].serverUrl}${currentSlide.mediaList[0].thumbnailPath}`
            : `${currentSlide.mediaList[0].serverUrl}${currentSlide.mediaList[0].filePath}`;

        return { currentIndex, currentSlide, title, shareUrl, imageUrl };
    }

    drawShareModal() {
        console.log('Share modal initialized');
        
        const slideInfo = this.getCurrentSlideInfo();
        if (!slideInfo) return;

        const { currentSlide } = slideInfo;

        const shareOptionsContainer = document.getElementById("shareOptions");
        if (!shareOptionsContainer) {
            console.error('Share options container not found');
            return;
        }

        // 기존 공유 옵션 제거
        shareOptionsContainer.innerHTML = '';

        // 공유 아이템 생성
        this.shareItems.forEach(item => {
            const div = document.createElement("div");
            div.className = "share-item";
            div.innerHTML = `
                <div class="icon ${item.className}">
                    <span>${item.name}</span>
                </div>
            `;

            // 아이콘 클릭 이벤트 추가
            div.querySelector(".icon").addEventListener("click", () => {
                this.handleShareAction(item.name);
            });

            shareOptionsContainer.appendChild(div);
        });

        // 공유 링크 input 영역은 별도로 share-popup 하단에 추가
        const sharePopup = document.querySelector(".share-popup");
        if (!sharePopup) {
            console.error('Share popup not found');
            return;
        }

        // 기존 공유 링크 영역 제거
        const existingShareLink = sharePopup.querySelector(".share-link");
        if (existingShareLink) {
            existingShareLink.remove();
        }

        // 공유 링크 영역 생성
        const shareLinkDiv = document.createElement("div");
        shareLinkDiv.className = "share-link";
        shareLinkDiv.innerHTML = `
            <textarea id="shareUrl" readonly>${currentSlide.productUrl}</textarea>
            <button>URL 복사</button>
        `;

        // 복사 버튼에 이벤트 리스너 추가
        const copyButton = shareLinkDiv.querySelector('button');
        copyButton.addEventListener('click', () => this.copyLink());
        sharePopup.appendChild(shareLinkDiv);
    }

    // 공유 액션 처리
    handleShareAction(platform) {
        const slideInfo = this.getCurrentSlideInfo();
        if (!slideInfo) return;

        if (!currentSlide) {
            console.error('No slide data found for index:', currentIndex);
            return;
        }
        const { title, shareUrl, imageUrl } = slideInfo;

        switch (platform) {
            case "카카오톡":
                window.onShareClick({ type: 'SNS', value: 'K' });

                const redirectUrl = CONSTANTS.SHARE_URL + shareUrl;
                // 카카오톡 공유 URL 생성
                Kakao.Link.sendDefault({
                    objectType: "feed",
                    content: {
                        title,
                        description: "",
                        imageUrl,
                        link: {
                            mobileWebUrl: redirectUrl,
                            webUrl: redirectUrl,
                        },
                    }
                });
                break;

            case "Facebook":
                window.onShareClick({ type: 'SNS', value: 'F' });
                const encodedUrl = encodeURIComponent(shareUrl);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
                break;

            default:
                console.log("Unknown platform:", platform);
                return;
        }
    }

    // 공유 링크 복사
    copyLink() {
        const input = document.getElementById("shareUrl");
        if (!input) {
            console.error('Share URL input not found');
            return;
        }
        input.select();
        input.setSelectionRange(0, 99999); // 모바일 대응
        document.execCommand("copy");
        alert("링크가 복사되었습니다!");
    }

    // 공유 모달 열기
    openPopup() {
        console.log('Share modal opened');

        const slideInfo = this.getCurrentSlideInfo();
        // if (!slideInfo) return;

        const { shareUrl } = slideInfo;
        //KSY
        if (this.isMobile()) {
            const shareData = {
                title: "상품 공유하기", //TODO: 아마 바꾸지 않을까?
                text: "상품을 공유 합니다!", //TODO: 아마 바꾸지 않을까?
                url: CONSTANTS.SHARE_URL + shareUrl,
            };

            try {
                navigator.share(shareData);
                console.log("shared successfully");
            } catch (err) {
                console.log("fail" + err);
            }
        } else {
            this.drawShareModal();
            const sharePopup = document.querySelector(".share-popup");
            const overlay = document.querySelector(".overlay");

            shareOverlay.style.display = "flex";
            sharePopup.classList.remove("hide");
            sharePopup.classList.add("show");
            overlay.classList.remove("none");
            overlay.classList.add("block");

            document.querySelectorAll("video").forEach(video => video.pause());
        }
    }

    // 공유 모달 닫기
    closePopup() {
        // 모달 닫기 로직
        console.log('Share modal closed');
        const sharePopup = document.querySelector(".share-popup");
        const overlay = document.querySelector(".overlay");

        sharePopup.classList.remove("show");
        sharePopup.classList.add("hide");
        overlay.classList.remove("block");
        overlay.classList.add("none");
        setTimeout(() => {
            // 팝업 닫히면 현재 슬라이드 동영상 다시 재생
            let activeSlide = document.querySelector(".swiper-slide-active video");
            if (activeSlide) {
                activeSlide.play();
            }
        }, 100);
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }
}
