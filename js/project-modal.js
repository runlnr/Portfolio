/**
 * Project In-Situ Modal Overlay (Editorial 50% Split Showcase Edition)
 * - Left: Floating dark obsidian glass metadata card
 * - Right: 50vw full-height #e5e5e6 editorial canvas with 10px padding & gaps
 * - Mixed layout: Full-width showcases & 2-column image pairs (6px rounded corners)
 * - Seamless infinite looping continuous physics scroll & drag with momentum
 * - Keyboard, mouse wheel, drag, swipe, URL sync, and back button support
 */

(function () {
  'use strict';

  // Helper to extract structured rows (full vs grid-2) from project gallery
  function extractGalleryRows(project) {
    if (!project) return [];
    var rows = [];

    if (project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0) {
      var pendingSingles = [];

      var flushPending = function () {
        while (pendingSingles.length > 0) {
          if (pendingSingles.length >= 2) {
            rows.push({
              type: 'grid-2',
              items: [pendingSingles.shift(), pendingSingles.shift()]
            });
          } else {
            var single = pendingSingles.shift();
            rows.push({
              type: 'full',
              src: single.src,
              alt: single.alt || project.title
            });
          }
        }
      };

      project.gallery.forEach(function (item, idx) {
        if (typeof item === 'string') {
          if (idx === 0) {
            rows.push({ type: 'full', src: item, alt: project.title });
          } else {
            pendingSingles.push({ src: item, alt: project.title });
          }
        } else if (item.type === 'grid-2' && Array.isArray(item.items) && item.items.length > 0) {
          flushPending();
          rows.push({
            type: 'grid-2',
            items: item.items
          });
        } else if (item.type === 'full' && item.src) {
          flushPending();
          rows.push({
            type: 'full',
            src: item.src,
            alt: item.alt || project.title
          });
        } else if (item.src) {
          if (idx === 0) {
            rows.push({ type: 'full', src: item.src, alt: item.alt || project.title });
          } else {
            pendingSingles.push(item);
          }
        }
      });

      flushPending();
    }

    if (rows.length === 0 && project.image) {
      rows.push({ type: 'full', src: project.image, alt: project.title });
    }

    return rows;
  }

  var ProjectModal = {
    isOpen: false,
    currentProject: null,
    galleryRows: [],
    setElements: [],

    // Smooth Continuous Physics Loop State
    currentScrollY: 0,
    targetScrollY: 0,
    cycleHeight: 0,
    rafId: null,
    resizeObserver: null,

    // Drag / Gesture State
    isDragging: false,
    lastDragY: 0,
    dragVelocity: 0,

    // DOM Elements
    overlayEl: null,
    stageEl: null,
    metaCardEl: null,
    metaTitleEl: null,
    metaYearEl: null,
    metaContentEl: null,
    metaActionEl: null,
    closeBtnEl: null,
    rightCanvasEl: null,
    canvasTrackEl: null,

    getLenis: function () {
      if (window.motionStack && window.motionStack.lenis) {
        return window.motionStack.lenis;
      }
      if (window.lenis && typeof window.lenis.stop === 'function') {
        return window.lenis;
      }
      return null;
    },

    init: function () {
      this.injectModalMarkup();
      this.bindTriggers();
      this.bindEvents();
      this.checkUrlOnLoad();
    },

    // Inject modal DOM if not already present
    injectModalMarkup: function () {
      if (document.getElementById('pm-modal-overlay')) {
        this.cacheElements();
        return;
      }

      var modalHtml = [
        '<div class="pm-modal-overlay" id="pm-modal-overlay" aria-hidden="true" role="dialog" aria-modal="true" data-lenis-prevent>',
        '  <div class="pm-layout-stage" id="pm-layout-stage" data-lenis-prevent>',
        '    <!-- 1. Left: Borderless Text Pane (Directly Resting on Blur) -->',
        '    <aside class="pm-meta-card" id="pm-meta-card" aria-label="Project Information" data-lenis-prevent>',
        '      <div class="pm-meta-header">',
        '        <h2 class="pm-meta-title type-aero-e" id="pm-meta-title">MEMPHIS GRIZZLIES</h2>',
        '      </div>',
        '      <div class="pm-meta-subrow">',
        '        <span class="pm-meta-label">YEAR</span>',
        '        <span class="pm-meta-year-badge" id="pm-meta-year">2024</span>',
        '      </div>',
        '      <div class="pm-meta-content" id="pm-meta-content"></div>',
        '    </aside>',
        '    <!-- Vertically Centered Close Button at Left Edge (top: 50%, left: 10px) -->',
        '    <button class="pm-close-btn" id="pm-close-btn" aria-label="Close modal">',
        '      <svg class="pm-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">',
        '        <line x1="18" y1="6" x2="6" y2="18"></line>',
        '        <line x1="6" y1="6" x2="18" y2="18"></line>',
        '      </svg>',
        '    </button>',
        '    <!-- Bottom Left Action Button (Styled as .f3-pill-btn) -->',
        '    <div class="pm-meta-action" id="pm-meta-action">',
        '      <a href="#" target="_blank" rel="noopener noreferrer" class="f3-pill-btn pm-pill-btn" id="pm-action-link" aria-label="Visit Project">',
        '        <span id="pm-action-label">VIEW ON BEHANCE</span>',
        '        <span class="btn-arrow">↗</span>',
        '      </a>',
        '    </div>',
        '    <!-- 2. Right: 50% Split Editorial Visual Canvas -->',
        '    <div class="pm-right-canvas" id="pm-right-canvas" aria-label="Project Visuals" data-lenis-prevent>',
        '      <div class="pm-canvas-track" id="pm-canvas-track"></div>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('\n');

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      this.cacheElements();
    },

    cacheElements: function () {
      this.overlayEl = document.getElementById('pm-modal-overlay');
      this.stageEl = document.getElementById('pm-layout-stage');
      this.metaCardEl = document.getElementById('pm-meta-card');
      this.metaTitleEl = document.getElementById('pm-meta-title');
      this.metaYearEl = document.getElementById('pm-meta-year');
      this.metaContentEl = document.getElementById('pm-meta-content');
      this.metaActionEl = document.getElementById('pm-meta-action');
      this.closeBtnEl = document.getElementById('pm-close-btn');
      this.rightCanvasEl = document.getElementById('pm-right-canvas');
      this.canvasTrackEl = document.getElementById('pm-canvas-track');

      if (this.overlayEl) this.overlayEl.setAttribute('data-lenis-prevent', '');
      if (this.metaCardEl) this.metaCardEl.setAttribute('data-lenis-prevent', '');
      if (this.rightCanvasEl) this.rightCanvasEl.setAttribute('data-lenis-prevent', '');
    },

    // Intercept clicks on thumbnail cards (.f3-work-card and .f3-list-item-row)
    bindTriggers: function () {
      var self = this;
      document.addEventListener('click', function (e) {
        var trigger = e.target.closest('.f3-work-card, .f3-list-item-row');
        if (!trigger) return;

        var href = trigger.getAttribute('href') || '';
        var pid = trigger.getAttribute('data-project-id');

        if (!pid && href.indexOf('project.html') !== -1) {
          var match = href.match(/[?&]id=([^&#]+)/);
          if (match && match[1]) {
            pid = decodeURIComponent(match[1]);
          }
        }

        if (pid) {
          e.preventDefault();
          e.stopPropagation();
          self.open(pid, true);
        }
      });
    },

    // Bind event listeners for gestures, scroll, keys, and window
    bindEvents: function () {
      var self = this;

      // Close button
      if (this.closeBtnEl) {
        this.closeBtnEl.addEventListener('click', function (e) {
          e.stopPropagation();
          self.close(true);
        });
      }

      // Backdrop click outside card & right canvas closes modal
      if (this.overlayEl) {
        this.overlayEl.addEventListener('click', function (e) {
          if (
            e.target === self.overlayEl ||
            e.target === self.stageEl ||
            (!e.target.closest('#pm-meta-card') && !e.target.closest('#pm-right-canvas') && !e.target.closest('#pm-close-btn') && !e.target.closest('#pm-meta-action'))
          ) {
            self.close(true);
          }
        });
      }

      // Keyboard navigation: smooth step jump
      window.addEventListener('keydown', function (e) {
        if (!self.isOpen) return;
        var step = 350;
        if (e.key === 'Escape') {
          self.close(true);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
          e.preventDefault();
          self.targetScrollY += step;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          self.targetScrollY -= step;
        }
      });

      // Dedicated wheel handler for metadata card (left pane)
      if (this.metaCardEl) {
        this.metaCardEl.addEventListener('wheel', function (e) {
          if (!self.isOpen) return;

          e.stopPropagation();

          var canScrollUp = self.metaCardEl.scrollTop > 0;
          var canScrollDown = self.metaCardEl.scrollTop + self.metaCardEl.clientHeight < (self.metaCardEl.scrollHeight - 1);

          if ((e.deltaY < 0 && !canScrollUp) || (e.deltaY > 0 && !canScrollDown)) {
            e.preventDefault();
          }
        }, { passive: false });

        this.metaCardEl.addEventListener('touchmove', function (e) {
          if (!self.isOpen) return;
          e.stopPropagation();
        }, { passive: true });
      }

      // Mouse wheel / trackpad: smooth continuous scroll for right canvas & overlay
      if (this.overlayEl) {
        this.overlayEl.addEventListener('wheel', function (e) {
          if (!self.isOpen) return;
          if (self.metaCardEl && self.metaCardEl.contains(e.target)) return;

          e.stopPropagation();
          e.preventDefault();

          self.targetScrollY += e.deltaY * 0.95;
        }, { passive: false });

        this.overlayEl.addEventListener('touchmove', function (e) {
          if (!self.isOpen) return;
          if (self.metaCardEl && self.metaCardEl.contains(e.target)) return;
          e.stopPropagation();
          e.preventDefault();
        }, { passive: false });
      }

      // Touch / Pointer Dragging on Right Canvas with Inertia Momentum
      if (this.rightCanvasEl) {
        this.rightCanvasEl.addEventListener('pointerdown', function (e) {
          if (!self.isOpen) return;
          if (e.target.closest('a, button')) return;

          self.isDragging = true;
          self.lastDragY = e.clientY;
          self.dragVelocity = 0;
          try {
            self.rightCanvasEl.setPointerCapture(e.pointerId);
          } catch (err) {}
        });

        this.rightCanvasEl.addEventListener('pointermove', function (e) {
          if (!self.isDragging) return;
          var delta = e.clientY - self.lastDragY;
          self.lastDragY = e.clientY;
          self.dragVelocity = delta;

          // Direct 1:1 manipulation under cursor/finger
          self.targetScrollY -= delta;
          self.currentScrollY -= delta;
        });

        var handlePointerEnd = function (e) {
          if (!self.isDragging) return;
          self.isDragging = false;
          try {
            self.rightCanvasEl.releasePointerCapture(e.pointerId);
          } catch (err) {}

          // Apply release momentum smoothly
          self.targetScrollY -= self.dragVelocity * 6;
        };

        this.rightCanvasEl.addEventListener('pointerup', handlePointerEnd);
        this.rightCanvasEl.addEventListener('pointercancel', handlePointerEnd);
      }

      // Browser popstate for back/forward navigation
      window.addEventListener('popstate', function () {
        var params = new URLSearchParams(window.location.search);
        var pid = params.get('project');
        if (pid) {
          self.open(pid, false);
        } else if (self.isOpen) {
          self.close(false);
        }
      });

      // Recalculate cycle height on window resize
      window.addEventListener('resize', function () {
        if (self.isOpen) {
          self.updateCycleHeight();
        }
      });
    },

    // Check if initial URL has ?project=<id> and open
    checkUrlOnLoad: function () {
      var params = new URLSearchParams(window.location.search);
      var pid = params.get('project');
      if (pid) {
        var self = this;
        setTimeout(function () {
          self.open(pid, false);
        }, 120);
      }
    },

    // Open project modal
    open: function (projectId, pushState) {
      var project = null;
      if (window.SWAG_PROJECTS && Array.isArray(window.SWAG_PROJECTS)) {
        project = window.SWAG_PROJECTS.find(function (p) {
          return p.id === projectId;
        });
      }

      if (!project) {
        console.warn('[ProjectModal] Project not found for ID:', projectId);
        return;
      }

      this.currentProject = project;
      this.galleryRows = extractGalleryRows(project);

      this.isOpen = true;
      this.currentScrollY = 0;
      this.targetScrollY = 0;

      // Populate metadata card (left)
      this.renderMetadata(project);

      // Build canvas sets on the right
      this.buildCanvas();

      // Show overlay
      this.overlayEl.classList.add('is-active');
      this.overlayEl.setAttribute('aria-hidden', 'false');

      // Pause Lenis background scroll and lock body/html
      var lenis = this.getLenis();
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('pm-modal-active');
      document.documentElement.classList.add('pm-modal-active');

      if (this.metaCardEl) {
        this.metaCardEl.scrollTop = 0;
      }

      // Start continuous requestAnimationFrame physics loop
      this.startPhysics();

      // Update browser history URL
      if (pushState) {
        var newUrl = window.location.pathname + '?project=' + encodeURIComponent(projectId);
        window.history.pushState({ modalOpen: true, projectId: projectId }, '', newUrl);
      }
    },

    // Close project modal
    close: function (updateHistory) {
      if (!this.isOpen) return;
      this.isOpen = false;

      // Stop physics loop to save CPU
      this.stopPhysics();

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }

      this.overlayEl.classList.remove('is-active');
      this.overlayEl.setAttribute('aria-hidden', 'true');

      // Resume Lenis scroll and unlock body/html
      var lenis = this.getLenis();
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('pm-modal-active');
      document.documentElement.classList.remove('pm-modal-active');

      // Clean up URL
      if (updateHistory) {
        var cleanUrl = window.location.pathname;
        window.history.pushState(null, '', cleanUrl);
      }
    },

    // Build the duplicate canvas sets inside track for infinite seamless looping
    buildCanvas: function () {
      if (!this.canvasTrackEl) return;
      this.canvasTrackEl.innerHTML = '';
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }

      var self = this;
      var rows = this.galleryRows.slice();
      if (rows.length === 0) return;

      // Ensure minimum 4 rows in single set for comfortable continuous flow
      var baseRows = rows.slice();
      while (baseRows.length < 4) {
        baseRows = baseRows.concat(rows);
      }

      // We create 3 duplicate sets: Set 0 (top buffer), Set 1 (base loop), Set 2 (bottom buffer)
      this.setElements = [];
      for (var s = 0; s < 3; s++) {
        var setEl = document.createElement('div');
        setEl.className = 'pm-canvas-set';
        setEl.setAttribute('data-set-index', s);

        baseRows.forEach(function (row) {
          if (row.type === 'grid-2' && Array.isArray(row.items) && row.items.length >= 2) {
            var gridRow = document.createElement('div');
            gridRow.className = 'pm-row-grid2';

            row.items.slice(0, 2).forEach(function (item) {
              var gridItem = document.createElement('div');
              gridItem.className = 'pm-grid-item';

              var img = document.createElement('img');
              img.src = item.src;
              img.alt = item.alt || self.currentProject.title || '';
              img.loading = 'eager';
              img.decoding = 'async';
              img.onload = function () {
                self.updateCycleHeight();
              };

              gridItem.appendChild(img);
              gridRow.appendChild(gridItem);
            });

            setEl.appendChild(gridRow);
          } else {
            var fullRow = document.createElement('div');
            fullRow.className = 'pm-row-full';

            var img = document.createElement('img');
            img.src = row.src;
            img.alt = row.alt || self.currentProject.title || '';
            img.loading = 'eager';
            img.decoding = 'async';
            img.onload = function () {
              self.updateCycleHeight();
            };

            fullRow.appendChild(img);
            setEl.appendChild(fullRow);
          }
        });

        self.canvasTrackEl.appendChild(setEl);
        self.setElements.push(setEl);
      }

      // Initial measurement
      requestAnimationFrame(function () {
        self.updateCycleHeight();
      });

      // Observe size changes automatically on Set 1
      if (window.ResizeObserver && self.setElements[1]) {
        self.resizeObserver = new ResizeObserver(function () {
          self.updateCycleHeight();
        });
        self.resizeObserver.observe(self.setElements[1]);
      }
    },

    updateCycleHeight: function () {
      if (!this.setElements || !this.setElements[1]) return;
      var h = this.setElements[1].offsetHeight;
      if (h > 0) {
        // Height of one set + 5px track gap to next set
        this.cycleHeight = h + 5;
      }
    },

    // Start 60/120fps continuous smooth scrolling physics loop
    startPhysics: function () {
      this.stopPhysics();
      var self = this;

      function loop() {
        if (!self.isOpen) return;

        // Smooth continuous interpolation (lerp factor 0.09)
        var delta = self.targetScrollY - self.currentScrollY;
        self.currentScrollY += delta * 0.09;

        var cycle = self.cycleHeight;
        if (cycle && cycle > 0) {
          // Keep bounded within 10 cycles to avoid floating point drift
          if (Math.abs(self.currentScrollY) > cycle * 10) {
            var wrapped = self.currentScrollY % cycle;
            self.currentScrollY = wrapped;
            self.targetScrollY = self.targetScrollY % cycle;
          }

          var normY = ((self.currentScrollY % cycle) + cycle) % cycle;
          // Position relative to Set 1 (offset by -cycle)
          var translateY = -(normY + cycle);
          self.canvasTrackEl.style.transform = 'translate3d(0, ' + translateY.toFixed(2) + 'px, 0)';
        }

        self.rafId = requestAnimationFrame(loop);
      }

      this.rafId = requestAnimationFrame(loop);
    },

    // Stop physics loop
    stopPhysics: function () {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    },

    // Render metadata card contents
    renderMetadata: function (project) {
      this.metaTitleEl.textContent = project.title || 'PROJECT';
      this.metaYearEl.textContent = project.year || '2024';

      // Build editorial text content (in natural sentence case for AT Aero Type E)
      var contentHtml = [];
      if (project.tabs && project.tabs.context) {
        contentHtml.push('<p>' + project.tabs.context + '</p>');
      } else if (project.description) {
        var paras = project.description.split(/\n\s*\n/);
        paras.forEach(function (p) {
          if (p.trim()) contentHtml.push('<p>' + p.trim() + '</p>');
        });
      }
      if (project.tabs && project.tabs.challengeSolution) {
        var snippet = project.tabs.challengeSolution.slice(0, 25).toLowerCase().trim();
        if (!project.tabs.context || project.tabs.context.toLowerCase().indexOf(snippet) === -1) {
          var lines = project.tabs.challengeSolution.split(/\n\s*\n/);
          lines.forEach(function (l) {
            if (l.trim()) contentHtml.push('<p>' + l.trim() + '</p>');
          });
        }
      }
      this.metaContentEl.innerHTML = contentHtml.join('');

      // Action link (Behance or visitUrl)
      var link = project.behanceUrl || project.visitUrl || 'https://www.behance.net/pxly';
      var actionLinkEl = document.getElementById('pm-action-link');
      var actionLabelEl = document.getElementById('pm-action-label');
      if (actionLinkEl && actionLabelEl) {
        actionLinkEl.href = link;
        actionLabelEl.textContent = (project.behanceUrl && project.behanceUrl.indexOf('behance.net') !== -1) ? 'VIEW ON BEHANCE' : 'VISIT PROJECT';
      }
    }
  };

  // Expose globally
  window.ProjectModal = ProjectModal;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ProjectModal.init();
    });
  } else {
    ProjectModal.init();
  }
})();
