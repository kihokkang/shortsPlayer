/**
 * =====================================================
 * 화면명 : imageSlideTemplate.js
 * 작성자 : 김기호
 * 작성일: 2025.05.14
 * 설명: 이미지 슬라이드 템플릿
 * =====================================================
 */

export const createImageSlide = (index, slideData) => {
    const containerClass = {
        'fadeSlider': 'fadeImg',
        'basicSlider': 'basicImg',
        'cubeSlider': 'cubeImg',
        'flipCard': 'flipImg',
        'cardSlider': 'cardImg'
    }[slideData.imgDisplayTp];

    const containerId = slideData.imgDisplayTp;

    const slideClass = {
        'fadeSlider': 'fade-slide',
        'basicSlider': 'basic-slide',
        'cubeSlider': 'cube-slide',
        'flipCard': 'flip-slide',
        'cardSlider': 'card-slide'
    }[slideData.imgDisplayTp];

    // 컨테이너가 필요한 슬라이더 타입 확인
    const needsContainer = ['basicSlider', 'cubeSlider', 'flipCard', 'cardSlider'].includes(slideData.imgDisplayTp);

    // 컨테이너 클래스 결정
    const getContainerClass = (type) => {
        switch(type) {
            case 'basicSlider': return 'basic-container';
            case 'cubeSlider': return 'cube-container';
            case 'flipCard': return 'flip-container';
            case 'cardSlider': return 'card-container';
            default: return '';
        }
    };

    // 이미지 슬라이더 HTML 생성
    const imageSliderHtml = `
        ${needsContainer ? `<div class="${getContainerClass(slideData.imgDisplayTp)}">` : ''}
            <div class="img-temp ${containerClass}" id="${containerId}">
                ${slideData.mediaList.map((media, i) => `
                    <div class="${slideClass}">
                        <img src="${media.serverUrl}${media.filePath}" />
                    </div>
                `).join('')}
            </div>
        ${needsContainer ? '</div>' : ''}
    `;

    return `
        <div class="swiper-slide" role="group">
            ${imageSliderHtml}

            <div class="content-layout ${!slideData.contentTop && slideData.contentMid ? 'mid-title' : ''}">
                <h1 class="short-title" style="${slideData.contentTopFont || ''}" ${!slideData.contentTop ? 'style="display: none;"' : ''}>${slideData.contentTop || ''}</h1>
                <h1 class="short-title" style="${slideData.contentMidFont || ''}" ${!slideData.contentMid ? 'style="display: none;"' : ''}>${slideData.contentMid || ''}</h1>
                <div class="short-content" style="${slideData.contentFont || ''}">
                    ${slideData.reviewYn === 'Y' && slideData.reviewInfo ? `
                        <div class="hashtags">
                            ${slideData.reviewInfo.map(tag => `
                                <span onclick="onHashtagClick('${tag.tag}')" data-tag="${tag.tag}" data-content="${tag.content}">
                                    ${tag.tag}
                                </span>
                            `).join('')}
                        </div>
                        <!-- 해시태그 클릭 시 표시되는 컨텐츠 -->
                        <p class="cont-text" style="display: none;">
                            ${slideData.reviewInfo[0]?.content || ''}
                        </p>
                    ` : `
                        <!-- 일반 컨텐츠 표시 -->
                        <p class="cont-text">
                            ${slideData.content || ''}
                        </p>
                    `}
                </div>
            </div>

            <div class="controls">
                <div class="control-icon like-button" data-index="${index}">
                    <span></span>
                    <p class="control-text">좋아요</p>
                </div>
                <div class="control-icon product-button" data-index="${index}">
                    <span></span>
                    <p class="control-text">상품</p>
                </div>
                <div class="control-icon share-button" onclick="openPopup()" data-index="${index}">
                    <span></span>
                    <p class="control-text">공유</p>
                </div>
                ${slideData.chatbotYn === 'Y' ? `
                    <div class="control-icon chatbot-button" onclick="openChatbot()" data-index="${index}">
                        <span></span>
                        <p class="control-text">챗봇</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
};