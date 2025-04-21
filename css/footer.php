<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the <div class="wf-container"> and all content after
 *
 * @since 1.0.0
 *
 * @package The7\Templates
 */

defined( 'ABSPATH' ) || exit;

if ( presscore_is_content_visible() ) : ?>

			</div><!-- .wf-container -->
		</div><!-- .wf-wrap -->

	<?php
	/**
	 * Do something after content container close tag.
	 *
	 * @since 6.8.1
	 */
	do_action( 'the7_after_content_container' );
	?>

	</div><!-- #main -->

	<?php
	if ( presscore_config()->get( 'template.footer.background.slideout_mode' ) ) {
		echo '</div>';
	}
	?>

<?php endif; ?>

	<?php do_action( 'presscore_after_main_container' ); ?>
	<!-- 2024-10-31 우측하단 플로팅 팝업 -->
	<div class="chatbot-pop" style="display:none">
		<div class="chatbot-wrap" id="chatbotWrap">
			<div class="chatbot-header">
				<h3 class="chatbot-title">Uracle</h3>
			</div>
			<div class="chatbot-content">
			<div class="content scrollBox">
				<div class="by-date" id="startByDatd">
					<div class="date" id="chatbotToday"></div>
					<div class="data-sources"></div>
					<div class="answer" dir="ltr">           
					<code>안녕하세요 유라클 AI챗봇 Athena입니다.
						궁금한 걸 물어보세요.</code> 
					</div>
					<!-- <div class="question">AI리서치 보고서 서비스를 회사명,서비스명,링크주소를 리스트로 작성해줘</div>
					<div class="data-sources">다음은 AI리서치 보고서 서비스를 제공하는 회사와 서비스명,링크주소의 리스트 입니다.</div>
					<div class="answer" dir="ltr">
					<code>SK텔레콤
											서비스명 : 에이닷
											링크 : <a href="#">에이닷</a>
										</code>
					<code><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">footer</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">body</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">html</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span>
									</code>
					</div> -->
				</div>
				<!-- <div class="by-date">
					<div class="date">2024.10.21(월)</div>
					<div class="my"></div>
					<div class="question">AI리서치 보고서 서비스를 회사명,서비스명,링크주소를 리스트로 작성해줘</div>
					<div class="data-sources">다음은 AI리서치 보고서 서비스를 제공하는 회사와 서비스명,링크주소의 리스트 입니다.</div>
					<div class="answer" dir="ltr">
					<code>SK텔레콤
											서비스명 : 에이닷
											링크 : <a href="#">에이닷</a>
										</code>
					<code><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">footer</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">body</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">html</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span>
									</code>
					</div>
					<div class="question">AI리서치 보고서 서비스를 회사명,서비스명,링크주소를 리스트로 작성해줘</div>
					<div class="data-sources">다음은 AI리서치 보고서 서비스를 제공하는 회사와 서비스명,링크주소의 리스트 입니다.</div>
					<div class="answer" dir="ltr">
					<code>SK텔레콤
											서비스명 : 에이닷
											링크 : <a href="#">에이닷</a>
										</code>
					<code><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">footer</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">body</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span><span class="xml" style="color: rgb(155, 155, 155);">&lt;/</span><span class="xml" style="color: rgb(86, 156, 214);">html</span><span class="xml" style="color: rgb(155, 155, 155);">&gt;</span><span class="xml">
											</span><span class="xml"></span>
									</code>
					</div>
				</div> -->
				</div>
			</div>
			<div class="input-box"><input type="text" class="type" placeholder="메세지를 입력하세요!" id="txt" onkeypress="askQuestion(event)"></div>
		</div>
		<a href="#" class="btn-chatbot ai" id="btnChatbot"></a>
	</div>

	<script src="https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js"></script>
	<link rel="stylesheet" href="//unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/intellij-light.min.css">
	<script src="//unpkg.com/@highlightjs/cdn-assets@11.6.0/highlight.min.js"></script>
	<script>
	let sessionId = "";
	document.addEventListener("DOMContentLoaded", function () {
		const chatbotWrap = document.querySelector(".chatbot-wrap");
		const btnChatbot = document.querySelector(".btn-chatbot");
		let isResizing = false;
		let newWidth = chatbotWrap.offsetWidth; // 초기 너비 값 설정
		let resizeRequest; // requestAnimationFrame ID
		// chatbotStart();
		let today = new Date();
		document.getElementById("chatbotToday").innerHTML = formatDate(today);
		document.getElementById("startByDatd").dataset.date =(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());

		// Toggle chatbot visibility
		btnChatbot.addEventListener("click", function (e) {
			const mWidth = 1070;
			 e.preventDefault();
			if (chatbotWrap.classList.contains("show-popup")) {
				chatbotWrap.classList.remove("show-popup");
				document.body.style.overflow = "hidden";
				if(document.getElementById("fullpage")){
					$.fn.fullpage.setAllowScrolling(true);
  					$.fn.fullpage.setKeyboardScrolling(true);
					if(window.innerWidth < mWidth){
						$.fn.fullpage.setAutoScrolling(false);
						$.fn.fullpage.setFitToSection(false);
					}else{
						$.fn.fullpage.setAutoScrolling(true);
						$.fn.fullpage.setFitToSection(true);
					}
				}
				setTimeout(() => {
					chatbotWrap.style.display = "none";
				}, 300);
			} else {
				chatbotWrap.style.display = "flex";
				document.body.style.overflow = "";
				if(document.getElementById("fullpage")){
					$.fn.fullpage.setAllowScrolling(false);
  					$.fn.fullpage.setKeyboardScrolling(false);
				}
				setTimeout(() => {
					chatbotWrap.classList.add("show-popup");
				}, 10);
			}
			btnChatbot.classList.toggle("active");
		});

		// Resizing logic
		const resizer = document.createElement("div");
		resizer.classList.add("resizer");
		chatbotWrap.appendChild(resizer);

		resizer.addEventListener("mousedown", (e) => {
			isResizing = true;
			document.body.style.userSelect = "none";
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", stopResizing);
			});

		function onMouseMove(e) {
			if (isResizing) {
				// 마우스 좌표에 따라 새로운 너비 계산
				newWidth = window.innerWidth - e.clientX - 20; // 20은 right의 거리
				if (newWidth >= 500 && newWidth <= 1000) { // 최소, 최대 너비 제한
				// requestAnimationFrame을 통한 부드러운 애니메이션
				if (!resizeRequest) {
					resizeRequest = requestAnimationFrame(resizePopup);
				}
				}
			}
		}

		function resizePopup() {
			chatbotWrap.style.width = `${newWidth}px`;
			resizeRequest = null; // 다음 resize 요청 준비
		}

		function stopResizing() {
			isResizing = false;
			document.body.style.userSelect = "";
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", stopResizing);
			if (resizeRequest) {
				cancelAnimationFrame(resizeRequest);
				resizeRequest = null;
			}
		}
	});
	function askQuestion(e){
		const txt = document.getElementById("txt");
		const code = e.code;

			if (code == 'Enter' && txt.value !== '') {
			let myDiv = document.createElement("div");
			let question = document.createElement("div");
			let chatBox = document.getElementsByClassName("by-date")[document.getElementsByClassName("by-date").length - 1];
			let scrollBox = document.getElementsByClassName("scrollBox")[0];
			let today = new Date();
			let strToday = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

			myDiv.className = "my";
			question.className = "question";
			question.innerHTML = txt.value;
			if (chatBox != undefined) {
				if (chatBox.dataset.date == strToday) {
				chatBox.append(myDiv);
				chatBox.append(question);
				} else {
				let divToday = document.createElement("div");
				divToday.className = "by-date";
				divToday.dataset.date = strToday;
				let divDate = document.createElement("div");
				divDate.className = "date";
				divDate.innerHTML = formatDate(today);
				scrollBox.append(divToday);

				divToday.append(divDate);
				divToday.append(myDiv);
				divToday.append(question);
				}
			} else {
				let divToday = document.createElement("div");
				divToday.className = "by-date";
				divToday.dataset.date = strToday;
				let divDate = document.createElement("div");
				divDate.className = "date";
				divDate.innerHTML = formatDate(today);
				scrollBox.append(divToday);

				divToday.append(divDate);
				divToday.append(myDiv);
				divToday.append(question);
			}

			getChatbotAnswer(txt.value);
			scrollBox.scrollTop = scrollBox.scrollHeight;
			txt.value = "";
		}
     }


    function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    
    // 요일 배열 (일요일부터 시작)
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${year}.${month}.${day}(${dayOfWeek})`;
    }

    function chatbotStart() {
		return new Promise((resolve, reject) => {
		const url = 'https://athena.uracle.co.kr:19001/uracle/start'; // 프록시 서버를 통해 요청할 상대 경로로 설정
		fetch(url, {
			method: 'POST', // POST 요청 방식
			headers: {
			'Content-Type': 'application/json' // JSON 형식
			},
			body: JSON.stringify({ // 데이터 변환 후 body에 추가
				'secret': atob('MDU4N2M4NTIwNjZkMjc2ZmYzN2I1YTRkMjI2YjFhMWU=')
			})
		})
			.then(response => response.json())
			.then(({ session_id }) => resolve(session_id))
			.catch(error => {
			reject(error)
			})
		})
	}

    function getChatbotAnswer(txtValue, retryCount = 0) {

		const MAX_RETRIES = 3; // 최대 재시도 횟수

		Promise.resolve()
		.then(() => {
			if (sessionId) {
			return Promise.resolve(sessionId)
			} else {
			return chatbotStart();
			}
		})
		.then((_sessionId) => {

			sessionId = _sessionId;

			const session_id = sessionId;
			const txt = txtValue;

			const eventSource = new EventSource("https://athena.uracle.co.kr:19001/uracle/chat?session_id=" + encodeURIComponent(session_id) + "&query=" + encodeURIComponent(txt));

			let dataSources = document.createElement("div");
			let divAnswer = document.createElement("div");
			let chatBox = document.getElementsByClassName("by-date")[document.getElementsByClassName("by-date").length - 1];
			let scrollBox = document.getElementsByClassName("scrollBox")[0];
			let today = new Date();
			let strToday = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
			let btnPause = document.createElement("button");
       		let tempAnswer = document.createElement("div");

			let isAutoScrollEnabled = true; // 자동 스크롤 상태

			// 스크롤 박스에 스크롤 이벤트 리스너 추가
			scrollBox.addEventListener("scroll", () => {
				const nearBottom = scrollBox.scrollHeight - scrollBox.scrollTop <= scrollBox.clientHeight + 20;
				
				// 사용자가 맨 아래에 있을 때만 자동 스크롤 활성화
				isAutoScrollEnabled = nearBottom;
			});
			document.querySelector('.chatbot-wrap').addEventListener('click', function(event) {
				if (event.target.classList.contains('btn-chat-ctrl')) {
					if (eventSource) {
						eventSource.close();
						document.getElementsByClassName("btn-chat-ctrl")[0].remove();
					} else {
						console.log("EventSource는 이미 닫혀 있습니다.");
					}
				}
			});

			dataSources.className = "data-sources";
			divAnswer.className = "answer";
			divAnswer.dir = "ltr";
			btnPause.className = "btn-chat-ctrl";
			divAnswer.append(btnPause);
			tempAnswer.className = "divAnswer";
			divAnswer.append(tempAnswer);
			dataSources.innerHTML = txt;

			eventSource.onopen = function (event) {
				// console.log('open', event);
				if (chatBox != undefined) {
					if (chatBox.dataset.date == strToday) {
					chatBox.append(dataSources);
					chatBox.append(divAnswer);
					} else {
					let divToday = document.createElement("div");
					divToday.className = "by-date";
					divToday.dataset.date = strToday;
					let divDate = document.createElement("div");
					divDate.className = "date";
					divDate.innerHTML = formatDate(today);
					scrollBox.append(divToday);

					divToday.append(divDate);
					divToday.append(dataSources);
					divToday.append(divAnswer);
					}
				} else {
					let divToday = document.createElement("div");
					divToday.className = "by-date";
					divToday.dataset.date = strToday;
					let divDate = document.createElement("div");
					divDate.className = "date";
					divDate.innerHTML = formatDate(today);
					scrollBox.append(divToday);
					divToday.append(divDate);
					divToday.append(dataSources);
					divToday.append(divAnswer);
				}
				scrollBox.scrollTop = scrollBox.scrollHeight;
			};

			eventSource.onmessage = function (event) {
				data = JSON.parse(event.data);
				let answer = document.getElementsByClassName("divAnswer")[document.getElementsByClassName("divAnswer").length - 1];
				// console.log('message', data);

				if (typeof data.text !== 'undefined') {
					// console.log('text received', data.text);
					const md = window.markdownit({
					highlight: function (str, lang) {
						if (lang && hljs.getLanguage(lang)) {
							try {
								return '<pre><code style="white-space:pre-wrap !important">' +
								hljs.highlight(str, { language: lang }).value +
								'</code></pre>';
							} catch (__) { }
							}

							return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
						}
					});

					// 코드 블록의 마크다운 텍스트 가져오기
					const markdownSource = data.text;
					// 마크다운을 HTML로 변환
					const result = md.render(markdownSource);
					// let strTest = fixHeaders(data.text);
					answer.innerHTML = `<div>${result}</div>`
					// 자동 스크롤이 활성화된 경우에만 스크롤 이동
					if (isAutoScrollEnabled) {
						scrollBox.scrollTop = scrollBox.scrollHeight;
					}

				}

				if (typeof data.end !== 'undefined') {
					// console.log('stream EOF received');
					eventSource.close();
					if( document.getElementsByClassName("btn-chat-ctrl")[0]){
						document.getElementsByClassName("btn-chat-ctrl")[0].remove();
					}
				}
			};

			eventSource.onerror = function (err) {
				console.error("EventSource failed:", err);
				// 세션이 만료되었을떄에 대한
				// 에러를 특정하여
				// 다시 test를 실행
				eventSource.close();
				if( document.getElementsByClassName("btn-chat-ctrl")[0]){
					document.getElementsByClassName("btn-chat-ctrl")[0].remove();
				}
				if (eventSource.readyState === EventSource.CLOSED) {
					if (retryCount < MAX_RETRIES) {
						// console.log(`Retrying... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
						sessionId = ''; // 세션 초기화
						divAnswer.remove();
						getChatbotAnswer(txtValue, retryCount + 1); // 재시도
					} else {
						console.error("Maximum retry attempts reached. Connection failed.");
						// 추가적인 실패 처리 로직을 작성할 수 있습니다.
					}
				}
			};

			// addEventListener version
			eventSource.addEventListener("error", (e) => {
				// console.log("An error occurred while attempting to connect.", e);
			});

		})


	}
    </script>
	

	<a href="#" class="scroll-top"><span class="screen-reader-text"><?php esc_html_e( 'Go to Top', 'the7mk2' ); ?></span></a>

