/* ═══════════════════════════════════════════════════════════════
   NATURAL FOODS ADMIN - Theme Toggle (Dark/Light Mode)
   ═══════════════════════════════════════════════════════════════ */

(function () {
    const STORAGE_KEY = 'nf_theme';
    const darkCSS = document.getElementById('darkModeCSS');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function getTheme() {
        return localStorage.getItem(STORAGE_KEY) || 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (darkCSS) darkCSS.disabled = false;
            if (themeIcon) {
                themeIcon.classList.remove('bi-moon-fill');
                themeIcon.classList.add('bi-sun-fill');
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (darkCSS) darkCSS.disabled = true;
            if (themeIcon) {
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-fill');
            }
        }
    }

    // Apply saved theme on load
    applyTheme(getTheme());

    // Toggle on click
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const current = getTheme();
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY, next);
            applyTheme(next);
        });
    }
})();
