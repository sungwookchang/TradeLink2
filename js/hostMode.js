/**
 * 호스트 모드 모듈
 * 링크/카테고리 CRUD 관련 함수들
 */

let isHostMode = false;

/**
 * 호스트 모드 토글
 */
function toggleHostMode() {
  isHostMode = !isHostMode;

  const hostModeToggle = document.getElementById('hostModeToggle');
  if (hostModeToggle) {
    hostModeToggle.textContent = isHostMode ? '🔓' : '🔒';
  }

  updateUI();
}

/**
 * 호스트 모드 상태 조회
 */
function getHostMode() {
  return isHostMode;
}

// ===== 링크 관련 호스트 함수 =====

/**
 * 링크 추가 폼 열기
 */
function openAddLinkForm() {
  if (!isHostMode) return;

  currentEditLinkId = null;

  // 모달 제목 변경
  const linkModalTitle = document.getElementById('linkModalTitle');
  if (linkModalTitle) {
    linkModalTitle.textContent = '링크 추가';
  }

  // 폼 초기화
  const linkForm = document.getElementById('linkForm');
  if (linkForm) {
    linkForm.reset();
  }

  // 카테고리 드롭다운 채우기
  const linkCategory = document.getElementById('linkCategory');
  if (linkCategory) {
    linkCategory.innerHTML = '<option value="">-- 카테고리 선택 --</option>';
    const categories = getAllCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      linkCategory.appendChild(option);
    });
  }

  openModal('linkModal');
}

/**
 * 링크 추가 처리
 */
function addLinkHandler(formData) {
  try {
    const categoryId = formData.categoryId ? parseInt(formData.categoryId) : null;

    addLink(categoryId, {
      title: formData.title,
      description: formData.description,
      url: formData.url
    });

    updateUI();
    closeModal('linkModal');
  } catch (error) {
    console.error('링크 추가 오류:', error);
    alert('링크 추가에 실패했습니다: ' + error.message);
  }
}

/**
 * 링크 편집 폼 열기
 */
function openEditLinkForm(linkId) {
  if (!isHostMode) return;

  currentEditLinkId = linkId;
  const link = getLink(linkId);

  if (!link) return;

  // 모달 제목 변경
  const linkModalTitle = document.getElementById('linkModalTitle');
  if (linkModalTitle) {
    linkModalTitle.textContent = '링크 수정';
  }

  // 폼 데이터 채우기
  document.getElementById('linkTitle').value = link.title;
  document.getElementById('linkDescription').value = link.description || '';
  document.getElementById('linkUrl').value = link.url;

  // 카테고리 드롭다운 채우기 및 선택
  const linkCategory = document.getElementById('linkCategory');
  if (linkCategory) {
    linkCategory.innerHTML = '<option value="">-- 카테고리 선택 --</option>';
    const categories = getAllCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      if (category.id === link.categoryId) {
        option.selected = true;
      }
      linkCategory.appendChild(option);
    });
  }

  openModal('linkModal');
}

/**
 * 링크 수정 처리
 */
function editLinkHandler(linkId, newData) {
  try {
    const categoryId = newData.categoryId ? parseInt(newData.categoryId) : null;

    updateLink(linkId, {
      title: newData.title,
      description: newData.description,
      url: newData.url,
      categoryId: categoryId
    });

    updateUI();
    closeModal('linkModal');
  } catch (error) {
    console.error('링크 수정 오류:', error);
    alert('링크 수정에 실패했습니다: ' + error.message);
  }
}

/**
 * 링크 삭제 처리
 */
function deleteLinkHandler(linkId) {
  if (!isHostMode) return;

  if (confirm('이 링크를 삭제하시겠습니까?')) {
    deleteLink(linkId);
    updateUI();
  }
}

// ===== 카테고리 관련 호스트 함수 =====

/**
 * 카테고리 추가 폼 열기
 */
function openAddCategoryForm() {
  if (!isHostMode) return;

  currentEditCategoryId = null;

  // 모달 제목 변경
  const categoryModalTitle = document.getElementById('categoryModalTitle');
  if (categoryModalTitle) {
    categoryModalTitle.textContent = '카테고리 추가';
  }

  // 폼 초기화
  const categoryForm = document.getElementById('categoryForm');
  if (categoryForm) {
    categoryForm.reset();
  }

  openModal('categoryModal');
}

/**
 * 카테고리 추가 처리
 */
function addCategoryHandler(categoryData) {
  try {
    const result = addCategory({
      name: categoryData.name,
      description: categoryData.description
    });

    if (!result) {
      throw new Error('카테고리 추가에 실패했습니다');
    }

    updateUI();
    closeModal('categoryModal');
  } catch (error) {
    console.error('카테고리 추가 오류:', error);
    alert('카테고리 추가에 실패했습니다: ' + error.message);
  }
}

/**
 * 카테고리 편집 폼 열기
 */
function openEditCategoryForm(categoryId) {
  if (!isHostMode) return;

  currentEditCategoryId = categoryId;
  const category = getCategory(categoryId);

  if (!category) return;

  // 모달 제목 변경
  const categoryModalTitle = document.getElementById('categoryModalTitle');
  if (categoryModalTitle) {
    categoryModalTitle.textContent = '카테고리 수정';
  }

  // 폼 데이터 채우기
  document.getElementById('categoryName').value = category.name;

  openModal('categoryModal');
}

/**
 * 카테고리 수정 처리
 */
function editCategoryHandler(categoryId, newData) {
  try {
    const result = updateCategory(categoryId, newData);

    if (!result) {
      throw new Error('카테고리 수정에 실패했습니다');
    }

    updateUI();
    closeModal('categoryModal');
  } catch (error) {
    console.error('카테고리 수정 오류:', error);
    alert('카테고리 수정에 실패했습니다: ' + error.message);
  }
}

/**
 * 카테고리 삭제 처리
 */
function deleteCategoryHandler(categoryId) {
  if (!isHostMode) return;

  if (confirm('이 카테고리를 삭제하시겠습니까? 해당 카테고리의 모든 링크도 함께 삭제됩니다.')) {
    deleteCategory(categoryId);
    currentCategoryId = null;
    updateUI();
  }
}

/**
 * 카테고리 순서 변경 처리
 */
function reorderCategoryHandler(categoryId, direction) {
  if (!isHostMode) return;

  const result = reorderCategory(categoryId, direction);
  if (result) {
    updateUI();
  }
}
