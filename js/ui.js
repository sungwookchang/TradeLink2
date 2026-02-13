/**
 * UI 렌더링 모듈
 * 카테고리와 링크를 화면에 표시하는 함수들
 */

/**
 * 모든 카테고리 렌더링
 */
function renderCategories() {
  const categoryFilters = document.getElementById('categoryFilters');
  if (!categoryFilters) return;

  categoryFilters.innerHTML = '';

  // "전체" 버튼
  const allBtn = document.createElement('button');
  allBtn.className = `category-btn ${currentCategoryId === null ? 'active' : ''}`;
  allBtn.textContent = '전체';
  allBtn.addEventListener('click', () => {
    currentCategoryId = null;
    renderCategories();
    renderLinks(null, searchQuery);
  });
  categoryFilters.appendChild(allBtn);

  // 각 카테고리 버튼
  const categories = getAllCategories();
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${currentCategoryId === category.id ? 'active' : ''}`;
    btn.textContent = category.name;
    btn.addEventListener('click', () => {
      currentCategoryId = category.id;
      renderCategories();
      renderLinks(category.id, searchQuery);
    });
    categoryFilters.appendChild(btn);
  });
}

/**
 * 특정 카테고리의 링크 렌더링
 */
function renderLinks(categoryId, query = '') {
  const linksList = document.getElementById('linksList');
  if (!linksList) return;

  // 링크 필터링
  let links;
  if (categoryId) {
    links = getLinksByCategory(categoryId);
  } else {
    links = getAllLinks();
  }

  // 검색 필터링
  if (query) {
    links = links.filter(link =>
      link.title.toLowerCase().includes(query) ||
      (link.description && link.description.toLowerCase().includes(query))
    );
  }

  linksList.innerHTML = '';

  if (links.length === 0) {
    linksList.innerHTML = '<p class="empty-state">해당하는 링크가 없습니다.</p>';
    return;
  }

  links.forEach(link => {
    const linkCard = document.createElement('div');
    linkCard.className = 'link-card';

    const category = getCategory(link.categoryId);
    const categoryBadge = category ? `<span class="category-badge">${escapeHtml(category.name)}</span>` : '';

    let actions = '';
    if (isHostMode) {
      actions = `
        <div class="link-actions">
          <button class="btn-icon" onclick="openEditLinkForm(${link.id})" title="수정">✏️</button>
          <button class="btn-icon" onclick="deleteLinkHandler(${link.id})" title="삭제">🗑️</button>
        </div>
      `;
    }

    linkCard.innerHTML = `
      <div class="link-header">
        <h3 class="link-title">${escapeHtml(link.title)}</h3>
        ${actions}
      </div>
      <p class="link-description">${escapeHtml(link.description || '')}</p>
      <a href="${escapeHtml(link.url)}" target="_blank" class="link-url">🔗 ${escapeHtml(link.url)}</a>
      ${categoryBadge}
    `;

    linksList.appendChild(linkCard);
  });
}

/**
 * 호스트 패널 렌더링
 */
function renderHostPanel() {
  const hostPanel = document.getElementById('hostPanel');
  if (!hostPanel) return;

  if (isHostMode) {
    hostPanel.classList.remove('hidden');
  } else {
    hostPanel.classList.add('hidden');
  }

  // 호스트 패널의 카테고리 목록
  const categoryListHost = document.getElementById('categoryListHost');
  if (categoryListHost) {
    categoryListHost.innerHTML = '';

    const categories = getAllCategories();
    categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item-host';
      categoryItem.innerHTML = `
        <span class="category-name">${escapeHtml(category.name)}</span>
        <div class="category-actions">
          <button class="btn-icon" onclick="openEditCategoryForm(${category.id})" title="수정">✏️</button>
          <button class="btn-icon" onclick="deleteCategoryHandler(${category.id})" title="삭제">🗑️</button>
        </div>
      `;
      categoryListHost.appendChild(categoryItem);
    });
  }
}

/**
 * 모달 열기
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

/**
 * 모달 닫기
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

/**
 * HTML 이스케이프 (XSS 방지)
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * UI 업데이트 (링크/카테고리 변경 후)
 */
function updateUI() {
  renderCategories();
  renderLinks(currentCategoryId, searchQuery);
  renderHostPanel();
}
