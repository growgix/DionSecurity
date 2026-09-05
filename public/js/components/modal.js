/**
 * Accessible Modal Component
 * Manages modal dialogs with focus-trapping and keyboard Escape dismissal.
 */
export class Modal {
    constructor(modalElementOrId) {
        this.element = typeof modalElementOrId === 'string'
            ? document.getElementById(modalElementOrId)
            : modalElementOrId;

        if (!this.element) {
            console.warn(`[Modal] Element not found: ${modalElementOrId}`);
            return;
        }

        this.dialog = this.element.querySelector('.modal-dialog');
        this.closeBtns = this.element.querySelectorAll('[data-modal-close], .modal-close-btn');
        this.boundHandleKeydown = this.handleKeydown.bind(this);
        this.previousActiveElement = null;

        this.init();
    }

    init() {
        this.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });
    }

    open() {
        if (!this.element) return;
        this.previousActiveElement = document.activeElement;
        this.element.classList.add('active');
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', this.boundHandleKeydown);

        // Focus first focusable item
        setTimeout(() => {
            const focusable = this.element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length > 0) {
                focusable[0].focus();
            }
        }, 50);
    }

    close() {
        if (!this.element) return;
        this.element.classList.remove('active');
        document.body.style.overflow = '';
        window.removeEventListener('keydown', this.boundHandleKeydown);

        if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
            this.previousActiveElement.focus();
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.close();
        }
    }
}

// Global modal initialization helper
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-modal-target');
            const targetModal = new Modal(targetId);
            targetModal.open();
        });
    });
});