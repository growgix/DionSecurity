/**
 * Global Authentication & Session Controller
 * Binds logout actions and monitors session state.
 */
import { api } from './api.js';
import { Toast } from './components/toast.js';

export function initAuth() {
    const logoutBtns = document.querySelectorAll('#logout-btn, #drawer-logout-btn, [data-action="logout"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            btn.disabled = true;
            try {
                await api.logout();
                Toast.success('Signed out successfully');
                setTimeout(() => {
                    window.location.href = '/pages/login.php';
                }, 300);
            } catch (err) {
                console.error('Logout error:', err);
                // Fallback redirect even on failure
                window.location.href = '/pages/login.php';
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}