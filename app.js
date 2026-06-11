/**
 * Priyavratt Sharma Portfolio - Client Interactions
 * Implements typewriter effect, mobile navbar, project filters, stats counter,
 * scroll reveal, interactive welcoming avatar widget with Speech Synthesis,
 * a fab mouse-trailing custom cursor, and dynamic 3D mouse parallax on the hero banner.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. CUSTOM MOUSE FOLLOWER CURSOR (FAB INTERACTION)
    // ==========================================================================
    const initCustomCursor = () => {
        // Create cursor elements dynamically
        const cursorDot = document.createElement('div');
        cursorDot.className = 'custom-cursor-dot';
        const cursorOutline = document.createElement('div');
        cursorOutline.className = 'custom-cursor-outline';
        
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let cursorVisible = false;

        // Position tracking
        window.addEventListener('mousemove', (e) => {
            if (!cursorVisible) {
                cursorDot.style.opacity = '1';
                cursorOutline.style.opacity = '1';
                cursorVisible = true;
            }
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot moves instantly
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        });

        // Loop to interpolate trailing circle smoothly
        const updateCursor = () => {
            // Lerp formula: current + (target - current) * interpolationFactor
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
            requestAnimationFrame(updateCursor);
        };
        requestAnimationFrame(updateCursor);

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
            cursorVisible = false;
        });

        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
            cursorVisible = true;
        });

        // Event delegation for interactive element hover scaling
        const interactiveSelector = 'a, button, input, textarea, select, .project-card, .filter-btn, .avatar-trigger, .avatar-action-btn, .logo, .contact-link';
        
        window.addEventListener('mouseover', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                cursorDot.classList.add('custom-cursor-hover');
                cursorOutline.classList.add('custom-cursor-hover');
                
                // Turn cursor green when hovering WhatsApp components
                if (target.closest('.btn-whatsapp, .btn-whatsapp-nav, .contact-whatsapp, [data-action="whatsapp"]')) {
                    cursorOutline.classList.add('cursor-whatsapp-hover');
                    cursorDot.classList.add('cursor-whatsapp-hover');
                }
            }
        });

        window.addEventListener('mouseout', (e) => {
            const target = e.target.closest(interactiveSelector);
            if (target) {
                const relatedTarget = e.relatedTarget ? e.relatedTarget.closest(interactiveSelector) : null;
                if (!relatedTarget) {
                    cursorDot.classList.remove('custom-cursor-hover', 'cursor-whatsapp-hover');
                    cursorOutline.classList.remove('custom-cursor-hover', 'cursor-whatsapp-hover');
                } else if (!relatedTarget.closest('.btn-whatsapp, .btn-whatsapp-nav, .contact-whatsapp, [data-action="whatsapp"]')) {
                    cursorOutline.classList.remove('cursor-whatsapp-hover');
                    cursorDot.classList.remove('cursor-whatsapp-hover');
                }
            }
        });

        // Click effects
        window.addEventListener('mousedown', () => {
            cursorDot.classList.add('custom-cursor-click');
            cursorOutline.classList.add('custom-cursor-click');
        });

        window.addEventListener('mouseup', () => {
            cursorDot.classList.remove('custom-cursor-click');
            cursorOutline.classList.remove('custom-cursor-click');
        });
    };

    // Check media query capabilities to only enable custom cursor on desktop pointer devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        initCustomCursor();
    }

    // ==========================================================================
    // 2. HERO BANNER INTERACTIVE 3D TILT & PARALLAX
    // ==========================================================================
    const initHeroParallax = () => {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        // Programmatically inject interactive coding glyphs behind content
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'hero-shapes';
        shapesContainer.innerHTML = `
            <div class="hero-shape shape-1" data-speed="0.05">&lt;/&gt;</div>
            <div class="hero-shape shape-2" data-speed="-0.04">{ }</div>
            <div class="hero-shape shape-3" data-speed="0.03">[ ]</div>
            <div class="hero-shape shape-4" data-speed="-0.03">f(x)</div>
            <div class="hero-shape shape-5" data-speed="0.06">TA</div>
        `;
        heroSection.appendChild(shapesContainer);

        const heroCard = document.querySelector('.hero-card-glow');
        const shapes = document.querySelectorAll('.hero-shape');
        const bgGlow1 = document.querySelector('.bg-glow-1');
        const bgGlow2 = document.querySelector('.bg-glow-2');

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            // Normalized coordinates: center of hero section is (0, 0)
            const relX = e.clientX - (rect.left + rect.width / 2);
            const relY = e.clientY - (rect.top + rect.height / 2);

            // 1. Move background code shapes with depth coordinates
            shapes.forEach(shape => {
                const speed = parseFloat(shape.getAttribute('data-speed')) || 0.04;
                const x = relX * speed;
                const y = relY * speed;
                shape.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });

            // 2. Soft parallax translate on background radial glows
            if (bgGlow1) bgGlow1.style.transform = `translate3d(${relX * 0.06}px, ${relY * 0.06}px, 0)`;
            if (bgGlow2) bgGlow2.style.transform = `translate3d(${relX * -0.06}px, ${relY * -0.06}px, 0)`;

            // 3. 3D holographic tilt on the hero avatar card glow frame
            if (heroCard) {
                const cardRect = heroCard.getBoundingClientRect();
                const cardX = e.clientX - (cardRect.left + cardRect.width / 2);
                const cardY = e.clientY - (cardRect.top + cardRect.height / 2);
                
                // Max degrees of rotation
                const rotateX = -(cardY / cardRect.height) * 15;
                const rotateY = (cardX / cardRect.width) * 15;
                
                heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            }
        });

        // Reset transforms when mouse leaves hero bounds
        heroSection.addEventListener('mouseleave', () => {
            shapes.forEach(shape => {
                shape.style.transform = 'translate3d(0, 0, 0)';
            });
            if (bgGlow1) bgGlow1.style.transform = 'translate3d(0, 0, 0)';
            if (bgGlow2) bgGlow2.style.transform = 'translate3d(0, 0, 0)';
            if (heroCard) {
                heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            }
        });
    };
    initHeroParallax();

    // ==========================================================================
    // 3. HERO TYPEWRITER ANIMS
    // ==========================================================================
    const initTypewriter = () => {
        const typewriterEl = document.getElementById('typewriter');
        if (!typewriterEl) return;

        const roles = [
            "Data Analyst",
            "Talent Sourcing Specialist",
            "Python Developer",
            "HR Tech Innovator"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at complete word
                typingSpeed = 1600;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400;
            }

            setTimeout(type, typingSpeed);
        };
        type();
    };
    initTypewriter();

    // ==========================================================================
    // 4. MOBILE NAVIGATION MENU & SCROLLED NAVBAR
    // ==========================================================================
    const initNavbar = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        const mainHeader = document.getElementById('main-header');

        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close toggle drawer on clicking navigation links
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }

        // Apply background blur class when scrolled
        window.addEventListener('scroll', () => {
            if (mainHeader) {
                if (window.scrollY > 50) {
                    mainHeader.classList.add('scroll-scrolled');
                } else {
                    mainHeader.classList.remove('scroll-scrolled');
                }
            }
        });
    };
    initNavbar();

    // ==========================================================================
    // 5. PROJECT GRID FILTERING
    // ==========================================================================
    const initProjectFilters = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterVal = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    card.classList.remove('project-show', 'project-hidden');

                    if (filterVal === 'all' || category === filterVal) {
                        // Trick browser into reflowing element for animation trigger
                        void card.offsetWidth;
                        card.classList.add('project-show');
                    } else {
                        card.classList.add('project-hidden');
                    }
                });
            });
        });
    };
    initProjectFilters();

    // ==========================================================================
    // 6. NUMERICAL STATS COUNTER ANIMS
    // ==========================================================================
    const initStatsCounter = () => {
        const statsSection = document.querySelector('.stats-grid');
        const statNumbers = document.querySelectorAll('.stat-number');
        let statsAnimated = false;

        const animateStats = () => {
            statNumbers.forEach(stat => {
                const originalText = stat.textContent.trim();
                const match = originalText.match(/^([\d,]+)(\+)?$/);
                if (!match) return;

                const targetNum = parseInt(match[1].replace(/,/g, ''), 10);
                const suffix = match[2] || '';
                const duration = 1800; // duration in ms
                const startTime = performance.now();

                const updateNumber = (timestamp) => {
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    const easedProgress = progress * (2 - progress); // easeOutQuad
                    const currentNum = Math.floor(easedProgress * targetNum);

                    stat.textContent = currentNum.toString() + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    } else {
                        stat.textContent = originalText; // Final clean state
                    }
                };
                requestAnimationFrame(updateNumber);
            });
        };

        if (statsSection && statNumbers.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !statsAnimated) {
                        statsAnimated = true;
                        animateStats();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            observer.observe(statsSection);
        }
    };
    initStatsCounter();

    // ==========================================================================
    // 7. WELCOMING AI AVATAR WIDGET WITH INTERACTIVE TTS AUDIO
    // ==========================================================================
    const initWelcomeAvatar = () => {
        const avatarTrigger = document.getElementById('avatar-widget-trigger');
        const avatarBubble = document.getElementById('avatar-speech-bubble');
        const triggerBadge = document.querySelector('.avatar-trigger-badge');
        const bubbleTextEl = document.getElementById('avatar-bubble-text');
        const choiceContainer = document.getElementById('avatar-interactive-choices');
        const btnSpeechAudio = document.getElementById('btn-speech-audio');

        if (!avatarTrigger || !avatarBubble || !bubbleTextEl) return;

        let audioEnabled = false;
        let speechTypingInterval = null;

        // Animate AI Speech bubbles with typewriter text output
        const setAvatarSpeechText = (text, playVoice = true) => {
            if (speechTypingInterval) clearInterval(speechTypingInterval);
            
            bubbleTextEl.textContent = '';
            let index = 0;

            speechTypingInterval = setInterval(() => {
                bubbleTextEl.textContent += text.charAt(index);
                index++;
                if (index >= text.length) {
                    clearInterval(speechTypingInterval);
                }
            }, 12);

            // Web Speech API Voice synthesis greeting if toggle is active
            if (playVoice && audioEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const welcomeUtterance = new SpeechSynthesisUtterance(text);
                welcomeUtterance.rate = 1.0;
                welcomeUtterance.pitch = 1.1; // Friendly pitch
                
                // Find a friendly English voice if possible
                const voices = window.speechSynthesis.getVoices();
                const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
                if (enVoice) {
                    welcomeUtterance.voice = enVoice;
                }
                
                window.speechSynthesis.speak(welcomeUtterance);
            }
        };

        // Open Speech bubble container
        avatarTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarBubble.classList.toggle('active');
            
            // Clear notifications badge
            if (triggerBadge) {
                triggerBadge.style.display = 'none';
            }
        });

        // Close when clicking outside widget
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#welcome-avatar-widget')) {
                avatarBubble.classList.remove('active');
            }
        });

        // Speech Audio Toggle Click Handler
        if (btnSpeechAudio) {
            btnSpeechAudio.addEventListener('click', (e) => {
                e.stopPropagation();
                audioEnabled = !audioEnabled;
                const icon = btnSpeechAudio.querySelector('i');
                
                if (icon) {
                    if (audioEnabled) {
                        icon.className = 'fas fa-volume-up';
                        // Audio confirmation greeting
                        if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const confirmation = new SpeechSynthesisUtterance("Audio guidance enabled.");
                            confirmation.pitch = 1.1;
                            window.speechSynthesis.speak(confirmation);
                        }
                    } else {
                        icon.className = 'fas fa-volume-mute';
                        if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                        }
                    }
                }
            });
            
            // Pre-load speech synthesis voices (Firefox/Chrome setup)
            if ('speechSynthesis' in window) {
                window.speechSynthesis.getVoices();
            }
        }

        // Quick choices button actions
        if (choiceContainer) {
            choiceContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.avatar-action-btn');
                if (!btn) return;

                const action = btn.getAttribute('data-action');
                let speechMessage = '';

                switch (action) {
                    case 'intro':
                        speechMessage = "Hi there! I am Priyavratt Sharma, an IT graduate with a passion for bridging technology and human resources. I build tools that streamline sourcing and analytics.";
                        break;
                    case 'resume':
                        speechMessage = "I love work dashboards! Using Power BI, DAX, and Python, I analyze supply chain metrics and automate recruiting spreadsheets, saving operators hours of manual work.";
                        break;
                    case 'recruitment':
                        speechMessage = "For talent acquisition, I map candidate pools, conduct Boolean searches, manage ATS software, and facilitate major campus hiring events like the AMU job fairs.";
                        break;
                    case 'whatsapp':
                        speechMessage = "I would love to connect with you. I am opening a WhatsApp chat window right now so we can message instantly!";
                        
                        // Open WhatsApp window after a short delay to let speech synthesis start
                        setTimeout(() => {
                            window.open("https://wa.me/917017696767", "_blank");
                        }, 1800);
                        break;
                }

                if (speechMessage) {
                    setAvatarSpeechText(speechMessage, true);
                }
            });
        }
    };
    initWelcomeAvatar();

    // ==========================================================================
    // 8. SCROLL REVEAL (INTERSECTION OBSERVER EFFECTS)
    // ==========================================================================
    const initScrollReveals = () => {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        if (revealElements.length === 0) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(el => revealObserver.observe(el));
    };
    initScrollReveals();

    // ==========================================================================
    // 9. FORM VALIDATION & MOCK SUBMIT HANDLER
    // ==========================================================================
    const initContactForm = () => {
        const contactForm = document.getElementById('contact-form');
        const formFeedback = document.getElementById('form-feedback-message');
        const submitBtn = document.getElementById('form-submit-btn');

        if (!contactForm || !formFeedback) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable submit triggers
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            }

            // Mock network response delays
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                }

                // Render success messaging
                formFeedback.className = 'form-feedback success';
                formFeedback.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! Priyavratt will get back to you shortly.';
                
                contactForm.reset();

                // Clear feedback box automatically after 6 seconds
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 6000);
            }, 1200);
        });
    };
    initContactForm();
});
