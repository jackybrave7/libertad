document.addEventListener('DOMContentLoaded', () => {
    // Apply mode-dependent content
    if (typeof TICKET_CONFIG !== 'undefined') {
        const isWaitlist = TICKET_CONFIG.mode === 'waitlist';
        const el = (id) => document.getElementById(id);

        const set = (id, text) => { if (el(id)) el(id).textContent = text; };
        const show = (id) => { if (el(id)) el(id).classList.remove('hidden'); };
        const hide = (id) => { if (el(id)) el(id).classList.add('hidden'); };

        if (isWaitlist) {
            set('hero-btn-text', 'Лист ожидания');
            set('tickets-heading', 'Лист ожидания');
            set('tickets-btn-text', 'Лист ожидания');
            set('tickets-desc', 'Премьера состоялась в мае 2026. Запишитесь в лист ожидания — сообщим о новых показах.');
            set('tickets-bottom', 'Спасибо за интерес к спектаклю!');
            show('tickets-btn-icon-waitlist');
            hide('tickets-btn-icon-sale');
        } else {
            set('hero-btn-text', 'Купить билет');
            set('tickets-heading', 'Ждем на показ 11 июля!');
            set('tickets-btn-text', 'Купить билет');
            set('tickets-desc', 'Лучшие места разбирают заранее — сейчас есть возможность выбрать удобные ряды и зафиксировать цену.');
            set('tickets-bottom', 'Рекомендуем приобретать билеты заранее');
            hide('tickets-btn-icon-waitlist');
            show('tickets-btn-icon-sale');
        }
    }

    // UTM helpers
    const getUtmParams = () => {
        const params = new URLSearchParams(window.location.search);
        const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
        return keys.reduce((acc, key) => {
            const value = params.get(key);
            if (value) acc[key] = value;
            return acc;
        }, {});
    };

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.remove('bg-transparent', 'py-6');
            navbar.classList.add('bg-black/80', 'backdrop-blur-md', 'py-4', 'border-b', 'border-white/10');
        } else {
            navbar.classList.add('bg-transparent', 'py-6');
            navbar.classList.remove('bg-black/80', 'backdrop-blur-md', 'py-4', 'border-b', 'border-white/10');
        }
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    let galleryItemsArray = Array.from(galleryItems);

    if (lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach((item) => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-src');
                const group = item.getAttribute('data-gallery');
                if (!src) return;

                galleryItemsArray = Array.from(document.querySelectorAll(
                    group ? `.gallery-item[data-gallery="${group}"]` : '.gallery-item'
                ));

                currentImageIndex = galleryItemsArray.indexOf(item);
                lightboxImg.src = src;

                if (navbar) navbar.style.display = 'none';

                lightbox.classList.remove('hidden');
                requestAnimationFrame(() => lightbox.classList.add('lightbox-open'));
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    try { lightboxClose.focus(); } catch (e) {}
                }, 50);
            });
        });

        const showImage = (index) => {
            if (index >= 0 && index < galleryItemsArray.length) {
                currentImageIndex = index;
                const src = galleryItemsArray[index].getAttribute('data-src');
                if (src) lightboxImg.src = src;
            }
        };

        const showNextImage = () => {
            const nextIndex = (currentImageIndex + 1) % galleryItemsArray.length;
            showImage(nextIndex);
        };

        const showPrevImage = () => {
            const prevIndex = (currentImageIndex - 1 + galleryItemsArray.length) % galleryItemsArray.length;
            showImage(prevIndex);
        };

        const closeLightbox = () => {
            if (navbar) navbar.style.display = '';
            lightbox.classList.remove('lightbox-open');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                lightboxImg.src = '';
                lightbox.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }, 350);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
        if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('hidden')) {
                if (e.key === 'Escape') closeLightbox();
                else if (e.key === 'ArrowLeft') showPrevImage();
                else if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // Partner form (partner.html)
    const partnerForm = document.getElementById('partner-form');
    if (partnerForm) {
        const partnerSubmit = document.getElementById('partner-submit');
        const partnerSuccess = document.getElementById('partner-success');
        const partnerError = document.getElementById('partner-error');
        const partnerOverlay = document.getElementById('partner-overlay');
        partnerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (partnerSuccess) partnerSuccess.classList.add('hidden');
            if (partnerError) partnerError.classList.add('hidden');
            if (partnerSubmit) partnerSubmit.disabled = true;
            if (partnerOverlay) partnerOverlay.classList.remove('hidden');
            const payload = new FormData(partnerForm);
            payload.append('action', 'partnerForm');
            try {
                await fetch('https://script.google.com/macros/s/AKfycbzDAcWHj22dKmRuGaZNb_2NLeCqYLQVYgAazQ2qOdzgYWYEqvftNvtMZ85VgX9i4nKWuw/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    body: payload
                });
                if (partnerSuccess) partnerSuccess.classList.remove('hidden');
                partnerForm.reset();
            } catch (err) {
                if (partnerError) partnerError.classList.remove('hidden');
            } finally {
                if (partnerOverlay) partnerOverlay.classList.add('hidden');
                if (partnerSubmit) partnerSubmit.disabled = false;
            }
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                entry.target.style.opacity = '1';
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('section > div, h2, .prose');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.classList.add('transition-all', 'duration-1000', 'ease-out');
        observer.observe(el);
    });

    // Gallery Slider Logic
    const slider = document.getElementById('gallery-slider');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (slider && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = slider.children.length;

        const updateSlider = () => {
            const isMobile = window.innerWidth < 768;
            const slidesPerView = isMobile ? 1 : 3;
            const maxIndex = Math.max(0, totalSlides - slidesPerView);
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
            const slideWidth = 100 / slidesPerView;
            slider.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        };

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            const isMobile = window.innerWidth < 768;
            const slidesPerView = isMobile ? 1 : 3;
            const maxIndex = totalSlides - slidesPerView;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        window.addEventListener('resize', updateSlider);
        updateSlider();
    }

    // Ticket handling
    const ticketModal = document.getElementById('ticket-modal');
    const ticketModalClose = document.getElementById('ticket-modal-close');
    const ticketForm = document.getElementById('ticket-notification-form');
    const ticketFormContainer = document.getElementById('ticket-form-container');
    const ticketSuccessMessage = document.getElementById('ticket-success-message');
    const ticketCloudConfig = typeof TICKET_CONFIG !== 'undefined' ? TICKET_CONFIG.ticketCloud : null;
    let ticketCloudPromise = null;

    const loadTicketCloud = () => {
        if (!ticketCloudConfig || !ticketCloudConfig.widgetScript) return Promise.resolve();
        if (window.TicketCloud && typeof window.TicketCloud.open === 'function') return Promise.resolve();
        if (!ticketCloudPromise) {
            ticketCloudPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = ticketCloudConfig.widgetScript;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load TicketCloud widget script'));
                document.head.appendChild(script);
            });
        }
        return ticketCloudPromise;
    };

    const openTicketCloudWidget = () => {
        if (!ticketCloudConfig || !window.TicketCloud || typeof window.TicketCloud.open !== 'function') return false;
        window.TicketCloud.open({ event: ticketCloudConfig.eventId, token: ticketCloudConfig.token });
        return true;
    };

    // Preload TicketCloud script only in ticket_sale mode
    if (typeof TICKET_CONFIG === 'undefined' || TICKET_CONFIG.mode !== 'waitlist') {
        loadTicketCloud().catch(() => {});
    }

    const openTicketModal = () => {
        if (ticketModal) {
            ticketModal.style.display = 'flex';
            ticketModal.classList.remove('hidden');
            ticketModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const firstInput = document.getElementById('ticket-name');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    };

    const closeTicketModal = () => {
        if (ticketModal) {
            ticketModal.style.display = 'none';
            ticketModal.classList.add('hidden');
            ticketModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (ticketFormContainer) ticketFormContainer.classList.remove('hidden');
                if (ticketSuccessMessage) ticketSuccessMessage.classList.add('hidden');
                if (ticketForm) ticketForm.reset();
            }, 300);
        }
    };

    const handleTicketButtonClick = (e) => {
        e.preventDefault();
        if (typeof TICKET_CONFIG === 'undefined') {
            console.error('TICKET_CONFIG is not defined. Please include config.js before main.js');
            return;
        }

        if (TICKET_CONFIG.mode === 'waitlist') {
            openTicketModal();
            return;
        }

        const fallback = () => {
            if (TICKET_CONFIG.mode === 'ticket_sale' && TICKET_CONFIG.ticketSaleUrl) {
                window.open(TICKET_CONFIG.ticketSaleUrl, '_blank');
            }
        };

        loadTicketCloud()
            .then(() => {
                if (!openTicketCloudWidget()) fallback();
            })
            .catch(() => fallback());
    };

    const ticketButtons = document.querySelectorAll('[data-tc-event][data-tc-token]');
    ticketButtons.forEach((button) => {
        button.addEventListener('click', handleTicketButtonClick);
    });

    if (ticketModalClose) ticketModalClose.addEventListener('click', closeTicketModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ticketModal && ticketModal.style.display === 'flex') {
            closeTicketModal();
        }
    });

    if (ticketForm) {
        ticketForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const overlay = document.getElementById('ticket-submit-overlay');
            const submitBtn = ticketForm.querySelector('button[type="submit"]');
            const formData = {
                name: document.getElementById('ticket-name').value.trim(),
                email: document.getElementById('ticket-email').value.trim(),
                phone: (document.getElementById('ticket-phone').value || '').replace(/\D+/g, ''),
                type: 'waitlist',
                project: 'stone-heart',
                sheetName: 'Sheet1',
                utm: getUtmParams()
            };

            if (!formData.name || !formData.email) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            if (formData.phone && !/^\d+$/.test(formData.phone)) {
                alert('Телефон должен содержать только цифры');
                return;
            }

            submitBtn.disabled = true;
            if (overlay) overlay.classList.remove('hidden');

            const googleScriptUrl = typeof TICKET_CONFIG !== 'undefined'
                ? TICKET_CONFIG.googleScriptUrl
                : 'https://script.google.com/macros/s/AKfycbxAcvI3xJyBcVWANBUKkWeeqUlXWs6SWR38rWrlXnlfl7wWtmCX9rum_ebQBzH3oZFb/exec';

            const utm = getUtmParams();
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                type: 'waitlist',
                route: 'waitlist',
                action: 'waitlist_stone_heart',
                project: 'stone-heart',
                sheetName: 'Sheet1',
                ...utm
            };

            const waitlistUrl = googleScriptUrl + (googleScriptUrl.indexOf('?') >= 0 ? '&' : '?') + 'route=waitlist';

            try {
                await fetch(waitlistUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(payload)
                });
                if (ticketFormContainer) ticketFormContainer.classList.add('hidden');
                if (ticketSuccessMessage) ticketSuccessMessage.classList.remove('hidden');
                setTimeout(() => { closeTicketModal(); }, 3000);
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
            } finally {
                if (overlay) overlay.classList.add('hidden');
                submitBtn.disabled = false;
                ticketForm.reset();
            }
        });
    }

    // Supporters fetch (support.html)
    const supportersGrid = document.getElementById('supporters-grid');
    const raisedEl = document.getElementById('raised-amount');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const progressRemaining = document.getElementById('progress-remaining');
    const goalEl = document.getElementById('goal-amount');

    const formatCurrency = (value) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);

    if (supportersGrid) {
        const goalAmount = 100000;

        const updateProgress = (raised) => {
            const raisedAmount = Number(raised) || 0;
            const percent = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);
            const remaining = Math.max(goalAmount - raisedAmount, 0);
            if (goalEl) goalEl.textContent = formatCurrency(goalAmount);
            if (raisedEl) raisedEl.textContent = formatCurrency(raisedAmount);
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressPercent) progressPercent.textContent = `${percent}%`;
            if (progressRemaining) progressRemaining.textContent = remaining > 0 ? `Осталось собрать ${formatCurrency(remaining)}` : 'Цель достигнута!';
        };

        updateProgress(0);

        const renderSupporters = (items) => {
            supportersGrid.innerHTML = '';
            if (!items || !items.length) {
                supportersGrid.innerHTML = '<p class="text-muted-foreground text-center col-span-full">Пока нет подтвержденных переводов.</p>';
                return;
            }
            const sorted = [...items].sort((a, b) => {
                if ((b.amountNumber || 0) !== (a.amountNumber || 0)) return (b.amountNumber || 0) - (a.amountNumber || 0);
                const aDate = a.date ? new Date(a.date).getTime() : 0;
                const bDate = b.date ? new Date(b.date).getTime() : 0;
                if (aDate !== bDate) return aDate - bDate;
                return (a.order || 0) - (b.order || 0);
            });

            sorted.forEach((item) => {
                const letter = (item.name || '?').trim().charAt(0).toUpperCase() || '?';
                const amountText = item.amount ? `<span class="text-primary text-sm">${item.amount}</span>` : '';
                const card = document.createElement('div');
                card.className = 'flex items-center gap-4 p-6 border border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-primary/30 transition-all rounded-lg';
                card.innerHTML = `
                    <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display text-xl shrink-0">${letter}</div>
                    <div class="flex flex-col gap-1 text-left">
                        <span class="text-white font-medium text-lg">${item.name || 'Аноним'}</span>
                        ${amountText}
                    </div>
                `;
                supportersGrid.appendChild(card);
            });

            const placeholder = document.createElement('div');
            placeholder.className = 'flex items-center gap-4 p-6 border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all rounded-lg';
            placeholder.innerHTML = `
                <div class="w-12 h-12 rounded-full bg-primary/10 border-2 border-dashed border-primary/50 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
                <span class="text-primary/80 italic text-lg">Ваше имя здесь</span>
            `;
            supportersGrid.appendChild(placeholder);
        };

        fetch('https://script.google.com/macros/s/AKfycbzDAcWHj22dKmRuGaZNb_2NLeCqYLQVYgAazQ2qOdzgYWYEqvftNvtMZ85VgX9i4nKWuw/exec?action=supporters')
            .then((res) => res.json())
            .then((data) => {
                if (data && data.supporters) {
                    renderSupporters(data.supporters);
                }
                if (data && data.totalAmount !== undefined) {
                    updateProgress(data.totalAmount);
                }
            })
            .catch(() => {
                supportersGrid.innerHTML = '<p class="text-muted-foreground text-center col-span-full">Не удалось получить список. Попробуйте позже.</p>';
                updateProgress(0);
            });
    }

    // Plans voting
    const voteButtons = document.querySelectorAll('.vote-button');
    const voteCounts = document.querySelectorAll('.vote-count');
    const VOTE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYS5YAbFZF8X_Yz0QMkwp5SD18HXGgpdYg-8J17MlTzyUmpvyYDdWkkik4XWo0aVYK/exec';

    const getClientId = () => {
        const KEY = 'libertad_plan_vote_id';
        const existing = localStorage.getItem(KEY);
        if (existing) return existing;
        const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
        localStorage.setItem(KEY, id);
        return id;
    };

    const renderVote = (planId, count) => {
        voteCounts.forEach((el) => {
            if (el.dataset.planId === planId) {
                el.textContent = count ?? 0;
            }
        });
    };

    const fetchVotes = () => {
        fetch(`${VOTE_SCRIPT_URL}?action=getVotes`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || !data.votes) return;
                Object.entries(data.votes).forEach(([planId, count]) => renderVote(planId, count));
            })
            .catch((err) => console.error('Failed to load votes', err));
    };

    const sendVote = (planId, title, button) => {
        if (!planId) return;
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Voting...';
        const params = new URLSearchParams({
            action: 'vote',
            planId,
            title,
            clientId: getClientId()
        });
        fetch(`${VOTE_SCRIPT_URL}?${params.toString()}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (!data) {
                    throw new Error('Empty response from server');
                }
                if (data.error) {
                    alert(`Ошибка голосования: ${data.error}`);
                    return;
                }
                const count = data.count || null;
                renderVote(planId, count);
            })
            .catch((err) => {
                console.error('Vote failed', err);
                alert('Не удалось отправить голос. Попробуйте позже.');
            })
            .finally(() => {
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = originalText;
                }, 1200);
            });
    };

    voteButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const planId = btn.dataset.planId;
            const planTitle = btn.dataset.planTitle;
            sendVote(planId, planTitle, btn);
        });
    });

    if (voteButtons.length) {
        fetchVotes();
    }
});
