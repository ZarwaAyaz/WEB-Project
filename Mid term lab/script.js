// ========== MOBILE MENU TOGGLE ==========
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

// ========== PRODUCT CAROUSEL (NEW PRODUCTS SECTION) ==========
$(document).ready(function() {
    
    // Update slide counter function
    function updateSlideCounter() {
        const carousel = $('.product-carousel');
        const currentSlide = carousel.slick('slickCurrentSlide') + 1;
        const totalSlides = carousel.slick('getSlick').slideCount; // FIXED: Using Slick's slideCount method
        
        $('.current-slide').text(currentSlide);
        $('.total-slides').text(totalSlides);
    }

    // Initialize Slick Carousel
    $('.product-carousel').slick({
        infinite: true,           // Infinite loop
        slidesToShow: 3,          // Show 3 cards on desktop
        slidesToScroll: 1,        // Scroll 1 card at a time
        autoplay: true,           // Enable auto-play
        autoplaySpeed: 5000,      // Auto-play every 5 seconds
        speed: 600,               // Smooth transition (600ms)
        arrows: false,            // Hide default arrows (we use custom buttons)
        dots: false,              // Hide dots
        pauseOnHover: false,      // Don't pause on carousel hover (we'll handle manually)
        responsive: [
            {
                breakpoint: 1024,  // Tablet
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,   // Mobile
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // FIXED: Update counter on initialization using 'init' event
    $('.product-carousel').on('init', function(event, slick) {
        updateSlideCounter();
    });

    // Update counter after slide change
    $('.product-carousel').on('afterChange', function(event, slick, currentSlide) {
        updateSlideCounter();
    });

    // Custom Previous Button
    $('.prev-btn').on('click', function() {
        $('.product-carousel').slick('slickPrev');
    });

    // Custom Next Button
    $('.next-btn').on('click', function() {
        $('.product-carousel').slick('slickNext');
    });

    // ========== AI-ENHANCED FEATURE: Pause on Product Card Hover ==========
    
    // Pause auto-play when hovering over ANY product card
    $('.product-carousel .product-card').on('mouseenter', function() {
        $('.product-carousel').slick('slickPause');
    });

    // Resume auto-play when mouse leaves the product card
    $('.product-carousel .product-card').on('mouseleave', function() {
        $('.product-carousel').slick('slickPlay');
    });
});