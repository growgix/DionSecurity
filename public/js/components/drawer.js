/**
 * Responsive Mobile Drawer Component
 * Handles sliding navigation drawer on smaller viewports.
 */
export function initDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const toggleBtn = document.getElementById('drawer-toggle-btn');
    const closeBtn = document.getElementById('drawer-close-btn');

    if (!drawer || !backdrop) return;

    function openDrawer() {
        drawer.classList.add('open');
        backdrop.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        backdrop.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDrawer);
} else {
    initDrawer();
}