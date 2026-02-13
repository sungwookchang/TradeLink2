/**
 * localStorage를 사용한 데이터 관리
 */

const STORAGE_KEY = 'tradeLink_data';

/**
 * 초기 데이터
 */
const initialData = {
  categories: [
    { id: 1, name: '무역 도우미' },
    { id: 2, name: 'Trade AI' },
    { id: 3, name: '뉴스레터' },
    { id: 4, name: '상담' },
    { id: 5, name: '보고서' }
  ],
  links: [
    { id: 1, categoryId: 1, title: '무역업자 전용 커뮤니티', description: '무역업자 네트워킹 플랫폼', url: 'https://example.com/traders' },
    { id: 2, categoryId: 2, title: '자동 가격 분석 AI', description: '실시간 가격 분석 도구', url: 'https://example.com/ai-price' },
    { id: 3, categoryId: 2, title: '수출 예측 모델', description: 'ML 기반 수출량 예측', url: 'https://example.com/export-forecast' },
    { id: 4, categoryId: 3, title: '주간 무역 뉴스', description: '매주 업데이트되는 무역 뉴스', url: 'https://example.com/weekly-news' },
    { id: 5, categoryId: 4, title: '관세 상담 예약', description: '전문가와의 상담 예약 시스템', url: 'https://example.com/tariff-consultation' },
    { id: 6, categoryId: 5, title: '월별 무역 현황', description: '최신 무역 통계 보고서', url: 'https://example.com/monthly-report' },
    { id: 7, categoryId: 1, title: '통관 자동화 시스템', description: '통관 서류 자동 처리', url: 'https://example.com/customs-auto' },
    { id: 8, categoryId: 3, title: '월별 관세 정보', description: '관세 변동 정보', url: 'https://example.com/tariff-info' },
    { id: 9, categoryId: 5, title: 'FTA 분석 보고서', description: 'FTA 협상 분석', url: 'https://example.com/fta-analysis' }
  ]
};

/**
 * localStorage에서 데이터 조회
 */
function getData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * localStorage에 데이터 저장
 */
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * 초기 데이터 설정 (첫 로드 시만)
 */
function initializeData() {
  const existingData = getData();
  if (!existingData) {
    saveData({
      categories: JSON.parse(JSON.stringify(initialData.categories)),
      links: JSON.parse(JSON.stringify(initialData.links)),
      nextCategoryId: 6,
      nextLinkId: 10
    });
    console.log('✅ 초기 데이터 설정 완료');
  }
}

// ===== 링크 관련 함수 =====

/**
 * 링크 추가
 */
function addLink(categoryId, linkData) {
  const data = getData();
  const newLink = {
    id: data.nextLinkId++,
    categoryId: categoryId || null,
    title: linkData.title,
    description: linkData.description || null,
    url: linkData.url
  };
  data.links.push(newLink);
  saveData(data);
  return newLink;
}

/**
 * 링크 수정
 */
function updateLink(linkId, newData) {
  const data = getData();
  const link = data.links.find(l => l.id === linkId);
  if (link) {
    link.title = newData.title;
    link.description = newData.description || null;
    link.url = newData.url;
    link.categoryId = newData.categoryId || null;
    saveData(data);
    return link;
  }
  return null;
}

/**
 * 링크 삭제
 */
function deleteLink(linkId) {
  const data = getData();
  const index = data.links.findIndex(l => l.id === linkId);
  if (index !== -1) {
    data.links.splice(index, 1);
    saveData(data);
    return true;
  }
  return false;
}

/**
 * 특정 카테고리의 링크 조회
 */
function getLinksByCategory(categoryId) {
  const data = getData();
  if (!categoryId) return data.links;
  return data.links.filter(l => l.categoryId === categoryId);
}

/**
 * 모든 링크 조회
 */
function getAllLinks() {
  const data = getData();
  return data.links;
}

/**
 * 특정 링크 조회
 */
function getLink(linkId) {
  const data = getData();
  return data.links.find(l => l.id === linkId) || null;
}

// ===== 카테고리 관련 함수 =====

/**
 * 카테고리 추가
 */
function addCategory(categoryData) {
  const data = getData();
  const newCategory = {
    id: data.nextCategoryId++,
    name: categoryData.name
  };
  data.categories.push(newCategory);
  saveData(data);
  return newCategory;
}

/**
 * 카테고리 수정
 */
function updateCategory(categoryId, newData) {
  const data = getData();
  const category = data.categories.find(c => c.id === categoryId);
  if (category) {
    category.name = newData.name;
    saveData(data);
    return category;
  }
  return null;
}

/**
 * 카테고리 삭제 (연관된 링크도 삭제)
 */
function deleteCategory(categoryId) {
  const data = getData();
  const index = data.categories.findIndex(c => c.id === categoryId);
  if (index !== -1) {
    data.categories.splice(index, 1);
    // 연관된 링크 삭제
    data.links = data.links.filter(l => l.categoryId !== categoryId);
    saveData(data);
    return true;
  }
  return false;
}

/**
 * 특정 카테고리 조회
 */
function getCategory(categoryId) {
  const data = getData();
  return data.categories.find(c => c.id === categoryId) || null;
}

/**
 * 모든 카테고리 조회
 */
function getAllCategories() {
  const data = getData();
  return data.categories;
}
