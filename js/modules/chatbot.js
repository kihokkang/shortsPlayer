/**
 * =====================================================
 * 화면명 : chatbot.js
 * 작성자 : 김기호
 * 작성일: 2025.05.07
 * 설명: 챗봇 관리 모듈
 * =====================================================
 */

import { API_URLS } from '../config/constants.js';

export class Chatbot {
    constructor() {
        this.MAX_RETRIES = 3;          // 최대 재시도 횟수
        this.connectRetry = 0;
        this.sessionId = "";           // 세션 id
        this.originQuery = "";         // 더보기
        this.stop = false;
        this.lastReceivedData = [];    // 더보기를 위한 마지막 데이터 저장
        this.chatbotAnswerFlag = false;// 현재 답변이 출력중인지 확인 플래그
        this.isResizing = false;
        this.newWidth = 0;
        this.resizeRequest = null;

        this.initChatbot();
    }

    initChatbot() {
        console.log('Chatbot initialized');
        const chatbotWrap = document.querySelector(".chatbot-wrap");
        if (!chatbotWrap) {
            console.error('Chatbot wrap element not found');
            return;
        }

        // 오늘 날짜 표시
        let today = new Date();
        document.getElementById("chatbotToday").innerHTML = this.formatDate(today);
        document.getElementById("startByDate").dataset.date = (today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());

        // 챗봇 버튼 click handler
        document.addEventListener("click", (event) => {
            if (event.target.closest(".chatbot-button")) {
                if (chatbotWrap.classList.contains("show-popup")) {
                    this.close();
                } else {
                    this.open();
                }
            }
        });

        // 닫기 버튼 이벤트
        const closeBtn = document.querySelector(".chatbot-close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.close());
        }

        // 입력 필드 이벤트
        const txt = document.getElementById("txt");
        const btnSend = document.getElementById("btnSend");

        if (txt) {
            txt.addEventListener("keypress", (e) => this.handleEnterKey(e));
            txt.addEventListener("input", () => {
                if (this.chatbotAnswerFlag) {
                    btnSend.className = "btn-stop";
                    btnSend.disabled = false;
                } else {
                    if (txt.value.trim() === '') {
                        btnSend.className = "btn-add";
                        btnSend.disabled = true;
                    } else {
                        btnSend.className = "btn-add";
                        btnSend.disabled = false;
                    }
                }
            });
        }

        if (btnSend) {
            btnSend.addEventListener("click", () => {
                if (btnSend.classList.contains("disabled")) {
                    return;
                }

                if (btnSend.className === "btn-add") {
                    btnSend.classList.add("disabled");
                    this.sendMessageUi();
                    setTimeout(() => {
                        btnSend.classList.remove("disabled");
                    }, 1000);
                }
            });
        }

        // Resizing logic
        this.setupResizing(chatbotWrap);
    }

    setupResizing(chatbotWrap) {
        const resizer = document.createElement("div");
        resizer.classList.add("resizer");
        chatbotWrap.appendChild(resizer);

        resizer.addEventListener("mousedown", (e) => {
            this.isResizing = true;
            chatbotWrap.classList.add("resizing");
            document.body.style.userSelect = "none";
            document.addEventListener("mousemove", this.onMouseMove.bind(this));
            document.addEventListener("mouseup", this.stopResizing.bind(this));
        });
    }

    onMouseMove(e) {
        if (this.isResizing) {
            this.newWidth = window.innerWidth - e.clientX - 20;
            if (this.newWidth >= 500 && this.newWidth <= 1000) {
                if (!this.resizeRequest) {
                    this.resizeRequest = requestAnimationFrame(this.resizePopup.bind(this));
                }
            }
        }
    }

    resizePopup() {
        const chatbotWrap = document.querySelector(".chatbot-wrap");
        chatbotWrap.style.width = `${this.newWidth}px`;
        this.resizeRequest = null;
    }

    stopResizing() {
        this.isResizing = false;
        const chatbotWrap = document.querySelector(".chatbot-wrap");
        chatbotWrap.classList.remove("resizing");
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", this.onMouseMove.bind(this));
        document.removeEventListener("mouseup", this.stopResizing.bind(this));
        if (this.resizeRequest) {
            cancelAnimationFrame(this.resizeRequest);
            this.resizeRequest = null;
        }
    }

