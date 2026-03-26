document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. HERO SLIDER LOGIC
       ========================================= */
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const sliderContainer = document.querySelector('.hero-slider-container');
    
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds per slide
    let slideTimer;

    // Function to show a specific slide
    function showSlide(index) {
        if (slides.length === 0) return; // Guard clause if no slides exist

        // Wrap around logic (Infinite loop)
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to the new current slide
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Event Listeners for Buttons (Check if buttons exist first)
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto Play Logic
    function startAutoPlay() {
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    function stopAutoPlay() {
        clearInterval(slideTimer);
    }

    // Start Auto Play on Load
    if (slides.length > 0) {
        startAutoPlay();
    }

    // Pause on Hover (So users can read the text)
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoPlay);
        sliderContainer.addEventListener('mouseleave', startAutoPlay);
    }

    /* =========================================
       2. MOBILE MENU TOGGLE (Updated for New Header)
       ========================================= */
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            // Toggle display flex/none
            if (mobileMenu.style.display === 'flex') {
                mobileMenu.style.display = 'none';
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            } else {
                mobileMenu.style.display = 'flex';
                hamburger.querySelector('i').classList.remove('fa-bars');
                hamburger.querySelector('i').classList.add('fa-times');
            }
        });

        // Close menu when clicking a link inside it
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    /* =========================================
       3. SMOOTH SCROLLING
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignore empty links

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});