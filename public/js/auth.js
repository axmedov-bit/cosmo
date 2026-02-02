// Authentication functions

async function checkAuth() {
    try {
        const response = await fetch('/api/auth/verify');
        const data = await response.json();

        if (data.authenticated) {
            // User is logged in
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                window.location.href = '/dashboard.html';
            } else {
                // Update username display
                const userElement = document.getElementById('currentUser');
                if (userElement) {
                    userElement.textContent = data.admin.username;
                }
            }
        } else {
            // User is not logged in
            if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
                window.location.href = '/';
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            window.location.href = '/';
        }
    }
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loginBtn = document.getElementById('loginBtn');

        // Clear previous errors
        errorMessage.classList.remove('show');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading"></span> Kirish...';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = '/dashboard.html';
            } else {
                errorMessage.textContent = data.error || 'Login xatosi';
                errorMessage.classList.add('show');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Kirish';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Server bilan aloqa xatosi';
            errorMessage.classList.add('show');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Kirish';
        }
    });
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/';
        }
    });
}
