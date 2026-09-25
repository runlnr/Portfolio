/**
 * Contact Page & FutureThree Editorial Contact Brief Logic
 * Revamped Modal Dialog & Live Clocks
 */

(function() {
  'use strict';

  function initFutureThreeContact() {
    const form = document.getElementById('f3-contact-form');
    const modal = document.getElementById('f3-contact-modal');
    const openBtn = document.getElementById('f3-open-contact-modal');
    const closeBtn = document.getElementById('f3-close-contact-modal');
    const backdrop = document.getElementById('f3-modal-backdrop');

    // 1. Modal Trigger & Management
    let isModalOpen = false;

    function openModal() {
      if (!modal) return;
      isModalOpen = true;
      modal.removeAttribute('hidden');
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('f3-contact-modal-open');

      // Request next frame to trigger CSS transitions
      requestAnimationFrame(() => {
        modal.classList.add('is-open');
        const firstInput = document.getElementById('f3-form-name');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 120);
        }
      });
    }

    function closeModal() {
      if (!modal || !isModalOpen) return;
      isModalOpen = false;
      modal.classList.remove('is-open');
      if (openBtn) {
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.focus();
      }
      document.body.classList.remove('f3-contact-modal-open');

      // Wait for exit transition to finish before hiding from accessibility tree
      setTimeout(() => {
        if (!isModalOpen) {
          modal.setAttribute('hidden', '');
        }
      }, 240);
    }

    window.openContactModal = openModal;
    window.closeContactModal = closeModal;

    const triggerSelectors = [
      '#f3-open-contact-modal',
      '#nav-floating-cta'
    ];

    triggerSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          // If navigation dropdown is open, close it seamlessly
          const navDropdown = document.getElementById('nav-dropdown-menu');
          if (navDropdown && navDropdown.classList.contains('is-open')) {
            const btn = document.getElementById('nav-hamburger-btn');
            navDropdown.classList.remove('is-open');
            if (btn) {
              btn.classList.remove('is-active');
              btn.setAttribute('aria-expanded', 'false');
            }
            navDropdown.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('nav-dropdown-active');
            document.documentElement.classList.remove('nav-dropdown-active');
          }
          openModal();
        });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        e.preventDefault();
        closeModal();
      }
    });

    if (!form) return;

    const submitBtn = document.getElementById('f3-submit-btn');
    const statusMsg = document.getElementById('f3-form-status');
    const serviceInput = document.getElementById('f3-selected-service');
    const budgetInput = document.getElementById('f3-selected-budget');
    const nameInput = document.getElementById('f3-form-name');
    const emailInput = document.getElementById('f3-form-email');
    const messageInput = document.getElementById('f3-form-message');

    // 2. Interactive Monospace Pill Selector Handling
    const pillGroups = form.querySelectorAll('.f3-pill-group');
    pillGroups.forEach(group => {
      const pills = group.querySelectorAll('.f3-pill-btn');
      pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          pills.forEach(p => {
            p.classList.remove('is-active');
            p.setAttribute('aria-checked', 'false');
          });
          pill.classList.add('is-active');
          pill.setAttribute('aria-checked', 'true');

          const serviceVal = pill.getAttribute('data-service');
          const budgetVal = pill.getAttribute('data-budget');
          if (serviceVal && serviceInput) serviceInput.value = serviceVal;
          if (budgetVal && budgetInput) budgetInput.value = budgetVal;
        });

        // Accessible Keyboard Navigation within Radio Group
        pill.addEventListener('keydown', (e) => {
          let target = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            target = pill.nextElementSibling || pills[0];
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            target = pill.previousElementSibling || pills[pills.length - 1];
          }
          if (target && target.classList.contains('f3-pill-btn')) {
            target.click();
            target.focus();
          }
        });
      });
    });

    // Clear validation error on input
    [nameInput, emailInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        if (statusMsg && statusMsg.classList.contains('is-error')) {
          statusMsg.textContent = '';
          statusMsg.className = 'f3-form-status-msg type-mono-a';
        }
      });
    });

    // 3. Form Submission Handling with Feedback Animation
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const name = (nameInput?.value || '').trim();
      const email = (emailInput?.value || '').trim();
      const message = (messageInput?.value || '').trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        nameInput?.classList.add('is-invalid');
        hasError = true;
      }
      if (!email || !emailPattern.test(email)) {
        emailInput?.classList.add('is-invalid');
        hasError = true;
      }
      if (!message) {
        messageInput?.classList.add('is-invalid');
        hasError = true;
      }

      if (hasError) {
        if (statusMsg) {
          statusMsg.textContent = 'PLEASE FILL IN ALL REQUIRED FIELDS.';
          statusMsg.className = 'f3-form-status-msg type-mono-a is-error';
        }
        return;
      }

      // Transition to Transmitting State
      if (submitBtn) {
        submitBtn.disabled = true;
        const btnLabel = submitBtn.querySelector('.f3-btn-label');
        if (btnLabel) btnLabel.textContent = 'Transmitting...';
      }

      if (statusMsg) {
        statusMsg.textContent = 'CONNECTING TO STUDIO...';
        statusMsg.className = 'f3-form-status-msg type-mono-a';
      }

      // Simulate asynchronous transmission
      setTimeout(() => {
        if (statusMsg) {
          statusMsg.textContent = 'MESSAGE SENT SUCCESSFULLY. TALK SOON.';
          statusMsg.className = 'f3-form-status-msg type-mono-a is-success';
        }

        if (submitBtn) {
          const btnLabel = submitBtn.querySelector('.f3-btn-label');
          if (btnLabel) btnLabel.textContent = 'Sent ✓';
        }

        // Reset form inputs (retain pill choices)
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (messageInput) messageInput.value = '';

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            const btnLabel = submitBtn.querySelector('.f3-btn-label');
            if (btnLabel) btnLabel.textContent = 'Send message ↗';
          }
          if (statusMsg) {
            statusMsg.style.opacity = '0';
            setTimeout(() => {
              statusMsg.textContent = '';
              statusMsg.style.opacity = '';
              statusMsg.className = 'f3-form-status-msg type-mono-a';
            }, 300);
          }
        }, 3500);
      }, 950);
    });

    // 4. Initialize Live Dual Clocks
    initDualClocks();
  }

  // Live Dual Studio & Visitor Time Clocks
  function initDualClocks() {
    const studioClockEl = document.getElementById('f3-clock-studio');
    const clientClockEl = document.getElementById('f3-clock-client');
    const clientTzEl = document.getElementById('f3-clock-client-tz');
    if (!studioClockEl && !clientClockEl) return;

    // Detect client timezone label (UTC offset only, e.g. (UTC+7), (UTC-5))
    let clientTzLabel = '(LOCAL)';
    try {
      const now = new Date();
      const offsetMinutes = -now.getTimezoneOffset();
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const absM = Math.abs(offsetMinutes);
      const absH = Math.floor(absM / 60);
      const remM = absM % 60;
      const offsetStr = remM > 0 ? `UTC${sign}${absH}:${String(remM).padStart(2, '0')}` : `UTC${sign}${absH}`;
      clientTzLabel = `(${offsetStr})`;
    } catch (e) {
      clientTzLabel = '(LOCAL)';
    }

    if (clientTzEl) {
      clientTzEl.textContent = clientTzLabel;
    }

    function tick() {
      const now = new Date();
      if (studioClockEl) {
        try {
          const studioTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).format(now);
          studioClockEl.textContent = `[${studioTime}]`;
        } catch (e) {
          const h = String((now.getUTCHours() + 7) % 24).padStart(2, '0');
          const m = String(now.getUTCMinutes()).padStart(2, '0');
          const s = String(now.getUTCSeconds()).padStart(2, '0');
          studioClockEl.textContent = `[${h}:${m}:${s}]`;
        }
      }

      if (clientClockEl) {
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clientClockEl.textContent = `[${h}:${m}:${s}]`;
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  // Legacy Contact Page fallback
  function initLegacyContact() {
    const legacyForm = document.getElementById('contact-form');
    if (!legacyForm) return;
    const statusMsg = document.getElementById('form-status');
    legacyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = legacyForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING...';
      }
      setTimeout(() => {
        if (statusMsg) {
          statusMsg.textContent = 'MESSAGE DISPATCHED SUCCESSFULLY.';
          statusMsg.style.color = '#faf9fc';
        }
        legacyForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'TRANSMIT MESSAGE ↗';
        }
      }, 1000);
    });
  }

  window.initContactPage = function() {
    initFutureThreeContact();
    initLegacyContact();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initContactPage);
  } else {
    window.initContactPage();
  }
})();
