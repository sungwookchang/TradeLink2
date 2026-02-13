/**
 * Supabase를 사용한 데이터 관리
 * RESTful API를 통한 CRUD 작업
 */

const SUPABASE_URL = 'https://zfiwdbehmsdjnmflumfn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_R8bdG2HpEuXT4Uj31eMRbQ_qWcTUxlH';

/**
 * Supabase API 호출 헬퍼
 */
async function supabaseRequest(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;

  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    // DELETE 요청은 응답이 없을 수 있음
    if (options.method === 'DELETE') {
      return [];
    }

    const text = await response.text();
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error('Supabase API 오류:', error);
    throw error;
  }
}

// ===== 링크 관련 함수 =====

/**
 * 링크 추가
 */
async function addLink(categoryId, linkData) {
  const payload = {
    title: linkData.title,
    description: linkData.description || null,
    url: linkData.url,
    category_id: categoryId || null
  };

  const result = await supabaseRequest('/links', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return result[0] || result;
}

/**
 * 링크 수정
 */
async function updateLink(linkId, newData) {
  const payload = {
    title: newData.title,
    description: newData.description || null,
    url: newData.url,
    category_id: newData.categoryId || null
  };

  const result = await supabaseRequest(`/links?id=eq.${linkId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

  return result[0] || result;
}

/**
 * 링크 삭제
 */
async function deleteLink(linkId) {
  await supabaseRequest(`/links?id=eq.${linkId}`, {
    method: 'DELETE'
  });
  return true;
}

/**
 * 특정 카테고리의 링크 조회
 */
async function getLinksByCategory(categoryId) {
  if (!categoryId) return getAllLinks();

  const links = await supabaseRequest(`/links?category_id=eq.${categoryId}`);
  return links;
}

/**
 * 모든 링크 조회
 */
async function getAllLinks() {
  const links = await supabaseRequest('/links?order=created_at.desc');
  return links;
}

/**
 * 특정 링크 조회
 */
async function getLink(linkId) {
  const links = await supabaseRequest(`/links?id=eq.${linkId}`);
  return links[0] || null;
}

// ===== 카테고리 관련 함수 =====

/**
 * 카테고리 추가
 */
async function addCategory(categoryData) {
  // 다음 position 계산
  const existing = await getAllCategories();
  const nextPosition = existing.length > 0
    ? Math.max(...existing.map(c => c.position ?? 0)) + 1
    : 0;

  const payload = {
    name: categoryData.name,
    description: categoryData.description || null,
    position: nextPosition
  };

  const result = await supabaseRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return result[0] || result;
}

/**
 * 카테고리 수정
 */
async function updateCategory(categoryId, newData) {
  const payload = {
    name: newData.name,
    description: newData.description || null
  };

  const result = await supabaseRequest(`/categories?id=eq.${categoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });

  return result[0] || result;
}

/**
 * 카테고리 삭제 (연관된 링크도 삭제)
 */
async function deleteCategory(categoryId) {
  // 먼저 연관된 모든 링크 삭제
  await supabaseRequest(`/links?category_id=eq.${categoryId}`, {
    method: 'DELETE'
  });

  // 그 다음 카테고리 삭제
  await supabaseRequest(`/categories?id=eq.${categoryId}`, {
    method: 'DELETE'
  });

  return true;
}

/**
 * 특정 카테고리 조회
 */
async function getCategory(categoryId) {
  if (!categoryId) return null;

  const categories = await supabaseRequest(`/categories?id=eq.${categoryId}`);
  return categories[0] || null;
}

/**
 * 모든 카테고리 조회 (position 순서로 정렬)
 */
async function getAllCategories() {
  const categories = await supabaseRequest('/categories?order=position.asc,created_at.asc');
  return categories;
}

/**
 * 카테고리들의 순서 일괄 업데이트
 * @param {string[]} orderedIds - 새로운 순서의 카테고리 ID 배열
 */
async function updateCategoryPositions(orderedIds) {
  const updates = orderedIds.map((id, index) =>
    supabaseRequest(`/categories?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ position: index })
    })
  );

  await Promise.all(updates);
  return true;
}

/**
 * 초기 데이터 설정
 */
async function initializeData() {
  try {
    const categories = await getAllCategories();

    // 이미 데이터가 있으면 초기화 스킵
    if (categories.length > 0) {
      console.log('✅ 기존 데이터 로드 완료');
      return;
    }

    // 초기 카테고리 추가
    const categoryNames = ['무역 도우미', 'Trade AI', '뉴스레터', '상담', '보고서'];
    let categoryMap = {};

    for (const name of categoryNames) {
      const category = await addCategory({ name });
      categoryMap[name] = category.id;
    }

    // 초기 링크 추가
    const initialLinks = [
      { categoryId: categoryMap['무역 도우미'], title: '무역업자 전용 커뮤니티', description: '무역업자 네트워킹 플랫폼', url: 'https://example.com/traders' },
      { categoryId: categoryMap['Trade AI'], title: '자동 가격 분석 AI', description: '실시간 가격 분석 도구', url: 'https://example.com/ai-price' },
      { categoryId: categoryMap['Trade AI'], title: '수출 예측 모델', description: 'ML 기반 수출량 예측', url: 'https://example.com/export-forecast' },
      { categoryId: categoryMap['뉴스레터'], title: '주간 무역 뉴스', description: '매주 업데이트되는 무역 뉴스', url: 'https://example.com/weekly-news' },
      { categoryId: categoryMap['상담'], title: '관세 상담 예약', description: '전문가와의 상담 예약 시스템', url: 'https://example.com/tariff-consultation' },
      { categoryId: categoryMap['보고서'], title: '월별 무역 현황', description: '최신 무역 통계 보고서', url: 'https://example.com/monthly-report' },
      { categoryId: categoryMap['무역 도우미'], title: '통관 자동화 시스템', description: '통관 서류 자동 처리', url: 'https://example.com/customs-auto' },
      { categoryId: categoryMap['뉴스레터'], title: '월별 관세 정보', description: '관세 변동 정보', url: 'https://example.com/tariff-info' },
      { categoryId: categoryMap['보고서'], title: 'FTA 분석 보고서', description: 'FTA 협상 분석', url: 'https://example.com/fta-analysis' }
    ];

    for (const link of initialLinks) {
      await addLink(link.categoryId, {
        title: link.title,
        description: link.description,
        url: link.url
      });
    }

    console.log('✅ 초기 데이터 설정 완료');
  } catch (error) {
    console.error('초기 데이터 설정 오류:', error);
  }
}
