/**
 * Archive Tab Script
 * Renders 5 pictures across 4 invisible columns and 3 rows.
 * Default State:
 *   Row 1: Col 2 (Messi), Col 3 (Museum 1 (RT))
 *   Row 2: Col 1 (Milk), Col 4 (POST)
 *   Row 3: Col 2 (PTNK)
 * If reloaded or navigated to while archive was already active in the session,
 * dynamically shuffles pictures with grid constraints (2-2-1, max 2 per column).
 */

(function() {
  'use strict';

  function escapeAttr(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function findItem(items, key) {
    const target = key.toLowerCase();
    return items.find(item => {
      const id = (item.id || '').toLowerCase();
      const img = (item.image || '').toLowerCase();
      return id === target || img.includes(target);
    });
  }

  function getGridSignature(matrix) {
    return matrix.map(row => row.map(cell => cell ? (cell.id || cell.image) : '_').join(',')).join(';');
  }

  const DEFAULT_SIGNATURE = '_,messi,museum,_;milk,_,_,post;_,ptnk,_,_';
  let currentSignature = DEFAULT_SIGNATURE;

  function buildDefaultGrid(items) {
    const numRows = 3;
    const numCols = 4;
    const matrix = Array.from({ length: numRows }, () => new Array(numCols).fill(null));

    const messi = findItem(items, 'messi');
    const museum = findItem(items, 'museum');
    const milk = findItem(items, 'milk');
    const post = findItem(items, 'post');
    const ptnk = findItem(items, 'ptnk');

    // Row 1: col2: Messi, col3: Museum 1 (RT)
    matrix[0][1] = messi;
    matrix[0][2] = museum;

    // Row 2: col1: milk, col4: POST
    matrix[1][0] = milk;
    matrix[1][3] = post;

    // Row 3: col2: PTNK
    matrix[2][1] = ptnk;

    return matrix;
  }

  function buildShuffledGrid(items, avoidSignature) {
    const numCols = 4;
    const numRows = 3;

    for (let attempt = 0; attempt < 100; attempt++) {
      const shuffledImages = [...items].sort(() => Math.random() - 0.5);
      const colCounts = new Array(numCols).fill(0);
      const gridMatrix = Array.from({ length: numRows }, () => new Array(numCols).fill(null));
      let imgIndex = 0;
      let valid = true;

      for (let r = 0; r < numRows && imgIndex < shuffledImages.length; r++) {
        const imagesInThisRow = Math.min(2, shuffledImages.length - imgIndex);
        const availableCols = [];
        for (let c = 0; c < numCols; c++) {
          if (colCounts[c] < 2) {
            availableCols.push(c);
          }
        }

        if (availableCols.length < imagesInThisRow) {
          valid = false;
          break;
        }

        const shuffledCols = availableCols.sort(() => Math.random() - 0.5);
        const chosenCols = shuffledCols.slice(0, imagesInThisRow);

        chosenCols.forEach(col => {
          if (imgIndex < shuffledImages.length) {
            gridMatrix[r][col] = shuffledImages[imgIndex++];
            colCounts[col]++;
          }
        });
      }

      if (!valid || imgIndex < shuffledImages.length) {
        continue;
      }

      const sig = getGridSignature(gridMatrix);
      if (sig !== DEFAULT_SIGNATURE && (!avoidSignature || sig !== avoidSignature)) {
        return gridMatrix;
      }
    }

    return buildDefaultGrid(items);
  }

  function renderMatrix(gridMatrix, container) {
    const numRows = gridMatrix.length;
    const numCols = gridMatrix[0].length;
    let html = '';

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const item = gridMatrix[r][c];
        if (item) {
          html += `
            <div class="archive-slot">
              <div class="archive-grid-item">
                <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.alt || 'Archive Specimen')}" class="archive-grid-item-img" loading="eager" width="${Number(item.width) || 1620}" height="${Number(item.height) || 2025}" decoding="async" />
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="archive-slot archive-slot-empty" aria-hidden="true"></div>
          `;
        }
      }
    }

    container.innerHTML = html;
  }

  function isPageReload() {
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries && navEntries.length > 0) {
        return navEntries[0].type === 'reload';
      }
      if (performance.navigation) {
        return performance.navigation.type === 1;
      }
    } catch (e) {}
    return false;
  }

  function initArchiveGrid(forceShuffle) {
    const matrixContainer = document.getElementById('archive-matrix');
    const rawData = window.SWAG_ARCHIVE || [];
    if (!matrixContainer || !rawData.length) return;

    let shouldShuffle = false;
    if (forceShuffle === true) {
      shouldShuffle = true;
    } else {
      const reloaded = isPageReload();
      let sessionShuffled = false;
      try {
        sessionShuffled = sessionStorage.getItem('scherre_archive_shuffled') === 'true';
      } catch (e) {}

      if (reloaded || sessionShuffled) {
        shouldShuffle = true;
      }
    }

    let gridMatrix;
    if (shouldShuffle) {
      try {
        sessionStorage.setItem('scherre_archive_shuffled', 'true');
      } catch (e) {}
      gridMatrix = buildShuffledGrid(rawData, currentSignature);
      currentSignature = getGridSignature(gridMatrix);
      renderMatrix(gridMatrix, matrixContainer);
    } else {
      currentSignature = DEFAULT_SIGNATURE;
      // If container is empty or needs reset
      if (!matrixContainer.firstElementChild || forceShuffle === false) {
        gridMatrix = buildDefaultGrid(rawData);
        renderMatrix(gridMatrix, matrixContainer);
      }
    }
  }

  function setupNavArchiveLink() {
    const archiveNavBtn = document.getElementById('nav-archive-link');
    if (!archiveNavBtn) return;

    archiveNavBtn.addEventListener('click', function(e) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      }

      // Close the navbar dropdown menu cleanly without fading the page
      if (typeof window.closeNavDropdown === 'function') {
        window.closeNavDropdown();
      } else {
        const navMenu = document.getElementById('nav-dropdown-menu');
        const hamburgerBtn = document.getElementById('nav-hamburger-btn');
        if (navMenu && navMenu.classList.contains('is-open') && hamburgerBtn) {
          hamburgerBtn.click();
        }
      }
    });
  }

  window.initArchivePage = initArchiveGrid;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initArchiveGrid();
      setupNavArchiveLink();
    });
  } else {
    initArchiveGrid();
    setupNavArchiveLink();
  }
})();
