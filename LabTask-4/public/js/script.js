const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('.main-menu');
const menuLinks = document.querySelectorAll('.main-menu a');

if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mainMenu.classList.toggle('is-open');
        menuToggle.classList.toggle('is-active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// ===== Search Overlay Toggle =====
const searchToggle  = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose   = document.getElementById('searchClose');
const searchInput   = document.getElementById('searchInput');

if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('is-open');
        if (searchInput) searchInput.focus();
    });
}

if (searchClose && searchOverlay) {
    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('is-open');
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay) {
        searchOverlay.classList.remove('is-open');
    }
});