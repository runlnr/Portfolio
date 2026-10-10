/**
 * Archive Tab Script
 * Renders 5 pictures across 4 invisible columns and 3 rows with dynamic column randomization
 * (max 2 pictures per column, exactly 2 pictures in Row 1 & Row 2, 1 picture in Row 3).
 * Dual local clocks & contact modal triggers.
 */

(function() {
  'use strict';

  function initArchiveGrid() {
    const matrixContainer = document.getElementById('archive-matrix');
    const rawData = window.SWAG_ARCHIVE || [];
    if (!matrixContainer || !rawData.length) return;

    // Shuffle the images array
    const images = [...rawData].sort(() => Math.random() - 0.5);

    // Number of columns = 4, Number of rows = Math.ceil(images.length / 2)
    const numCols = 4;
    const numRows = Math.ceil(images.length / 2); // 3 rows for 5 images

    // Track how many images each column has across the grid (max 2 per column)
    const colCounts = new Array(numCols).fill(0);
    const gridMatrix = Array.from({ length: numRows }, () => new Array(numCols).fill(null));

    let imgIndex = 0;

    for (let r = 0; r < numRows && imgIndex < images.length; r++) {
      // Determine how many images to place in this row (2 for full rows, remaining for last row)
      const imagesInThisRow = Math.min(2, images.length - imgIndex);

      // Available columns for this row where column count < 2
      const availableCols = [];
      for (let c = 0; c < numCols; c++) {
        if (colCounts[c] < 2) {
          availableCols.push(c);
        }
      }

      // Randomly shuffle available columns and pick required count
      const shuffledCols = availableCols.sort(() => Math.random() - 0.5);
      const chosenCols = shuffledCols.slice(0, imagesInThisRow);

      chosenCols.forEach(col => {
        if (imgIndex < images.length) {
          gridMatrix[r][col] = images[imgIndex++];
          colCounts[col]++;
        }
      });
    }

    // Render 4 x numRows grid slots
    let html = '';
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const item = gridMatrix[r][c];
        if (item) {
          html += `
            <div class="archive-slot">
              <div class="archive-grid-item">
                <img src="${item.image}" alt="${item.alt || 'Archive Specimen'}" class="archive-grid-item-img" loading="eager" width="${item.width || 1620}" height="${item.height || 2025}" decoding="async" />
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

    matrixContainer.innerHTML = html;
  }

  window.initArchivePage = initArchiveGrid;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArchiveGrid);
  } else {
    initArchiveGrid();
  }
})();
