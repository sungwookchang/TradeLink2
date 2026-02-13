/**
 * Supabase 설정
 */
const SUPABASE_URL = 'https://zfiwdbehmsdjnmflumfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_R8bdG2HpEuXT4Uj31eMRbQ_qWcTUxlH';

// Supabase 클라이언트 초기화 (라이브러리 로드 대기)
let supabase = null;

function initializeSupabase() {
  try {
    if (!window.supabase) {
      console.error('Supabase 라이브러리가 로드되지 않았습니다.');
      console.log('window 객체:', Object.keys(window).filter(k => k.includes('supabase')));
      return false;
    }

    const { createClient } = window.supabase;
    if (!createClient) {
      console.error('window.supabase.createClient가 없습니다.');
      return false;
    }

    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase 초기화 성공');
    return true;
  } catch (error) {
    console.error('❌ Supabase 초기화 오류:', error);
    return false;
  }
}

// DOM이 로드되면 초기화 시도
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
  // 이미 DOM이 로드된 경우
  setTimeout(initializeSupabase, 100);
}
