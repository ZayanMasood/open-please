(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // Page entrance
  const loader = document.querySelector('.page-loader');
  const hideLoader = () => {
    window.setTimeout(() => loader?.classList.add('is-hidden'), reducedMotion ? 0 : 350);
  };
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });

  // Current year
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Sticky header state
  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Theme preference
  const themeToggle = document.querySelector('.theme-toggle');
  const storedTheme = localStorage.getItem('open-please-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = storedTheme || preferredTheme;

  const syncThemeMeta = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', root.dataset.theme === 'light' ? '#f7f5ff' : '#080b16');
    themeToggle?.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
  };
  syncThemeMeta();

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('open-please-theme', root.dataset.theme);
    syncThemeMeta();
  });

  // Mobile navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');

  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.hidden = !open;
    body.classList.toggle('menu-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  // Scroll reveal
  const revealItems = [...document.querySelectorAll('.reveal')];
  revealItems.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) item.style.setProperty('--delay', `${delay}ms`);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Animated goal counters
  const counters = [...document.querySelectorAll('[data-count]')];
  const animateCounter = (element) => {
    const target = Number(element.dataset.count || 0);
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (reducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach((counter) => { counter.textContent = counter.dataset.count || '0'; });
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.65 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  // One open FAQ at a time
  const faqItems = [...document.querySelectorAll('.accordion details')];
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  // Cursor spotlight
  const cursorGlow = document.querySelector('.cursor-glow');
  if (finePointer && cursorGlow && !reducedMotion) {
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    window.addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });

    const moveGlow = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(moveGlow);
    };
    moveGlow();
  }

  // Gentle perspective tilt
  if (finePointer && !reducedMotion) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });

    document.querySelectorAll('.magnetic').forEach((item) => {
      item.addEventListener('pointermove', (event) => {
        const bounds = item.getBoundingClientRect();
        const x = event.clientX - bounds.left - bounds.width / 2;
        const y = event.clientY - bounds.top - bounds.height / 2;
        item.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
      });
      item.addEventListener('pointerleave', () => {
        item.style.transform = '';
      });
    });
  }

  // Lightweight animated constellation background
  const canvas = document.querySelector('#constellation');
  if (canvas && !reducedMotion) {
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let pointer = { x: -1000, y: -1000 };

    const particleCount = () => Math.min(75, Math.max(28, Math.floor((width * height) / 26000)));

    const makeParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.13,
      vy: (Math.random() - 0.5) * 0.13,
      radius: Math.random() * 1.2 + 0.45
    });

    const resizeCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: particleCount() }, makeParticle);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const isLight = root.dataset.theme === 'light';
      const dotColor = isLight ? '45, 38, 90' : '208, 202, 255';

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;

        const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
        if (pointerDistance < 120) {
          particle.x += (particle.x - pointer.x) * 0.0025;
          particle.y += (particle.y - pointer.y) * 0.0025;
        }

        context.beginPath();
        context.fillStyle = `rgba(${dotColor}, .34)`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();

        for (let next = index + 1; next < particles.length; next += 1) {
          const other = particles[next];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance > 115) continue;
          context.beginPath();
          context.strokeStyle = `rgba(${dotColor}, ${0.09 * (1 - distance / 115)})`;
          context.lineWidth = 0.6;
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      });
      requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', (event) => {
      pointer = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
    draw();
  }

  // Static-site contact form: compose an email in the visitor's mail app.
  const form = document.querySelector('#contact-form');
  const toast = document.querySelector('.toast');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const contactEmail = body.dataset.contactEmail || '';
    if (!contactEmail || contactEmail.includes('REPLACE_') || !contactEmail.includes('@')) {
      showToast('Site owner: replace REPLACE_WITH_YOUR_EMAIL in index.html before publishing.');
      return;
    }

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const visitorEmail = String(data.get('email') || '').trim();
    const interest = String(data.get('interest') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Open Please inquiry: ${interest}`);
    const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${visitorEmail}\nInterest: ${interest}\n\n${message}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${emailBody}`;
    showToast('Opening your email app...');
  });

  // Service worker for fast repeat visits on GitHub Pages.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // The site still works normally if a browser blocks service workers.
      });
    });
  }
})();