</div><!-- #page -->

<?php if(is_front_page()){ ?>
	
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.7.9/jquery.fullpage.min.js"></script>
	
    <script>
	
	jQuery(function() {
		const $ = jQuery;
		const mWidth = 1070;
		$('#content > div > div').attr('id', 'fullpage');
		$('#fullpage').fullpage({
			sectionSelector: '#fullpage > .elementor-top-section',
			navigation: false,
			slidesNavigation: false,
			controlArrows: false,
			responsiveWidth: mWidth,
			//anchors: ['firstSection', 'secondSection', 'thirdSection', 'fourthSection', 'last'],
			//menu:"#menu-full",
			afterLoad: function(anchorLink, index){
				if (index > 1){
					$('div.masthead').fadeOut(200);
					$('.scroll-top').addClass('on');
				} else {
					$('div.masthead').fadeIn(200);
					$('.scroll-top').removeClass('on');
				}
			},
			/*
			onLeave: function(index, nextIndex, direction){
				if (index == 2 && direction == 'up') {
					$('div.masthead').fadeIn(200); 
				}
			}
			*/
		});
		
		// ����� ������� ���� �ڵ���ũ�� ���� �� ����ũž ������� ����
		$(window).resize(function() {
			if (window.innerWidth < mWidth) {
				$.fn.fullpage.setAutoScrolling(false);
				$.fn.fullpage.setFitToSection(false);
			} else {
				$.fn.fullpage.setAutoScrolling(true);
				$.fn.fullpage.setFitToSection(true);
			}
		}).trigger('resize');

		$('.scroll-top').click(function() {
			if (window.innerWidth >= mWidth) {
				$.fn.fullpage.moveTo(1);
			}
		});

	});

	

    </script>

	

<?php } ?>

