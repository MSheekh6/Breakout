/*
  Registration page script
  Handles user registration with form validation and saves data to localStorage
*/

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
  
  // Find the registration form
  const form = document.getElementById('register-form');
  if (!form) return;

  // Get all the input fields
  const usernameEl = document.getElementById('reg-username');
  const passwordEl = document.getElementById('reg-password');
  const fullnameEl = document.getElementById('reg-fullname');
  const phoneEl = document.getElementById('reg-phone');

  // Get all the error message spots
  const usernameErr = document.getElementById('reg-username-error');
  const passwordErr = document.getElementById('reg-password-error');
  const fullnameErr = document.getElementById('reg-fullname-error');
  const phoneErr = document.getElementById('reg-phone-error');
  const successEl = document.getElementById('reg-success');

  // Clear all error messages
  function clearErrors() {
    [usernameErr, passwordErr, fullnameErr, phoneErr].forEach(el => {
      if (el) el.textContent = '';
    });
    if (successEl) successEl.textContent = '';
  }

  // Validate all form fields
  function validate() {
    let isValid = true;
    clearErrors();
    
    const username = usernameEl.value.trim();
    const password = passwordEl.value;
    const fullname = fullnameEl.value.trim();
    const phone = phoneEl.value.trim();

    // Check username/email
    if (!username) {
      usernameErr.textContent = 'Username or email is required';
      isValid = false;
    } else if (!username.includes('@') && username.length < 3) {
      usernameErr.textContent = 'Enter a valid email or username (min 3 chars)';
      isValid = false;
    }

    // Check password strength
    if (!password) {
      passwordErr.textContent = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      passwordErr.textContent = 'Password must be at least 6 characters';
      isValid = false;
    } else if (!(/[A-Za-z]/.test(password) && /[0-9]/.test(password))) {
      passwordErr.textContent = 'Password must include letters and numbers';
      isValid = false;
    }

    // Check full name
    if (!fullname) {
      fullnameErr.textContent = 'Full name is required';
      isValid = false;
    }

    // Check phone number
    if (!phone) {
      phoneErr.textContent = 'Phone number is required';
      isValid = false;
    } else if (!/^[\d\s()+-]{6,20}$/.test(phone)) {
      phoneErr.textContent = 'Invalid phone format';
      isValid = false;
    }

    return isValid;
  }

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Run validation
    if (!validate()) return;

    // Get existing users from localStorage
    const usersRaw = localStorage.getItem('breakout_users') || '[]';
    const users = JSON.parse(usersRaw);
    const username = usernameEl.value.trim();

    // Check for duplicate username
    if (users.find(u => u.username === username)) {
      usernameErr.textContent = 'Username already exists';
      return;
    }

    // Create user object
    const user = {
      username: username,
      password: passwordEl.value,
      fullname: fullnameEl.value.trim(),
      phone: phoneEl.value.trim(),
      created: new Date().toISOString()
    };

    // Save user to localStorage
    users.push(user);
    localStorage.setItem('breakout_users', JSON.stringify(users));

    // Show success message
    successEl.textContent = '✓ Registration successful! Redirecting to login...';
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  });
});
