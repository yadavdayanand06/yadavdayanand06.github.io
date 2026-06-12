document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const errorAlert = document.getElementById('errorAlert');
  const successAlert = document.getElementById('successAlert');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';

    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Client-side validations
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!username || !usernameRegex.test(username)) {
      showError('Username must be alphanumeric and between 4 to 20 characters.');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!password || !passwordRegex.test(password)) {
      showError('Password must be at least 8 characters long, containing at least one number and one special character (!@#$%^&*).');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    try {
      let adminUsers = JSON.parse(localStorage.getItem('demo_admin_users')) || [];
      const userExists = adminUsers.some(u => u.username === username);

      if (userExists) {
        showError('Username is already taken.');
        return;
      }

      // Save user (plain text for mock static page demo)
      adminUsers.push({ username, password });
      localStorage.setItem('demo_admin_users', JSON.stringify(adminUsers));

      successAlert.textContent = 'Account registered successfully! Redirecting to login page...';
      successAlert.style.display = 'block';
      signupForm.reset();
      
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);

    } catch (err) {
      console.error('Signup mock error:', err);
      showError('Failed to register admin account.');
    }
  });

  const showError = (msg) => {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
  };
});
