// Authentication state
let currentUser = null;
let authToken = null;

// Check if user is authenticated on page load
function checkAuth() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (token && user) {
    authToken = token;
    currentUser = JSON.parse(user);
    showApp();
  } else {
    showAuthModal();
  }
}

// Show authentication modal
function showAuthModal() {
  document.getElementById('authModal').classList.add('show');
  document.getElementById('navActions').style.display = 'none';
}

// Hide authentication modal
function hideAuthModal() {
  document.getElementById('authModal').classList.remove('show');
  document.getElementById('navActions').style.display = 'flex';
}

// Show main app
function showApp() {
  hideAuthModal();
  document.getElementById('userEmail').textContent = currentUser.email;
  document.getElementById('navActions').style.display = 'flex';
}

// Initialize event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Toggle between login and register
  document.getElementById('authToggle').addEventListener('click', (e) => {
    e.preventDefault();
    const title = document.getElementById('authTitle');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleText = document.getElementById('authToggleText');
    const toggle = document.getElementById('authToggle');

    if (title.textContent === 'Login') {
      title.textContent = 'Register';
      submitBtn.textContent = 'Register';
      toggleText.innerHTML = 'Already have an account? ';
      toggle.textContent = 'Login';
    } else {
      title.textContent = 'Login';
      submitBtn.textContent = 'Login';
      toggleText.innerHTML = "Don't have an account? ";
      toggle.textContent = 'Register';
    }

    document.getElementById('authError').textContent = '';
    document.getElementById('authForm').reset();
  });

  // Handle auth form submission
  document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isLogin = document.getElementById('authTitle').textContent === 'Login';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    const errorEl = document.getElementById('authError');
    errorEl.textContent = '';

    try {
      showLoading();

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store token and user
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      authToken = data.token;
      currentUser = data.user;

      showApp();

      // Add pin cursor to map
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.classList.add('pin-cursor');
      }

      // Load pins after authentication
      if (typeof loadPins === 'function') {
        await loadPins();
      }

      document.getElementById('authForm').reset();
    } catch (error) {
      errorEl.textContent = error.message;
    } finally {
      hideLoading();
    }
  });

  // Handle logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      authToken = null;
      currentUser = null;

      // Clear map markers
      if (typeof clearMarkers === 'function') {
        clearMarkers();
      }

      // Remove pin cursor from map
      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapElement.classList.remove('pin-cursor');
      }

      showAuthModal();
      document.getElementById('authForm').reset();
    }
  });

  // Initialize auth check
  checkAuth();
});

// Helper to add auth header to requests
function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`
  };
}

// Show loading spinner
function showLoading() {
  document.getElementById('loading').classList.add('show');
}

// Hide loading spinner
function hideLoading() {
  document.getElementById('loading').classList.remove('show');
}
