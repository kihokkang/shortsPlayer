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
        'fade': 'fadeImg',
        'basic': 'basicImg',
        'cube': 'cubeImg',
        'flip': 'flipImg',
        'card': 'cardImg'
    }[slideData.type];

    const containerId = {
        'fade': 'fadeSlider',
        'basic': 'basicSlider',
        'cube': 'cubeSlider',
        'flip': 'flipCard',
        'card': 'CardSlider'
    }[slideData.type];

    const slideClass = {
        'fade': 'fade-slide',
        'basic': 'basic-slide',
        'cube': 'cube-slide',
        'flip': 'flip-slide',
        'card': 'card-slide'
    }[slideData.type];

    return `
        <div class="swiper-slide" role="group">
            <div class="img-temp ${containerClass}" id="${containerId}">
                ${slideData.images.map((img, i) => `
                    <div class="${slideClass}">
                        <img src="${img}" />
                    </div>
                `).join('')}
            </div>

            <div class="content-layout ${slideData.layout}">
                <h1 class="short-title ${slideData.titleColor}">${slideData.title}</h1>
                <div class="short-content ${slideData.contentClass}">
                    <div class="hashtags">
                        ${slideData.hashtags.map(tag => `
                            <span onclick="onHashtagClick('${tag}')" data-tag="${tag}">${tag}</span>
                        `).join('')}
                    </div>
                    <p class="cont-text ${slideData.textColor}">
                        ${slideData.description}
                    </p>
                </div>
            </div>

            <div class="controls">
                <div class="control-icon like-button active" data-index="${index}">
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
                <div class="control-icon chatbot-button" onclick="openChatbot()" data-index="${index}">
                    <span></span>
                    <p class="control-text">챗봇</p>
                </div>
            </div>
        </div>
    `;
};