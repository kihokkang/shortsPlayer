(() => {
// 1. fade in out
let next = 1;       // 고정값
let current = 0;    // 고정값
const interval = 4000;
const fadeTime = 800;
const imgNum = 5;   // 이미지 갯수

function initializeUI() {
  const imgTemp = document.querySelectorAll('.img-temp img');

  document.querySelectorAll('.img-temp').forEach(el => {
      el.style.position = 'relative';
  });

  imgTemp.forEach(img => {
      img.style.position = 'absolute';
      img.style.transition = `opacity ${fadeTime}ms`;
      img.style.opacity = 0;
  });

    if (imgTemp.length > 0) {
  imgTemp[current].style.opacity = 1;

  nextFadeIn();
    }
}

// 전역 스코프에 함수 노출
window.initializeUI = initializeUI;

function nextFadeIn() {
    const fadeImgs = document.querySelectorAll('.fadeImg img');
    if (fadeImgs.length === 0) return; // 요소가 없으면 바로 리턴

    setTimeout(() => {
        // 현재 이미지 fade out
        fadeImgs[current].style.opacity = 0;

        // 다음 이미지 fade in
        fadeImgs[next].style.opacity = 1;

        // 인덱스 업데이트
        current = current < imgNum - 1 ? current + 1 : 0;
        next = next < imgNum - 1 ? next + 1 : 0;

        // 재귀 호출
        setTimeout(nextFadeIn, fadeTime);
    }, interval);
}


// 2. 기본 가로 슬라이드 전환
const sliderInner = document.querySelector(".basicImg");
const images = document.querySelectorAll(".basic-slide");
//const slideWidth = 360;
const shortsCont = document.querySelector("#shorts-container");
let slideIndex = 1;
const slideWidth = shortsCont.offsetWidth;
const sliderInterval = 3000;
// const totalImages = sliderInner.querySelectorAll("img").length;
let totalImages = "";

if (sliderInner && images.length > 0 && shortsCont) {
  
  // 클론: 첫 번째와 마지막 이미지 복제
  const firstClone = images[0].cloneNode(true);
  const lastClone = images[images.length - 1].cloneNode(true);

  sliderInner.appendChild(firstClone); // 마지막 뒤에 첫 이미지 추가
  sliderInner.insertBefore(lastClone, images[0]); // 첫 앞에 마지막 이미지 추가

  totalImages = sliderInner.querySelectorAll("img");

  sliderInner.style.width = `${slideWidth * totalImages}px`;
  // 초기 위치 설정 (1번째 실제 이미지로 이동)
  sliderInner.style.transform = `translateX(-${slideWidth * slideIndex}px)`;


  setInterval(moveToSlide, sliderInterval);
}

function moveToSlide() {
  slideIndex++;
  sliderInner.style.transition = "transform 0.4s ease-in-out";
  sliderInner.style.transform = `translateX(-${slideWidth * slideIndex}px)`;

  // 클론 이미지에 도달한 후 위치 리셋
  setTimeout(() => {
    if (slideIndex === totalImages - 1) {
      sliderInner.style.transition = "none";
      slideIndex = 1;
      sliderInner.style.transform = `translateX(-${slideWidth * slideIndex}px)`;
    }
  }, 400); // transition 시간과 맞춰야 자연스러움
}
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


})();