// Supabase 클라이언트 라이브러리를 CDN에서 직접 가져와 설치 없이 사용합니다.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// IMPORTANT: 실제 서비스에서는 환경 변수로 관리해야 합니다.
// 🚨 다음 두 값을 사용자의 실제 Supabase URL과 Public Key로 교체해야 합니다.
const SUPABASE_URL = "https://wshlarjkrnkzgpanqpyz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaGxhcmprcm5remdwYW5xcHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzIzMzUsImV4cCI6MjA3NzE0ODMzNX0.uJnRXhE8gZtgUr2GP0P4I-k_dJShHdEC7vZxJz2PVmo";

// 1. Supabase 클라이언트 초기화
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 2. 익명 로그인(Anonymous Sign In)을 시도합니다.
 * 실제 이메일/비밀번호 없이 테스트 사용자를 만듭니다.
 */
export const signInAnonymously = async () => {
  try {
    // Firebase와 달리 Supabase는 익명 로그인(signInAnonymously)이 기본 설정이 아닐 수 있습니다.
    // 이 기능을 사용하려면 Supabase Auth 설정에서 'Anonymous Sign In'을 활성화해야 합니다.
    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    console.log("익명 로그인 성공!");
    return true;
  } catch (error) {
    console.error("익명 로그인 오류:", error.message);
    return false;
  }
};

/**
 * 3. 로그아웃을 처리합니다.
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("로그아웃 성공!");
  } catch (error) {
    console.error("로그아웃 오류:", error.message);
  }
};

/**
 * 4. 인증 상태 변경 리스너를 설정하고, 사용자 정보를 콜백으로 전달합니다.
 * 이 함수를 통해 WritePage가 로그인 상태를 실시간으로 알 수 있습니다.
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    // session?.user가 현재 사용자 정보입니다.
    callback(session?.user || null);
  }).data.subscription;
};