<?php wp_footer(); ?>

<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="pswp__bg"></div>
	<div class="pswp__scroll-wrap">
		<div class="pswp__container">
			<div class="pswp__item"></div>
			<div class="pswp__item"></div>
			<div class="pswp__item"></div>
		</div>
		<div class="pswp__ui pswp__ui--hidden">
			<div class="pswp__top-bar">
				<div class="pswp__counter"></div>
				<button class="pswp__button pswp__button--close" title="<?php esc_html_e( 'Close (Esc)', 'the7mk2' ) ?>" aria-label="<?php esc_html_e( 'Close (Esc)', 'the7mk2' ) ?>"></button>
				<button class="pswp__button pswp__button--share" title="<?php esc_html_e( 'Share', 'the7mk2' ) ?>" aria-label="<?php esc_html_e( 'Share', 'the7mk2' ) ?>"></button>
				<button class="pswp__button pswp__button--fs" title="<?php esc_html_e( 'Toggle fullscreen', 'the7mk2' ) ?>" aria-label="<?php esc_html_e( 'Toggle fullscreen', 'the7mk2' ) ?>"></button>
				<button class="pswp__button pswp__button--zoom" title="<?php esc_html_e( 'Zoom in/out', 'the7mk2' ) ?>" aria-label="<?php esc_html_e( 'Zoom in/out', 'the7mk2' ) ?>"></button>
				<div class="pswp__preloader">
					<div class="pswp__preloader__icn">
						<div class="pswp__preloader__cut">
							<div class="pswp__preloader__donut"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
				<div class="pswp__share-tooltip"></div> 
			</div>
			<button class="pswp__button pswp__button--arrow--left" title="<?php esc_html_e( 'Previous (arrow left)', 'the7mk2' ) ?>" aria-label="<?php esc_html_e( 'Previous (arrow left)', 'the7mk2' ) ?>">
			</button>
			<button class="pswp__button pswp__button--arrow--right" title="<?php esc_html_e( 'Next (arrow right)', 'the7mk2' ) ?>" aria-label="<?php esc_html_e( 'Next (arrow right)', 'the7mk2' ) ?>">
			</button>
			<div class="pswp__caption">
				<div class="pswp__caption__center"></div>
			</div>
		</div>
	</div>
</div>
</body>
</html>