    setupEventListeners() {
        // 보내기버튼 활성화 비활성화 함수
        const txt = document.getElementById("txt");
        const btn = document.getElementById("btnSend");

        txt.addEventListener("input", () => {
            if (this.chatbotAnswerFlag) {
                btn.className = "btn-stop";
                btn.disabled = false;
            } else {
                if (txt.value.trim() === '') {
                    btn.className = "btn-add";
                    btn.disabled = true;
                } else {
                    btn.className = "btn-add";
                    btn.disabled = false;
                }
            }
        });

        // 보내기 버튼 이벤트
        btn.addEventListener("click", () => {
            if (btn.classList.contains("disabled")) {
                return;
            }

            if (btn.className === "btn-add") {
                btn.classList.add("disabled");
                this.sendMessageUi();
                setTimeout(() => {
                    btn.classList.remove("disabled");
                }, 1000);
            }
        });

        // textarea 엔터 이벤트
        txt.addEventListener("keydown", (e) => this.handleEnterKey(e));

        // 더보기 클릭 이벤트
        document.querySelector('.chatbot-wrap').addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-chat-more')) {
                document.querySelector('.btn-chat-more').remove();
                this.getChatbotAnswer(this.lastReceivedData[this.lastReceivedData.length - 1], true);
                const btnSend = document.getElementById("btnSend");
                btnSend.className = "btn-stop";
                btnSend.disabled = false;
            }
        });
    }

    handleEnterKey(e) {
        const txt = document.getElementById('txt');
        const code = e.code || e.key;

        if (code === 'Enter' || code === 'NumpadEnter') {
            if (!e.shiftKey && !this.isMobile()) {
                e.preventDefault();
                if (txt.value.trim() !== '' && !this.chatbotAnswerFlag) {
                    this.sendMessageUi();
                    txt.value = '';
                }
            } else if (e.shiftKey || this.isMobile()) {
                const cursorPos = txt.selectionStart;
                const textBefore = txt.value.substring(0, cursorPos);
                const textAfter = txt.value.substring(cursorPos);

                e.preventDefault();
                txt.value = `${textBefore}\n${textAfter}`;
                txt.selectionStart = txt.selectionEnd = cursorPos + 1;

                setTimeout(() => {
                    txt.scrollTop = txt.scrollHeight;
                }, 0);
            }
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${year}.${month}.${day}(${dayOfWeek})`;
    }

    getChatbotAnswer(txtValue, seeMore) {
        if (this.connectRetry < this.MAX_RETRIES) {
            this.sendMessage(txtValue, seeMore);
        }
    }

    sendMessageUi() {
        const txt = document.getElementById("txt");
        let myDiv = document.createElement("div");
        let question = document.createElement("div");
        let chatBox = document.getElementsByClassName("by-date")[document.getElementsByClassName("by-date").length - 1];
        let scrollBox = document.getElementsByClassName("scrollBox")[0];
        let today = new Date();
        let strToday = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        myDiv.className = "my";
        question.className = "question";
        question.innerHTML = txt.value.replace(/\n/g, '<br>');
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
                divDate.innerHTML = this.formatDate(today);
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
            divDate.innerHTML = this.formatDate(today);
            scrollBox.append(divToday);

            divToday.append(divDate);
            divToday.append(myDiv);
            divToday.append(question);
        }

        this.lastReceivedData = [];
        this.originQuery = txt.value;
        this.getChatbotAnswer(txt.value, false);
        scrollBox.scrollTop = scrollBox.scrollHeight;
        txt.value = "";
    }

    async sendMessage(txt, seeMore) {
        console.log('sendMessage', txt);
        this.lastReceivedData.push('');
        this.stop = false;
        const keywordText = this.replaceKeywords(txt);
        const sendText = this.replaceYearWords(keywordText);
        const selectedKeyword = this.getSelectedKeyword();

        let dataSources = document.createElement("div");
        let divAnswer = document.createElement("div");
        let chatBox = document.getElementsByClassName("by-date")[document.getElementsByClassName("by-date").length - 1];
        let scrollBox = document.getElementsByClassName("scrollBox")[0];
        let today = new Date();
        let strToday = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        let tempAnswer = document.createElement("div");

        const btnSend = document.getElementById("btnSend");
        const inputBox = document.getElementById("txt");

        let isAutoScrollEnabled = true;

        scrollBox.addEventListener("scroll", () => {
            const nearBottom = scrollBox.scrollHeight - scrollBox.scrollTop <= scrollBox.clientHeight + 20;
            isAutoScrollEnabled = nearBottom;
        });

        dataSources.className = "data-sources";
        divAnswer.className = "answer";
        divAnswer.dir = "ltr";
        tempAnswer.className = "divAnswer";
        divAnswer.append(tempAnswer);
        dataSources.innerHTML = "";

        let url = API_URLS.CHATBOT;
        const currentIndex = window.currentSlideIndex;

        const params = {
            "shortsIdx":  window.slidesData[currentIndex].shortsIdx,
            "query": selectedKeyword + " " + sendText,
        };

        if (seeMore) {
            params["orig_query"] = this.originQuery;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });

            console.log('=== API 응답 정보 ===');
            console.log('응답 상태:', response.status);
            console.log('응답 헤더:', response.headers);
            console.log('응답 URL:', response.url);

            if (!response.ok) {
                const reader = response.body.getReader();
                const utf8Decoder = new TextDecoder('utf-8');
                const { value } = await reader.read();
                if (response.status === 400) {
                    if (this.connectRetry < this.MAX_RETRIES) {
                        this.connectRetry++;
                        this.getChatbotAnswer(txt, seeMore);
                    } else {
                        console.error("Maximum retry attempts reached. Connection failed.");
                    }
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const utf8Decoder = new TextDecoder('utf-8');
            const boundaryDecoder = new TextDecoder('iso-8859-1');
            let done = false;
            let buffer = new Uint8Array();

            console.log('=== 스트림 읽기 시작 ===');

            if (reader) {
                this.chatbotAnswerFlag = true;
                if (chatBox != undefined) {
                    if (chatBox.dataset.date == strToday) {
                        if (!seeMore) {
                            chatBox.append(dataSources);
                            chatBox.append(divAnswer);
                        }
                    } else {
                        let divToday = document.createElement("div");
                        divToday.className = "by-date";
                        divToday.dataset.date = strToday;
                        let divDate = document.createElement("div");
                        divDate.className = "date";
                        divDate.innerHTML = this.formatDate(today);
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
                    divDate.innerHTML = this.formatDate(today);
                    scrollBox.append(divToday);
                    divToday.append(divDate);
                    divToday.append(dataSources);
                    divToday.append(divAnswer);
                }
            } else {
                this.chatbotAnswerFlag = false;
            }
            btnSend.className = "btn-stop";
            document.querySelector('.chatbot-wrap').addEventListener('click', (event) => {
                if (event.target.classList.contains('btn-stop')) {
                    this.stop = true;
                    this.chatbotAnswerFlag = false;
                    btnSend.className = "btn-add";
                    inputBox.value.trim() === '' ? btnSend.disabled = true : btnSend.disabled = false;
                }
            });

            while (!done) {
                if (this.stop) {
                    console.log('사용자 중지 요청');
                    await reader.cancel();
                    break;
                }
                const { value, done: isDone } = await reader.read();
                done = isDone;

                if (typeof value !== 'undefined' && value !== null) {
                    this.connectRetry = 0;
                    const combined = new Uint8Array(buffer.length + value.length);
                    combined.set(buffer);
                    combined.set(value, buffer.length);
                    buffer = combined;

                    // UTF-8 디코더로 변경
                    const byteDec = utf8Decoder.decode(buffer);
                    console.log('받은 데이터 청크:', byteDec);

                    // 데이터 청크를 개별 메시지로 분리
                    const messages = byteDec.split('\n');
                    
                    for (const message of messages) {
                        if (message.trim() === '') continue;
                        
                        if (message === 'data:[DONE]') {
                            console.log('스트림 종료');
                            break;
                        }

                        if (message.startsWith('data:')) {
                            try {
                                const jsonStr = message.substring(5).trim();
                                if (jsonStr === '') continue;
                                
                                const chunk_data = JSON.parse(jsonStr);
                                console.log('파싱된 JSON 데이터:', chunk_data);

                                if (typeof chunk_data.text !== 'undefined') {
                                    console.log('텍스트 응답:', chunk_data.text);
                                    let lastDivAnswer = await document.getElementsByClassName("divAnswer")[document.getElementsByClassName("divAnswer").length - 1];
                                    if (!seeMore) {
                                        chunk_data.text = chunk_data.text.trimStart();
                                    }

                                    // 마지막 데이터만 업데이트
                                    this.lastReceivedData[this.lastReceivedData.length - 1] = chunk_data.text;
                                    
                                    // 중복 체크
                                    if (this.lastReceivedData.length > 1 && this.lastReceivedData[this.lastReceivedData.length - 1] === this.lastReceivedData[this.lastReceivedData.length - 2]) {
                                        this.lastReceivedData.pop(); // 중복된 데이터 제거
                                    }

                                    const lastReceivedDataJoin = this.lastReceivedData.join('');

                                    const md = window.markdownit({
                                        highlight: function (str, lang) {
                                            if (lang && hljs.getLanguage(lang)) {
                                                try {
                                                    return '<pre class="hljs"><code style="white-space:pre-wrap !important">' +
                                                        hljs.highlight(str, { language: lang }).value +
                                                        '</code></pre>';
                                                } catch (__) { }
                                            }
                                            return '<pre class="hljs"><code>' + str + '</code></pre>';
                                        }
                                    });

                                    const markdownSource = lastReceivedDataJoin;
                                    const result = md.render(markdownSource);
                                    
                                    // DOM 업데이트 전에 중복 체크
                                    if (lastDivAnswer.innerHTML !== `<div>${result}</div>`) {
                                        lastDivAnswer.innerHTML = `<div>${result}</div>`;
                                        if (isAutoScrollEnabled) {
                                            scrollBox.scrollTop = scrollBox.scrollHeight;
                                        }
                                    }
                                }
                                
                                if (typeof chunk_data.end !== 'undefined') {
                                    console.log('응답 종료:', chunk_data);
                                    this.connectRetry = 0;
                                    this.chatbotAnswerFlag = false;
                                    btnSend.className = "btn-add";
                                    inputBox.value.trim() === '' ? btnSend.disabled = true : btnSend.disabled = false;
                                    
                                    if (document.getElementsByClassName("btn-chat-more")[0]) {
                                        document.getElementsByClassName("btn-chat-more")[0].remove();
                                    }
                                    
                                    if (chunk_data.finish_reason === 'length') {
                                        let btnMore = document.createElement("button");
                                        btnMore.textContent = '더보기';
                                        btnMore.className = "btn-chat-more";
                                        document.getElementsByClassName('answer')[document.getElementsByClassName('answer').length - 1].append(btnMore);
                                    } else {
                                        this.originQuery = '';
                                    }
                                }
                            } catch (e) {
                                console.error('JSON 파싱 오류:', e);
                                console.error('문제가 된 메시지:', message);
                            }
                        }
                    }
                }
            }
            console.log('=== 스트림 읽기 완료 ===');
        } catch (error) {
            console.log("ERROR::::::", error);
            if (this.connectRetry < this.MAX_RETRIES) {
                this.connectRetry++;
                this.getChatbotAnswer(txt, seeMore);
            } else {
                console.error("Maximum retry attempts reached. Connection failed.");
            }
        }
    }

    replaceYearWords(input) {
        const currentYear = new Date().getFullYear();
        const wordToYearMapping = {
            '지지난해': currentYear - 2,
            '재작년': currentYear - 2,
            '작년': currentYear - 1,
            '지난해': currentYear - 1,
            '전년': currentYear - 1,
            '올해': currentYear,
            '금년': currentYear,
            '내년': currentYear + 1,
            '명년': currentYear + 1,
            '다음 해': currentYear + 1,
            '오는 해': currentYear + 1
        };

        const pattern = Object.keys(wordToYearMapping)
            .map(word => word.split('').join('\\s*'))
            .join('|');

        const timePattern = `(\\d+)\\s*년\\s*(전|후|뒤)`;

        const regex = new RegExp(`${pattern}|${timePattern}`, 'gi');

        return input.replace(regex, (match, num, direction) => {
            if (num && direction) {
                const offset = parseInt(num, 10) * (direction === '전' ? -1 : direction === '후' || direction === '뒤' ? +1 : 1);
                return `${currentYear + offset}년`;
            } else {
                const normalizedWord = match.replace(/\s+/g, '');
                return `${wordToYearMapping[normalizedWord]}년`;
            }
        });
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }

    replaceKeywords(input) {
        const keywordMapping = {
            // MADP API
            '모바일 관리': 'MADP API 모바일 관리',
            '리소스 업로드': 'MADP API 리소스 업로드',
            'Push 관리': 'MADP API Push 관리',
            '가로 모드': 'MADP API 가로 모드',
            '세로 모드': 'MADP API 세로 모드',
            "Core Library": "MADP API Core Library",
            "MCore Framework": "MADP API MCore Framework",
            "로컬 데이터베이스": "MADP API 로컬 데이터베이스",
            "파일 입출력": "MADP API 파일 입출력",
            "다국어 처리": "MADP API 다국어 처리",
            "미디어 처리": "MADP API 미디어 처리",
            "네트워크 관련 기능": "MADP API 네트워크 관련 기능",
            "팝업 처리": "MADP API 팝업 처리",
            "ZIP 압축": "MADP API ZIP 압축",
            "Qr코드 관련": "MADP API Qr코드 관련",
            "Drawing 관련": "MADP API Drawing 관련",
            "문서 뷰어 관련": "MADP API 문서 뷰어 관련",
            "앱 위변조 방지": "MADP API 앱 위변조 방지",
            "PUSH 관련": "MADP API PUSH 관련",
            "위치 정보 기능": "MADP API 위치 정보 기능",
            "앱 보안 관련": "MADP API 앱 보안 관련",
            "화면 이벤트": "MADP API 화면 이벤트",
            "화면 이동 및 관리": "MADP API 화면 이동 및 관리",
            "데이터 관리": "MADP API 데이터 관리",
            "네이티브 기능": "MADP API 네이티브 기능",
            "디바이스 및 앱 정보": "MADP API 디바이스 및 앱 정보",
            "암복호화": "MADP API 암복호화",
            "OS 정보 확인": "MADP API OS 정보 확인",
            "디바이스 상세 정보 조회": "MADP API 디바이스 상세 정보 조회",
            "웹 뷰 브라우저 정보": "MADP API 웹 뷰 브라우저 정보",
            "Page 정보 추출": "MADP API Page 정보 추출",
            "화면 지연 이동": "MADP API 화면 지연 이동",
            "탭 화면 이동": "MADP API 탭 화면 이동",
            "데이터베이스 파일 생성": "MADP API 데이터베이스 파일 생성",
            "데이터베이스 sql 실행": "MADP API 데이터베이스 sql 실행",
            "파일 생성": "MADP API 파일 생성",
            "파일 읽기": "MADP API 파일 읽기",
            "파일 삭제": "MADP API 파일 삭제",
            "파일 정보 조회": "MADP API 파일 정보 조회",
            "다국어 변환 출력": "MADP API 다국어 변환 출력",
            "언어 변경 이벤트": "MADP API 언어 변경 이벤트",
            "미디어 촬영": "MADP API 미디어 촬영",
            "앨범 저장": "MADP API 앨범 저장",
            "미디어 정보 조회": "MADP API 미디어 정보 조회",
            "네트워크 통신": "MADP API 네트워크 통신",
            "HTTP 파일 업로드": "MADP API HTTP 파일 업로드",
            "HTTP 파일 다운로드": "MADP API HTTP 파일 다운로드",
            "FTP 파일 리스트": "MADP API FTP 파일 리스트",
            "알림 팝업": "MADP API 알림 팝업",
            "데이트 피커": "MADP API 데이트 피커",
            "리스트 팝업": "MADP API 리스트 팝업",
            "파일 압축": "MADP API 파일 압축",
            "QR 코드 스캔": "MADP API QR 코드 스캔",
            "드로잉 화면": "MADP API 드로잉 화면",
            "문서 뷰어": "MADP API 문서 뷰어",
            "앱 설치": "MADP API 앱 설치",
            "앱 삭제": "MADP API 앱 삭제",
            "앱 정보 조회": "MADP API 앱 정보 조회",
            "화면 이동": "MADP API 화면 이동",
            "화면 로드": "MADP API 화면 로드",
            "화면 전환": "MADP API 화면 전환",
            "화면 스택 관리": "MADP API 화면 스택 관리",
            "화면 복귀": "MADP API 화면 복귀",
            "앱 백그라운드": "MADP API 앱 백그라운드",
            "앱 포그라운드": "MADP API 앱 포그라운드",
            "화면 종료": "MADP API 화면 종료",
            "화면 애니메이션": "MADP API 화면 애니메이션",
            "화면 전환 효과": "MADP API 화면 전환 효과",
            "화면 방향 설정": "MADP API 화면 방향 설정",
        };

        if (input.toLowerCase().includes("madp")) {
            return input;
        }

        Object.entries(keywordMapping).forEach(([key, value]) => {
            const regex = new RegExp(key.replace(/\s+/g, '\\s*'), 'gi');
            input = input.replace(regex, value);
        });

        return input;
    }

    handleButtonClick(event) {
        const clickedButton = event.target;

        if (clickedButton.classList.contains("active")) {
            clickedButton.classList.remove("active");
        } else {
            const buttons = clickedButton.parentElement.querySelectorAll("button");
            buttons.forEach(button => button.classList.remove("active"));
            clickedButton.classList.add("active");
        }
    }

    createKeywordButtons(keywords) {
        const keywordDiv = document.createElement("div");
        keywordDiv.classList.add("keywordMapping");

        keywords.forEach(keyword => {
            const button = document.createElement("button");
            button.innerText = keyword;

            button.addEventListener("click", (event) => this.handleButtonClick(event));

            keywordDiv.appendChild(button);
        });

        return keywordDiv;
    }

    getSelectedKeyword() {
        const activeButton = document.querySelector(".keywordMapping button.active");
        return activeButton ? activeButton.innerText : "";
    }

    addNewQuestionAndAnswer() {
        const chatBox = document.getElementsByClassName("by-date")[document.getElementsByClassName("by-date").length - 1];
        const scrollBox = document.getElementsByClassName("scrollBox")[0];

        document.querySelectorAll(".keywordMapping button.active").forEach(button => {
            button.classList.remove("active");
        });

        const myDiv = document.createElement("div");
        myDiv.classList.add("my");
        chatBox.appendChild(myDiv);

        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");
        questionDiv.innerHTML = "키워드를 선택 해주세요.";

        const newKeywords = ["MADP API", "MADP ADMIN", "MADP IOS가이드", "MADP AOS가이드", "MADP Push가이드"];
        const keywordButtons = this.createKeywordButtons(newKeywords);
        questionDiv.appendChild(keywordButtons);

        chatBox.appendChild(questionDiv);
        scrollBox.scrollTop = scrollBox.scrollHeight;
    }

    open() {
        const chatbotWrap = document.querySelector(".chatbot-wrap");
        const chatbotPop = document.querySelector(".chatbot-pop");
        const overlay = document.querySelector(".overlay");

        // 챗봇 환영 메시지 업데이트
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            const currentIndex = window.currentSlideIndex;
            const currentProduct = window.slidesData[currentIndex].productNm;

            welcomeMessage.innerHTML = `안녕하세요!
                저는 유라클의 대화형 챗봇, MessageAI 입니다.
                ${currentProduct}에 대해 궁금한 점은 언제든 물어보세요!`;
        }

        chatbotPop.style.display = "flex";
        chatbotWrap.style.display = "flex";
        overlay.classList.remove("none");
        overlay.classList.add("block");
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            chatbotWrap.classList.add("show-popup");
        }, 10);
        document.querySelectorAll("video").forEach(video => video.pause());
    }

    close() {
        const chatbotWrap = document.querySelector(".chatbot-wrap");
        const chatbotPop = document.querySelector(".chatbot-pop");
        const overlay = document.querySelector(".overlay");

        chatbotWrap.classList.remove("show-popup");
        document.body.style.overflow = "";
        overlay.classList.remove("block");
        overlay.classList.add("none");

        this.stop = true;
        this.chatbotAnswerFlag = false;
        document.getElementById("txt").value = "";
        document.getElementById("btnSend").disabled = true;
        document.getElementById("btnSend").className = "btn-add";

        setTimeout(() => {
            chatbotWrap.style.display = "none";
            chatbotPop.style.display = "none";
            let activeSlide = document.querySelector(".swiper-slide-active video");
            if (activeSlide) {
                activeSlide.play();
            }
        }, 300);
    }
}