# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TradeLink2** is a browser-based **링크 관리 및 공유 플랫폼** (Link Management & Sharing Platform) for trading-related resources. It allows users to organize, search, and share trading information links by category.

- **Type**: Vanilla JavaScript (No frameworks)
- **Backend**: Browser localStorage (persistent data)
- **Architecture**: Single HTML file with modular JavaScript
- **Status**: Phase 2 ✅ Complete (Full CRUD + UI Implementation)

## Development Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or server required
- Optional: Local HTTP server for testing

### Running the Application
```bash
# Simply open index.html in a web browser
# Double-click the file or:
# File → Open File → select index.html

# Optional: Start a local server for better testing
python -m http.server 8000
# Then navigate to: http://localhost:8000
```

## Architecture

### High-Level Structure

**Module-based architecture with clear separation of concerns:**

1. **data.js** - Initial data definitions
   - 5 default categories (무역 도우미, Trade AI, 뉴스레터, 상담, 보고서)
   - 9 sample trading links across categories
   - Used to initialize localStorage on first load

2. **storage.js** - Data persistence layer (CRUD operations)
   - localStorage management with key: `tradeLink_data`
   - Link operations: `addLink()`, `updateLink()`, `deleteLink()`, `getLinksByCategory()`, `getLink()`
   - Category operations: `addCategory()`, `updateCategory()`, `deleteCategory()`, `getCategory()`, `getAllCategories()`
   - Data management: `getData()`, `saveData()`, `initializeData()`

3. **ui.js** - Rendering & presentation layer (Phase 2 ✅)
   - `renderCategories()` - Renders category filter buttons with "전체" button
   - `renderLinks(categoryId, query)` - Renders link cards with filtering & search
   - `renderHostPanel()` - Shows/hides host management panel with category list
   - `updateUI()` - Main orchestrator function, calls all render functions
   - Utility: `openModal()`, `closeModal()`, `escapeHtml()` (XSS prevention)

4. **hostMode.js** - Business logic layer (Phase 2 ✅)
   - `toggleHostMode()` - Switch between 🔒 (locked) and 🔓 (unlocked) states
   - Link handlers:
     - `openAddLinkForm()` - Opens modal, resets form, populates category dropdown
     - `addLinkHandler(formData)` - Creates new link via storage, updates UI
     - `openEditLinkForm(linkId)` - Opens modal, pre-fills with existing data
     - `editLinkHandler(linkId, newData)` - Updates link via storage, updates UI
     - `deleteLinkHandler(linkId)` - Confirms, deletes link, updates UI
   - Category handlers:
     - `openAddCategoryForm()` - Opens modal, resets form
     - `addCategoryHandler(categoryData)` - Creates new category via storage, updates UI
     - `openEditCategoryForm(categoryId)` - Opens modal, pre-fills with existing data
     - `editCategoryHandler(categoryId, newData)` - Updates category via storage, updates UI
     - `deleteCategoryHandler(categoryId)` - Confirms, deletes category and associated links, updates UI

5. **app.js** - Event handling & state management (Phase 2 ✅)
   - Global state variables:
     - `currentCategoryId` - Currently selected category (null = all)
     - `currentEditLinkId` - Link being edited (null = new)
     - `currentEditCategoryId` - Category being edited (null = new)
     - `searchQuery` - Current search text
   - `attachEventListeners()` - All event handlers registered
   - `initializeApp()` - App initialization on page load

### Directory Structure
```
TradeLink2/
├── index.html                      # Main HTML structure with modals
├── CLAUDE.md                       # This file (project documentation)
├── PHASE2_IMPLEMENTATION.md        # Phase 2 completion report
├── css/
│   └── style.css                   # All styling (responsive design, new Phase 2 classes)
└── js/
    ├── data.js                     # Initial data (categories & links)
    ├── storage.js                  # CRUD functions & localStorage
    ├── ui.js                       # Rendering functions (Phase 2)
    ├── hostMode.js                 # Event handlers for CRUD operations (Phase 2)
    └── app.js                      # App initialization & event listeners (Phase 2)
```

