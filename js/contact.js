/**
 * Contact Page Interactive Logic
 */

window.initContactPage = function() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING...';
      }

      setTimeout(() => {
        if (statusMsg) {
          statusMsg.textContent = 'MESSAGE DISPATCHED SUCCESSFULLY.';
          statusMsg.style.color = '#ffffff';
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'TRANSMIT MESSAGE ↗';
        }
      }, 1200);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.initContactPage();
});
