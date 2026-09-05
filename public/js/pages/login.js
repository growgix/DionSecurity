/**
 * Login Page Controller
 * Supports Quick Persona Selection and Manual Credential Submission.
 */
import { api } from '../api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorAlert = document.getElementById('login-error-alert');
    const errorMessage = document.getElementById('login-error-message');
    const submitBtn = document.getElementById('login-submit-btn');
    const submitSpinner = document.getElementById('login-spinner');
    const submitText = document.getElementById('login-submit-text');
    const personaBtns = document.querySelectorAll('.persona-btn');

    // Preset persona credentials matching database seed
    const personas = {
        admin: {
            username: 'admin@dionsecurity.com',
            password: 'AdminPassword123!'
        },
        supervisor: {
            username: 'r.thorne.sup@dionventures.internal',
            password: 'SupervisorPassword123!'
        },
        guard: {
            username: 'c.miller@dionventures.internal',
            password: 'GuardPassword123!'
        }
    };

    // Persona button click handlers
    personaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            personaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const role = btn.getAttribute('data-role');
            if (personas[role]) {
                usernameInput.value = personas[role].username;
                passwordInput.value = personas[role].password;
                hideError();
            }
        });
    });

    function showError(msg) {
        if (errorMessage) errorMessage.textContent = msg;
        if (errorAlert) errorAlert.classList.add('active');
    }

    function hideError() {
        if (errorAlert) errorAlert.classList.remove('active');
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (submitSpinner) submitSpinner.style.display = isLoading ? 'inline-block' : 'none';
        if (submitText) submitText.textContent = isLoading ? 'Authenticating...' : 'Sign In';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideError();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                showError('Please enter both username and password.');
                return;
            }

            setLoading(true);

            try {
                const response = await api.login(username, password);

                if (response && response.success) {
                    const user = response.data && response.data.user ? response.data.user : {};
                    const role = (user.role || '').toLowerCase();

                    // Determine landing page based on authenticated role
                    let redirectUrl = '/pages/login.php';
                    if (role === 'admin') {
                        redirectUrl = '/pages/admin/dashboard.php';
                    } else if (role === 'supervisor') {
                        redirectUrl = '/pages/supervisor/dashboard.php';
                    } else if (role === 'guard') {
                        redirectUrl = '/pages/guard/dashboard.php';
                    }

                    window.location.href = redirectUrl;
                } else {
                    showError(response.message || 'Login failed. Please check your credentials.');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Login error:', err);
                const msg = err.data && err.data.message ? err.data.message : 'Invalid credentials or connection error.';
                showError(msg);
                setLoading(false);
            }
        });
    }
});