/**
 * Execution Script: Services Directory Line Highlight Selection Animation
 * Randomly selects and highlights whole lines across the 3-column Services Directory
 * with an #a6a6a6 highlight block and black text.
 * Automatically activates on viewport intersection and pauses when off-screen.
 */

(function () {
  'use strict';

  function initServicesLineSelection() {
    const servicesSection = document.getElementById('f3-bio-services');
    if (!servicesSection) return;

    const listItems = Array.from(servicesSection.querySelectorAll('.f3-services-item'));
    if (!listItems.length) return;

    // Ensure each item's text is cleanly wrapped in an inline highlightable container
    listItems.forEach(item => {
      if (!item.querySelector('.f3-service-text-inner')) {
        const inner = document.createElement('span');
        inner.className = 'f3-service-text-inner';
        while (item.firstChild) {
          inner.appendChild(item.firstChild);
        }
        item.appendChild(inner);
      }
    });

    let activeItem = null;
    let timerId = null;
    let isVisible = false;

    function selectNextLine() {
      if (!listItems.length) return;

      // Remove previous selection
      if (activeItem) {
        activeItem.classList.remove('is-selected-line');
      }

      // Pick random next item different from current
      let nextIndex = Math.floor(Math.random() * listItems.length);
      if (listItems.length > 1 && listItems[nextIndex] === activeItem) {
        nextIndex = (nextIndex + 1) % listItems.length;
      }

      activeItem = listItems[nextIndex];
      activeItem.classList.add('is-selected-line');
    }

    function startAnimation() {
      if (timerId) return;
      selectNextLine();
      // Jumps every 2.5 seconds (2500ms)
      timerId = setInterval(selectNextLine, 2500);
    }

    function stopAnimation() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      if (activeItem) {
        activeItem.classList.remove('is-selected-line');
        activeItem = null;
      }
    }

    // IntersectionObserver to only play animation when section is in viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible = true;
            startAnimation();
          } else {
            isVisible = false;
            stopAnimation();
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '50px 0px 50px 0px'
      });

      observer.observe(servicesSection);
    } else {
      // Fallback
      startAnimation();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesLineSelection);
  } else {
    initServicesLineSelection();
  }
})();
