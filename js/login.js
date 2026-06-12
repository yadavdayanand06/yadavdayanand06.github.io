document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorAlert = document.getElementById('errorAlert');

  // Seed default fallback admin user if not present
  const seedDefaultAdmin = () => {
    let adminUsers = JSON.parse(localStorage.getItem('demo_admin_users')) || [];
    const defaultExists = adminUsers.some(u => u.username === 'admin');
    if (!defaultExists) {
      // Default plain password: AdminSecret2026!
      adminUsers.push({
        username: 'admin',
        password: 'AdminSecret2026!'
      });
      localStorage.setItem('demo_admin_users', JSON.stringify(adminUsers));
    }
  };

  seedDefaultAdmin();

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';

    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      showError('Please enter both username and password.');
      return;
    }

    try {
      const adminUsers = JSON.parse(localStorage.getItem('demo_admin_users')) || [];
      const userMatch = adminUsers.find(u => u.username === username);

      if (userMatch && userMatch.password === password) {
        // Successful login
        localStorage.setItem('demo_session_active', 'true');
        localStorage.setItem('demo_session_username', username);
        window.location.href = 'report.html'; // redirect to relative dashboard page
      } else {
        showError('Invalid username or password. (Hint: use admin / AdminSecret2026!)');
      }
    } catch (err) {
      console.error('Login mock error:', err);
      showError('Failed to verify login credentials.');
    }
  });

  const showError = (msg) => {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
  };
});
