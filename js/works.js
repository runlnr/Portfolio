/**
 * Works Page Logic
 * Renders Grid & List views, handles View Toggle Switcher, Floating Cursor /view/ Tag, and List Image Preview Follower
 */

window.initWorksPage = function() {
  const gridContainer = document.getElementById('works-grid');
  const listContainer = document.getElementById('works-list');
  const listItemsWrap = document.getElementById('works-list-items');
  const toggleGridBtn = document.getElementById('toggle-grid');
  const toggleListBtn = document.getElementById('toggle-list');
  const hoverPreview = document.getElementById('hover-preview');
  const hoverImage = document.getElementById('hover-preview-img');

  const projects = window.SWAG_PROJECTS || [];
  if (!gridContainer && !listContainer) return;

  // Clean up any prior animation frame loops (SPA resilience)
  if (window._gridCursorTagRaf) {
    cancelAnimationFrame(window._gridCursorTagRaf);
    window._gridCursorTagRaf = null;
  }
  if (window._listViewPreviewRaf) {
    cancelAnimationFrame(window._listViewPreviewRaf);
    window._listViewPreviewRaf = null;
  }

  // Ensure Floating /view/ Cursor Tag element exists in DOM
  let cursorTag = document.getElementById('grid-cursor-tag');
  if (!cursorTag) {
    cursorTag = document.createElement('div');
    cursorTag.id = 'grid-cursor-tag';
    cursorTag.className = 'grid-cursor-tag';
    cursorTag.textContent = '/view/';
    document.body.appendChild(cursorTag);
  }

  // 1. Render Grid View (Image only with Top-Left Name & Top-Right Date on Hover)
  if (gridContainer && projects.length) {
    gridContainer.innerHTML = projects.map(p => `
      <a href="project.html?id=${p.id}" class="work-grid-card" aria-label="${p.title} (${p.year})">
        <div class="work-card-header">
          <span class="work-card-title">${p.title}</span>
          <span class="work-card-date">${p.year}</span>
        </div>
        <div class="work-card-media">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
        </div>
      </a>
    `).join('');

    // Floating /view/ Cursor Tag Follower for Grid Cards
    const gridCards = gridContainer.querySelectorAll('.work-grid-card');
    let mouseX = -9999, mouseY = -9999;
    let currentX = -9999, currentY = -9999;
    let isHoveringGrid = false;

    gridCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        cursorTag.classList.add('visible');
        isHoveringGrid = true;
        if (currentX === -9999) {
          currentX = e.clientX;
          currentY = e.clientY;
        }
      });

      card.addEventListener('mouseleave', () => {
        cursorTag.classList.remove('visible');
        isHoveringGrid = false;
      });

      card.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
    });

    function animateCursorTag() {
      if (isHoveringGrid) {
        if (currentX === -9999) {
          currentX = mouseX;
          currentY = mouseY;
        }
        currentX += (mouseX - currentX) * 0.2;
        currentY += (mouseY - currentY) * 0.2;
        cursorTag.style.left = `${currentX}px`;
        cursorTag.style.top = `${currentY}px`;
      }
      window._gridCursorTagRaf = requestAnimationFrame(animateCursorTag);
    }
    animateCursorTag();
  }

  // 2. Render List View
  const targetListElement = listItemsWrap || listContainer;
  if (targetListElement && projects.length) {
    targetListElement.innerHTML = projects.map(p => `
      <a href="project.html?id=${p.id}" class="work-list-item-row" data-image="${p.image}" data-title="${p.title}">
        <span class="list-col-num">${p.number}</span>
        <span class="list-col-title">${p.title}</span>
        <span class="list-col-field">${p.field || (p.disciplines ? p.disciplines.join(', ') : 'Graphic Design')}</span>
        <span class="list-col-client">${p.client || 'Studio'}</span>
        <span class="list-col-year">${p.year}</span>
        <span class="list-col-arrow">↗</span>
      </a>
    `).join('');

    // Floating Cursor Image Preview Follower
    if (hoverPreview && hoverImage) {
      const rows = targetListElement.querySelectorAll('.work-list-item-row');
      let listMouseX = -9999, listMouseY = -9999;
      let listCurrentX = -9999, listCurrentY = -9999;
      let isHoveringList = false;

      rows.forEach(row => {
        row.addEventListener('mouseenter', (e) => {
          const imgSrc = row.getAttribute('data-image');
          if (imgSrc) {
            hoverImage.src = imgSrc;
            hoverPreview.classList.add('visible');
            isHoveringList = true;
          }
        });

        row.addEventListener('mouseleave', () => {
          hoverPreview.classList.remove('visible');
          isHoveringList = false;
        });

        row.addEventListener('mousemove', (e) => {
          listMouseX = e.clientX + 30;
          listMouseY = e.clientY - 20;
        });
      });

      function animatePreview() {
        if (isHoveringList) {
          if (listCurrentX === -9999) {
            listCurrentX = listMouseX;
            listCurrentY = listMouseY;
          }
          listCurrentX += (listMouseX - listCurrentX) * 0.14;
          listCurrentY += (listMouseY - listCurrentY) * 0.14;
          hoverPreview.style.left = `${listCurrentX}px`;
          hoverPreview.style.top = `${listCurrentY}px`;
        }
        window._listViewPreviewRaf = requestAnimationFrame(animatePreview);
      }
      animatePreview();
    }
  }

  // 3. Grid vs List View Switcher Toggle
  if (toggleGridBtn && toggleListBtn && gridContainer && listContainer) {
    toggleGridBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleGridBtn.classList.add('active');
      toggleListBtn.classList.remove('active');
      gridContainer.style.display = 'grid';
      listContainer.style.display = 'none';
      if (cursorTag) cursorTag.classList.remove('visible');
      if (window.motionStack) window.motionStack.refresh();
    });

    toggleListBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleListBtn.classList.add('active');
      toggleGridBtn.classList.remove('active');
      gridContainer.style.display = 'none';
      listContainer.style.display = 'flex';
      if (cursorTag) cursorTag.classList.remove('visible');
      if (window.motionStack) window.motionStack.refresh();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.initWorksPage();
});
