// Magic Link Authentication

// Magic Link form handler
document.getElementById('magicLinkForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const button = document.getElementById('sendMagicLinkBtn');
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');
    
    // Show loading state
    button.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    hideError();
    
    try {
        const response = await fetch('/admin/api/request-magic-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success message
            document.getElementById('magicLinkForm').style.display = 'none';
            document.getElementById('magicLinkSent').style.display = 'block';
        } else {
            showError(data.error || 'Failed to send magic link');
        }
    } catch (error) {
        showError('Network error. Please try again.');
    } finally {
        // Reset button state
        button.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
});

// Handle magic link verification from URL
function handleMagicLinkToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        verifyMagicLink(token);
    }
}

async function verifyMagicLink(token) {
    try {
        const response = await fetch('/admin/api/verify-magic-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            // Store JWT token and redirect
            localStorage.setItem('adminToken', data.token);
            window.location.href = '/admin/dashboard-new.html';
        } else {
            showError(data.error || 'Invalid or expired magic link');
        }
    } catch (error) {
        showError('Failed to verify magic link');
    }
}

// Check if already logged in with JWT
async function checkExistingAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    
    try {
        // Try to validate existing token
        const response = await fetch('/admin/api/photos', {
            headers: { 
                'Authorization': 'Bearer ' + token
            }
        });
        
        if (response.ok) {
            window.location.href = '/admin/dashboard-new.html';
        } else {
            // Token invalid, remove it
            localStorage.removeItem('adminToken');
        }
    } catch (error) {
        // Token invalid, remove it
        localStorage.removeItem('adminToken');
    }
}

// Utility functions
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    handleMagicLinkToken();
    checkExistingAuth();
});