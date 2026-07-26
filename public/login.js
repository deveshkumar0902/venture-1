// NEO-THREAD // LOGIN MODULE

function initLogin() {
  // Initialize Lucide Icons
  lucide.createIcons();

  const loginForm = document.getElementById('login-form');
  const errorBox = document.getElementById('error-box');
  const errorText = document.getElementById('error-text');
  const submitBtn = document.getElementById('submit-btn');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const identity = document.getElementById('login-identity').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identity, password })
      });

      const data = await response.json();

      if (response.ok) {
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

        // Log user in by setting token & user info
        localStorage.setItem('neo_token', data.token);
        localStorage.setItem('neo_logged_in_user', JSON.stringify(data.user));

        // Redirect after animation
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        // Display backend error
        errorText.innerText = (data.error || "ACCESS DENIED").toUpperCase();
        errorBox.style.display = 'flex';
        
        // Clear password field
        document.getElementById('login-password').value = '';
        document.getElementById('login-password').focus();
      }
    } catch (err) {
      console.error("Login Fetch Error:", err);
      errorText.innerText = "CONNECTION FAILURE: SERVER UNRESPONSIVE.";
      errorBox.style.display = 'flex';
    }
  });
}

window.addEventListener('DOMContentLoaded', initLogin);

