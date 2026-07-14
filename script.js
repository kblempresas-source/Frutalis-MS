/* ==========================================================================
   FRUTALIS — SCRIPT.JS (Vanilla JS, sem dependências)
   Organizado por módulos independentes, iniciados em DOMContentLoaded.
   ========================================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initHeader();
  initMobileNav();
  initSmoothAnchors();
  initRevealOnScroll();
  initRipple();
  renderProducts();
  renderGallery();
  initLightbox();
  renderTestimonials();
  initAccordion();
  initCounters();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   Ano dinâmico no rodapé
-------------------------------------------------------------------------- */
function setYear(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
   Header inteligente: encolhe e ganha sombra ao rolar
-------------------------------------------------------------------------- */
function initHeader(){
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // marca link ativo conforme a seção visível
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(sec => spy.observe(sec));
}

/* --------------------------------------------------------------------------
   Menu mobile (hamburger)
-------------------------------------------------------------------------- */
function initMobileNav(){
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll suave para âncoras (fallback consistente entre navegadores)
-------------------------------------------------------------------------- */
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('header').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* --------------------------------------------------------------------------
   Animações de entrada (fade + slide up) via IntersectionObserver
-------------------------------------------------------------------------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const delay = entry.target.getAttribute('data-reveal-delay');
        if (delay) entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => io.observe(item));
}

/* --------------------------------------------------------------------------
   Efeito Ripple nos botões
-------------------------------------------------------------------------- */
function initRipple(){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}