### Key Technologies
- **Vanilla JavaScript** - No frameworks, pure DOM manipulation
- **localStorage API** - Persistent client-side data storage
- **CSS Grid/Flexbox** - Responsive layout design
- **Modal dialogs** - For add/edit operations
- **Event listeners** - Native DOM event handling
- **XSS prevention** - HTML escaping for user input

### Data Flow
```
User Interaction (click, input, submit)
         ↓
Event Listener (app.js) captures event
         ↓
Handler Function (hostMode.js) processes action
         ↓
Storage Function (storage.js) updates data
         ↓
localStorage updates persistently
         ↓
updateUI() triggers all render functions
         ↓
DOM updated (ui.js) with fresh data
         ↓
CSS applies styling (style.css)
         ↓
User sees updated screen
```

## Key Features (Phase 2 Complete ✅)

### 1. Category Filtering
- "전체" button displays all links
- Click category buttons to filter by category
- Active state indication (blue highlight)
- Categories loaded dynamically from storage

### 2. Real-time Search
- Search bar filters by link title and description
- Case-insensitive search
- Works in combination with category filtering
- Updates instantly as user types

### 3. Host Mode (Admin Panel)
- 🔒/🔓 toggle button in header
- When unlocked (🔓):
  - "호스트 패널" appears in sidebar with category management
  - "링크 추가" & "카테고리 추가" buttons enabled
  - Edit (✏️) and Delete (🗑️) buttons appear on all items
- When locked (🔒):
  - Host panel hidden
  - Only read-only access to links
  - No edit/delete buttons visible

### 4. Link Management
- **Add**: Click "링크 추가" → fill form → save to storage
- **Edit**: Click ✏️ on link → modify → save to storage
- **Delete**: Click 🗑️ → confirm dialog → deleted from storage
- Links grouped by category in dropdown
- URL validation via HTML5

### 5. Category Management
- **Add**: Click "카테고리 추가" → fill form → save to storage
- **Edit**: Click ✏️ on category → modify → save to storage
- **Delete**: Click 🗑️ → confirm dialog → deletes category and cascade-deletes all associated links
- Categories displayed in sidebar filter and host panel

### 6. Data Persistence
- All data saved to browser's localStorage
- localStorage key: `tradeLink_data`
- Data persists across page refreshes and browser sessions
- No server required
- ~50KB storage for typical usage

## Code Organization

