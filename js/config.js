/**
 * Supabase 설정
 */
const SUPABASE_URL = 'https://zfiwdbehmsdjnmflumfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_R8bdG2HpEuXT4Uj31eMRbQ_qWcTUxlH';

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