/* --------------------------------------------------------------------------
   DADOS: PRODUTOS
   (imagens de placeholder — substituir pelas fotos oficiais da Frutalis)
-------------------------------------------------------------------------- */
const PRODUCT_DATA = [
  { icon: '🍎', title: 'Frutas',                     desc: 'Selecionadas diariamente, no ponto ideal de sabor.', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=75' },
  { icon: '🥬', title: 'Verduras',                    desc: 'Folhas frescas e crocantes, colhidas com cuidado.',  img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=75' },
  { icon: '🥕', title: 'Legumes',                     desc: 'Qualidade e frescor para o dia a dia da sua cozinha.', img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=500&q=75' },
  { icon: '🌿', title: 'Temperos',                    desc: 'Ervas e temperos frescos para elevar suas receitas.', img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=500&q=75' },
  { icon: '🥚', title: 'Ovos',                        desc: 'Selecionados com procedência garantida.',            img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=500&q=75' },
  { icon: '🍣', title: 'Produtos Japoneses',          desc: 'O essencial da culinária japonesa, com procedência.', img: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=500&q=75' },
  { icon: '🍜', title: 'Macarrão Oriental',           desc: 'Variedades autênticas para pratos rápidos e saborosos.', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=75' },
  { icon: '🍘', title: 'Snacks Orientais',            desc: 'Petiscos autênticos para todos os momentos.',        img: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=500&q=75' },
  { icon: '🍶', title: 'Molhos Orientais',            desc: 'Shoyu, missô e muito mais para o seu tempero especial.', img: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?auto=format&fit=crop&w=500&q=75' },
  { icon: '🥤', title: 'Bebidas Orientais',           desc: 'Chás e refrigerantes exclusivos do universo asiático.', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=75' },
  { icon: '🧊', title: 'Congelados',                  desc: 'Praticidade sem abrir mão da qualidade.',            img: 'https://images.unsplash.com/photo-1584263347416-85a696b4eda7?auto=format&fit=crop&w=500&q=75' },
  { icon: '💪', title: 'Produtos Saudáveis',          desc: 'Opções naturais para uma rotina mais equilibrada.',  img: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=500&q=75' },
  { icon: '⏱️', title: 'Produtos Práticos',            desc: 'Soluções rápidas para o seu dia corrido.',           img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=500&q=75' },
  { icon: '🍱', title: 'Culinária Japonesa',          desc: 'Utensílios e ingredientes para pratos autênticos.',  img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=75' }
];

function renderProducts(){
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const html = PRODUCT_DATA.map((p, i) => `
    <article class="product-card reveal" data-reveal-delay="${(i % 4) * 60}">
      <div class="product-card__media">
        <img src="${p.img}" alt="${p.title} — Frutalis" loading="lazy" width="500" height="375">
        <span class="product-card__icon" aria-hidden="true">${p.icon}</span>
      </div>
      <div class="product-card__body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    </article>
  `).join('');

  grid.innerHTML = html;
  initRevealOnScroll(); // observa os cards recém-criados
}

/* --------------------------------------------------------------------------
   DADOS: GALERIA (masonry)
-------------------------------------------------------------------------- */
const GALLERY_DATA = [
  { img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=75', alt: 'Seleção de frutas frescas Frutalis', h: 380 },
  { img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=75', alt: 'Verduras frescas expostas', h: 460 },
  { img: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=600&q=75', alt: 'Legumes selecionados', h: 320 },
  { img: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=600&q=75', alt: 'Produtos japoneses em destaque', h: 420 },
  { img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=600&q=75', alt: 'Frutas tropicais selecionadas', h: 340 },
  { img: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=75', alt: 'Legumes coloridos e frescos', h: 400 },
  { img: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?auto=format&fit=crop&w=600&q=75', alt: 'Cesta de frutas Frutalis', h: 470 },
  { img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=75', alt: 'Culinária japonesa e ingredientes', h: 300 }
];

function renderGallery(){
  const wrap = document.getElementById('masonryGallery');
  if (!wrap) return;

  const html = GALLERY_DATA.map((g, i) => `
    <div class="masonry__item reveal" data-reveal-delay="${(i % 4) * 50}" data-index="${i}">
      <img src="${g.img}" alt="${g.alt}" loading="lazy" width="600" height="${g.h}">
    </div>
  `).join('');

  wrap.innerHTML = html;
  initRevealOnScroll();
}

/* --------------------------------------------------------------------------
   LIGHTBOX
-------------------------------------------------------------------------- */
function initLightbox(){
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const gallery = document.getElementById('masonryGallery');
  if (!lightbox || !gallery) return;

  let currentIndex = 0;

  const open = (index) => {
    currentIndex = index;
    const data = GALLERY_DATA[currentIndex];
    lightboxImg.src = data.img.replace('w=600', 'w=1400');
    lightboxImg.alt = data.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  const show = (delta) => {
    currentIndex = (currentIndex + delta + GALLERY_DATA.length) % GALLERY_DATA.length;
    open(currentIndex);
  };

  gallery.addEventListener('click', (e) => {
    const item = e.target.closest('.masonry__item');
    if (!item) return;
    open(Number(item.dataset.index));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(-1));
  nextBtn.addEventListener('click', () => show(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });
}

/* --------------------------------------------------------------------------
   DADOS: DEPOIMENTOS + SLIDER AUTOMÁTICO
-------------------------------------------------------------------------- */
const TESTIMONIALS_DATA = [
  {
    text: 'Desde que conheci a Frutalis não compro mais frutas em outro lugar. Chegam sempre no ponto certo e o atendimento pelo WhatsApp é super rápido.',
    name: 'Marina Souza',
    role: 'Cliente há 1 ano',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=75'
  },
  {
    text: 'Finalmente encontrei um hortifruti com produtos japoneses de verdade. O molho shoyu e o macarrão oriental são ótimos, e a entrega é sempre pontual.',
    name: 'Rafael Tanaka',
    role: 'Cliente frequente',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=75'
  },
  {
    text: 'A qualidade das verduras é visivelmente melhor. Peço toda semana pelo WhatsApp e em poucos minutos já está tudo combinado.',
    name: 'Camila Andrade',
    role: 'Cliente há 8 meses',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=75'
  },
  {
    text: 'Atendimento nota 10 e preços justos. Recomendo a Frutalis para quem quer praticidade sem abrir mão da qualidade.',
    name: 'João Pedro Lima',
    role: 'Cliente novo',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=75'
  }
];

function renderTestimonials(){
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!track || !dotsWrap) return;

  track.innerHTML = TESTIMONIALS_DATA.map(t => `
    <div class="testimonial-slide">
      <div class="testimonial-card">
        <span class="stars" aria-hidden="true">★★★★★</span>
        <p>"${t.text}"</p>
        <div class="testimonial-author">
          <img src="${t.photo}" alt="Foto de ${t.name}" loading="lazy" width="52" height="52">
          <div>
            <strong>${t.name}</strong>
            <span>${t.role}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  dotsWrap.innerHTML = TESTIMONIALS_DATA.map((_, i) =>
    `<button class="dot${i === 0 ? ' is-active' : ''}" aria-label="Ver depoimento ${i + 1}"></button>`
  ).join('');

  let current = 0;
  const dots = dotsWrap.querySelectorAll('.dot');
  const total = TESTIMONIALS_DATA.length;
  let timer;

  const goTo = (index) => {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  };

  const startAuto = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5500);
  };

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

  const testimonialsSection = document.getElementById('testimonials');
  testimonialsSection.addEventListener('mouseenter', () => clearInterval(timer));
  testimonialsSection.addEventListener('mouseleave', startAuto);

  goTo(0);
  startAuto();
}

/* --------------------------------------------------------------------------
   FAQ — Acordeão animado
-------------------------------------------------------------------------- */
function initAccordion(){
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      items.forEach(other => {
        other.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion__panel').style.maxHeight = null;
      });

      if (!isOpen){
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Contadores animados (badge do hero + seção de destaques)
-------------------------------------------------------------------------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = Number(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => io.observe(counter));
}

/* --------------------------------------------------------------------------
   Botão voltar ao topo
-------------------------------------------------------------------------- */
function initBackToTop(){
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
