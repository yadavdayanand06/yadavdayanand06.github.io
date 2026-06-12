document.addEventListener('DOMContentLoaded', () => {
  // Set target date (August 1st, 2026 00:00:00 IST)
  const targetDate = new Date('August 1, 2026 00:00:00').getTime();

  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');
  const countdownWrap = document.getElementById('countdownTimer');

  const updateCountdown = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      clearInterval(timerInterval);
      if (countdownWrap) {
        countdownWrap.innerHTML = '<div style="font-size:1.2rem; font-weight:600; color:var(--accent-blue)">Batch Registration Closed. Contact support for late entry.</div>';
      }
      return;
    }

    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Format elements with leading zeros
    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  };

  // Run initial calculation and set interval
  updateCountdown();
  const timerInterval = setInterval(updateCountdown, 1000);
});
