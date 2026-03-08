// ===================== ICONS =====================
lucide.createIcons();

// ===================== CURSOR GLOW =====================
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
});

// ===================== DARK MODE TOGGLE =====================
const darkInput = document.getElementById('dark-toggle-input');

function applyTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    darkInput.checked = isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

applyTheme(localStorage.getItem('theme') === 'dark');
darkInput.addEventListener('change', () => applyTheme(darkInput.checked));

// ===================== CONFIG / SDK =====================
const defaultConfig = {
    hero_name:        'Sabeen Ahmad',
    hero_title:       'Mobile Application Developer & UI/UX Designer',
    hero_tagline:     'Creating elegant, functional digital experiences that solve real problems and inspire users.',
    about_text:       `I'm a student and aspiring mobile app developer. Over the past year, I've focused on building Flutter applications, exploring Firebase integration, and improving my UI/UX design skills. I enjoy creating apps that are simple, functional, and user-friendly, and I'm always eager to learn new technologies and take on challenges.`,
    contact_email:    'sabeenahmaddev@gmail.com',
    contact_location: 'Nankana Sahib, Pakistan',
    font_family:      'Inter',
    font_size:        16
};
let config = { ...defaultConfig };

async function onConfigChange(c) {
    config = { ...config, ...c };
    document.getElementById('hero-name').textContent        = config.hero_name        || defaultConfig.hero_name;
    document.getElementById('hero-title').textContent       = config.hero_title       || defaultConfig.hero_title;
    document.getElementById('hero-tagline').textContent     = config.hero_tagline     || defaultConfig.hero_tagline;
    document.getElementById('about-text').textContent       = config.about_text       || defaultConfig.about_text;
    document.getElementById('contact-email').textContent    = config.contact_email    || defaultConfig.contact_email;
    document.getElementById('contact-location').textContent = config.contact_location || defaultConfig.contact_location;
    document.body.style.fontFamily           = `${config.font_family || defaultConfig.font_family}, sans-serif`;
    document.documentElement.style.fontSize  = `${config.font_size   || defaultConfig.font_size}px`;
}

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities: (cfg) => ({
            recolorables: [],
            borderables:  [],
            fontEditable: {
                get: () => cfg.font_family || defaultConfig.font_family,
                set: v  => window.elementSdk.setConfig({ font_family: v })
            },
            fontSizeable: {
                get: () => cfg.font_size || defaultConfig.font_size,
                set: v  => window.elementSdk.setConfig({ font_size: v })
            }
        }),
        mapToEditPanelValues: (cfg) => new Map([
            ['hero_name',        cfg.hero_name        || defaultConfig.hero_name],
            ['hero_title',       cfg.hero_title       || defaultConfig.hero_title],
            ['hero_tagline',     cfg.hero_tagline     || defaultConfig.hero_tagline],
            ['about_text',       cfg.about_text       || defaultConfig.about_text],
            ['contact_email',    cfg.contact_email    || defaultConfig.contact_email],
            ['contact_location', cfg.contact_location || defaultConfig.contact_location],
        ])
    });
}

// ===================== MOBILE MENU =====================
const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
const closeMenuBtn   = document.getElementById('close-menu-btn');
const mobileMenu     = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
});
closeMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
});
mobileNavLinks.forEach(l => l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
}));

// ===================== SCROLL REVEAL =====================
const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
const revealObserver  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            if (e.target.dataset.skillTarget) {
                const fill = document.getElementById(e.target.dataset.skillTarget);
                if (fill) setTimeout(() => fill.classList.add('animated'), 200);
            }
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(revealSelectors).forEach(el => revealObserver.observe(el));

// ===================== SKILL BARS =====================
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.setProperty('--tw', bar.dataset.width);
});

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('animated'), 300);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-bar-fill').forEach(bar => skillObserver.observe(bar));

// ===================== TAG BADGE STAGGER =====================
document.querySelectorAll('.tag-badge').forEach((badge, i) => {
    badge.style.animationDelay = `${0.08 * i + 0.3}s`;
});

