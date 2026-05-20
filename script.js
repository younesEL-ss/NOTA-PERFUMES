/* ══ NOTA PERFUMES — script.js ══════════════════════════════
   Main JavaScript: Cursor, Loader, Nav, Lang, Products,
   Why, Testimonials, Form, Animations
══════════════════════════════════════════════════════════ */

let lang = 'en';

const WA_NUMBER = '212779276395';

/* ══ CURSOR — only active on real pointer devices ══════════
   Disabled on touch / mobile to avoid lag or ghost elements
══════════════════════════════════════════════════════════ */
const isTouchDevice = () =>
  window.matchMedia('(hover: none)').matches ||
  window.matchMedia('(pointer: coarse)').matches;

const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (!isTouchDevice()) {
  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 85);
  });
  document.addEventListener('mousedown', () => {
    dot.style.width  = '16px';
    dot.style.height = '16px';
  });
  document.addEventListener('mouseup', () => {
    dot.style.width  = '9px';
    dot.style.height = '9px';
  });
}

/* ══ LOADER ════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  createSmoke();
  renderProducts();
  renderWhy();
  renderTestimonials();
  initReveal();
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 2700);
});

/* ══ SMOOTH SCROLL ═════════════════════════════════════════ */
function goto(e, id) {
  if (e && e.preventDefault) e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('.nav-item').forEach(a => {
    a.classList.toggle('active', a.href && a.href.includes('#' + id));
  });
}

/* ══ NAVBAR ════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const sc = window.scrollY;
  document.getElementById('navbar').classList.toggle('scrolled', sc > 60);
  document.getElementById('backTop').classList.toggle('hidden', sc < 400);
  document.getElementById('floats').classList.toggle('visible', sc > 400);
  ['home','collections','about','why','testimonials','social','contact'].forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) {
      document.querySelectorAll('.nav-item').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { passive: true });

/* ══ HAMBURGER ═════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
function closeMob() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

/* ══ LANGUAGE DROPDOWN ═════════════════════════════════════ */
const langTrigger = document.getElementById('langTrigger');
const langMenu    = document.getElementById('langMenu');
langTrigger.addEventListener('click', e => {
  e.stopPropagation();
  langTrigger.classList.toggle('open');
  langMenu.classList.toggle('open');
});
document.addEventListener('click', () => {
  langTrigger.classList.remove('open');
  langMenu.classList.remove('open');
});

function setLang(l) {
  lang = l;
  document.getElementById('activeLang').textContent = l.toUpperCase();
  langMenu.classList.remove('open');
  langTrigger.classList.remove('open');

  const isAr = l === 'ar';
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';
  document.documentElement.lang = l;

  const t = T[l];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  const lt = document.getElementById('loaderText');
  if (lt && t['loading']) lt.textContent = t['loading'];

  renderProducts();
  renderWhy();
  setTimeout(initReveal, 80);
}

/* ══ THEME ══════════════════════════════════════════════════ */
let dark = true;
document.getElementById('themeBtn').addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeIco').className = dark ? 'fa fa-sun' : 'fa fa-moon';
});

/* ══ SMOKE PARTICLES — skip on mobile for performance ══════ */
function createSmoke() {
  if (isTouchDevice()) return;
  const wrap = document.getElementById('smokeWrap');
  for (let i = 0; i < 14; i++) {
    const p  = document.createElement('div');
    p.className = 'sp';
    const sz = 16 + Math.random() * 36;
    const tx = (Math.random() - 0.5) * 80;
    const d  = (4 + Math.random() * 4).toFixed(1);
    const dl = (Math.random() * 6).toFixed(1);
    p.style.cssText = `
      width:${sz}px;height:${sz}px;
      left:${8 + i * 6.5}%;
      bottom:0;
      --tx:${tx}px;--d:${d}s;--dl:${dl}s;
    `;
    wrap.appendChild(p);
  }
}

