/**
 * UI 렌더링 모듈
 * 카테고리와 링크를 화면에 표시하는 함수들
 */

/**
 * 모든 카테고리 렌더링 (fetch-first 패턴으로 layout jump 방지)
 */
async function renderCategories() {
  const categoryFilters = document.getElementById('categoryFilters');
  if (!categoryFilters) return;

  // 데이터 먼저 fetch (DOM 수정 전)
  const categories = await getAllCategories();

  categoryFilters.innerHTML = '';

  // "전체" 버튼
  const allBtn = document.createElement('button');
  allBtn.className = `category-btn ${currentCategoryId === null ? 'active' : ''}`;
  allBtn.textContent = '전체';
  allBtn.addEventListener('click', async () => {
    currentCategoryId = null;
    await renderCategories();
    await renderLinks(null, searchQuery);
  });
  categoryFilters.appendChild(allBtn);

  // 각 카테고리 버튼
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${currentCategoryId === category.id ? 'active' : ''}`;
    btn.textContent = category.name;
    btn.addEventListener('click', async () => {
      currentCategoryId = category.id;
      await renderCategories();
      await renderLinks(category.id, searchQuery);
    });
    categoryFilters.appendChild(btn);
  });
}

/**
 * 특정 카테고리의 링크 렌더링 (fetch-first 패턴 + 병렬 fetch로 layout jump 방지)
 */
async function renderLinks(categoryId, query = '') {
  const linksList = document.getElementById('linksList');
  if (!linksList) return;

  // 병렬로 데이터 fetch (DOM 수정 전)
  const [links, allCategories] = await Promise.all([
    categoryId ? getLinksByCategory(categoryId) : getAllLinks(),
    getAllCategories()
  ]);

  // 검색 필터링
  let filteredLinks = query
    ? links.filter(link =>
        link.title.toLowerCase().includes(query) ||
        (link.description && link.description.toLowerCase().includes(query))
      )
    : links;

  // 모든 데이터 준비 후 DOM 수정
  linksList.innerHTML = '';

  if (filteredLinks.length === 0) {
    linksList.innerHTML = '<p class="empty-state">해당하는 링크가 없습니다.</p>';
    return;
  }

  // 카테고리 맵 구성
  const categoryMap = {};
  allCategories.forEach(cat => {
    categoryMap[cat.id] = cat;
  });

  filteredLinks.forEach(link => {
    const linkCard = document.createElement('div');
    linkCard.className = 'link-card';

    const category = link.category_id ? categoryMap[link.category_id] : null;
    const categoryBadge = category ? `<span class="category-badge">${escapeHtml(category.name)}</span>` : '';

    let actions = '';
    if (isHostMode) {
      actions = `
        <div class="link-actions">
          <button class="btn-icon" onclick="editLinkWrapper('${link.id}')" title="수정">✎</button>
          <button class="btn-icon" onclick="deleteLinkWrapper('${link.id}')" title="삭제">✕</button>
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
 * 호스트 패널 렌더링 (D&D 이벤트 포함)
 */
async function renderHostPanel() {
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

    const categories = await getAllCategories();

    let dragSrcId = null;

    categories.forEach((category) => {
      const categoryItem = document.createElement('div');
      categoryItem.className = 'category-item-host';
      categoryItem.setAttribute('draggable', 'true');
      categoryItem.dataset.id = category.id;

      categoryItem.innerHTML = `
        <span class="category-name">${escapeHtml(category.name)}</span>
        <div class="category-actions">
          <button class="btn-icon" onclick="editCategoryWrapper('${category.id}')" title="수정">✎</button>
          <button class="btn-icon" onclick="deleteCategoryWrapper('${category.id}')" title="삭제">✕</button>
        </div>
      `;

      // D&D 이벤트 핸들러
      categoryItem.addEventListener('dragstart', (e) => {
        dragSrcId = category.id;
        e.dataTransfer.effectAllowed = 'move';
        categoryItem.classList.add('dragging');
      });

      categoryItem.addEventListener('dragover', (e) => {
        e.preventDefault();
        categoryItem.classList.add('drag-over');
      });

      categoryItem.addEventListener('dragleave', () => {
        categoryItem.classList.remove('drag-over');
      });

      categoryItem.addEventListener('drop', async (e) => {
        e.preventDefault();
        categoryItem.classList.remove('drag-over');

        if (dragSrcId && dragSrcId !== category.id) {
          // 현재 순서 기준으로 새로운 배열 생성
          const items = [...categoryListHost.querySelectorAll('.category-item-host')];
          const orderedIds = items.map(el => el.dataset.id);

          // 드래그 원본과 드롭 대상의 위치 찾기
          const srcIdx = orderedIds.indexOf(dragSrcId);
          const dstIdx = orderedIds.indexOf(category.id);

          // 원본 제거 후 대상 위치에 삽입
          orderedIds.splice(srcIdx, 1);
          orderedIds.splice(dstIdx, 0, dragSrcId);

          // 서버에 새로운 순서 저장
          await handleCategoryReorder(orderedIds);
        }

        dragSrcId = null;
      });

      categoryItem.addEventListener('dragend', () => {
        categoryItem.classList.remove('dragging');
        categoryListHost.querySelectorAll('.category-item-host')
          .forEach(el => el.classList.remove('drag-over'));
      });

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
async function updateUI() {
  await renderCategories();
  await renderLinks(currentCategoryId, searchQuery);
  await renderHostPanel();
}
