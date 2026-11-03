(() => {
  'use strict';

  const systems = {
    doh: ['DOH integration', 'Healthcare application integration work across DOH-related workflows.', 'HEALTHCARE CONNECTIVITY', '01'],
    dha: ['DHA integration', 'Connecting healthcare applications with DHA-related integration workflows.', 'HEALTHCARE CONNECTIVITY', '02'],
    moh: ['MOH integration', 'Healthcare system integration work across MOH-related workflows.', 'HEALTHCARE CONNECTIVITY', '03'],
    pacs: ['PACS integration', 'Connecting clinical applications with picture archiving and communication systems for imaging workflows.', 'IMAGING CONNECTIVITY', '04'],
    lab: ['Laboratory integration', 'Connecting healthcare applications with laboratory systems and their clinical workflows.', 'LABORATORY CONNECTIVITY', '05']
  };
  const nodes = document.querySelectorAll('[data-system]');

  function selectSystem(key) {
    const system = systems[key];
    if (!system) return;
    nodes.forEach(node => {
      const selected = node.dataset.system === key;
      node.classList.toggle('selected', selected);
      node.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-path]').forEach(path => {
      path.classList.toggle('active', path.dataset.path === key);
    });
    document.getElementById('system-title').textContent = system[0];
    document.getElementById('system-description').textContent = system[1];
    document.querySelector('.detail-kicker').textContent = system[2];
    document.querySelector('.console-caption > span').textContent = system[3] + ' / 05';
  }

  nodes.forEach(node => node.addEventListener('click', () => selectSystem(node.dataset.system)));
  selectSystem('doh');

  const panel = document.getElementById('integration-console');
  const toggle = document.getElementById('view-toggle');
  const plane = document.getElementById('map-plane');
  const scene = document.getElementById('scene');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let is3D = true;
  let tiltFrame = 0;
  let pendingTilt = null;

  function resetTilt() {
    if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
    tiltFrame = 0;
    pendingTilt = null;
    plane.style.transform = '';
  }

  toggle.addEventListener('click', () => {
    is3D = !is3D;
    panel.classList.toggle('flat', !is3D);
    toggle.setAttribute('aria-pressed', String(is3D));
    toggle.textContent = is3D ? '3D view ↗' : 'Flat view ↔';
    resetTilt();
  });

  scene.addEventListener('pointermove', event => {
    if (!is3D || reducedMotion.matches || !finePointer.matches) return;
    const bounds = scene.getBoundingClientRect();
    pendingTilt = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5
    };
    if (tiltFrame) return;
    tiltFrame = window.requestAnimationFrame(() => {
      tiltFrame = 0;
      if (!pendingTilt) return;
      const { x, y } = pendingTilt;
      plane.style.transform = `rotateX(${24 - y * 8}deg) rotateY(${x * 8}deg) rotateZ(${-9 + x * 3}deg)`;
    });
  });
  scene.addEventListener('pointerleave', resetTilt);
  finePointer.addEventListener('change', resetTilt);

  const filters = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-category]');
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let visibleCount = 0;
    projects.forEach(project => {
      project.hidden = filter !== 'all' && project.dataset.category !== filter;
      if (!project.hidden) visibleCount++;
    });
    document.getElementById('filter-status').textContent =
      `Showing ${visibleCount}${filter === 'all' ? '' : ' ' + filter} projects.`;
  }));

  const navLinks = document.querySelectorAll('.main-nav a');
  if ('IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const current = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    ['overview', 'integrations', 'work', 'experience'].forEach(id => {
      const section = document.getElementById(id);
      if (section) navigationObserver.observe(section);
    });
  }

  const revealElements = document.querySelectorAll(
    '.section-heading, .integration-card, .project, .career-row, .skills-grid > div, .contact-panel'
  );
  let revealObserver;
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -20px 0px', threshold: 0.08 });
    revealElements.forEach(element => {
      element.classList.add('reveal');
      revealObserver.observe(element);
    });
  }

  reducedMotion.addEventListener('change', () => {
    resetTilt();
    if (reducedMotion.matches) {
      revealElements.forEach(element => element.classList.add('is-visible'));
      if (revealObserver) revealObserver.disconnect();
    }
  });

  const copyButton = document.getElementById('copy-email');
  const copyStatus = document.getElementById('copy-status');
  if (copyButton && copyStatus) {
    copyButton.addEventListener('click', async () => {
      copyButton.disabled = true;
      copyStatus.textContent = '';
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText('jibint88@gmail.com');
        copyStatus.textContent = 'Email address copied.';
      } catch {
        copyStatus.textContent = 'Please copy the email address: jibint88@gmail.com';
      } finally {
        copyButton.disabled = false;
      }
    });
  }
})();