/* ══ RENDER PRODUCTS ════════════════════════════════════════ */
function makeBottleSVG(c, i) {
  return `<svg viewBox="0 0 80 145" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <defs>
      <linearGradient id="pcg${i}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="${c}"      stop-opacity="0.95"/>
        <stop offset="55%"  stop-color="#f3d98a"   stop-opacity="0.70"/>
        <stop offset="100%" stop-color="#b8860b"   stop-opacity="0.90"/>
      </linearGradient>
    </defs>
    <rect x="33" y="3"  width="14" height="8"  rx="2" fill="${c}" opacity="0.9"/>
    <rect x="28" y="9"  width="24" height="13" rx="3" fill="url(#pcg${i})"/>
    <rect x="30" y="21" width="20" height="16" rx="2" fill="url(#pcg${i})"/>
    <path d="M12 40 Q10 55 10 80 Q10 115 40 122 Q70 115 70 80 Q70 55 68 40 Z" fill="url(#pcg${i})" opacity="0.88"/>
    <path d="M18 48 Q16 62 16 85" stroke="white" stroke-width="5" stroke-linecap="round" opacity="0.13"/>
    <rect x="18" y="65" width="44" height="38" rx="5" fill="rgba(8,8,8,0.26)"/>
    <text x="40" y="80" text-anchor="middle" fill="${c}" font-size="5.5" font-family="serif" font-weight="bold" letter-spacing="1.5">NOTA</text>
    <text x="40" y="89" text-anchor="middle" fill="${c}" font-size="4"   font-family="serif" opacity="0.7"  letter-spacing="1">PERFUMES</text>
    <ellipse cx="40" cy="121" rx="24" ry="5" fill="${c}" opacity="0.1"/>
  </svg>`;
}

function renderProducts() {
  const grid  = document.getElementById('productsGrid');
  const items = PRODUCTS[lang] || PRODUCTS.en;
  const t     = T[lang];
  grid.innerHTML = items.map((p, i) => `
    <div class="pc reveal-up" style="transition-delay:${i * 0.09}s">
      <div class="pc-img">
        ${p.badge ? `<div class="pc-badge">${p.badge}</div>` : ''}
        <div class="pc-glow" style="background:radial-gradient(circle,${p.c}22 0%,transparent 70%)"></div>
        <div class="pc-bottle">${makeBottleSVG(p.c, i)}</div>
        <div class="pc-stars">${'<i class="fas fa-star"></i>'.repeat(5)}</div>
      </div>
      <div class="pc-body">
        <h3 class="pc-name">${p.name}</h3>
        <p class="pc-desc">${p.desc}</p>
        <div class="pc-foot">
          <span class="pc-price">${p.price}</span>
          <div class="pc-acts">
            <button class="pc-ico" title="${t['products.view']||'Enquire'}" onclick="viewProduct('${p.name.replace(/'/g,"\\'")}','${p.price}')"><i class="fa fa-eye"></i></button>
            <button class="pc-cart" onclick="orderOnWhatsApp('${p.name.replace(/'/g,"\\'")}','${p.price}',this)">
              <i class="fab fa-whatsapp"></i>${t['products.add']||'Order Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  setTimeout(initReveal, 50);
}

/* ══ WHATSAPP ORDER ════════════════════════════════════════ */
function orderOnWhatsApp(productName, price, btn) {
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fa fa-check"></i> Redirecting...';
  btn.style.opacity = '0.8';

  const greetings = {
    en: `Hello! I'd like to order the following from Nota Perfumes:\n\n🌹 *${productName}*\n💰 Price: ${price}\n\nPlease let me know the payment and delivery details. Thank you!`,
    fr: `Bonjour ! Je souhaite commander chez Nota Perfumes :\n\n🌹 *${productName}*\n💰 Prix : ${price}\n\nMerci de m'indiquer les modalités de paiement et de livraison.`,
    ar: `مرحباً! أود الطلب من نوتا للعطور:\n\n🌹 *${productName}*\n💰 السعر: ${price}\n\nأرجو إعلامي بتفاصيل الدفع والتوصيل. شكراً!`
  };

  const message = greetings[lang] || greetings.en;
  const waURL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  setTimeout(() => {
    window.open(waURL, '_blank');
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.style.opacity = '';
    }, 1500);
  }, 400);
}

