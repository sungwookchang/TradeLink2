/**
 * TradeLink2 메인 앱 로직
 * 앱 초기화 및 전체 흐름 관리
 */

// ===== 전역 상태 변수 =====
let currentCategoryId = null;  // null = 전체 보기
let currentEditLinkId = null;  // null = 신규 추가, 값 있으면 수정 모드
let currentEditCategoryId = null;
let searchQuery = '';

/**
 * 앱 초기화
 */
async function initializeApp() {
  try {
    // 1. 초기 데이터 설정
    await initializeData();

    // 2. 초기 UI 렌더링
    await updateUI();

    // 3. 이벤트 리스너 등록
    attachEventListeners();

    console.log('✅ TradeLink2 앱이 정상적으로 초기화되었습니다.');
  } catch (error) {
    console.error('앱 초기화 오류:', error);
  }
}

/**
 * 이벤트 리스너 등록
 */
function attachEventListeners() {
  // 호스트 모드 토글
  const hostModeToggle = document.getElementById('hostModeToggle');
  if (hostModeToggle) {
    hostModeToggle.addEventListener('click', toggleHostMode);
  }

  // 검색 입력
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      searchQuery = e.target.value.toLowerCase();
      await renderLinks(currentCategoryId, searchQuery);
    });
  }

  // 링크 추가 버튼
  const addLinkBtn = document.getElementById('addLinkBtn');
  if (addLinkBtn) {
    addLinkBtn.addEventListener('click', openAddLinkForm);
  }

  // 카테고리 추가 버튼
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', openAddCategoryForm);
  }

  // 링크 폼 제출
  const linkForm = document.getElementById('linkForm');
  if (linkForm) {
    linkForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        title: document.getElementById('linkTitle').value,
        description: document.getElementById('linkDescription').value,
        url: document.getElementById('linkUrl').value,
        categoryId: document.getElementById('linkCategory').value
      };

      if (currentEditLinkId) {
        await editLinkHandler(currentEditLinkId, formData);
      } else {
        await addLinkHandler(formData);
      }
    });
  }

  // 카테고리 폼 제출
  const categoryForm = document.getElementById('categoryForm');
  if (categoryForm) {
    categoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        name: document.getElementById('categoryName').value
      };

      if (currentEditCategoryId) {
        await editCategoryHandler(currentEditCategoryId, formData);
      } else {
        await addCategoryHandler(formData);
      }
    });
  }

  // 모달 닫기 버튼 (링크 모달)
  const linkFormCancel = document.getElementById('linkFormCancel');
  if (linkFormCancel) {
    linkFormCancel.addEventListener('click', () => closeModal('linkModal'));
  }

  // 모달 닫기 버튼 (카테고리 모달)
  const categoryFormCancel = document.getElementById('categoryFormCancel');
  if (categoryFormCancel) {
    categoryFormCancel.addEventListener('click', () => closeModal('categoryModal'));
  }

  // 모달 헤더의 X 버튼들
  const closeButtons = document.querySelectorAll('.btn-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // 모달 배경 클릭으로 닫기 (카테고리 모달만, 링크 모달은 닫지 않음)
  const categoryModal = document.getElementById('categoryModal');
  if (categoryModal) {
    categoryModal.addEventListener('click', (e) => {
      if (e.target === categoryModal) {
        closeModal('categoryModal');
      }
    });
  }
}

/**
 * 앱 실행 (DOM 로드 후)
 */
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});
