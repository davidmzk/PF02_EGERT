// ==========================================================================
// FLUXO — script.js
// Interactividad vanilla JS: menú móvil, header sticky, animaciones al
// hacer scroll, botón "volver arriba" y envío visual del formulario.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initScrollTopButton();
  initSmoothAnchorLinks();
  initContactForm();
});

/* ---------- Año dinámico en el footer ---------- */
function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ---------- Header: sombra al hacer scroll ---------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const toggleScrolled = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };

  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* ---------- Menú de navegación móvil ---------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  const closeNav = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cierra el menú al elegir un enlace
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Cierra el menú al presionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  // Cierra el menú si la ventana vuelve a tamaño de escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeNav();
  });
}

/* ---------- Animación de aparición al hacer scroll ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Pequeño escalonado para las cuadrículas de tarjetas
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  // Escalona las tarjetas dentro de una misma cuadrícula
  const grids = document.querySelectorAll('.services-grid, .testimonials-grid');
  grids.forEach((grid) => {
    Array.from(grid.children).forEach((card, i) => {
      card.dataset.delay = i * 90;
    });
  });

  items.forEach((el) => observer.observe(el));
}

/* ---------- Botón flotante "volver arriba" ---------- */
function initScrollTopButton() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Desplazamiento suave para enlaces internos ---------- */
function initSmoothAnchorLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  const header = document.getElementById('siteHeader');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({ top, behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

/* ---------- Formulario de contacto (visual, sin backend) ---------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const note = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      if (note) {
        note.textContent = 'Por favor completá los campos obligatorios.';
        note.style.color = '#DC2626';
      }
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Simulación de envío (no hay backend real)
    setTimeout(() => {
      if (note) {
        note.style.color = '#16A34A';
        note.textContent = '¡Gracias! Recibimos tu mensaje y te contactaremos pronto.';
      }
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      form.reset();
    }, 900);
  });
}
