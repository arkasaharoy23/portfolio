(() => {

  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('out'), 900);
  });

  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorText = document.getElementById('cursorText');
  let mx = 0, my = 0, rx = 0, ry = 0;
  let tx = 0, ty = 0;

  if (window.matchMedia('(pointer: fine)').matches) {

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
      cursorText.style.left = mx + 'px';
      cursorText.style.top = (my + 28) + 'px';
    });

    const animCursor = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    };
    animCursor();

    document.addEventListener('mousedown', () => {
      cursorDot.classList.add('clicking');
      cursorRing.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      cursorDot.classList.remove('clicking');
      cursorRing.classList.remove('clicking');
    });

    const setHover = (label) => {
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovered');
      if (label) {
        cursorText.textContent = label;
        cursorText.style.opacity = '1';
      }
    };
    const clearHover = () => {
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovered');
      cursorText.style.opacity = '0';
      cursorText.textContent = '';
    };

    document.querySelectorAll('a[href^="http"], a[target="_blank"]').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('visit'));
      el.addEventListener('mouseleave', clearHover);
    });
    document.querySelectorAll('a[href^="#"]').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('go'));
      el.addEventListener('mouseleave', clearHover);
    });
    document.querySelectorAll('.proj-card, .project-featured').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('view'));
      el.addEventListener('mouseleave', clearHover);
    });
    document.querySelectorAll('.cert-preview-btn').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('open'));
      el.addEventListener('mouseleave', clearHover);
    });
    document.querySelectorAll('.btn-resume, .cta-primary, .cta-secondary, a[download]').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('get'));
      el.addEventListener('mouseleave', clearHover);
    });
    document.querySelectorAll('.sk-badge').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('skill'));
      el.addEventListener('mouseleave', clearHover);
    });
    document.querySelectorAll('.hack-card, .exp-card').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('read'));
      el.addEventListener('mouseleave', clearHover);
    });
    document.querySelectorAll('button:not(.cert-preview-btn):not(.hamburger):not(.back-to-top)').forEach(el => {
      el.addEventListener('mouseenter', () => setHover('click'));
      el.addEventListener('mouseleave', clearHover);
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('solid', y > 50);
    backToTop.classList.toggle('show', y > 500);
    highlightNav();
  }, { passive: true });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });

  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinkEls.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  const counters = document.querySelectorAll('.hstat-num');
  let counted = false;
  const counterObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      counters.forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1200;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          el.textContent = start + suffix;
          if (start >= target) clearInterval(timer);
        }, 16);
      });
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) counterObs.observe(heroStats);

  const words = document.querySelectorAll('.role-word');
  let wordIdx = 0;
  if (words.length > 0) {
    setInterval(() => {
      words[wordIdx].classList.remove('active');
      words[wordIdx].classList.add('out');
      setTimeout(() => words[wordIdx - (wordIdx > 0 ? 1 : -words.length + 1)].classList.remove('out'), 500);
      wordIdx = (wordIdx + 1) % words.length;
      words[wordIdx].classList.add('active');
    }, 2600);
  }

  function spawnParticle(container) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 10;
    const colors = ['rgba(155,93,229,', 'rgba(79,142,247,', 'rgba(34,211,238,'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.4 + 0.1;
    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: ${color}${opacity});
      border-radius: 50%;
      left: ${x}%;
      top: 100%;
      animation: floatUp ${duration}s ${delay}s linear infinite;
      pointer-events: none;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatUp {
      0%   { transform: translateY(0) scale(1); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.4; }
      100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) spawnParticle(particlesContainer);
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  const heroName = document.querySelector('.hero-name');
  const heroEls = document.querySelectorAll('.hero-badge, .hero-hello, .hero-role, .hero-sub, .hero-cta, .hero-stats');
  const fadeIn = (el, delay) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  };
  if (heroName) fadeIn(heroName, 0.2);
  heroEls.forEach((el, i) => fadeIn(el, 0.4 + i * 0.12));

  const modal = document.getElementById('certModal');
  const modalBackdrop = document.getElementById('certModalBackdrop');
  const modalClose = document.getElementById('certModalClose');
  const modalFrame = document.getElementById('modalFrame');
  const modalIssuer = document.getElementById('modalIssuer');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalVerify = document.getElementById('modalVerify');

  function openCertModal(card) {
    const pdf = card.getAttribute('data-pdf');
    const issuer = card.getAttribute('data-issuer');
    const title = card.getAttribute('data-title');
    const date = card.getAttribute('data-date');
    const verify = card.getAttribute('data-verify');

    modalIssuer.textContent = issuer;
    modalTitle.textContent = title;
    modalDate.textContent = date;
    modalVerify.href = verify || '#';

    if (pdf) {
      modalFrame.src = pdf + '#toolbar=0&navpanes=0&scrollbar=0&view=FitH';
    } else {
      modalFrame.src = '';
      modalFrame.style.height = '120px';
      modalFrame.srcdoc = `<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#0d1224;color:#94a3b8;font-family:sans-serif;font-size:0.85rem;padding:24px;text-align:center;">Specialization certificate — verify online via the link below.</div>`;
    }

    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeCertModal() {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { modalFrame.src = ''; }, 300);
  }

  document.querySelectorAll('.cert-preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openCertModal(btn.closest('.cert-card'));
    });
  });

  modalClose.addEventListener('click', closeCertModal);
  modalBackdrop.addEventListener('click', closeCertModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeCertModal();
  });

  document.querySelectorAll('.cert-modal-preview iframe').forEach(f => {
    f.addEventListener('contextmenu', e => e.preventDefault());
  });

})();