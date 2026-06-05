/* ===== SCROLL PROGRESS ===== */
const sp = document.getElementById('sp');
window.addEventListener('scroll', () => {
  const s = document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  sp.style.width = (s / h * 100) + '%';
}, { passive: true });

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
const navAs = document.querySelectorAll('.nav-links a');
const sects = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  let cur = '';
  sects.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ===== HAMBURGER ===== */
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobileNav');
ham.addEventListener('click', () => {
  const open = ham.classList.toggle('open');
  mob.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mnl').forEach(a => {
  a.addEventListener('click', () => {
    ham.classList.remove('open'); mob.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ===== THEME TOGGLE ===== */
const themeBtn = document.getElementById('themeBtn');

const SVG_SUN = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  class="ico ico--sun" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
</svg>`;

const SVG_MOON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  class="ico ico--moon" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>`;

let isDark = false;
themeBtn.innerHTML = SVG_MOON;
themeBtn.setAttribute('aria-label', 'Switch to dark mode');

themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeBtn.innerHTML = isDark ? SVG_SUN : SVG_MOON;
  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
});

/* ===== SCROLL REVEAL ===== */
const revEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revEls.forEach(el => ro.observe(el));

/* ===== SKILL BARS ===== */
const fills = document.querySelectorAll('.bar-fill');
const bo = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; bo.unobserve(e.target); }
  });
}, { threshold: 0.3 });
fills.forEach(f => bo.observe(f));

/* ===== ACHIEVEMENT TIMELINE ===== */
const achItems = document.querySelectorAll('.ach-item');
const ao = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 100); ao.unobserve(e.target); }
  });
}, { threshold: 0.2 });
achItems.forEach(el => ao.observe(el));

/* ===== ANIMATED COUNTERS ===== */
function animCount(el) {
  const target = +el.dataset.target;
  const dur = 1600;
  const step = target / (dur / 16);
  let cur = 0;
  const timer = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = Math.floor(cur);
  }, 16);
}
const counters = document.querySelectorAll('.counter');
const co = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); co.unobserve(e.target); } });
}, { threshold: 0.5 });
counters.forEach(c => co.observe(c));

/* ===== BACK TO TOP ===== */
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 400), { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== CLEAN REFACTORED CONTACT FORM ===== */
const contactForm = document.getElementById('cform');
const successMessage = document.getElementById('fsuc');
const submitBtn = document.getElementById('fsub');

contactForm.addEventListener('submit', async function(e) {
  e.preventDefault(); // Stop standard page redirection layout refresh
  
  // Set UI state to sending safely
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  const formData = new FormData(contactForm);
  
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      // Message successfully reached Formspree
      submitBtn.style.display = 'none';
      successMessage.style.display = 'block'; 
      contactForm.reset(); 
    } else {
      // Something broke on the Formspree side
      alert("Oops! There was a configuration issue. Please double check your Formspree ID.");
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  } catch (error) {
    // Network failures
    alert("Network error. Please check your connection and try again.");
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ===== HERO ENTRANCE ===== */
window.addEventListener('load', () => {
  document.querySelectorAll('#home .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 180);
  });
});
