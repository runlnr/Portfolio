/**
 * Works Page Logic
 * Renders Grid & List views, handles View Toggle Switcher, and Floating Cursor Image Preview Follower
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

  // 1. Render Grid View
  if (gridContainer && projects.length) {
    gridContainer.innerHTML = projects.map(p => `
      <a href="project.html?id=${p.id}" class="work-grid-card">
        <div class="work-card-media">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
        </div>
        <div class="work-card-info">
          <span class="work-card-number">${p.number}</span>
          <span class="work-card-title">${p.title}</span>
          <span class="work-card-category">${p.field || (p.disciplines ? p.disciplines[0] : 'Design')}</span>
          <span class="work-card-year">${p.year}</span>
        </div>
      </a>
    `).join('');
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
      let mouseX = -9999, mouseY = -9999;
      let currentX = -9999, currentY = -9999;
      let isHovering = false;
      let rafId = null;

      rows.forEach(row => {
        row.addEventListener('mouseenter', (e) => {
          const imgSrc = row.getAttribute('data-image');
          if (imgSrc) {
            hoverImage.src = imgSrc;
            hoverPreview.classList.add('visible');
            isHovering = true;
          }
        });

        row.addEventListener('mouseleave', () => {
          hoverPreview.classList.remove('visible');
          isHovering = false;
        });

        row.addEventListener('mousemove', (e) => {
          mouseX = e.clientX + 30;
          mouseY = e.clientY - 20;
        });
      });

      function animatePreview() {
        if (isHovering) {
          if (currentX === -9999) {
            currentX = mouseX;
            currentY = mouseY;
          }
          currentX += (mouseX - currentX) * 0.14;
          currentY += (mouseY - currentY) * 0.14;
          hoverPreview.style.left = `${currentX}px`;
          hoverPreview.style.top = `${currentY}px`;
        }
        rafId = requestAnimationFrame(animatePreview);
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
      if (window.motionStack) window.motionStack.refresh();
    });

    toggleListBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleListBtn.classList.add('active');
      toggleGridBtn.classList.remove('active');
      gridContainer.style.display = 'none';
      listContainer.style.display = 'flex';
      if (window.motionStack) window.motionStack.refresh();
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.initWorksPage();
});
