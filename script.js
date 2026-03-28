document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = document.body.classList.contains('home-page');
    let popupIsActive = false;

    /* =========================================
       0. STARTUP POPUP
       ========================================= */
    const startupPopup = document.getElementById('startupPopup');
    const startupPopupClose = document.getElementById('startupPopupClose');
    const startupPopupProgressBar = document.getElementById('startupPopupProgressBar');

    const popupEnabledOnPage = !document.body.classList.contains('contact-page');

    if (startupPopup && startupPopupClose && popupEnabledOnPage) {
        const popupAutoCloseMs = 8500;
        let popupAutoCloseTimer = null;

        function runPopupProgress() {
            if (!startupPopupProgressBar) return;

            startupPopupProgressBar.style.transition = 'none';
            startupPopupProgressBar.style.width = '0';

            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    startupPopupProgressBar.style.transition = `width ${popupAutoCloseMs}ms linear`;
                    startupPopupProgressBar.style.width = '100%';
                });
            });
        }

        function clearPopupAutoClose() {
            if (popupAutoCloseTimer) {
                window.clearTimeout(popupAutoCloseTimer);
                popupAutoCloseTimer = null;
            }
        }

        function showStartupPopup() {
            startupPopup.classList.add('is-visible');
            startupPopup.setAttribute('aria-hidden', 'false');
            document.body.classList.add('popup-open');
            popupIsActive = true;

            const liveSlides = document.querySelectorAll('.slide');
            if (liveSlides.length > 0) {
                liveSlides.forEach((slide) => slide.classList.remove('active'));
                liveSlides[0].classList.add('active');
                currentSlide = 0;
            }

            stopAutoPlay();

            clearPopupAutoClose();
            runPopupProgress();
            popupAutoCloseTimer = window.setTimeout(() => {
                hideStartupPopup();
            }, popupAutoCloseMs);
        }

        function hideStartupPopup() {
            clearPopupAutoClose();
            startupPopup.classList.remove('is-visible');
            startupPopup.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('popup-open');
            popupIsActive = false;

            if (slides.length > 0) {
                startAutoPlay();
            }
        }

        // Only auto-show popup on home page and only if not shown during this session
        const popupAutoShownThisSession = sessionStorage.getItem('popupAutoShownThisSession');
        const shouldShowPopup = isHomePage && !popupAutoShownThisSession;

        if (shouldShowPopup) {
            window.setTimeout(showStartupPopup, 300);
            // Mark that we've shown the popup during this session
            sessionStorage.setItem('popupAutoShownThisSession', 'true');
        }

        startupPopupClose.addEventListener('click', hideStartupPopup);

        startupPopup.addEventListener('click', (event) => {
            if (event.target === startupPopup) {
                hideStartupPopup();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && startupPopup.classList.contains('is-visible')) {
                hideStartupPopup();
            }
        });

        // Show popup when logo is clicked
        const logoLink = document.querySelector('.logo-link');
        if (logoLink) {
            logoLink.addEventListener('click', (event) => {
                // Only show popup if we're staying on the page (not navigating away)
                if (isHomePage) {
                    event.preventDefault();
                    if (!popupIsActive) {
                        showStartupPopup();
                    }
                }
                // If not on home page, allow normal navigation
            });
        }
    }

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
        if (popupIsActive) return;
        clearInterval(slideTimer);
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

    /* =========================================
       4. HOME PAGE AUTO REVEAL ANIMATIONS
       ========================================= */
    if (isHomePage) {
        const revealTargets = document.querySelectorAll(
            '.hero-slider-container, .services-strip-container, .service-box, .marquee-wrapper, .topper-card-pro, #about .about-content-center, #about .video-container-theme, .why-wrapper, .feature-item, .security-banner, .lab-gallery-container, .lab-item, #events .event-card, .enrollment-strip, .main-footer'
        );

        revealTargets.forEach((element, index) => {
            element.classList.add('auto-reveal');
            element.style.setProperty('--reveal-delay', `${Math.min(index * 60, 420)}ms`);
        });

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.14,
                rootMargin: '0px 0px -8% 0px'
            });

            revealTargets.forEach((element) => revealObserver.observe(element));
        } else {
            revealTargets.forEach((element) => element.classList.add('in-view'));
        }
    }

    /* =========================================
       5. HOME PAGE CUSTOM CURSOR ANIMATION
       ========================================= */
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (isHomePage && hasFinePointer && cursorDot && cursorRing) {
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let ringX = targetX;
        let ringY = targetY;

        document.body.classList.add('cursor-ready');

        function animateCursor() {
            ringX += (targetX - ringX) * 0.16;
            ringY += (targetY - ringY) * 0.16;

            cursorDot.style.left = `${targetX}px`;
            cursorDot.style.top = `${targetY}px`;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;

            window.requestAnimationFrame(animateCursor);
        }

        window.requestAnimationFrame(animateCursor);

        window.addEventListener('mousemove', (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
        });

        const interactiveElements = document.querySelectorAll('a, button, .service-box, .event-card, .btn-primary, .btn-admission-red, .btn-enroll');

        interactiveElements.forEach((element) => {
            element.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });

            element.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    /* =========================================
       6. CONTACT FORM EMAIL + PHONE VALIDATION
       ========================================= */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const phoneInput = contactForm.querySelector('input[name="phone"]');
        const emailRecipient = contactForm.dataset.recipientEmail || 'kaurga@gmail.com';

        function digitsOnly(value) {
            return value.replace(/\D/g, '');
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                phoneInput.value = digitsOnly(phoneInput.value).slice(0, 10);
                if (phoneInput.value.length === 10) {
                    phoneInput.setCustomValidity('');
                }
            });

            phoneInput.addEventListener('invalid', () => {
                phoneInput.setCustomValidity('Please enter exactly 10 digits for phone number.');
            });

            phoneInput.addEventListener('blur', () => {
                phoneInput.setCustomValidity('');
                if (digitsOnly(phoneInput.value).length !== 10) {
                    phoneInput.setCustomValidity('Please enter exactly 10 digits for phone number.');
                }
            });
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = (contactForm.querySelector('input[name="name"]')?.value || '').trim();
            const email = (contactForm.querySelector('input[name="email"]')?.value || '').trim();
            const phone = digitsOnly(contactForm.querySelector('input[name="phone"]')?.value || '');
            const message = (contactForm.querySelector('textarea[name="message"]')?.value || '').trim();

            if (phone.length !== 10) {
                if (phoneInput) {
                    phoneInput.setCustomValidity('Please enter exactly 10 digits for phone number.');
                    phoneInput.reportValidity();
                }
                return;
            }

            if (phoneInput) {
                phoneInput.setCustomValidity('');
            }

            const subject = encodeURIComponent(`Contact Form Query from ${name || 'Website Visitor'}`);
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone}\n\n` +
                `Message:\n${message}`
            );

            window.location.href = `mailto:${emailRecipient}?subject=${subject}&body=${body}`;
        });
    }

    /* =========================================
       7. TOPPER MODAL FUNCTIONALITY
       ========================================= */
    const seeAllButtons = document.querySelectorAll('.see-all-btn');
    
    seeAllButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal when close button is clicked
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach((closeBtn) => {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const modal = closeBtn.closest('.topper-modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal when clicking on overlay (outside content)
    const modals = document.querySelectorAll('.topper-modal-overlay');
    modals.forEach((modal) => {
        modal.addEventListener('click', (e) => {
            // Only close if clicking directly on overlay, not on content
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach((modal) => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });

});