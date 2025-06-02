(() => {
    // 전역 변수들
    let next = 1;
    let current = 0;
    const interval = 4000;
    const fadeTime = 800;
    const fadeZoom = 9000;
    const imgNum = 5;
    let currentSliderType = null;
    let slideIntervals = {};
    let fadeTimer = null; // fade 타이머를 위한 변수 추가

    // 1. Fade Slider 초기화
    function initializeFadeSlider(index) {
        const fadeImgs = document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .fadeImg img`);
        if (fadeImgs.length === 0) return;

        // 이전 타이머가 있다면 제거
        if (fadeTimer) {
            clearTimeout(fadeTimer);
            fadeTimer = null;
        }

        document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .fadeImg`).forEach(el => {
            el.style.position = 'relative';
        });

        fadeImgs.forEach(img => {
            img.style.position = 'absolute';
            img.style.transition = `opacity ${fadeTime}ms, transform ${fadeZoom}ms`;
            img.style.opacity = 0;
            img.style.transform = 'scale(1)';
            img.style.animation = 'none';
        });

        // 현재 이미지가 존재하는지 확인
        if (fadeImgs[current]) {
            fadeImgs[current].style.opacity = 1;
            fadeImgs[current].style.transform = 'scale(1.2)';
            fadeImgs[current].style.animation = `fadeZoom ${fadeZoom}ms forwards`;
        }

        // 다음 이미지가 있는 경우에만 nextFadeIn 실행
        if (fadeImgs.length > 1) {
            nextFadeIn(index);
        }
    }

    function nextFadeIn(index) {
        const fadeImgs = document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .fadeImg img`);
        if (fadeImgs.length === 0) return;

        // 이전 타이머가 있다면 제거
        if (fadeTimer) {
            clearTimeout(fadeTimer);
        }

        fadeTimer = setTimeout(() => {
            // 현재 이미지가 존재하는지 확인
            if (fadeImgs[current]) {
                fadeImgs[current].style.opacity = 0;
                fadeImgs[current].style.zIndex = 0;
                fadeImgs[current].style.animation = 'none';
            }

            // 다음 인덱스가 이미지 개수를 초과하면 처음으로 돌아가기
            if (next >= fadeImgs.length) {
                next = 0;
            }

            // 다음 이미지가 존재하는지 확인
            if (fadeImgs[next]) {
                fadeImgs[next].style.opacity = 1;
                fadeImgs[next].style.transform = 'scale(1.2)';
                fadeImgs[next].style.zIndex = 1;
                fadeImgs[next].style.animation = `fadeZoom ${fadeZoom}ms forwards`;
            }

            current = next;
            next = next + 1;

            // 타이머 설정
            fadeTimer = setTimeout(() => nextFadeIn(index), fadeTime);
        }, fadeZoom);
    }

    // 2. Basic Slider 초기화
    function initializeBasicSlider(index) {
        const sliderInner = document.querySelector(`.swiper-slide:nth-child(${index + 1}) .basicImg`);
        const images = document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .basic-slide`);
        const shortsCont = document.querySelector(`.swiper-slide:nth-child(${index + 1}) .basic-container`);
        
        if (!sliderInner || !images.length || !shortsCont) {
            console.log('Required elements not found:', {
                sliderInner: !!sliderInner,
                images: images.length,
                shortsCont: !!shortsCont
            });
            return;
        }

        try {
            const containerWidth = shortsCont.offsetWidth;
            let slideIndex = 1;

            // 기존 클론 제거
            const existingClones = sliderInner.querySelectorAll('.clone-slide');
            existingClones.forEach(clone => clone.remove());

            // 클론: 첫 번째와 마지막 이미지 복제
            const firstClone = images[0].cloneNode(true);
            const lastClone = images[images.length - 1].cloneNode(true);
            firstClone.classList.add('clone-slide');
            lastClone.classList.add('clone-slide');

            // 클론 추가
            sliderInner.insertBefore(lastClone, sliderInner.firstChild);
            sliderInner.appendChild(firstClone);

            // 전체 이미지 개수 계산 (클론 포함)
            const totalImages = sliderInner.querySelectorAll(".basic-slide").length;
            
            // 슬라이더 너비 설정
            sliderInner.style.width = `${containerWidth * totalImages}px`;
            
            // 초기 위치 설정 (첫 번째 실제 이미지로 이동)
            sliderInner.style.transform = `translateX(-${containerWidth}px)`;

            // 이전 인터벌 제거
            if (slideIntervals.basic) clearInterval(slideIntervals.basic);

            // 슬라이드 이동 함수
            function moveToSlide() {
                slideIndex++;
                sliderInner.style.transition = "transform 0.4s ease-in-out";
                sliderInner.style.transform = `translateX(-${containerWidth * slideIndex}px)`;

                // 클론 이미지에 도달한 후 위치 리셋
                if (slideIndex === totalImages - 1) {
                    setTimeout(() => {
                        sliderInner.style.transition = "none";
                        slideIndex = 1;
                        sliderInner.style.transform = `translateX(-${containerWidth}px)`;
                    }, 400);
                }
            }

            // 새로운 인터벌 설정
            slideIntervals.basic = setInterval(moveToSlide, interval);

        } catch (error) {
            console.error('Error initializing basic slider:', error);
            console.log('Slider state:', {
                sliderInnerHTML: sliderInner.innerHTML,
                imagesCount: images.length,
                containerWidth: shortsCont ? shortsCont.offsetWidth : sliderInner.parentElement.offsetWidth
            });
        }
    }

    // 3. Cube Slider 초기화
    function initializeCubeSlider(index) {
        const $slides = $(`.swiper-slide:nth-child(${index + 1}) #cubeSlider .cube-slide`);
        if ($slides.length === 0) return;

        let currentCubeIndex = 0;
        const totalSlides = $slides.length;
        const $outer = $(`.swiper-slide:nth-child(${index + 1}) #cubeSlider`);
        let isAnimating = false;

        // 초기 상태 설정
        $slides.removeClass('active').css({ display: 'none', zIndex: 0 });
        $slides.eq(currentCubeIndex).addClass('active').css({ display: 'block', zIndex: 1 });

        const galleryEffect = {
            easing: 'easeInOutQuad',
            completeMove: function () {
                $('.clone-box').remove();
                $slides.removeClass('active').css({ display: 'none', zIndex: 0 });
                $slides.eq(currentCubeIndex).addClass('active').css({ display: 'block', zIndex: 1 });
                isAnimating = false;
            }
        };

        // 큐브 애니메이션 함수 정의
        function animationCubeStop(opt) {
            if (isAnimating) return;
            isAnimating = true;

            $.extend(this, opt);

            this.outer.append($(this.ndiv).css({ zIndex: 2, display: 'block' }));

            let time_animate = 1000 / this.velocity;

            const division_w = Math.ceil(this.width_skitter / (this.width_skitter / 8));
            const division_h = Math.ceil(this.height_skitter / (this.width_skitter / 8));
            const total = division_w * division_h;

            const width_box = Math.ceil(this.width_skitter / division_w);
            const height_box = Math.ceil(this.height_skitter / division_h);

            let col = 0, col_t = 0;

            for (let i = 0; i < total; i++) {
                const _vtop = height_box * col_t;
                const _vleft = width_box * col;
                const _vtop_image = -_vtop;
                const _vleft_image = -_vleft;

                const box_clone = $(this.odiv).clone();
                box_clone.attr('class', 'clone-box').css({ overflow: 'hidden', zIndex: 3 });

                box_clone.find('img').css({
                    width: this.ndiv.width(),
                    height: this.ndiv.height(),
                    position: 'absolute',
                    left: _vleft_image,
                    top: _vtop_image
                });

                box_clone.css({
                    left: _vleft,
                    top: _vtop,
                    width: width_box,
                    height: height_box
                });

                this.outer.append(box_clone);

                const delay_time = 30 * (i % 8 + Math.floor(i / 8));
                time_animate = 1000 / this.velocity;

                const callback = (i === total - 1)
                    ? function () { galleryEffect.completeMove(); }
                    : null;

                box_clone.delay(delay_time).animate({
                    opacity: 0,
                    top: _vtop + (Math.random() * 80 - 40),
                    left: _vleft + (Math.random() * 80 - 40)
                }, time_animate, galleryEffect.easing, callback);

                col_t++;
                if (col_t === division_h) {
                    col_t = 0;
                    col++;
                }
            }
        }

        // 이전 인터벌 제거
        if (slideIntervals.cube) clearInterval(slideIntervals.cube);

        // 새로운 인터벌 설정
        slideIntervals.cube = setInterval(() => {
            if (isAnimating) return;

            const nextIndex = (currentCubeIndex + 1) % totalSlides;
            const $current = $slides.eq(currentCubeIndex);
            const $next = $slides.eq(nextIndex);

            animationCubeStop.call({}, {
                outer: $outer,
                odiv: $current,
                ndiv: $next,
                width_skitter: $outer.width(),
                height_skitter: $outer.height(),
                velocity: 1.0
            });

            currentCubeIndex = nextIndex;
        }, 3000);
    }

    // 4. Flip Slider 초기화
    function initializeFlipSlider(index) {
        const flipSlides = document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .flip-slide`);
        if (flipSlides.length === 0) return;

        let flipIndex = 0;
        const flipTotal = flipSlides.length;

        function showSlide(index) {
            flipSlides.forEach((slide, i) => {
                slide.classList.remove("active");
                if (i === index) {
                    slide.classList.add("active");
                }
            });
        }

        // 초기 설정
        showSlide(flipIndex);

        // 이전 인터벌 제거
        if (slideIntervals.flip) clearInterval(slideIntervals.flip);

        // 새로운 인터벌 설정
        slideIntervals.flip = setInterval(() => {
            flipIndex = (flipIndex + 1) % flipTotal;
            showSlide(flipIndex);
        }, 3000);
    }

    // 5. Card Slider 초기화
    function initializeCardSlider(index) {
        const cardSlides = document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .card-slide`);
        if (cardSlides.length === 0) return;

        // 이미지가 1장일 경우 복사하여 3장으로 만들기
        if (cardSlides.length === 1) {
            const originalSlide = cardSlides[0];
            const container = originalSlide.parentElement;
            
            // 2개의 추가 슬라이드 생성
            for (let i = 0; i < 2; i++) {
                const clone = originalSlide.cloneNode(true);
                container.appendChild(clone);
            }
            
            // 업데이트된 슬라이드 목록 가져오기
            const updatedSlides = document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .card-slide`);
            let cardIndex = 0;

            // 이전 인터벌 제거
            if (slideIntervals.card) clearInterval(slideIntervals.card);

            // 새로운 인터벌 설정
            slideIntervals.card = setInterval(() => {
                cardIndex = (cardIndex + 1) % updatedSlides.length;
                updateCards(updatedSlides, cardIndex);
            }, 3000);

            updateCards(updatedSlides, cardIndex);
        } 
        // 이미지가 2장일 경우 복사하여 4장으로 만들기
        else if (cardSlides.length === 2) {
            const container = cardSlides[0].parentElement;
            
            // 2개의 추가 슬라이드 생성 (0번, 1번 이미지 순서대로 복사)
            for (let i = 0; i < 2; i++) {
                const clone = cardSlides[i].cloneNode(true);
                container.appendChild(clone);
            }
            
            // 업데이트된 슬라이드 목록 가져오기
            const updatedSlides = document.querySelectorAll(`.swiper-slide:nth-child(${index + 1}) .card-slide`);
            let cardIndex = 0;

            // 이전 인터벌 제거
            if (slideIntervals.card) clearInterval(slideIntervals.card);

            // 새로운 인터벌 설정
            slideIntervals.card = setInterval(() => {
                cardIndex = (cardIndex + 1) % updatedSlides.length;
                updateCards(updatedSlides, cardIndex);
            }, 3000);

            updateCards(updatedSlides, cardIndex);
        } else {
            let cardIndex = 0;

            // 이전 인터벌 제거
            if (slideIntervals.card) clearInterval(slideIntervals.card);

            // 새로운 인터벌 설정
            slideIntervals.card = setInterval(() => {
                cardIndex = (cardIndex + 1) % cardSlides.length;
                updateCards(cardSlides, cardIndex);
            }, 3000);

            updateCards(cardSlides, cardIndex);
        }
    }

    function updateCards(slides, index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'left', 'right');
            if (i === index) {
                slide.classList.add('active');
            } else if (i === (index - 1 + slides.length) % slides.length) {
                slide.classList.add('left');
            } else if (i === (index + 1) % slides.length) {
                slide.classList.add('right');
            }
        });
    }

    // 메인 초기화 함수
    function initializeUI() {
        // 모든 슬라이드 데이터 가져오기
        const slides = window.getAllSlidesData?.();
        if (!slides) return;

        // 각 슬라이드의 애니메이션 초기화
        slides.forEach((slide, index) => {
            if (slide.mediaTp === 'P') { // 이미지 타입인 경우
                const sliderType = slide.imgDisplayTp;
                if (!sliderType) return;

                console.log(`Initializing slider type: ${sliderType} for slide ${index}`);

                // 슬라이더 초기화
                switch(sliderType) {
                    case 'fadeSlider':
                        initializeFadeSlider(index);
                        break;
                    case 'basicSlider':
                        initializeBasicSlider(index);
                        break;
                    case 'cubeSlider':
                        initializeCubeSlider(index);
                        break;
                    case 'flipCard':
                        initializeFlipSlider(index);
                        break;
                    case 'cardSlider':
                        initializeCardSlider(index);
                        break;
                }
            }
        });
    }

    // 슬라이더 정리 함수
    function cleanupSlider(sliderType) {
        // 모든 인터벌 정리
        Object.values(slideIntervals).forEach(interval => clearInterval(interval));
        slideIntervals = {};

        // fade 타이머 정리 추가
        if (fadeTimer) {
            clearTimeout(fadeTimer);
            fadeTimer = null;
        }

        switch(sliderType) {
            case 'fadeSlider':
                const fadeImgs = document.querySelectorAll('.fadeImg img');
                fadeImgs.forEach(img => {
                    img.style.opacity = 0;
                });
                break;
            case 'basicSlider':
                const sliderInner = document.querySelector(".basicImg");
                if (sliderInner) {
                    sliderInner.style.transition = 'none';
                    sliderInner.style.transform = 'translateX(0)';
                }
                break;
            case 'cubeSlider':
                $('.clone-box').remove();
                $('#cubeSlider .cube-slide').removeClass('active').css({ display: 'none', zIndex: 0 });
                break;
            case 'flipSlider':
                document.querySelectorAll(".flip-slide").forEach(slide => {
                    slide.style.transform = 'rotateY(180deg)';
                    slide.style.opacity = '0';
                    slide.classList.remove("active");
                });
                break;
            case 'cardSlider':
                document.querySelectorAll('.card-slide').forEach(slide => {
                    slide.classList.remove('active', 'left', 'right');
                });
                break;
        }
    }

    // 전역 스코프에 함수 노출
    window.initializeUI = initializeUI;
})();

// iOS 키패드 처리
document.addEventListener('DOMContentLoaded', function() {
    const txt = document.getElementById('txt');
    const chatbotWrap = document.getElementById('chatbotWrap');
    
    // 포커스 시 스크롤 처리
    txt.addEventListener('focus', function() {
        setTimeout(() => {
            const rect = txt.getBoundingClientRect();
            const scrollAmount = rect.top - (window.innerHeight - rect.height - 20);
            if (scrollAmount > 0) {
                window.scrollTo({
                    top: window.scrollY + scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 300); // 키패드가 완전히 올라온 후 스크롤
    });

    // 블러 시 스크롤 복원
    txt.addEventListener('blur', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// 3. 큐브박스 (jquery)
$(function () {
  let currentCubeIndex = 0;
  const $slides = $('#cubeSlider .cube-slide');
  const totalSlides = $slides.length;
  const $outer = $('#cubeSlider');
  let isAnimating = false; 

  const galleryEffect = {
    easing: 'easeInOutQuad',
    completeMove: function () {
      $('.clone-box').remove(); 
      $slides.removeClass('active').css({ display: 'none', zIndex: 0 });
      $slides.eq(currentCubeIndex).addClass('active').css({ display: 'block', zIndex: 1 });
      isAnimating = false; // 애니메이션 종료
    }
  };

  function animationCubeStop(opt) {
    if (isAnimating) return; // 중복 방지
    isAnimating = true;

    $.extend(this, opt);

    this.outer.append($(this.ndiv).css({ zIndex: 2, display: 'block' }));

    let time_animate = 1000 / this.velocity;

    const division_w = Math.ceil(this.width_skitter / (this.width_skitter / 8));
    const division_h = Math.ceil(this.height_skitter / (this.width_skitter / 8));
    const total = division_w * division_h;

    const width_box = Math.ceil(this.width_skitter / division_w);
    const height_box = Math.ceil(this.height_skitter / division_h);

    let col = 0, col_t = 0;

    for (let i = 0; i < total; i++) {
      const _vtop = height_box * col_t;
      const _vleft = width_box * col;
      const _vtop_image = -_vtop;
      const _vleft_image = -_vleft;

      const box_clone = $(this.odiv).clone();
      box_clone.attr('class', 'clone-box').css({ overflow: 'hidden', zIndex: 3 });

      box_clone.find('img').css({
        width: this.ndiv.width(),
        height: this.ndiv.height(),
        position: 'absolute',
        left: _vleft_image,
        top: _vtop_image
      });

      box_clone.css({
        left: _vleft,
        top: _vtop,
        width: width_box,
        height: height_box
      });

      this.outer.append(box_clone);

      // const delay_time = 30 * i;
      const delay_time = 30 * (i % 8 + Math.floor(i / 8));
      time_animate = 1000 / this.velocity;

      const callback = (i === total - 1)
        ? function () { galleryEffect.completeMove(); }
        : null;

      box_clone.delay(delay_time).animate({
        opacity: 0,
        top: _vtop + (Math.random() * 80 - 40),
        left: _vleft + (Math.random() * 80 - 40)
      }, time_animate, galleryEffect.easing, callback);

      col_t++;
      if (col_t === division_h) {
        col_t = 0;
        col++;
      }
    }
  }

  setInterval(() => {
    if (isAnimating) return;

    const nextIndex = (currentCubeIndex + 1) % totalSlides;
    const $current = $slides.eq(currentCubeIndex);
    const $next = $slides.eq(nextIndex);

    animationCubeStop.call({}, {
      outer: $outer,
      odiv: $current,
      ndiv: $next,
      width_skitter: $outer.width(),
      height_skitter: $outer.height(),
      velocity: 1.0
    });

    currentCubeIndex = nextIndex;
  }, 3000);
});



// 4. 플립 이펙트 
const flipSlides = document.querySelectorAll(".flip-slide");
let flipIndex = 0;
const flipTotal = flipSlides.length;

function showSlide(index) {
  flipSlides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  flipIndex = (flipIndex + 1) % flipTotal;
  showSlide(flipIndex);
}

// 초기 설정
showSlide(flipIndex);

// 자동 실행
setInterval(nextSlide, 3000);


// 5. 카드 이펙트
const cardSlides = document.querySelectorAll('.card-slide');
let cardIndex = 0;

function cards() {
  cardSlides.forEach((slide, index) => {
    slide.classList.remove('active', 'left', 'right');
    if (index === cardIndex) {
      slide.classList.add('active');
    } else if (index === (cardIndex - 1 + cardSlides.length) % cardSlides.length) {
      slide.classList.add('left');
    } else if (index === (cardIndex + 1) % cardSlides.length) {
      slide.classList.add('right');
    }
  });
}

function cardNextSlide() {
  cardIndex = (cardIndex + 1) % cardSlides.length;
  cards();
}

// 초기 슬라이드 설정
cards();

// 자동 슬라이드 실행 (3초 간격)
setInterval(cardNextSlide, 3000);
