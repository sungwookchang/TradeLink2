// localStorage 키
const STORAGE_KEY = 'tradeLink_data';

/**
 * localStorage 초기화 (첫 로드 시)
 */
function initializeData() {
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
}

/**
 * 현재 데이터 불러오기
 */
function getData() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialData;
}

/**
 * 데이터 저장
 */
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== 링크 관련 함수 =====

/**
 * 새로운 링크 ID 생성
 */
function generateLinkId() {
  const data = getData();
  const maxId = Math.max(...data.links.map(link => parseInt(link.id) || 0), 0);
  return String(maxId + 1);
}

/**
 * 링크 추가
 */
function addLink(categoryId, linkData) {
  const data = getData();
  const newLink = {
    id: generateLinkId(),
    categoryId: categoryId,
    ...linkData
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
  const linkIndex = data.links.findIndex(link => link.id === linkId);
  if (linkIndex !== -1) {
    data.links[linkIndex] = { ...data.links[linkIndex], ...newData };
    saveData(data);
    return data.links[linkIndex];
  }
  return null;
}

/**
 * 링크 삭제
 */
function deleteLink(linkId) {
  const data = getData();
  const initialLength = data.links.length;
  data.links = data.links.filter(link => link.id !== linkId);
  if (data.links.length < initialLength) {
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
  return data.links.filter(link => link.categoryId === categoryId);
}

/**
 * 특정 링크 조회
 */
function getLink(linkId) {
  const data = getData();
  return data.links.find(link => link.id === linkId);
}

// ===== 카테고리 관련 함수 =====

/**
 * 새로운 카테고리 ID 생성
 */
function generateCategoryId() {
  const data = getData();
  const maxId = Math.max(...data.categories.map(cat => parseInt(cat.id) || 0), 0);
  return String(maxId + 1);
}

/**
 * 카테고리 추가
 */
function addCategory(categoryData) {
  const data = getData();
  const newCategory = {
    id: generateCategoryId(),
    ...categoryData
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
  const categoryIndex = data.categories.findIndex(cat => cat.id === categoryId);
  if (categoryIndex !== -1) {
    data.categories[categoryIndex] = { ...data.categories[categoryIndex], ...newData };
    saveData(data);
    return data.categories[categoryIndex];
  }
  return null;
}

/**
 * 카테고리 삭제
 */
function deleteCategory(categoryId) {
  const data = getData();
  const initialLength = data.categories.length;
  data.categories = data.categories.filter(cat => cat.id !== categoryId);

  // 해당 카테고리의 링크도 함께 삭제
  data.links = data.links.filter(link => link.categoryId !== categoryId);

  if (data.categories.length < initialLength) {
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
  return data.categories.find(cat => cat.id === categoryId);
}

/**
 * 모든 카테고리 조회
 */
function getAllCategories() {
  const data = getData();
  return data.categories;
}
