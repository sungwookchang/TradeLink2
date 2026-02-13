# TradeLink2 - 무역 정보 링크 통합 플랫폼

무역 관련 링크를 카테고리별로 정리하고, 호스트가 쉽게 수정/추가/삭제할 수 있는 웹사이트입니다.

## 📋 프로젝트 개요

### 핵심 특징
- ✅ 새로고침해도 데이터 유지 (localStorage)
- ✅ 호스트 모드로 링크/카테고리 CRUD 기능
- ✅ 깔끔하고 직관적인 UI
- ✅ 카테고리별 필터링 및 검색 기능

### 제외 기능 (추후 개발)
- 로그인 / 인증
- 추천 알고리즘
- 북마크 / 즐겨찾기
- 고급 분석 기능

## 📁 프로젝트 구조

```
TradeLink2/
├── index.html              # 메인 HTML
├── css/
│   └── style.css           # 스타일
├── js/
│   ├── data.js             # 초기 데이터
│   ├── storage.js          # localStorage 관리
│   ├── ui.js               # UI 렌더링
│   ├── hostMode.js         # 호스트 모드 기능
│   └── app.js              # 메인 앱 로직
├── CLAUDE.md               # Claude Code 설정
└── README.md               # 이 파일
```

## 🚀 개발 진행도

### Phase 1: 기본 구조 & 데이터 설정 ✅ 완료
- [x] 데이터 구조 정의 (data.js)
- [x] localStorage 관리 함수 (storage.js)
- [x] HTML 구조 (index.html)
- [x] 스타일시트 (style.css)
- [x] UI/호스트 모드 함수 스켈레톤

### Phase 2: 사용자 인터페이스 & 기능 🔄 예정
- [ ] UI 렌더링 함수 구현
- [ ] 호스트 모드 토글 기능
- [ ] 링크/카테고리 추가/수정/삭제 폼
- [ ] 모달 및 이벤트 처리
- [ ] 검색 & 필터링 기능

### Phase 3: 초기 데이터 & 배포 🔄 예정
- [ ] 초기 링크 데이터 (9개 항목 포함)
- [ ] GitHub 저장소 생성
- [ ] Vercel 배포
- [ ] 라이브 URL 획득

## 📊 데이터 구조

### 카테고리 (5개)
- 무역 도우미
- Trade AI
- 뉴스레터
- 상담
- 보고서

### 링크 데이터
각 링크는 다음 정보를 포함합니다:
```javascript
{
  id: "1",
  categoryId: "1",
  title: "링크 제목",
  description: "링크 설명",
  url: "https://example.com"
}
```

## 💻 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: localStorage API
- **Hosting**: Vercel / GitHub Pages (예정)

## 🔧 개발 방법

### 로컬에서 실행
```bash
# 웹 브라우저에서 index.html을 직접 열거나
# 간단한 HTTP 서버 사용 (Python)
python -m http.server 8000
# 또는 (Node.js)
npx http-server
```

### 호스트 모드 사용
1. 우측 상단의 "호스트 모드 OFF" 버튼 클릭
2. 호스트 모드 패널이 좌측에 나타남
3. 링크/카테고리 추가, 수정, 삭제 가능

## 📝 주요 함수

### storage.js
- `initializeData()` - localStorage 초기화
- `getData()` - 현재 데이터 불러오기
- `saveData(data)` - 데이터 저장
- `addLink(categoryId, linkData)` - 링크 추가
- `updateLink(linkId, newData)` - 링크 수정
- `deleteLink(linkId)` - 링크 삭제
- `addCategory(categoryData)` - 카테고리 추가
- `updateCategory(categoryId, newData)` - 카테고리 수정
- `deleteCategory(categoryId)` - 카테고리 삭제

### ui.js
- `renderCategories()` - 카테고리 목록 표시
- `renderLinks(categoryId)` - 링크 목록 표시
- `renderHostPanel()` - 호스트 패널 표시
- `updateUI()` - 전체 UI 업데이트

### hostMode.js
- `toggleHostMode()` - 호스트 모드 ON/OFF
- `openAddLinkForm(categoryId)` - 링크 추가 폼
- `openAddCategoryForm()` - 카테고리 추가 폼

### app.js
- `initializeApp()` - 앱 초기화
- `attachEventListeners()` - 이벤트 리스너 등록

## 🎨 UI 디자인

### 메인 레이아웃
- **헤더**: 로고 + 호스트 모드 버튼
- **좌측 패널**: 호스트 모드 패널 (toggle 가능)
- **메인 콘텐츠**: 카테고리 필터 + 검색 + 링크 목록

### 색상 스킴
- 주색상: #667eea (보라색)
- 보조색: #764ba2 (진보라색)
- 배경: #f5f5f5 (밝은 회색)

## 📝 라이선스

MIT License

## 🤝 기여

버그 리포트 및 기능 제안은 GitHub Issues를 통해 등록해주세요.
