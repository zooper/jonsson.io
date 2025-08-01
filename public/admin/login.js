// Admin login functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/admin/api/auth', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        if (response.ok) {
            localStorage.setItem('adminToken', password);
            window.location.href = '/admin/dashboard-new.html';
        } else {
            document.getElementById('error').textContent = 'Invalid password';
            document.getElementById('error').style.display = 'block';
        }
    } catch (error) {
        document.getElementById('error').textContent = 'Login failed';
        document.getElementById('error').style.display = 'block';
    }
});

// Check if already logged in
const token = localStorage.getItem('adminToken');
if (token) {
    fetch('/admin/api/auth', {
        method: 'POST',
        headers: { 
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: token })
    }).then(response => {
        if (response.ok) {
            window.location.href = '/admin/dashboard-new.html';
        }
    });
}