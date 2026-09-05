<?php
/**
 * Shared HTML Footer Include
 * Renders global toast notifications container, dialog modals,
 * and loads base JavaScript application scripts.
 *
 * Variables expected:
 *   $pageScripts (array, optional) - Page-specific JavaScript modules to load
 */
?>
    <!-- Global Toast Notifications Container -->
    <div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true"></div>

    <!-- Core Modular Vanilla JS Framework -->
    <script type="module" src="/public/js/api.js"></script>
    <script type="module" src="/public/js/auth.js"></script>
    <script type="module" src="/public/js/components/drawer.js"></script>
    <script type="module" src="/public/js/components/toast.js"></script>
    <script type="module" src="/public/js/components/modal.js"></script>

    <?php if (!empty($pageScripts) && is_array($pageScripts)): ?>
        <?php foreach ($pageScripts as $script): ?>
            <script type="module" src="<?= htmlspecialchars($script, ENT_QUOTES, 'UTF-8') ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
</body>
</html>