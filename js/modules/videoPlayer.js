/**
 * =====================================================
 * 화면명 : videoPlayer.js
 * 작성자 : 김기호
 * 작성일: 2025.05.07
 * 설명: 비디오 플레이어 관리 모듈
 * =====================================================
 */

export class VideoPlayer {
    constructor(videoElement) {
        console.log('VideoPlayer constructor called');
        this.videoElement = videoElement;
        this.isInitialized = false;
        this.isInitializing = false;
        this.init();
    }

    init() {
        console.log('VideoPlayer init started');
        if (this.isInitialized || this.isInitializing) {
            console.log('VideoPlayer already initialized or initializing');
            return;
        }

        this.isInitializing = true;
        try {
            if (!this.videoElement) {
                console.error('Video element is not available');
                return;
            }

            // 기존 Plyr 인스턴스가 있다면 제거
            if (this.player) {
                this.player.destroy();
            }

            // Plyr 초기화
            this.player = new Plyr(this.videoElement, {
                controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen'],
                autoplay: false,
                muted: true,
            });

            this.setupEventListeners();
            this.isInitialized = true;
            console.log('VideoPlayer initialization completed');
        } catch (error) {
            console.error('Error initializing VideoPlayer:', error);
        } finally {
            this.isInitializing = false;
        }
    }

    // 비디오 로드 대기 함수
    waitForVideoLoad() {
        return new Promise((resolve, reject) => {
            if (!this.videoElement) {
                reject(new Error('Video element is not available'));
                return;
            }

            if (this.videoElement.readyState >= 2) {
                this.handleVideoLoaded();
                resolve();
            } else {
                const loadHandler = () => {
                    this.videoElement.removeEventListener('loadeddata', loadHandler);
                    this.videoElement.removeEventListener('error', errorHandler);
                    this.handleVideoLoaded();
                    resolve();
                };

                const errorHandler = (e) => {
                    this.videoElement.removeEventListener('loadeddata', loadHandler);
                    this.videoElement.removeEventListener('error', errorHandler);
                    reject(e);
                };

                this.videoElement.addEventListener('loadeddata', loadHandler);
                this.videoElement.addEventListener('error', errorHandler);
            }
        });
    }

    // 비디오 로드 완료 처리
    handleVideoLoaded() {
        if (this.thumbnail) {
            this.thumbnail.style.display = 'none';
        }
        if (this.loadingSpinner) {
            this.loadingSpinner.style.display = 'none';
        }
    }

    // 비디오 활성화 상태 설정
    setActive(active) {
        if (!this.isInitialized || !this.videoElement) {
            console.warn('Video player is not properly initialized');
            return;
        }

        this.isActive = active;
        if (active) {
            this.play();
        } else {
            this.pause();
        }
    }

    // 비디오 재생 함수
    async play() {
        try {
            if (!this.isInitialized && !this.isInitializing) {
                await this.init();
            }
            
            if (this.isActive && this.videoElement.paused) {
                const playPromise = this.videoElement.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
            }
        } catch (error) {
            console.error('Play error:', error);
        }
    }

    // 비디오 일시정지 함수
    pause() {
        if (this.videoElement && !this.videoElement.paused) {
            this.videoElement.pause();
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 비디오 클릭 이벤트
        if (this.videoWrapper) {
            this.videoWrapper.addEventListener('click', () => {
                if (this.videoElement.paused) {
                    this.play();
                } else {
                    this.pause();
                }
            });

            // 터치 이벤트 (모바일 대응)
            this.videoWrapper.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (this.videoElement.paused) {
                    this.play();
                } else {
                    this.pause();
                }
            });
        }

        // 비디오 이벤트 리스너
        this.videoElement.addEventListener('play', () => {
            console.log('Video started playing');
        });

        this.videoElement.addEventListener('pause', () => {
            console.log('Video paused');
        });

        this.videoElement.addEventListener('ended', () => {
            console.log('Video ended');
        });

        this.videoElement.addEventListener('error', (e) => {
            console.error('Video error:', e);
        });
    }

    // 비디오 요소가 DOM에 있는지 확인
    isInDOM() {
        return document.body.contains(this.videoElement);
    }

    // 비디오 정리
    destroy() {
        if (this.player) {
            this.player.destroy();
        }
        this.videoElement = null;
        this.player = null;
        this.isInitialized = false;
    }
}