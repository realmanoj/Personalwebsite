/* ─────────────────────────────────────────────────────────────────────────────
   NAVIGATION — scroll shadow & active link tracking
───────────────────────────────────────────────────────────────────────────── */
const header   = document.getElementById('site-header');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('main section[id]');

function updateNav() {
  // Scrolled shadow
  header.classList.toggle('scrolled', window.scrollY > 10);

  // Active nav link based on scroll position
  let currentId = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === currentId);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE NAV TOGGLE
───────────────────────────────────────────────────────────────────────────── */
const navToggle  = document.getElementById('nav-toggle');
const navList    = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navList.classList.toggle('open', !expanded);
});

// Close mobile nav when a link is clicked
navList.addEventListener('click', e => {
  if (e.target.classList.contains('nav__link')) {
    navToggle.setAttribute('aria-expanded', 'false');
    navList.classList.remove('open');
  }
});

// Close mobile nav when clicking outside
document.addEventListener('click', e => {
  if (!header.contains(e.target)) {
    navToggle.setAttribute('aria-expanded', 'false');
    navList.classList.remove('open');
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS — Intersection Observer
───────────────────────────────────────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up:not(.hero .fade-up)');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT FORM — validation & simulated submit
───────────────────────────────────────────────────────────────────────────── */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

const validators = {
  name:    val => val.trim().length >= 2   ? '' : 'Please enter your full name.',
  email:   val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? '' : 'Please enter a valid email address.',
  message: val => val.trim().length >= 10  ? '' : 'Message must be at least 10 characters.',
};

function validateField(name, value) {
  const input = document.getElementById(name);
  const error = document.getElementById(`${name}-error`);
  const msg   = validators[name](value);

  input.classList.toggle('has-error', !!msg);
  error.textContent = msg;
  return !msg;
}

// Live validation on blur
['name', 'email', 'message'].forEach(fieldName => {
  const input = document.getElementById(fieldName);
  input.addEventListener('blur', () => validateField(fieldName, input.value));
  input.addEventListener('input', () => {
    if (input.classList.contains('has-error')) {
      validateField(fieldName, input.value);
    }
  });
});

form.addEventListener('submit', async e => {
  e.preventDefault();

  // Validate all fields
  const nameVal    = document.getElementById('name').value;
  const emailVal   = document.getElementById('email').value;
  const messageVal = document.getElementById('message').value;

  const validName    = validateField('name',    nameVal);
  const validEmail   = validateField('email',   emailVal);
  const validMessage = validateField('message', messageVal);

  if (!validName || !validEmail || !validMessage) return;

  // Loading state
  submitBtn.classList.add('btn--loading');
  submitBtn.disabled = true;

  // Simulate network request — replace this block with your real form handler
  // e.g. fetch('/api/contact', { method: 'POST', body: new FormData(form) })
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Success state
  submitBtn.classList.remove('btn--loading');
  successMsg.classList.add('visible');
  form.reset();
  submitBtn.disabled = false;

  // Hide success message after 6s
  setTimeout(() => successMsg.classList.remove('visible'), 6000);
});

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER — dynamic year
───────────────────────────────────────────────────────────────────────────── */
document.getElementById('footer-year').textContent = new Date().getFullYear();
