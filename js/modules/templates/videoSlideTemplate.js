/**
 * =====================================================
 * 화면명 : videoSlideTemplate.js
 * 작성자 : 김기호
 * 작성일: 2025.05.14
 * 설명: 비디오 슬라이드 템플릿
 * =====================================================
 */

export const createVideoSlide = (index, videoData) => `
    <div class="swiper-slide" role="group">
        <div class="video-wrapper">
            <img src="${videoData.mediaList[0].serverUrl}${videoData.mediaList[0].thumbnailPath}" class="video-thumbnail" id="thumbnail-${index}">
            <div class="loading-spinner" id="loading-${index}"></div>
            <video
                class="plyr"
                id="shorts-video-${index}" 
                src="${videoData.mediaList[0].serverUrl}${videoData.mediaList[0].filePath}" 
                playsinline 
                muted 
            ></video>
            <!-- 재생, 일시정지 버튼 추가 20250507 , 기능없이 잠시 노출됐다가 사라짐
                동영상 재생 중 누르면 status-pause
                동영상 정지 중 누르면 status-play 
            -->
            <div class="video-status status-play"></div>
        </div>
        
        
        <div class="content-layout ${videoData.titlePosition === 'U' ? 'layout-1' : 'layout-2'}">
            <h1 class="short-title ${videoData.titleColor || ''}">${videoData.title}</h1>
            <div class="short-content">
                ${videoData.reviewYn === 'Y' && videoData.reviewInfo ? `
                    <div class="hashtags">
                        ${videoData.reviewInfo.map(tag => `
                            <span onclick="onHashtagClick('${tag.tag}')" data-tag="${tag.tag}" data-content="${tag.content}">
                                ${tag.tag}
                            </span>
                        `).join('')}
                    </div>
                    <!-- 해시태그 클릭 시 표시되는 컨텐츠 -->
                    <p class="cont-text ${videoData.contentColor || ''}" style="display: none;">
                        ${videoData.reviewInfo[0]?.content || ''}
                    </p>
                ` : `
                    <!-- 일반 컨텐츠 표시 -->
                    <p class="cont-text ${videoData.contentColor || ''}">
                        ${videoData.content || ''}
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
            ${videoData.chatbotYn === 'Y' ? `
                <div class="control-icon chatbot-button" onclick="openChatbot()" data-index="${index}">
                    <span></span>
                    <p class="control-text">챗봇</p>
                </div>
            ` : ''}
        </div> 
    </div>
`;