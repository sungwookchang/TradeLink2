/**
 * Supabase 설정
 */
const SUPABASE_URL = 'https://zfiwdbehmsdjnmflumfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_R8bdG2HpEuXT4Uj31eMRbQ_qWcTUxlH';

// Supabase 클라이언트 (전역 변수)
let supabase = null;

/**
 * Supabase 초기화
 */
function initializeSupabase() {
  console.log('Supabase 초기화 시도...');

  // window.supabase 확인
  if (!window.supabase) {
    console.error('❌ window.supabase가 정의되지 않았습니다.');
    console.log('현재 window 속성:', Object.keys(window).filter(k => k.toLowerCase().includes('supa')));
    return false;
  }

  try {
    // createClient 함수 확인
    if (typeof window.supabase.createClient !== 'function') {
      console.error('❌ window.supabase.createClient가 함수가 아닙니다.');
      return false;
    }

    // Supabase 클라이언트 생성
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    if (!supabase) {
      console.error('❌ Supabase 클라이언트 생성 실패');
      return false;
    }

    console.log('✅ Supabase 초기화 완료');
    console.log('URL:', SUPABASE_URL);
    return true;
  } catch (error) {
    console.error('❌ Supabase 초기화 중 오류:', error);
    return false;
  }
}

// 스크립트 로드 완료 후 초기화 (최대 5초 대기)
let initAttempts = 0;
const initTimer = setInterval(() => {
  if (initializeSupabase()) {
    clearInterval(initTimer);
  } else if (initAttempts > 50) {
    clearInterval(initTimer);
    console.error('⚠️ Supabase 초기화 타임아웃');
  }
  initAttempts++;
}, 100);
