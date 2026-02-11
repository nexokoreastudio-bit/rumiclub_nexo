/**
 * 디버그 모드: URL에 ?debug=1 또는 localStorage에 rumiclub_debug=1 이 있으면 활성화
 * 콘솔에서 localStorage.setItem('rumiclub_debug', '1') 로 켜고, removeItem('rumiclub_debug') 로 끌 수 있음
 */
export function isDebug() {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === '1' || params.get('debug') === 'true') return true;
  try {
    return localStorage.getItem('rumiclub_debug') === '1' || localStorage.getItem('rumiclub_debug') === 'true';
  } catch {
    return false;
  }
}

/** 디버그 로그: isDebug() 일 때만 console.log */
export function debugLog(tag, ...args) {
  if (isDebug()) {
    console.log(`[DEBUG ${tag}]`, ...args);
  }
}

/** 디버그용: 객체를 안전하게 직렬화 (에러·순환 참조 방지) */
export function safeStringify(obj, space = 2) {
  try {
    return JSON.stringify(obj, (_, v) => (v === undefined ? '__undefined__' : v), space);
  } catch (e) {
    return String(obj);
  }
}
