const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower && !prefersReducedMotion && !isTouchDevice) {
    document.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;

        setTimeout(() => {
            cursorFollower.style.left = `${event.clientX}px`;
            cursorFollower.style.top = `${event.clientY}px`;
        }, 100);
    });
} else {
    if (cursor) cursor.style.display = 'none';
    if (cursorFollower) cursorFollower.style.display = 'none';
}

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

function setMenuState(isOpen) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        setMenuState(!isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false);
        }
    });
}

const navbar = document.querySelector('.navbar');
const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

smoothScrollLinks.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 8;

        window.scrollTo({
            top: targetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
});

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });

    document.querySelectorAll('section').forEach((section) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(24px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
}

window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 100
        ? '0 10px 30px -10px rgba(2, 12, 27, 0.9)'
        : '0 10px 30px -10px rgba(2, 12, 27, 0.7)';
});

const profilePhoto = document.getElementById('profilePhoto');
const profilePlaceholder = document.getElementById('profilePlaceholder');

if (profilePhoto && profilePlaceholder) {
    const showPhotoIfAvailable = () => {
        if (profilePhoto.naturalWidth > 0) {
            profilePhoto.classList.add('loaded');
            profilePlaceholder.style.display = 'none';
        } else {
            profilePhoto.classList.remove('loaded');
            profilePlaceholder.style.display = 'flex';
        }
    };

    profilePhoto.addEventListener('load', showPhotoIfAvailable);

    profilePhoto.addEventListener('error', () => {
        profilePhoto.classList.remove('loaded');
        profilePlaceholder.style.display = 'flex';
    });

    if (profilePhoto.complete) {
        showPhotoIfAvailable();
    }
}
