/* =========================================================
   Zé dos Parafusos — Landing Page (JS)
   ========================================================= */

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Logo e mascote (img/logo.png e img/ze.png) ---------- */
  // Se a imagem existir, ela substitui o logo/parafuso em SVG; se não, a <img> é removida.
  const useImage = (img, onOk) => {
    const ok = () => onOk();
    const fail = () => img.remove();
    if (img.complete) { img.naturalWidth ? ok() : fail(); }
    else { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', fail, { once: true }); }
  };
  $$('.logo__img').forEach(img => useImage(img, () => img.closest('.logo').classList.add('has-img')));
  const mascot = $('.mascot');
  if (mascot) useImage(mascot, () => mascot.parentElement.classList.add('has-mascot'));

  /* ---------- Dados dos produtos ---------- */
  // Fotos ilustrativas: Wikimedia Commons (créditos em creditos.html)
  const catLabel = { fixacao: 'Fixação', abrasivos: 'Abrasivos', epis: 'EPIs', ferramentas: 'Ferramentas' };

  const products = [
    { cat: 'fixacao',     img: 'parafusos',             title: 'Parafusos',                  desc: 'Sextavados, Allen, autoatarrachantes, drywall, madeira e muito mais.', tags: ['Inox', 'Zincado', 'Aço carbono'] },
    { cat: 'fixacao',     img: 'porcas-arruelas',       title: 'Porcas e Arruelas',          desc: 'Porcas sextavadas, travantes, borboleta e arruelas lisas e de pressão.', tags: ['Métrica', 'Polegada'] },
    { cat: 'fixacao',     img: 'bucha-chumbadores.webp', zoom: 'object-fit: contain; background: #fff; padding: 8px 0', title: 'Buchas e Chumbadores',       desc: 'Fixação segura em concreto, alvenaria, drywall e estruturas metálicas.', tags: ['Nylon', 'Parabolt', 'Química'] },
    { cat: 'fixacao',     img: 'rebites',               title: 'Rebites',                    desc: 'Rebites de repuxo e estruturais em alumínio, aço e inox.', tags: ['Repuxo', 'Rosca'] },
    { cat: 'abrasivos',   img: 'discos',                title: 'Discos de Corte e Desbaste', desc: 'Discos para metal, inox, pedra e madeira, para todas as medidas de esmerilhadeira.', tags: ['4.1/2"', '7"', 'Flap'] },
    { cat: 'abrasivos',   img: 'lixas',                 title: 'Lixas e Rebolos',            desc: 'Lixas em folha, rolo e disco, rebolos e escovas de aço para acabamento.', tags: ['Ferro', 'Madeira', 'Água'] },
    { cat: 'epis',        img: 'capacete.jpg', zoom: 'object-fit: contain; background: #fff; padding: 14px 0', title: 'Capacetes e Óculos',         desc: 'Capacetes, óculos de proteção, protetores faciais e auriculares.', tags: ['Com CA', 'NR-6'] },
    { cat: 'epis',        img: 'luvas-calcados.jpeg', title: 'Luvas e Calçados',           desc: 'Luvas de vaqueta, nitrílica, anticorte, botinas e calçados de segurança.', tags: ['Com CA', 'Anticorte'] },
    { cat: 'ferramentas', img: 'ferramentas-manuais',   title: 'Ferramentas Manuais',        desc: 'Chaves, alicates, martelos, jogos de soquetes e ferramentas de medição.', tags: ['Profissional', 'Kits'] },
    { cat: 'ferramentas', img: 'parafusadeira.jpg', zoom: 'object-position: 35% 50%', title: 'Ferramentas Elétricas',      desc: 'Furadeiras, parafusadeiras, esmerilhadeiras e serras das melhores marcas.', tags: ['Bateria', '127/220V'] },
    { cat: 'ferramentas', img: 'brocas',                title: 'Brocas e Acessórios',        desc: 'Brocas para aço, concreto e madeira, bits, serras-copo e mandris.', tags: ['HSS', 'SDS', 'Vídea'] },
  ];

  /* ---------- Render dos produtos ---------- */
  const productsEl = $('#products');
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  productsEl.innerHTML = products.map(p => `
    <article class="product reveal" data-cat="${p.cat}">
      <div class="product__media">
        <span class="product__cat">${catLabel[p.cat]}</span>
        <img src="img/produtos/${p.img.includes('.') ? p.img : `${p.img}.jpg`}" alt="${p.title}" loading="lazy" width="640" height="400"${p.zoom ? ` style="${p.zoom}"` : ''} />
      </div>
      <div class="product__body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="product__tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <a href="#contato" class="product__link" data-interest="${p.cat}">Pedir orçamento ${arrow}</a>
      </div>
    </article>
  `).join('');

  /* ---------- Filtro de produtos ---------- */
  const filters = $$('.filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filters.forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on);
      });
      let i = 0;
      $$('.product', productsEl).forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('is-hidden', !show);
        card.classList.remove('is-entering');
        if (show) {
          card.classList.add('visible');
          void card.offsetWidth; // reinicia a animação
          card.style.animationDelay = `${i++ * 60}ms`;
          card.classList.add('is-entering');
        }
      });
    });
  });

  /* Clique em "Pedir orçamento" de um produto pré-seleciona o interesse */
  const interestMap = { fixacao: 'Parafusos e fixadores', abrasivos: 'Abrasivos', epis: 'EPIs', ferramentas: 'Ferramentas' };
  productsEl.addEventListener('click', e => {
    const link = e.target.closest('[data-interest]');
    if (link) $('#categoria').value = interestMap[link.dataset.interest] || 'Outros';
  });

  /* ---------- Header: scroll, menu mobile, link ativo ---------- */
  const header = $('#header');
  const nav = $('#nav');
  const toggle = $('#menuToggle');
  const backdrop = $('#navBackdrop');
  const backToTop = $('#backToTop');

  const setMenu = open => {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  backdrop.addEventListener('click', () => setMenu(false));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    backToTop.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

  /* Indicador amarelo que desliza entre os itens do menu (desktop) */
  const navList = $('.nav__list');
  const indicator = $('.nav__indicator');
  const navLinks = $$('.nav__link');

  const moveIndicator = link => {
    navLinks.forEach(l => l.classList.toggle('is-lit', l === link));
    if (!link || !link.offsetWidth) return;
    indicator.style.setProperty('--ind-x', `${link.offsetLeft}px`);
    indicator.style.setProperty('--ind-w', `${link.offsetWidth}px`);
    indicator.classList.add('ready');
  };
  const activeLink = () => navLinks.find(l => l.classList.contains('active'));

  navLinks.forEach(l => l.addEventListener('mouseenter', () => moveIndicator(l)));
  navList.addEventListener('mouseleave', () => moveIndicator(activeLink()));
  window.addEventListener('resize', () => moveIndicator(activeLink()));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => moveIndicator(activeLink()));
  moveIndicator(activeLink());

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
      if (!navList.matches(':hover')) moveIndicator(activeLink());
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(l => {
    const sec = $(l.getAttribute('href'));
    if (sec) sectionObserver.observe(sec);
  });

  /* ---------- Cursor: sombra/luz que segue o ponteiro ---------- */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (finePointer && !reducedMotion) {
    const body = document.body;
    const glow = $('.cursor-glow');
    body.classList.add('has-cursor');

    let mx = innerWidth / 2, my = innerHeight / 2;   // posição real do mouse
    let gx = mx, gy = my;                            // posição suavizada (efeito de rastro)

    window.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      body.classList.add('cursor-visible');
    }, { passive: true });
    document.addEventListener('pointerleave', () => body.classList.remove('cursor-visible'));
    window.addEventListener('blur', () => body.classList.remove('cursor-visible'));

    const tick = () => {
      gx += (mx - gx) * 0.1; gy += (my - gy) * 0.1;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Animação de entrada (reveal) ---------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transitionDelay = `${el.dataset.delay || 0}ms`;
      el.classList.add('visible');
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Slider de depoimentos ---------- */
  const track = $('#testimonialsTrack');
  const dotsEl = $('#testimonialsDots');
  const slides = $$('.testimonial', track);
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsEl.appendChild(dot);
  });
  const dots = $$('button', dotsEl);

  const goTo = i => {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 5000); };

  // Swipe no mobile
  let touchX = null;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); restart(); }
    touchX = null;
  });
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', restart);

  goTo(0);
  restart();

  /* ---------- Formulário ---------- */
  const form = $('#contactForm');
  const phone = $('#telefone');
  const success = $('#formSuccess');

  phone.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 6) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    phone.value = out;
  });

  const rules = {
    nome:     v => v.trim().length >= 2 || 'Informe seu nome.',
    telefone: v => v.replace(/\D/g, '').length >= 10 || 'Informe um telefone válido.',
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Informe um e-mail válido.',
    mensagem: v => v.trim().length >= 5 || 'Conte um pouco do que você precisa.',
  };

  const validateField = input => {
    const rule = rules[input.name];
    if (!rule) return true;
    const result = rule(input.value);
    const field = input.closest('.field');
    const ok = result === true;
    field.classList.toggle('invalid', !ok);
    $('.field__error', field).textContent = ok ? '' : result;
    return ok;
  };

  Object.keys(rules).forEach(name => {
    const input = form.elements[name];
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => input.closest('.field').classList.contains('invalid') && validateField(input));
  });

  /* Envia o orçamento para o WhatsApp da loja com os dados preenchidos */
  const WHATSAPP_NUMBER = '5548996625001';

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = Object.keys(rules).map(n => form.elements[n]);
    const valid = inputs.map(validateField).every(Boolean);
    if (!valid) {
      inputs.find(i => i.closest('.field').classList.contains('invalid'))?.focus();
      return;
    }

    const v = name => form.elements[name].value.trim();
    const message = [
      '*Pedido de orçamento - Site Zé dos Parafusos*',
      '',
      `*Nome:* ${v('nome')}`,
      `*Telefone:* ${v('telefone')}`,
      `*E-mail:* ${v('email')}`,
      `*Interesse:* ${v('categoria')}`,
      '',
      '*Itens / mensagem:*',
      v('mensagem'),
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // se o navegador bloquear a nova aba

    success.textContent = '✔ Abrimos o WhatsApp com seu pedido. É só tocar em enviar!';
    setTimeout(() => { success.textContent = ''; }, 8000);
    form.reset();
  });

})();
