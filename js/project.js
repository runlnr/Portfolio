/**
 * Project Detail / Case Study Dynamic Page Logic
 */

window.initProjectPage = function() {
  // Only execute on project case study pages with hero elements
  const isProjectPage = document.getElementById('project-title') || document.getElementById('project-hero-image');
  if (!isProjectPage) return;

  const projects = window.SWAG_PROJECTS || [];
  if (!projects.length) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || 'wide-angle';

  const currentIndex = projects.findIndex(p => p.id === projectId);
  const project = currentIndex !== -1 ? projects[currentIndex] : projects[0];

  // Populate Hero Metadata
  const numEl = document.getElementById('project-number');
  const titleEl = document.getElementById('project-title');
  const clientEl = document.getElementById('project-client');
  const catEl = document.getElementById('project-category');
  const yearEl = document.getElementById('project-year');
  const descEl = document.getElementById('project-desc');
  const heroImg = document.getElementById('project-hero-image');
  const gallery = document.getElementById('project-gallery');

  if (numEl) numEl.textContent = project.number;
  if (titleEl) titleEl.textContent = project.title;
  if (clientEl) clientEl.textContent = project.client;
  if (catEl) catEl.textContent = project.category;
  if (yearEl) yearEl.textContent = project.year;
  if (descEl) descEl.textContent = project.description;
  if (heroImg) {
    heroImg.src = project.image;
    heroImg.alt = project.title;
  }
  document.title = `${project.title} • Nam Pham`;

  // Populate Gallery Images
  if (gallery && project.gallery && project.gallery.length) {
    gallery.innerHTML = project.gallery.map((img, i) => `
      <div class="gallery-item-wrap reveal-fade-up" data-reveal="fade-up">
        <img src="${img}" alt="${project.title} - Visual ${i + 1}" loading="lazy" />
      </div>
    `).join('');
  }

  // Previous & Next Navigation Links
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  const prevProject = projects[prevIndex];
  const nextProject = projects[nextIndex];

  const prevLink = document.getElementById('prev-project-link');
  const nextLink = document.getElementById('next-project-link');

  if (prevLink) {
    prevLink.href = `project.html?id=${prevProject.id}`;
    prevLink.innerHTML = `← ${prevProject.number} ${prevProject.title}`;
  }
  if (nextLink) {
    nextLink.href = `project.html?id=${nextProject.id}`;
    nextLink.innerHTML = `${nextProject.number} ${nextProject.title} →`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.initProjectPage();
});