function viewProduct(productName, price) {
  const greetings = {
    en: `Hello! I'd like more information about:\n\n🌹 *${productName}*\n💰 Price: ${price}\n\nCould you tell me more about this fragrance?`,
    fr: `Bonjour ! J'aimerais plus d'informations sur :\n\n🌹 *${productName}*\n💰 Prix : ${price}\n\nPouvez-vous m'en dire plus sur cette fragrance ?`,
    ar: `مرحباً! أود الاستفسار عن:\n\n🌹 *${productName}*\n💰 السعر: ${price}\n\nهل يمكنك إخباري المزيد عن هذا العطر؟`
  };
  const message = greetings[lang] || greetings.en;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

/* ══ RENDER WHY ════════════════════════════════════════════ */
function renderWhy() {
  const grid  = document.getElementById('whyGrid');
  const items = WHY[lang] || WHY.en;
  grid.innerHTML = items.map((w, i) => `
    <div class="why-card reveal-up" style="transition-delay:${i * 0.09}s">
      <div class="why-ico"><i class="fa ${w.ico}"></i></div>
      <h3 class="why-title">${w.title}</h3>
      <p class="why-desc">${w.desc}</p>
    </div>
  `).join('');
  setTimeout(initReveal, 50);
}

/* ══ RENDER TESTIMONIALS ════════════════════════════════════ */
function renderTestimonials() {
  const grid = document.getElementById('testGrid');
  grid.innerHTML = TESTIMONIALS.map((r, i) => `
    <div class="tc reveal-up" style="transition-delay:${i * 0.1}s">
      <div class="tc-q">"</div>
      <p class="tc-text">${r.text}</p>
      <div class="tc-foot">
        <div class="tc-av">${r.av}</div>
        <div>
          <div class="tc-name">${r.name}</div>
          <div class="tc-loc">${r.loc}</div>
          <div class="tc-stars">${'<i class="fas fa-star"></i>'.repeat(5)}</div>
        </div>
      </div>
    </div>
  `).join('');
  setTimeout(initReveal, 50);
}

/* ══ SCROLL REVEAL ══════════════════════════════════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => {
    if (!el.classList.contains('visible')) obs.observe(el);
  });
}

/* ══ CONTACT FORM ═══════════════════════════════════════════ */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const t      = T[lang];
  const inputs = e.target.querySelectorAll('[required]');
  let valid    = true;

  inputs.forEach(inp => {
    const err = inp.parentElement.querySelector('.ferr');
    if (!inp.value.trim()) {
      inp.classList.add('err');
      if (err) err.textContent = 'This field is required';
      valid = false;
    } else if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) {
      inp.classList.add('err');
      if (err) err.textContent = 'Please enter a valid email';
      valid = false;
    } else {
      inp.classList.remove('err');
      if (err) err.textContent = '';
    }
  });

  if (!valid) return;

  const btn  = document.getElementById('submitBtn');
  const span = btn.querySelector('span');
  span.textContent = t['con.sending'] || 'Sending...';
  btn.disabled     = true;

  setTimeout(() => {
    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('formOk').classList.remove('hidden');
    const h3 = document.querySelector('#formOk h3');
    const p  = document.querySelector('#formOk p');
    if (h3 && t['con.sent'])  h3.textContent = t['con.sent'];
    if (p  && t['con.reply']) p.textContent  = t['con.reply'];
  }, 1800);
});

/* ══ NEWSLETTER ═════════════════════════════════════════════ */
document.getElementById('newsForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('newsForm').classList.add('hidden');
  const ok = document.getElementById('newsOk');
  ok.classList.remove('hidden');
  ok.textContent = T[lang]['ft.subscribed'] || '✨ Subscribed!';
});

/* ══ INPUT LIVE VALIDATION ══════════════════════════════════ */
document.querySelectorAll('.fi[required]').forEach(inp => {
  inp.addEventListener('input', () => {
    const err = inp.parentElement.querySelector('.ferr');
    inp.classList.remove('err');
    if (err) err.textContent = '';
  });
});