### Naming Conventions
- **Function names**: camelCase, descriptive (e.g., `renderCategories`, `openEditLinkForm`)
- **Variable names**: camelCase, clear intent (e.g., `currentCategoryId`, `searchQuery`)
- **CSS classes**: kebab-case, semantic (e.g., `link-card`, `category-badge`)
- **HTML IDs**: kebab-case, unique (e.g., `linkModal`, `searchInput`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`)

### Module Dependencies (Load Order)
```
1. data.js
   ↓
2. storage.js (uses initialData)
   ↓
3. ui.js (uses storage functions)
4. hostMode.js (uses storage & ui functions)
   ↓
5. app.js (orchestrates everything)
   ↓
6. DOMContentLoaded event → initializeApp()
```

## Important Files & Locations

| File | Purpose |
|------|---------|
| `index.html` | HTML structure with modals, sidebar, and main content area |
| `css/style.css` | All styling including responsive design and Phase 2 classes |
| `js/data.js` | Initial data for 5 categories and 9 sample links |
| `js/storage.js` | CRUD functions and localStorage management |
| `js/ui.js` | Rendering functions and DOM updates (Phase 2) |
| `js/hostMode.js` | Event handlers for admin CRUD operations (Phase 2) |
| `js/app.js` | App initialization and event listeners (Phase 2) |

## Development Workflows

### Adding a New Link
1. Host mode: Click 🔒 to enable (🔓)
2. Click "링크 추가" button in host panel
3. Fill in form:
   - 제목 (Title) - required
   - 설명 (Description) - optional
   - URL - required, validated
   - 카테고리 (Category) - required, dropdown populated from storage
4. Click "저장" button
5. Link appears in main list and filtered correctly
6. Data saved to localStorage

### Adding a New Category
1. Host mode: Click 🔒 to enable (🔓)
2. Click "카테고리 추가" button in host panel
3. Fill in form:
   - 카테고리명 (Name) - required
   - 설명 (Description) - optional
4. Click "저장" button
5. Category appears as new filter button and in dropdown menus
6. Data saved to localStorage

### Modifying Existing Data
1. Host mode must be enabled (🔓)
2. Click ✏️ button on item
3. Modal opens with pre-filled data
4. Modify form fields as needed
5. Click "저장" button
6. UI updates automatically with new data
7. Changes saved to localStorage

### Deleting Data
1. Host mode must be enabled (🔓)
2. Click 🗑️ button on item
3. Confirmation dialog appears
4. Click "확인" to confirm deletion
5. Item deleted from storage and UI updated
6. For categories: all associated links also deleted (cascade delete)

### Searching & Filtering
1. Type in "🔍 링크 검색..." box
2. List filters in real-time (title + description)
3. Works together with category filter
4. Case-insensitive search
5. Clear search box to reset

## Security Considerations

### XSS Prevention
- All user input escaped via `escapeHtml()` function before DOM insertion
- Dynamic content created via `textContent`, not `innerHTML`
- Prevents injection attacks through link titles, descriptions, etc.

### Data Validation
- URL validation via HTML5 `<input type="url">`
- Required fields enforced (title, URL, category)
- Confirmation dialogs for destructive operations (delete)
- No SQL injection risk (no server/database)

### Client-Side Only
- No external API calls (no CORS issues)
- No authentication needed (single-user app)
- localStorage is domain-restricted (browser-level security)
- No sensitive data exposure

## Testing Checklist

Core Functionality:
- [ ] Page loads without console errors
- [ ] All 5 default categories render as buttons in sidebar
- [ ] "전체" button appears at top of category list
- [ ] Category filtering works (shows only selected category's links)
- [ ] "전체" button shows all links

Search Functionality:
- [ ] Search bar is visible and functional
- [ ] Search filters by title in real-time
- [ ] Search filters by description in real-time
- [ ] Search is case-insensitive
- [ ] Search works with category filter simultaneously
- [ ] Clearing search box resets list

Host Mode:
- [ ] 🔒 button visible in header
- [ ] Clicking 🔒 changes to 🔓
- [ ] Host panel appears when 🔓
- [ ] Host panel hides when 🔒
- [ ] "링크 추가" button visible in host panel
- [ ] "카테고리 추가" button visible in host panel

Link Management:
- [ ] "링크 추가" opens modal
- [ ] Link form has all fields (title, description, URL, category)
- [ ] Category dropdown populated
- [ ] Adding link saves to localStorage
- [ ] New link appears in list
- [ ] ✏️ button opens edit modal with data
- [ ] Edit link updates localStorage and UI
- [ ] 🗑️ button shows confirmation
- [ ] Deleting link removes from storage and UI

Category Management:
- [ ] "카테고리 추가" opens modal
- [ ] Category form has required fields
- [ ] Adding category creates new filter button
- [ ] Adding category updates dropdown menus
- [ ] ✏️ on category opens edit modal
- [ ] Edit category updates storage and UI
- [ ] 🗑️ on category shows confirmation
- [ ] Deleting category also deletes associated links

Data Persistence:
- [ ] Data persists after page refresh
- [ ] Data persists after browser close/reopen
- [ ] localStorage contains `tradeLink_data` key

Modal Behavior:
- [ ] Modal closes on X button click
- [ ] Modal closes on background click
- [ ] Modal closes on Cancel button
- [ ] Modal closes after successful save
- [ ] Form resets when opening new add form

## Common Issues & Solutions

### Issue: Changes not persisting after refresh
**Cause**: localStorage is disabled or full
**Solution**:
1. Check DevTools → Application → Local Storage
2. Verify `tradeLink_data` exists
3. Clear cache: DevTools → Storage → Clear all
4. Check browser storage quota

### Issue: Modal won't close
**Cause**: closeModal() not called or incorrect modal ID
**Solution**:
1. Check browser console for errors
2. Verify modal has correct `id` attribute
3. Clear browser cache and refresh
4. Try different browser

### Issue: Styles not applying correctly
**Cause**: CSS file not loaded or cache issue
**Solution**:
1. Check DevTools → Network tab → style.css
2. Verify file path is correct: `css/style.css`
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Clear browser cache completely

### Issue: Search not filtering
**Cause**: searchQuery not updating or renderLinks not called
**Solution**:
1. Check DevTools → Console for errors
2. Verify search input has ID `searchInput`
3. Type in search box and check if console logs new query
4. Check that renderLinks() includes search filter logic

### Issue: Host mode buttons not appearing
**Cause**: isHostMode not toggled or renderHostPanel not called
**Solution**:
1. Click 🔒 button to toggle host mode
2. Check DevTools → Console for errors
3. Verify hostPanel element has ID `hostPanel`
4. Ensure updateUI() is called after toggleHostMode()

## Performance Notes

- All data kept in memory (localStorage + JavaScript variables)
- No pagination (suitable for < 1000 links)
- No external dependencies (fast initial load)
- CSS Grid/Flexbox for efficient layout
- Typical page load: < 100ms
- localStorage write: ~10ms
- Search/filter: instant (< 50ms)

## Known Limitations & Future Enhancements

### Current Limitations
- Single-user only (no authentication)
- No data export/import functionality
- No link ordering/custom sorting
- No drag-and-drop reordering
- No dark mode
- No mobile app
- Keyboard shortcuts not implemented
- No link preview/tooltip

### Possible Phase 3 Features
- [ ] Data import/export (JSON/CSV)
- [ ] Link drag-and-drop reordering
- [ ] Category drag-and-drop reordering
- [ ] Link favorites/star system
- [ ] Link click counting/analytics
- [ ] Link tags (in addition to categories)
- [ ] Advanced search filters
- [ ] Dark mode toggle
- [ ] Keyboard shortcuts (Ctrl+N for new, Del for delete, etc.)
- [ ] Link preview on hover
- [ ] Duplicate link detection
- [ ] Bulk operations (multi-select, batch edit)
- [ ] Link archiving (soft delete)
- [ ] Category colors/icons
- [ ] Mobile responsive optimization

### Architecture Improvements for Phase 3
- [ ] Add state management library (Redux/Zustand)
- [ ] Component-based approach (Web Components)
- [ ] API integration (backend sync)
- [ ] Unit tests framework
- [ ] Build process (Webpack/Vite)
- [ ] TypeScript support
- [ ] Service worker for offline support

## Notes for Future Development

### Architectural Decisions
1. **Vanilla JavaScript chosen** to minimize dependencies and maximize browser compatibility
2. **localStorage for persistence** instead of IndexedDB for simplicity
3. **Single global object** would be better refactor than 4 global variables
4. **Event delegation** considered for scalability with many links
5. **Modal approach** chosen over inline editing for simplicity

### Technical Debt
- Consider refactoring global variables into state object: `const appState = { currentCategoryId, currentEditLinkId, ... }`
- Consider extracting modal logic into separate module
- Consider adding data validation layer
- Consider adding logging/debugging utilities

### Scaling Considerations
- For > 1000 links: implement pagination/virtual scrolling
- For collaborative use: implement backend + authentication
- For offline use: implement Service Worker + IndexedDB
- For performance: consider lazy loading and code splitting

