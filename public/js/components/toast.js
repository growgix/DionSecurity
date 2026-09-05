/**
 * Toast Notification Utility
 * Provides lightweight, non-blocking toast notifications.
 */
class ToastManager {
    constructor() {
        this.container = null;
    }

    getContainer() {
        if (!this.container) {
            this.container = document.getElementById('toast-container');
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.id = 'toast-container';
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        }
        return this.container;
    }

    show(message, type = 'info', duration = 4000) {
        const container = this.getContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const iconMap = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        const icon = iconMap[type] || 'info';

        toast.innerHTML = `
            <span class="material-symbols-outlined toast-icon">${icon}</span>
            <div class="toast-message">${this.escapeHtml(message)}</div>
            <button type="button" class="toast-close" aria-label="Close notification">
                <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
            </button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.dismiss(toast));

        container.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }
    }

    dismiss(toast) {
        if (!toast || toast.classList.contains('removing')) return;
        toast.classList.add('removing');
        toast.addEventListener('transitionend', () => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        });
    }

    success(message, duration) { this.show(message, 'success', duration); }
    error(message, duration) { this.show(message, 'error', duration); }
    warning(message, duration) { this.show(message, 'warning', duration); }
    info(message, duration) { this.show(message, 'info', duration); }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

export const Toast = new ToastManager();
window.Toast = Toast;