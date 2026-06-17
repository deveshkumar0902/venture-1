// NEO-THREAD // SIGN-UP MODULE

function initSignup() {
  // Initialize Lucide Icons
  lucide.createIcons();

  const signupForm = document.getElementById('signup-form');
  const errorBox = document.getElementById('error-box');
  const errorText = document.getElementById('error-text');
  const submitBtn = document.getElementById('submit-btn');

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const phone = document.getElementById('signup-phone').value.trim();
    const address = document.getElementById('signup-address').value.trim();
    const pincode = document.getElementById('signup-pincode').value.trim();
    const password = document.getElementById('signup-password').value;

    // Simple validations
    if (!name || !email || !phone || !address || !pincode || !password) {
      showError("ALL FIELDS ARE REQUIRED.");
      return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
      showError("INVALID PHONE: MUST BE A 10-DIGIT NUMBER.");
      return;
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
      showError("INVALID PINCODE: MUST BE A 6-DIGIT NUMBER.");
      return;
    }

    if (password.length < 6) {
      showError("PASSWORD MUST BE AT LEAST 6 CHARACTERS.");
      return;
    }

    // Load user list
    const users = JSON.parse(localStorage.getItem('neo_users')) || [];

    // Check duplicates
    const isDuplicate = users.some(u => 
      u.email.toLowerCase() === email || u.phone === phone
    );

    if (isDuplicate) {
      showError("ACCESS DENIED: AN ACCOUNT WITH THIS EMAIL OR PHONE ALREADY EXISTS.");
      return;
    }

    // Success - create user
    const newUser = {
      name,
      email,
      phone,
      address,
      pincode,
      password
    };

    // Save to users list
    users.push(newUser);
    localStorage.setItem('neo_users', JSON.stringify(users));

    // Hide error
    errorBox.style.display = 'none';

    // Animate button
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = 'transparent';
    submitBtn.style.color = 'var(--accent-lime)';
    submitBtn.innerHTML = `<span>PROFILE REGISTERED. REDIRECTING...</span> <i data-lucide="loader" class="loader-spin"></i>`;
    
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

    // Automatically log user in
    localStorage.setItem('neo_logged_in_user', JSON.stringify(newUser));

    // Redirect to home
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
  });

  function showError(msg) {
    errorText.innerText = msg;
    errorBox.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

window.addEventListener('DOMContentLoaded', initSignup);