// ===================== STAT COUNTER ANIMATION =====================
function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 1400;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting && !e.target.dataset.counted) {
            e.target.dataset.counted = true;
            const target = parseInt(e.target.dataset.count);
            const suffix = e.target.dataset.suffix || '';
            animateCounter(e.target, target, suffix);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

// ===================== ACTIVE NAV =====================
const sections = document.querySelectorAll('section');
const navLinks  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const id = e.target.getAttribute('id');
            navLinks.forEach(l => {
                l.classList.remove('nav-active');
                if (l.getAttribute('href') === `#${id}`) l.classList.add('nav-active');
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(s => navObserver.observe(s));

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===================== INITIAL CONFIG =====================
onConfigChange(config);

// ===================== CONTACT MODAL =====================
const modal          = document.getElementById('contact-modal');
const openBtn        = document.getElementById('open-contact-modal');
const closeBtn       = document.getElementById('close-contact-modal');
const sendBtn        = document.getElementById('send-msg-btn');
const sendLabel      = document.getElementById('send-label');
const sendSpinner    = document.getElementById('send-spinner');
const formWrap       = document.getElementById('contact-form-wrap');
const successWrap    = document.getElementById('contact-success');
const sendAnotherBtn = document.getElementById('send-another-btn');

function openModal() {
    modal.classList.remove('closing');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeModal() {
    modal.classList.add('closing');
    modal.addEventListener('animationend', () => {
        modal.classList.remove('open', 'closing');
        document.body.style.overflow = '';
    }, { once: true });
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);

// Close on backdrop click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ===================== FORM VALIDATION =====================
function validate() {
    let ok = true;
    const fields = [
        { id: 'f-name',    errId: 'err-name',    msg: 'Please enter your name.' },
        { id: 'f-email',   errId: 'err-email',   msg: 'Please enter a valid email.', isEmail: true },
        { id: 'f-subject', errId: 'err-subject', msg: 'Please enter a subject.' },
        { id: 'f-message', errId: 'err-message', msg: 'Please write a message.' },
    ];

    fields.forEach(f => {
        const el  = document.getElementById(f.id);
        const err = document.getElementById(f.errId);
        const val = el.value.trim();
        let msg   = '';

        if (!val) {
            msg = f.msg;
        } else if (f.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            msg = 'Please enter a valid email address.';
        }

        err.textContent = msg;
        el.classList.toggle('error', !!msg);
        if (msg) ok = false;
    });

    return ok;
}

// Clear errors on input
['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        document.getElementById(id).classList.remove('error');
        const errEl = document.getElementById('err-' + id.replace('f-', ''));
        if (errEl) errEl.textContent = '';
    });
});

// ===================== SEND HANDLER =====================
sendBtn.addEventListener('click', () => {
    if (!validate()) return;

    sendLabel.classList.add('hidden');
    sendSpinner.classList.remove('hidden');
    sendBtn.disabled = true;

    const name    = document.getElementById('f-name').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const subject = document.getElementById('f-subject').value.trim();
    const message = document.getElementById('f-message').value.trim();

    fetch('https://formspree.io/f/maqpnwqe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify({ name, email, subject, message })
    })
    .then(res => res.ok ? res.json() : res.json().then(d => Promise.reject(d)))
    .then(() => {
        formWrap.classList.add('hidden');
        successWrap.classList.remove('hidden');
        lucide.createIcons();
    })
    .catch(err => {
        alert(err?.errors?.[0]?.message || 'Something went wrong. Please try again.');
    })
    .finally(() => {
        sendLabel.classList.remove('hidden');
        sendSpinner.classList.add('hidden');
        sendBtn.disabled = false;
    });
});

// ===================== SEND ANOTHER =====================
sendAnotherBtn.addEventListener('click', () => {
    successWrap.classList.add('hidden');
    formWrap.classList.remove('hidden');
    ['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => {
        document.getElementById(id).value = '';
        document.getElementById(id).classList.remove('error');
    });
    ['err-name', 'err-email', 'err-subject', 'err-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });
});