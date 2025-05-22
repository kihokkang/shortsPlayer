(function (global) {
  // 네임스페이스 객체 정의
  const M = {};

  M.callShorts = function (options = {}) {
    let {
      shortsIdx = '',
      previewYn = 'N',
      type = 'shorts', //shorts or shortform
    } = options;

    const iframeUrl = options.url ||`https://kihokkang.github.io/shortsPlayer/index.html?idx=${encodeURIComponent(shortsIdx)}&previewYn=${encodeURIComponent(previewYn)}&type=${encodeURIComponent(type)}`;
    const width = options.width || "360px";
    const height = options.height || "640px";

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

    document.body.insertBefore(iframe, document.body.firstChild);
  };

  // 전역에 노출
  global.M = M;

})(window);


// 사용 예시
// <script src="http://127.0.0.1:5501/src/views/shortsPlayer/js/shorts-embed.js"></script> 

// M.callShorts({
//   shortsIdx: '100003',
//   previewYn: 'Y',
//   type: 'shorts'
// });
