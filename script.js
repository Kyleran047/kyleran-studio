document.addEventListener('DOMContentLoaded', () => {
    // icons
    if (window.feather) {
        feather.replace();
    }

    // dynamic year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // mobile nav toggle (unchanged)
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileNav.style.maxHeight && mobileNav.style.maxHeight !== '0px';
            mobileNav.style.maxHeight = isOpen ? '0px' : mobileNav.scrollHeight + 'px';
            navToggle.innerHTML = isOpen
                ? '<i data-feather="menu" class="w-5 h-5"></i>'
                : '<i data-feather="x" class="w-5 h-5"></i>';
            feather.replace();
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.style.maxHeight = '0px';
                navToggle.innerHTML = '<i data-feather="menu" class="w-5 h-5"></i>';
                feather.replace();
            });
        });
    }

    // THEME TOGGLE
    // NEW – put theme class on <body>
    const root = document.body;
    const themeButtons = [
        document.getElementById('theme-toggle'),
        document.getElementById('theme-toggle-mobile')
    ];

    // start from system preference
    let darkMode = window.matchMedia &&
                   window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme() {
        if (darkMode) {
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
        }

        themeButtons.forEach(btn => {
            if (!btn) return;
            const icon = darkMode ? 'moon' : 'sun';
            const label = darkMode ? 'Dark' : 'Light';
            btn.innerHTML = `<i data-feather="${icon}" class="w-4 h-4"></i><span>${label}</span>`;
        });

        feather.replace();
    }

    themeButtons.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            darkMode = !darkMode;
            applyTheme();
        });
    });

    applyTheme();
});

