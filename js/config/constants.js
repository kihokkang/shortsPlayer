/**
 * =====================================================
 * 화면명 : constants.js
 * 작성자 : 김기호
 * 작성일: 2025.04.30
 * 설명: 상수 정의 관리 모듈
 * =====================================================
 */

import { getApiUrl, getChatbotUrl } from './domains.js';

export const API_URLS = {
    CHATBOT: getChatbotUrl('/api/shortform/chat'),
    GET_SHORT_FORM_CONTENT: getApiUrl('/api/shortform/init/'),
    SEND_ACTION_LOG: getApiUrl('/api/shortform/action')
};

export const CONSTANTS = {
    KAKAO_SDK_KEY: '76533188d481d2576e1330c0e59156b6',
    SHARE_URL: getApiUrl('/shortsPlayer/redirect.html?to=')
};

