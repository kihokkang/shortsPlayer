/**
 * =====================================================
 * 화면명 : domains.js
 * 작성자 : 김기호
 * 작성일: 2025.05.23
 * 설명: 도메인 관리 모듈
 * =====================================================
 */

const ENV = {
    LOCAL: 'local',
    DEV: 'dev',
    PROD: 'prod'
};

// 현재 환경 설정 (기본값: local)
const CURRENT_ENV = ENV.DEV;

// TODO: 환경별 도메인 설정 추가 해야함
const DOMAINS = {
    [ENV.LOCAL]: {
        API: 'http://localhost:8080',
        CHATBOT: 'https://saasdev.message-ai.net'
    },
    [ENV.DEV]: {
        API: 'https://saasdev.message-ai.net',
        CHATBOT: 'https://saasdev.message-ai.net'
    },
    [ENV.PROD]: {
        API: 'https://api.message-ai.net',
        CHATBOT: 'https://saas.message-ai.net'
    }
};

export const getDomain = (type) => {
    return DOMAINS[CURRENT_ENV][type] || '';
};

export const getApiUrl = (path) => {
    return `${getDomain('API')}${path}`;
};

export const getChatbotUrl = (path) => {
    return `${getDomain('CHATBOT')}${path}`;
}; 