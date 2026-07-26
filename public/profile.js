// NEO-THREAD // PROFILE SETTINGS ENGINE

function initProfile() {
  // Initialize Lucide Icons
  lucide.createIcons();

  const profileForm = document.getElementById('profile-form');
  const errorBox = document.getElementById('error-box');
  const errorText = document.getElementById('error-text');
  const successBox = document.getElementById('success-box');
  const submitBtn = document.getElementById('submit-btn');

  // Input Elements
  const nameInput = document.getElementById('profile-name');
  const phoneInput = document.getElementById('profile-phone');
  const address1Input = document.getElementById('profile-address1');
  const address2Input = document.getElementById('profile-address2');
  const cityInput = document.getElementById('profile-city');
  const stateInput = document.getElementById('profile-state');
  const pincodeInput = document.getElementById('profile-pincode');

  // Ensure boxes are hidden on startup
  errorBox.style.display = 'none';
  successBox.style.display = 'none';

  // Load and pre-populate saved profile data
  const loggedInUser = JSON.parse(localStorage.getItem('neo_logged_in_user'));

  if (loggedInUser) {
    nameInput.value = loggedInUser.name || '';
    phoneInput.value = loggedInUser.phone || '';
    address1Input.value = loggedInUser.addressLine1 || loggedInUser.address || '';
    address2Input.value = loggedInUser.addressLine2 || '';
    cityInput.value = loggedInUser.city || '';
    stateInput.value = loggedInUser.state || '';
    pincodeInput.value = loggedInUser.pincode || '';
  }

  // Handle Form Submission
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset alert displays
    errorBox.style.display = 'none';
    successBox.style.display = 'none';

    // Extract trim values
    const fullName = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const addressLine1 = address1Input.value.trim();
    const addressLine2 = address2Input.value.trim();
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();
    const pincode = pincodeInput.value.trim();

    // Required Field Validations
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      showError("ALL REQUIRED FIELDS (*) MUST BE COMPLETED.");
      return;
    }

    // Phone Validation: 10 digits
    if (phone.length !== 10 || isNaN(phone)) {
      showError("INVALID PHONE: MUST BE A 10-DIGIT NUMBER.");
      return;
    }

    // Pincode Validation: 6 digits
    if (pincode.length !== 6 || isNaN(pincode)) {
      showError("INVALID PINCODE: MUST BE A 6-DIGIT NUMBER.");
      return;
    }

    try {
      const token = localStorage.getItem('neo_token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update current user details in localStorage session
        localStorage.setItem('neo_logged_in_user', JSON.stringify(data.user));

        // Visual save feedback / animation
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = 'transparent';
        submitBtn.style.color = 'var(--accent-lime)';
        submitBtn.innerHTML = `<span>SAVING CONFIGURATION...</span> <i data-lucide="loader" class="loader-spin"></i>`;
        
        // Inject spinning CSS animation keyframe dynamically
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

        setTimeout(() => {
          // Restore submit button state
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.color = '';
          submitBtn.innerHTML = originalBtnHTML;
          lucide.createIcons();

          // Show success alert and scroll to top
          successBox.style.display = 'flex';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
      } else {
        showError((data.error || "PROFILE UPDATE REJECTED").toUpperCase());
      }
    } catch (err) {
      console.error("Profile Update Fetch Error:", err);
      showError("CONNECTION FAILURE: SERVER UNRESPONSIVE.");
    }
  });

  function showError(msg) {
    errorText.innerText = msg;
    errorBox.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

window.addEventListener('DOMContentLoaded', initProfile);

