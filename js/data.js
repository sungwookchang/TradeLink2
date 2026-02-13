// 초기 카테고리 데이터
const initialCategories = [
  { id: "1", name: "무역 도우미", description: "기본 무역 서비스" },
  { id: "2", name: "Trade AI", description: "AI 기반 서비스" },
  { id: "3", name: "뉴스레터", description: "무역 뉴스 및 정보" },
  { id: "4", name: "상담", description: "무역 상담 서비스" },
  { id: "5", name: "보고서", description: "전문 보고서 및 자료" }
];

// 초기 링크 데이터
const initialLinks = [
  // 무역 도우미 (카테고리 1)
  {
    id: "1",
    categoryId: "1",
    title: "KOTRA 주요 서비스",
    description: "KOTRA 수출, 더 이상 어렵지 않아요",
    url: "https://kotra.or.kr"
  },
  {
    id: "2",
    categoryId: "1",
    title: "KOTRA 무역투자24",
    description: "한 눈에 보는 KOTRA 서비스",
    url: "https://kotra.or.kr/trade24"
  },

  // Trade AI (카테고리 2)
  {
    id: "3",
    categoryId: "2",
    title: "AI 수출정보 서비스",
    description: "KOTRA AI 기반 수출 정보",
    url: "https://ai.kotra.or.kr"
  },

  // 뉴스레터 (카테고리 3)
  {
    id: "4",
    categoryId: "3",
    title: "KOTRA 뉴스레터",
    description: "주간 무역 뉴스 및 정보",
    url: "https://kotra.or.kr/newsletter"
  },
  {
    id: "5",
    categoryId: "3",
    title: "한국무역협회 뉴스",
    description: "무역협회 공식 뉴스",
    url: "https://kita.or.kr/news"
  },

  // 상담 (카테고리 4)
  {
    id: "6",
    categoryId: "4",
    title: "1:1 상담 - 한국무역협회",
    description: "무역 전문가 1:1 상담",
    url: "https://kita.or.kr/consulting"
  },
  {
    id: "7",
    categoryId: "4",
    title: "KOTRA 온라인 상담",
    description: "KOTRA 온라인 상담 서비스",
    url: "https://kotra.or.kr/consulting"
  },

  // 보고서 (카테고리 5)
  {
    id: "8",
    categoryId: "5",
    title: "신용보고서",
    description: "기업 신용정보 보고서",
    url: "https://report.kotra.or.kr"
  },
  {
    id: "9",
    categoryId: "5",
    title: "국제무역 연구자료",
    description: "KOTRA 국제무역 연구 자료",
    url: "https://research.kotra.or.kr"
  }
];

// 초기 전체 데이터 구조
const initialData = {
  categories: initialCategories,
  links: initialLinks
};
