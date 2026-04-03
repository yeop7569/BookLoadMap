# 📚 BookLoadMap (북로드맵)

당신만의 독서 경로를 설계하고 공유하는 스마트한 도서 로드맵 서비스입니다.

![BookLoadMap Screenshot](https://via.placeholder.com/800x450?text=BookLoadMap+Preview)

## 🌟 주요 기능

- **🔍 스마트 도서 검색**: 카카오 도서 검색 API를 활용하여 전 세계의 방대한 도서 데이터를 실시간으로 검색합니다.
- **🗺️ 독서 로드맵 설계**: 읽고 싶은 책들을 순서대로 배치하여 자신만의 '책 읽는 경로'를 시각적으로 구성할 수 있습니다.
- **💾 실시간 데이터 저장**: Supabase를 연동하여 내가 만든 로드맵을 언제 어디서든 다시 불러오고 편집할 수 있습니다.
- **✍️ 풍부한 노트 기능**: BlockNote를 기반으로 한 에디터를 통해 각 도서별로 깊이 있는 감상과 메모를 남길 수 있습니다.

## 🛠️ 기술 스택

- **Frontend**: React 19, Vite, TypeScript
- **State Management**: Zustand
- **UI Components**: Mantine UI, Tailwind CSS, Daisy UI
- **Backend/DB**: Supabase (PostgreSQL, Auth)
- **API**: Kakao Book Search API
- **Others**: React Router Dom, React Icons, BlockNote, Day.js, Sonner (Toasts)

## 🚀 시작하기 (로컬 실행 방법)

1. **저장소 복제**
   ```bash
   git clone https://github.com/사용자이름/BookLoadMap.git
   cd BookLoadMap
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 입력합니다:
   ```env
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=YOUR_SUPABASE_ANON_KEY
   VITE_KAKAO_API_KEY=YOUR_KAKAO_API_KEY
   ```

4. **애플리케이션 실행**
   ```bash
   npm run dev
   ```

## 🔒 보안 및 주의사항

- 이 프로젝트는 환경 변수(`.env`)를 사용하여 API 키를 관리합니다.
- `.gitignore` 파일에 `.env` 관련 파일들이 포함되어 있으므로, 실제 API 키가 공개 저장소에 노출되지 않도록 주의하십시오.
- Supabase의 **Row Level Security (RLS)** 설정을 통해 데이터 보안을 강화하는 것이 권장됩니다.

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
