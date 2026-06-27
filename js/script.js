const cursor = document.getElementById('cursor');
let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
  cx = e.clientX;
  cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
});

document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

const preloader = document.getElementById('preloader');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    runCounters();
    initReveal();
  }, 600);
});

document.body.classList.add('no-scroll');

function runCounters() {
  document.querySelectorAll('.count-num[data-to]').forEach(el => {
    const target = parseInt(el.dataset.to);
    const duration = 1000;
    const start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => io.observe(el));
}

const sidebar = document.getElementById('sidebar');
const mobToggle = document.getElementById('mob-toggle');

mobToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  mobToggle.classList.toggle('open');
});

sidebar.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      sidebar.classList.remove('open');
      mobToggle.classList.remove('open');
    }
  });
});

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section[id]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

document.querySelectorAll('.cert-crd-preview').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.cert-crd');
    openCert(card);
  });
});

const certOverlay = document.getElementById('cert-overlay');
const coBackdrop = document.getElementById('co-backdrop');
const coClose = document.getElementById('co-close');
const coFrame = document.getElementById('co-frame');
const coOrg = document.getElementById('co-org');
const coTitle = document.getElementById('co-title');
const coDate = document.getElementById('co-date');
const coVerify = document.getElementById('co-verify');
const coNoPdf = document.getElementById('co-no-pdf');

function openCert(row) {
  const pdf = row.dataset.pdf;
  const org = row.dataset.org;
  const title = row.dataset.title;
  const date = row.dataset.date;
  const verify = row.dataset.verify;

  coOrg.textContent = org;
  coTitle.textContent = title;
  coDate.textContent = date;

  if (pdf && pdf.trim() !== '') {
    coFrame.src = pdf + '#toolbar=0&navpanes=0';
    coFrame.style.display = 'block';
    coNoPdf.classList.remove('visible');
  } else {
    coFrame.src = '';
    coFrame.style.display = 'none';
    coNoPdf.classList.add('visible');
  }

  if (verify && verify.trim() !== '') {
    coVerify.href = verify;
    coVerify.style.display = 'inline';
  } else {
    coVerify.style.display = 'none';
  }

  certOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCert() {
  certOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    coFrame.src = '';
    coNoPdf.classList.remove('visible');
  }, 320);
}

coClose.addEventListener('click', closeCert);
coBackdrop.addEventListener('click', closeCert);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCert();
});