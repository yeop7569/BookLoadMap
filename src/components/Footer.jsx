function Footer() {
  return (
    <footer className="w-full border-t mt-10">
      <div className="w-full flex justify-between items-start p-6">
        {/* Left */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">BookRoadmap</h2>
          <p className="text-sm text-gray-500">맞춤 독서 커리큘럼 플랫폼</p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <p className="cursor-pointer transition-all duration-200 hover:font-medium">
            이용약관
          </p>
          <p className="cursor-pointer transition-all duration-200 hover:font-medium">
            개인정보처리방침
          </p>
          <p className="cursor-pointer transition-all duration-200 hover:font-medium">
            도서 정보 문의
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
