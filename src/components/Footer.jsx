function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-zinc-900 pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">G</span>
              </div>
              <span className="text-lg font-black tracking-tighter text-white">
                Guide<span className="text-blue-500 text-sm">Book</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              지식의 바다에서 나만의 경로를 설계하고 공유하는 <br />
              맞춤 독서 커리큘럼 플랫폼입니다. 당신의 성장을 응원합니다.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">𝕏</div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">🐙</div>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600">Platform</h4>
            <ul className="space-y-4">
              <li><p className="text-sm font-bold text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer">로드맵 탐색</p></li>
              <li><p className="text-sm font-bold text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer">베스트 가이드</p></li>
              <li><p className="text-sm font-bold text-zinc-400 hover:text-blue-500 transition-colors cursor-pointer">새소식</p></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600">Policy</h4>
            <ul className="space-y-4">
              <li><p className="text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer">이용약관</p></li>
              <li><p className="text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer">개인정보처리방침</p></li>
              <li><p className="text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer">도서 정보 문의</p></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            © 2026 GuideBook Team. All Rights Reserved.
          </p>
          <p className="text-[10px] font-bold text-zinc-700">
            MADE WITH ❤️ FOR READERS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
