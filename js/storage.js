/**
 * Supabase를 사용한 데이터 관리
 * 모든 함수는 비동기(async)입니다.
 */

/**
 * 초기 데이터 (첫 로드 시 Supabase에 추가)
 */
const initialData = {
  categories: [
    { name: '무역 도우미', description: '무역 관련 도구 및 리소스' },
    { name: 'Trade AI', description: 'AI 기반 무역 솔루션' },
    { name: '뉴스레터', description: '무역 정보 뉴스레터' },
    { name: '상담', description: '전문가 상담 서비스' },
    { name: '보고서', description: '무역 분석 보고서' }
  ],
  links: [
    { categoryIndex: 0, title: '무역업자 전용 커뮤니티', description: '무역업자 네트워킹 플랫폼', url: 'https://example.com/traders' },
    { categoryIndex: 1, title: '자동 가격 분석 AI', description: '실시간 가격 분석 도구', url: 'https://example.com/ai-price' },
    { categoryIndex: 1, title: '수출 예측 모델', description: 'ML 기반 수출량 예측', url: 'https://example.com/export-forecast' },
    { categoryIndex: 2, title: '주간 무역 뉴스', description: '매주 업데이트되는 무역 뉴스', url: 'https://example.com/weekly-news' },
    { categoryIndex: 3, title: '관세 상담 예약', description: '전문가와의 상담 예약 시스템', url: 'https://example.com/tariff-consultation' },
    { categoryIndex: 4, title: '월별 무역 현황', description: '최신 무역 통계 보고서', url: 'https://example.com/monthly-report' },
    { categoryIndex: 0, title: '통관 자동화 시스템', description: '통관 서류 자동 처리', url: 'https://example.com/customs-auto' },
    { categoryIndex: 2, title: '월별 관세 정보', description: '관세 변동 정보', url: 'https://example.com/tariff-info' },
    { categoryIndex: 4, title: 'FTA 분석 보고서', description: 'FTA 협상 분석', url: 'https://example.com/fta-analysis' }
  ]
};

/**
 * 초기 데이터 로드 (첫 로드 시만)
 */
async function initializeData() {
  try {
    // 카테고리 확인
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id');

    if (catError) throw catError;

    // 데이터가 없으면 초기 데이터 추가
    if (!categories || categories.length === 0) {
      console.log('초기 데이터 추가 중...');

      // 카테고리 추가
      const { data: categoryData, error: insertCatError } = await supabase
        .from('categories')
        .insert(initialData.categories)
        .select();

      if (insertCatError) throw insertCatError;

      // 링크 추가 (카테고리 ID 매핑)
      const linksToInsert = initialData.links.map((link, index) => {
        const categoryId = categoryData[link.categoryIndex].id;
        return {
          category_id: categoryId,
          title: link.title,
          description: link.description,
          url: link.url
        };
      });

      const { error: insertLinkError } = await supabase
        .from('links')
        .insert(linksToInsert);

      if (insertLinkError) throw insertLinkError;

      console.log('초기 데이터가 Supabase에 추가되었습니다.');
    }
  } catch (error) {
    console.error('초기 데이터 로드 오류:', error);
  }
}

// ===== 링크 관련 함수 =====

/**
 * 링크 추가
 */
async function addLink(categoryId, linkData) {
  try {
    const insertData = {
      title: linkData.title,
      description: linkData.description || null,
      url: linkData.url
    };

    // categoryId가 있으면 추가
    if (categoryId) {
      insertData.category_id = categoryId;
    }

    const { data, error } = await supabase
      .from('links')
      .insert(insertData)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('링크 추가 오류:', error);
    throw error;
  }
}

/**
 * 링크 수정
 */
async function updateLink(linkId, newData) {
  try {
    const updateData = {
      title: newData.title,
      description: newData.description || null,
      url: newData.url,
      category_id: newData.categoryId || newData.category_id || null
    };

    const { data, error } = await supabase
      .from('links')
      .update(updateData)
      .eq('id', linkId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('링크 수정 오류:', error);
    throw error;
  }
}

/**
 * 링크 삭제
 */
async function deleteLink(linkId) {
  try {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('링크 삭제 오류:', error);
    return false;
  }
}

/**
 * 특정 카테고리의 링크 조회
 */
async function getLinksByCategory(categoryId) {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('카테고리 링크 조회 오류:', error);
    return [];
  }
}

/**
 * 모든 링크 조회
 */
async function getAllLinks() {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('모든 링크 조회 오류:', error);
    return [];
  }
}

/**
 * 특정 링크 조회
 */
async function getLink(linkId) {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', linkId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('링크 조회 오류:', error);
    return null;
  }
}

// ===== 카테고리 관련 함수 =====

/**
 * 카테고리 추가
 */
async function addCategory(categoryData) {
  try {
    console.log('카테고리 추가 시도:', categoryData);

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        description: categoryData.description || null
      })
      .select();

    if (error) {
      console.error('Supabase 오류 상세:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('카테고리 추가 성공:', data);
    return data[0];
  } catch (error) {
    console.error('카테고리 추가 오류:', error);
    throw new Error(error.message || '카테고리 추가 실패');
  }
}

/**
 * 카테고리 수정
 */
async function updateCategory(categoryId, newData) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: newData.name,
        description: newData.description
      })
      .eq('id', categoryId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('카테고리 수정 오류:', error);
    return null;
  }
}

/**
 * 카테고리 삭제 (연관된 링크도 삭제)
 */
async function deleteCategory(categoryId) {
  try {
    // 연관된 링크는 외래키 제약(ON DELETE CASCADE)으로 자동 삭제됨
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('카테고리 삭제 오류:', error);
    return false;
  }
}

/**
 * 특정 카테고리 조회
 */
async function getCategory(categoryId) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    return null;
  }
}

/**
 * 모든 카테고리 조회
 */
async function getAllCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    return [];
  }
}
