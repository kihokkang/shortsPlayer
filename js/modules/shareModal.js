/**
 * =====================================================
 * 화면명 : shareModal.js
 * 작성자 : 김기호
 * 작성일: 2025.05.07
 * 설명: 공유 모달 관리 모듈
 * =====================================================
 */

export class ShareModal {
    shareItems = [
        { name: "카카오톡", className:"icon-kakao"},
        { name: "인스타그램", className: "icon-insta" },
        { name: "Facebook", className: "icon-facebook" }
    ];

    // Third-Party SDK 초기화
    constructor() {
        // 카카오 초기화
        Kakao.init('76533188d481d2576e1330c0e59156b6');
    }

    drawShareModal() {
        // 공유 모달 초기화 로직
        console.log('Share modal initialized');
        
        // 현재 슬라이드 데이터 가져오기
        const currentIndex = window.currentSlideIndex;
        const currentSlide = window.slidesData[currentIndex];
        
        if (!currentSlide) {
            console.error('No slide data found for index:', currentIndex);
            return;
        }

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
            <input type="text" id="shareUrl" readonly value="${currentSlide.src}" />
            <button>URL 복사</button>
        `;
        
        // 복사 버튼에 이벤트 리스너 추가
        const copyButton = shareLinkDiv.querySelector('button');
        copyButton.addEventListener('click', () => this.copyLink());
        
        sharePopup.appendChild(shareLinkDiv);
    }

    // 공유 액션 처리
    handleShareAction(platform) {
        const currentIndex = window.currentSlideIndex;
        const currentSlide = window.slidesData[currentIndex];

        if (!currentSlide) {
            console.error('No slide data found for index:', currentIndex);
            return;
        }

        const videoUrl = currentSlide.src;
        const title = currentSlide.title;

        const url = encodeURIComponent("https://kihokkang.github.io/shortsPlayer/");
        let shareUrl = "";

        switch (platform) {
            case "카카오톡":
                Kakao.Link.sendDefault({
                    objectType: "feed",
                    content: {
                        title: title,
                        description: currentSlide.description || "동영상에 대한 설명글이 필요해",
                        imageUrl: currentSlide.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2Dy3jDxsWMYdkSsE5tKprkkqvePuvDDhfKQ&s",
                        link: {
                            mobileWebUrl: videoUrl,
                            webUrl: videoUrl,
                        },
                    },
                });
                break;
            case "인스타그램":
                console.log('인스타그램 공유');
                shareUrl = `https://www.instagram.com/sharer/sharer.php?u=${url}`;
                break;
            case "Facebook":
                console.log('페이스북 공유');
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
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
        this.drawShareModal();
        const sharePopup = document.querySelector(".share-popup");
        const overlay = document.querySelector(".overlay");

        shareOverlay.style.display = "flex";
        sharePopup.classList.remove("hide");
        sharePopup.classList.add("show");
        overlay.classList.remove("none");
        overlay.classList.add("block");
        // 팝업 열리면 재생하고 있는 동영상 정지
        document.querySelectorAll("video").forEach(video => video.pause());
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
}
