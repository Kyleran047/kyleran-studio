/* ============================================================
   KYLERAN STUDIO  —  script.js  (improved)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Feather icons ─────────────────────────────────────── */
  if (window.feather) feather.replace();

  /* ── Dynamic year ──────────────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ════════════════════════════════════════════════════════
     THEME — persisted in localStorage
     ════════════════════════════════════════════════════════ */
  const themeButtons = [
    document.getElementById('theme-toggle'),
    document.getElementById('theme-toggle-mobile'),
  ].filter(Boolean);

  // Initialise from localStorage → system pref → dark
  const savedTheme = localStorage.getItem('ks-theme');
  let darkMode = savedTheme
    ? savedTheme === 'dark'
    : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true);

  function applyTheme() {
    if (darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
    localStorage.setItem('ks-theme', darkMode ? 'dark' : 'light');

    const icon  = darkMode ? 'moon' : 'sun';
    const label = darkMode ? 'Dark' : 'Light';
    themeButtons.forEach(btn => {
      btn.innerHTML = `<i data-feather="${icon}" class="w-4 h-4"></i><span>${label}</span>`;
    });
    if (window.feather) feather.replace();
  }

  themeButtons.forEach(btn => btn.addEventListener('click', () => {
    darkMode = !darkMode;
    applyTheme();
  }));

  applyTheme();


  /* ════════════════════════════════════════════════════════
     MOBILE NAV
     ════════════════════════════════════════════════════════ */
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.style.maxHeight = '0px';
    navToggle.innerHTML = '<i data-feather="menu" class="w-5 h-5"></i>';
    if (window.feather) feather.replace();
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.style.maxHeight && mobileNav.style.maxHeight !== '0px';
      if (isOpen) {
        closeMobileNav();
      } else {
        mobileNav.style.maxHeight = mobileNav.scrollHeight + 'px';
        navToggle.innerHTML = '<i data-feather="x" class="w-5 h-5"></i>';
        if (window.feather) feather.replace();
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', closeMobileNav)
    );

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMobileNav();
    });
  }


  /* ════════════════════════════════════════════════════════
     SCROLL PROGRESS BAR
     ════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    if (!progressBar) return;
    const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollMax  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct        = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
    progressBar.style.width = pct + '%';
  }


  /* ════════════════════════════════════════════════════════
     SCROLL-TO-TOP BUTTON
     ════════════════════════════════════════════════════════ */
  const scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function updateScrollTopVisibility() {
    if (!scrollTopBtn) return;
    const show = (document.documentElement.scrollTop || document.body.scrollTop) > 300;
    scrollTopBtn.classList.toggle('visible', show);
  }


  /* ════════════════════════════════════════════════════════
     NAVBAR — shadow + active link
     ════════════════════════════════════════════════════════ */
  const header   = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sections for active-link tracking (in page order)
  const sections = ['home', 'services', 'projects', 'about', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function updateNav() {
    const scrollY = window.scrollY;

    // Shadow when scrolled
    if (header) header.classList.toggle('scrolled', scrollY > 10);

    // Active link based on which section is in view
    let currentId = sections[0]?.id ?? '';
    for (const section of sections) {
      if (scrollY >= section.offsetTop - 100) currentId = section.id;
    }
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '') ?? '';
      link.classList.toggle('active', href === currentId);
    });
  }


  /* ════════════════════════════════════════════════════════
     SCROLL REVEAL — IntersectionObserver
     ════════════════════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);   // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════════════════════════════
     UNIFIED SCROLL HANDLER
     ════════════════════════════════════════════════════════ */
  function onScroll() {
    updateProgress();
    updateScrollTopVisibility();
    updateNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ════════════════════════════════════════════════════════
     CONTACT FORM — mock submit with validation
     ════════════════════════════════════════════════════════ */
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = form.querySelector('#c-name')?.value.trim();
      const email   = form.querySelector('#c-email')?.value.trim();
      const message = form.querySelector('#c-message')?.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        feedback.className   = 'form-feedback';
        feedback.style.display = '';          // let CSS rule handle it
        feedback.innerHTML   = '⚠️  Please fill in your name, email, and message.';
        feedback.style.display = 'flex';
        feedback.style.background    = 'rgba(245,158,11,0.1)';
        feedback.style.borderColor   = 'rgba(245,158,11,0.35)';
        feedback.style.color         = '#fbbf24';
        return;
      }

      // Simulate sending
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled     = true;
        btn.innerHTML    = '<i data-feather="loader" class="w-4 h-4 animate-spin"></i><span>Sending…</span>';
        if (window.feather) feather.replace();
      }

      setTimeout(() => {
        // Reset form
        form.reset();

        // Show success
        feedback.className        = 'form-feedback success';
        feedback.innerHTML        = '✅ Message received — thanks! I\'ll get back to you soon.';
        // clear inline styles so CSS class takes over
        feedback.style.background = '';
        feedback.style.borderColor = '';
        feedback.style.color      = '';

        if (btn) {
          btn.disabled  = false;
          btn.innerHTML = '<i data-feather="send" class="w-4 h-4"></i><span>Send message</span>';
          if (window.feather) feather.replace();
        }

        // Hide success after 6 s
        setTimeout(() => {
          feedback.className = 'form-feedback';
          feedback.style.display = 'none';
        }, 6000);
      }, 1200);
    });
  }

});
