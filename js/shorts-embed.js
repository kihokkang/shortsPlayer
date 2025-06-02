(function (global) {
  // 네임스페이스 객체 정의
  const M = {};

  M.callShorts = function (options = {}) {
    const params = new URLSearchParams(window.location.search);
    let {
      // shortsIdx = '',
      // previewYn = 'N',
      // type = 'shorts', //shorts or shortform
      sendKey = params.get('shortform'),
    } = options;

    if (!sendKey) return;
    
    const iframeUrl = options.url ||`https://saasdev.message-ai.net/shortsPlayer/index.html?&sendKey=${sendKey}`;
    const width = options.width || "360px";
    const height = options.height || "640px";

    
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일은 새 창으로 열기
      window.open(iframeUrl, '_blank');
      return;
    }
    // 이미 삽입된 iframe이 있다면 제거
    const existing = document.getElementById("m-shorts-iframe");
    if (existing) existing.remove();

    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.id = "m-shorts-iframe";
    iframe.style.width = width;
    iframe.style.height = height;
    iframe.style.border = "none";
    iframe.style.position = "fixed";
    iframe.style.display = "block";
    iframe.style.top = "50%";
    iframe.style.left = "50%";
    iframe.style.transform = "translate(-50%, -50%)";
    iframe.style.zIndex = "100";
    iframe.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
    iframe.style.padding = "5px";
    iframe.style.backgroundColor = "#EEEEEE";
    document.body.insertBefore(iframe, document.body.firstChild);
  };

  window.addEventListener('message', function(event) {
    if (event.data.type === 'iframeClose') {
      const iframe = document.getElementById('m-shorts-iframe');
      if (iframe) {
        iframe.remove(); // iframe 제거
      }
    }
  });

  window.addEventListener('message', function(event) {
    if (event.data.type === 'productUrl') {
      const iframe = document.getElementById('m-shorts-iframe');
      if (iframe) {
        iframe.remove(); // iframe 제거
        location.href = event.data.url;
      }
    }
  });

  // 전역에 노출
  global.M = M;

})(window);


// 사용 예시
// HTML 파일 내 아래 스크립트를 <head> 또는 <body> 하단에 삽입해주세요.
    //*127.0.0.1 형식의 local 주소는 실제 파일 업로드 후 변경하여 스크립트 삽입
// <script src="http://127.0.0.1:5501/src/views/shortsPlayer/js/shorts-embed.js"></script>
// 2 . JavaScript 호출
  // M.callShorts(); 함수를 웹페이지 로딩 이후(예: DOMContentLoaded 또는 onReady)에 호출해주세요.
  // URL에 shortform 파라미터가 포함되어 있을 경우에만 iFrame이 생성되어 자동으로 노출됩니다.
