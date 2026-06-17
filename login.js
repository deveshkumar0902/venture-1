// NEO-THREAD // LOGIN MODULE

// 1. DATA SEEDING
const DEFAULT_USERS = [
  {
    name: "Shiv Kumar",
    phone: "9876543210",
    email: "shiv@neothread.com",
    address: "123 Cyber Street, Sector 404",
    pincode: "110001",
    password: "password123"
  }
];

function seedUsers() {
  if (!localStorage.getItem('neo_users')) {
    localStorage.setItem('neo_users', JSON.stringify(DEFAULT_USERS));
  }
}

// 2. MAIN LOGIC
function initLogin() {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Seed default account
  seedUsers();

  const loginForm = document.getElementById('login-form');
  const errorBox = document.getElementById('error-box');
  const errorText = document.getElementById('error-text');
  const submitBtn = document.getElementById('submit-btn');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const identity = document.getElementById('login-identity').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    // Load user list
    const users = JSON.parse(localStorage.getItem('neo_users')) || [];

    // Find matching user
    const matchedUser = users.find(u => 
      (u.email.toLowerCase() === identity || u.phone === identity) && 
      u.password === password
    );

    if (matchedUser) {
      // Hide errors
      errorBox.style.display = 'none';

      // Visual feedback
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = 'transparent';
      submitBtn.style.color = 'var(--accent-lime)';
      submitBtn.innerHTML = `<span>ACCESS GRANTED. CONNECTING...</span> <i data-lucide="loader" class="loader-spin"></i>`;
      
      // Inject spinning CSS keyframe dynamically for loader animation if not present
      if (!document.getElementById('loader-style')) {
        const style = document.createElement('style');
        style.id = 'loader-style';
        style.textContent = `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loader-spin {
            animation: spin 1s linear infinite;
            width: 18px;
            height: 18px;
          }
        `;
        document.head.appendChild(style);
      }
      lucide.createIcons();

      // Log user in
      localStorage.setItem('neo_logged_in_user', JSON.stringify(matchedUser));

      // Redirect after animation
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      // Display error
      errorText.innerText = "ACCESS DENIED: INVALID EMAIL/PHONE OR PASSWORD.";
      errorBox.style.display = 'flex';
      
      // Clear password field
      document.getElementById('login-password').value = '';
      document.getElementById('login-password').focus();
    }
  });
}

window.addEventListener('DOMContentLoaded', initLogin);
