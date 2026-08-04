(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function createWords(node) {
    if (!node) return;
    const text = node.textContent.trim();
    if (!text) return;
    node.innerHTML = '';
    const tokens = text.split(/(\s+)/);
    tokens.forEach((token) => {
      const span = document.createElement('span');
      if (token.trim().length === 0) {
        span.className = 'hero-title-space';
      } else {
        span.className = 'hero-title-word';
      }
      span.textContent = token;
      node.appendChild(span);
    });
  }

  function initMagnetic() {
    document.querySelectorAll('.hero-button').forEach((item) => {
      item.classList.add('magnetic-target');
      item.addEventListener('mousemove', (event) => {
        const rect = item.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const radius = Math.min(rect.width, rect.height) * 0.45;
        if (distance < radius) {
          item.style.transform = `translate3d(${dx * 0.18}px, ${dy * 0.18}px, 0) scale(1.02)`;
        }
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
      });
    });
  }

  function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({
      scrollTrigger: {
        trigger: '.home-info',
        start: 'top 90%',
      },
    })
    .fromTo('.hero-eyebrow', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
    .fromTo('.hero-title-word', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.72, ease: 'power3.out', stagger: 0.08 }, '<0.08')
    .fromTo('.hero-subtitle', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.78, ease: 'power3.out' }, '<0.1')
    .fromTo('.hero-actions', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.72, ease: 'power3.out' }, '<0.1')
    .fromTo('.hero-footnote', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '<0.05')
    .fromTo('.hero-stats', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '<0.05')
    .fromTo('.hero-dashboard', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.78, ease: 'power3.out' }, '<0.08')
    .fromTo('.home-info .entry-footer', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '<0.05');

    gsap.utils.toArray('.post-entry').forEach((entry) => {
      entry.classList.add('anim-ready');
      gsap.fromTo(
        entry,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: entry, start: 'top 92%', toggleActions: 'play none none none' },
        }
      );
    });
  }

  const heroTitle = document.querySelector('.home-info h1');
  createWords(heroTitle);
  initMagnetic();
  window.addEventListener('load', initScrollReveal);
})();
