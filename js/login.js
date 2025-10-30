/*
  Login page script
  Handles user login and checks credentials against localStorage
*/

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
  
  // Find the login form
  const form = document.getElementById('login-form');
  if (!form) return;

  // Get the input fields
  const usernameEl = document.getElementById('login-username');
  const passwordEl = document.getElementById('login-password');
  
  // Get the error message spots
  const usernameErr = document.getElementById('login-username-error');
  const passwordErr = document.getElementById('login-password-error');
  const successEl = document.getElementById('login-success');

  // Clear all error messages
  function clearErrors() {
    if (usernameErr) usernameErr.textContent = '';
    if (passwordErr) passwordErr.textContent = '';
    if (successEl) successEl.textContent = '';
  }

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    // Check if fields are filled
    if (!username) {
      usernameErr.textContent = 'Username or email is required';
      return;
    }
    if (!password) {
      passwordErr.textContent = 'Password is required';
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('breakout_users') || '[]');
    
    // Find user by username
    const user = users.find(u => u.username === username);
    
    if (!user) {
      usernameErr.textContent = 'User not found';
      return;
    }
    
    // Verify password
    if (user.password !== password) {
      passwordErr.textContent = 'Incorrect password';
      return;
    }

    // Success - save current user session
    localStorage.setItem('breakout_currentUser', user.username);
    
    // Show success message
    successEl.textContent = '✓ Login successful! Redirecting to game...';
    
    // Redirect to game page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  });
});
