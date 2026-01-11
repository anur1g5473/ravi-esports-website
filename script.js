/* ============================================
   RAVI ESPORTS - Main JavaScript
   Born To Rush. Built To Win.
   ============================================ */

/* ============================================
   TABLE OF CONTENTS
   ============================================
   1. Global Variables
   2. Utility Functions
   3. Loading Screen
   4. Particle Background
   5. Navigation
   6. Mobile Menu
   7. Scroll Effects
   8. Data Fetching (Supabase)
   9. Render Functions
   10. Stats Counter
   11. Gallery & Lightbox
   12. Recruitment Form
   13. Scroll Animations
   14. Back to Top
   15. Initialize App
   ============================================ */

// ============================================
// 1. GLOBAL VARIABLES
// ============================================

// Cache DOM elements
const DOM = {
    // Loading
    loadingScreen: document.getElementById('loading-screen'),
    
    // Navigation
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('nav-toggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Mobile Menu
    mobileMenu: document.getElementById('mobile-menu'),
    mobileMenuClose: document.getElementById('mobile-menu-close'),
    mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    
    // Hero
    heroLogoImg: document.getElementById('hero-logo-img'),
    heroTagline: document.getElementById('hero-tagline'),
    
    // About
    aboutBannerImg: document.getElementById('about-banner-img'),
    aboutDescription: document.getElementById('about-description'),
    
    // Stats
    statKills: document.getElementById('stat-kills'),
    statWins: document.getElementById('stat-wins'),
    statMembers: document.getElementById('stat-members'),
    statTrophies: document.getElementById('stat-trophies'),
    
    // Teams
    teamTabs: document.getElementById('team-tabs'),
    playersGrid: document.getElementById('players-grid'),
    
    // Achievements
    achievementsGrid: document.getElementById('achievements-grid'),
    
    // Gallery
    galleryGrid: document.getElementById('gallery-grid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Lightbox
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxPrev: document.getElementById('lightbox-prev'),
    lightboxNext: document.getElementById('lightbox-next'),
    
    // Recruitment
    recruitForm: document.getElementById('recruit-form'),
    formSuccess: document.getElementById('form-success'),
    resetFormBtn: document.getElementById('reset-form'),
    submitBtn: document.getElementById('submit-btn'),
    
    // Socials
    socialDiscord: document.getElementById('social-discord'),
    socialYoutube: document.getElementById('social-youtube'),
    socialInstagram: document.getElementById('social-instagram'),
    socialFacebook: document.getElementById('social-facebook'),
    socialWhatsapp: document.getElementById('social-whatsapp'),
    recruitDiscord: document.getElementById('recruit-discord'),
    recruitWhatsapp: document.getElementById('recruit-whatsapp'),
    mobileDiscord: document.getElementById('mobile-discord'),
    mobileYoutube: document.getElementById('mobile-youtube'),
    mobileInstagram: document.getElementById('mobile-instagram'),
    footerDiscord: document.getElementById('footer-discord'),
    footerWhatsapp: document.getElementById('footer-whatsapp'),
    footerInstagram: document.getElementById('footer-instagram'),
    
    // Back to Top
    backToTop: document.getElementById('back-to-top'),
    
    // Particles
    particlesContainer: document.getElementById('particles-container'),
    
    // Footer
    currentYear: document.getElementById('current-year'),
    navLogoImg: document.getElementById('nav-logo-img')
};

// App State
const state = {
    teams: [],
    players: [],
    achievements: [],
    gallery: [],
    settings: null,
    currentTeam: null,
    currentGalleryFilter: 'all',
    currentLightboxIndex: 0,
    filteredGallery: [],
    statsAnimated: false
};

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Get role color class
function getRoleClass(role) {
    if (!role) return '';
    return role.toLowerCase();
}

// Get achievement icon based on position
function getAchievementIcon(position) {
    const pos = position?.toLowerCase() || '';
    if (pos.includes('1st') || pos.includes('first') || pos.includes('winner') || pos.includes('champion')) {
        return { icon: 'fa-trophy', class: 'gold' };
    } else if (pos.includes('2nd') || pos.includes('second')) {
        return { icon: 'fa-medal', class: 'silver' };
    } else if (pos.includes('3rd') || pos.includes('third')) {
        return { icon: 'fa-award', class: 'bronze' };
    }
    return { icon: 'fa-star', class: 'winner' };
}

// Default placeholder image
function getPlaceholderImage(type) {
    const placeholders = {
        player: 'https://placehold.co/400x400/1a1a1a/ff4500?text=Player',
        logo: 'https://placehold.co/200x200/1a1a1a/ff4500?text=Logo',
        banner: 'https://placehold.co/600x400/1a1a1a/ff4500?text=RAVI+ESPORTS',
        gallery: 'https://placehold.co/400x400/1a1a1a/ff4500?text=Image'
    };
    return placeholders[type] || placeholders.gallery;
}

// ============================================
// 3. LOADING SCREEN
// ============================================

function hideLoadingScreen() {
    setTimeout(() => {
        DOM.loadingScreen.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }, 2500);
}

// ============================================
// 4. PARTICLE BACKGROUND
// ============================================

function createParticles() {
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 10;
    const duration = Math.random() * 10 + 10;
    const opacity = Math.random() * 0.5 + 0.3;
    
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${opacity};
    `;
    
    DOM.particlesContainer.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle();
    }, (delay + duration) * 1000);
}

// ============================================
// 5. NAVIGATION
// ============================================

function handleNavbarScroll() {
    if (window.scrollY > 50) {
        DOM.navbar.classList.add('scrolled');
    } else {
        DOM.navbar.classList.remove('scrolled');
    }
}

function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Desktop nav
            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
            
            // Mobile nav
            DOM.mobileNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth scroll for nav links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// ============================================
// 6. MOBILE MENU
// ============================================

function openMobileMenu() {
    DOM.mobileMenu.classList.add('active');
    DOM.mobileMenuOverlay.classList.add('active');
    DOM.navToggle.classList.add('active');
    document.body.classList.add('no-scroll');
}

function closeMobileMenu() {
    DOM.mobileMenu.classList.remove('active');
    DOM.mobileMenuOverlay.classList.remove('active');
    DOM.navToggle.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function setupMobileMenu() {
    DOM.navToggle.addEventListener('click', () => {
        if (DOM.mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    DOM.mobileMenuClose.addEventListener('click', closeMobileMenu);
    DOM.mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    
    // Close menu on link click
    DOM.mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// ============================================
// 7. SCROLL EFFECTS
// ============================================

function handleScroll() {
    handleNavbarScroll();
    setActiveNavLink();
    handleStatsAnimation();
    handleScrollAnimations();
    handleBackToTop();
}

// ============================================
// 8. DATA FETCHING (SUPABASE)
// ============================================

async function fetchGuildSettings() {
    try {
        const { data, error } = await window.supabaseClient
            .from('guild_settings')
            .select('*')
            .single();
        
        if (error) throw error;
        
        state.settings = data;
        applyGuildSettings(data);
        
    } catch (error) {
        console.error('Error fetching guild settings:', error);
        // Apply defaults
        applyGuildSettings({
            guild_name: 'RAVI ESPORTS',
            tagline: 'Born To Rush. Built To Win.',
            about_text: 'We are RAVI ESPORTS, a passionate Free Fire guild dedicated to dominating every match.',
            total_kills: 5000,
            total_wins: 200,
            total_members: 50,
            total_trophies: 25
        });
    }
}

async function fetchTeams() {
    try {
        const { data, error } = await window.supabaseClient
            .from('teams')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        state.teams = data || [];
        renderTeamTabs();
        
        // Select first team by default
        if (state.teams.length > 0) {
            state.currentTeam = state.teams[0].id;
            await fetchPlayers();
        } else {
            renderNoPlayers();
        }
        
    } catch (error) {
        console.error('Error fetching teams:', error);
        renderNoPlayers();
    }
}

async function fetchPlayers() {
    try {
        let query = window.supabaseClient
            .from('players')
            .select('*')
            .order('display_order', { ascending: true });
        
        if (state.currentTeam) {
            query = query.eq('team_id', state.currentTeam);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        state.players = data || [];
        renderPlayers();
        
    } catch (error) {
        console.error('Error fetching players:', error);
        renderNoPlayers();
    }
}

async function fetchAchievements() {
    try {
        const { data, error } = await window.supabaseClient
            .from('achievements')
            .select('*')
            .order('year', { ascending: false });
        
        if (error) throw error;
        
        state.achievements = data || [];
        renderAchievements();
        
    } catch (error) {
        console.error('Error fetching achievements:', error);
        renderNoAchievements();
    }
}

async function fetchGallery() {
    try {
        const { data, error } = await window.supabaseClient
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        state.gallery = data || [];
        state.filteredGallery = data || [];
        renderGallery();
        
    } catch (error) {
        console.error('Error fetching gallery:', error);
        renderNoGallery();
    }
}

async function submitJoinRequest(formData) {
    try {
        const { data, error } = await window.supabaseClient
            .from('join_requests')
            .insert([{
                name: formData.name,
                uid: formData.uid,
                rank: formData.rank,
                role: formData.role,
                kd_ratio: parseFloat(formData.kd_ratio),
                discord_id: formData.discord_id,
                reason: formData.reason,
                status: 'pending'
            }]);
        
        if (error) throw error;
        
        return { success: true };
        
    } catch (error) {
        console.error('Error submitting join request:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// 9. RENDER FUNCTIONS
// ============================================

function applyGuildSettings(settings) {
    // Tagline
    if (DOM.heroTagline && settings.tagline) {
        DOM.heroTagline.textContent = settings.tagline;
    }
    
    // About description
    if (DOM.aboutDescription && settings.about_text) {
        DOM.aboutDescription.textContent = settings.about_text;
    }
    
    // Logo
    if (settings.logo_url) {
        if (DOM.heroLogoImg) {
            DOM.heroLogoImg.src = settings.logo_url;
        }
        if (DOM.navLogoImg) {
            DOM.navLogoImg.src = settings.logo_url;
        }
    }
    
    // Banner
    if (settings.banner_url && DOM.aboutBannerImg) {
        DOM.aboutBannerImg.src = settings.banner_url;
    }
    
    // Stats data attributes
    if (DOM.statKills) {
        DOM.statKills.setAttribute('data-target', settings.total_kills || 0);
    }
    if (DOM.statWins) {
        DOM.statWins.setAttribute('data-target', settings.total_wins || 0);
    }
    if (DOM.statMembers) {
        DOM.statMembers.setAttribute('data-target', settings.total_members || 0);
    }
    if (DOM.statTrophies) {
        DOM.statTrophies.setAttribute('data-target', settings.total_trophies || 0);
    }
    
    // Social links
    const socialMappings = [
        { element: DOM.socialDiscord, url: settings.discord_link },
        { element: DOM.socialYoutube, url: settings.youtube_link },
        { element: DOM.socialInstagram, url: settings.instagram_link },
        { element: DOM.socialFacebook, url: settings.facebook_link },
        { element: DOM.socialWhatsapp, url: settings.whatsapp_link },
        { element: DOM.recruitDiscord, url: settings.discord_link },
        { element: DOM.recruitWhatsapp, url: settings.whatsapp_link },
        { element: DOM.mobileDiscord, url: settings.discord_link },
        { element: DOM.mobileYoutube, url: settings.youtube_link },
        { element: DOM.mobileInstagram, url: settings.instagram_link },
        { element: DOM.footerDiscord, url: settings.discord_link },
        { element: DOM.footerWhatsapp, url: settings.whatsapp_link },
        { element: DOM.footerInstagram, url: settings.instagram_link }
    ];
    
    socialMappings.forEach(({ element, url }) => {
        if (element && url) {
            element.href = url;
        }
    });
}

function renderTeamTabs() {
    if (!DOM.teamTabs || state.teams.length === 0) {
        DOM.teamTabs.innerHTML = '';
        return;
    }
    
    DOM.teamTabs.innerHTML = state.teams.map((team, index) => `
        <button class="team-tab ${index === 0 ? 'active' : ''}" data-team-id="${team.id}">
            ${team.name}
        </button>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.team-tab').forEach(tab => {
        tab.addEventListener('click', async () => {
            // Update active state
            document.querySelectorAll('.team-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Fetch players for selected team
            state.currentTeam = tab.dataset.teamId;
            
            // Show loading
            DOM.playersGrid.innerHTML = `
                <div class="loading-placeholder">
                    <div class="spinner"></div>
                    <p>Loading players...</p>
                </div>
            `;
            
            await fetchPlayers();
        });
    });
}

function renderPlayers() {
    if (!DOM.playersGrid) return;
    
    if (state.players.length === 0) {
        renderNoPlayers();
        return;
    }
    
    DOM.playersGrid.innerHTML = state.players.map(player => `
        <div class="player-card fade-in-up">
            <div class="player-image">
                <img src="${player.photo_url || getPlaceholderImage('player')}" 
                     alt="${player.name}"
                     onerror="this.src='${getPlaceholderImage('player')}'">
                <span class="player-role-badge ${getRoleClass(player.role)}">${player.role || 'Player'}</span>
            </div>
            <div class="player-info">
                <h3 class="player-name">${player.name}</h3>
                <p class="player-uid">UID: ${player.uid || 'N/A'}</p>
                <div class="player-stats">
                    <div class="player-stat">
                        <div class="player-stat-value">${player.kd_ratio || '0.0'}</div>
                        <div class="player-stat-label">K/D</div>
                    </div>
                    <div class="player-stat">
                        <div class="player-stat-value">${formatNumber(player.total_kills || 0)}</div>
                        <div class="player-stat-label">Kills</div>
                    </div>
                    <div class="player-stat">
                        <div class="player-stat-value">${player.current_rank || 'N/A'}</div>
                        <div class="player-stat-label">Rank</div>
                    </div>
                </div>
                ${player.instagram_url ? `
                    <div class="player-social">
                        <a href="${player.instagram_url}" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Trigger animations
    setTimeout(() => {
        document.querySelectorAll('.player-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 100);
}

function renderNoPlayers() {
    if (!DOM.playersGrid) return;
    
    DOM.playersGrid.innerHTML = `
        <div class="no-players">
            <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-primary);"></i>
            <p>No players added yet.</p>
        </div>
    `;
}

function renderAchievements() {
    if (!DOM.achievementsGrid) return;
    
    if (state.achievements.length === 0) {
        renderNoAchievements();
        return;
    }
    
    DOM.achievementsGrid.innerHTML = state.achievements.map(achievement => {
        const { icon, class: iconClass } = getAchievementIcon(achievement.position);
        
        return `
            <div class="achievement-card fade-in-left">
                <div class="achievement-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="achievement-details">
                    <h3 class="achievement-title">${achievement.title}</h3>
                    <div class="achievement-meta">
                        <span class="achievement-position">${achievement.position || 'Winner'}</span>
                        <span class="achievement-year">${achievement.year || ''}</span>
                        ${achievement.prize ? `<span class="achievement-prize">${achievement.prize}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Trigger animations
    setTimeout(() => {
        document.querySelectorAll('.achievement-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }, 100);
}

function renderNoAchievements() {
    if (!DOM.achievementsGrid) return;
    
    DOM.achievementsGrid.innerHTML = `
        <div class="no-achievements">
            <i class="fas fa-trophy" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-primary);"></i>
            <p>No achievements added yet.</p>
        </div>
    `;
}

function renderGallery() {
    if (!DOM.galleryGrid) return;
    
    if (state.filteredGallery.length === 0) {
        renderNoGallery();
        return;
    }
    
    DOM.galleryGrid.innerHTML = state.filteredGallery.map((item, index) => `
        <div class="gallery-item ${item.type === 'video' ? 'video' : ''} scale-in" 
             data-index="${index}"
             data-type="${item.type || 'image'}"
             data-url="${item.url}">
            <img src="${item.thumbnail_url || item.url || getPlaceholderImage('gallery')}" 
                 alt="${item.title || 'Gallery item'}"
                 onerror="this.src='${getPlaceholderImage('gallery')}'">
            <div class="gallery-overlay">
                <i class="fas ${item.type === 'video' ? 'fa-play' : 'fa-expand'}"></i>
            </div>
        </div>
    `).join('');
    
    // Add click event listeners
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            const type = item.dataset.type;
            const url = item.dataset.url;
            
            if (type === 'video') {
                window.open(url, '_blank');
            } else {
                openLightbox(index);
            }
        });
    });
    
    // Trigger animations
    setTimeout(() => {
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 50);
        });
    }, 100);
}

function renderNoGallery() {
    if (!DOM.galleryGrid) return;
    
    DOM.galleryGrid.innerHTML = `
        <div class="no-gallery">
            <i class="fas fa-images" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-primary);"></i>
            <p>No gallery items added yet.</p>
        </div>
    `;
}

// ============================================
// 10. STATS COUNTER
// ============================================

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target) + '+';
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function handleStatsAnimation() {
    if (state.statsAnimated) return;
    
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    
    if (isInViewport(statsSection)) {
        state.statsAnimated = true;
        
        const statElements = [
            DOM.statKills,
            DOM.statWins,
            DOM.statMembers,
            DOM.statTrophies
        ];
        
        statElements.forEach(element => {
            if (element) {
                const target = parseInt(element.dataset.target) || 0;
                animateCounter(element, target);
            }
        });
    }
}

// ============================================
// 11. GALLERY & LIGHTBOX
// ============================================

function setupGalleryFilter() {
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter gallery
            const filter = btn.dataset.filter;
            state.currentGalleryFilter = filter;
            
            if (filter === 'all') {
                state.filteredGallery = state.gallery;
            } else {
                state.filteredGallery = state.gallery.filter(item => item.type === filter);
            }
            
            renderGallery();
        });
    });
}

function openLightbox(index) {
    const images = state.filteredGallery.filter(item => item.type !== 'video');
    if (images.length === 0) return;
    
    state.currentLightboxIndex = index;
    const item = state.filteredGallery[index];
    
    if (item && item.type !== 'video') {
        DOM.lightboxImg.src = item.url;
        DOM.lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
    }
}

function closeLightbox() {
    DOM.lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

function navigateLightbox(direction) {
    const images = state.filteredGallery.filter(item => item.type !== 'video');
    const currentIndexInImages = images.findIndex(
        (_, i) => state.filteredGallery.indexOf(images[i]) === state.currentLightboxIndex
    );
    
    let newIndex = currentIndexInImages + direction;
    
    if (newIndex < 0) {
        newIndex = images.length - 1;
    } else if (newIndex >= images.length) {
        newIndex = 0;
    }
    
    state.currentLightboxIndex = state.filteredGallery.indexOf(images[newIndex]);
    DOM.lightboxImg.src = images[newIndex].url;
}

function setupLightbox() {
    DOM.lightboxClose.addEventListener('click', closeLightbox);
    
    DOM.lightbox.addEventListener('click', (e) => {
        if (e.target === DOM.lightbox) {
            closeLightbox();
        }
    });
    
    DOM.lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    DOM.lightboxNext.addEventListener('click', () => navigateLightbox(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!DOM.lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    });
}

// ============================================
// 12. RECRUITMENT FORM
// ============================================

function setupRecruitmentForm() {
    if (!DOM.recruitForm) return;
    
    DOM.recruitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('applicant-name').value,
            uid: document.getElementById('applicant-uid').value,
            rank: document.getElementById('applicant-rank').value,
            role: document.getElementById('applicant-role').value,
            kd_ratio: document.getElementById('applicant-kd').value,
            discord_id: document.getElementById('applicant-discord').value,
            reason: document.getElementById('applicant-reason').value
        };
        
        // Disable button and show loading
        DOM.submitBtn.disabled = true;
        DOM.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting...</span>';
        
        // Submit to Supabase
        const result = await submitJoinRequest(formData);
        
        if (result.success) {
            // Show success message
            DOM.recruitForm.classList.add('hidden');
            DOM.formSuccess.classList.add('show');
        } else {
            // Show error
            alert('Error submitting application. Please try again.');
            DOM.submitBtn.disabled = false;
            DOM.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Submit Application</span>';
        }
    });
    
    // Reset form button
    if (DOM.resetFormBtn) {
        DOM.resetFormBtn.addEventListener('click', () => {
            DOM.recruitForm.reset();
            DOM.recruitForm.classList.remove('hidden');
            DOM.formSuccess.classList.remove('show');
            DOM.submitBtn.disabled = false;
            DOM.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Submit Application</span>';
        });
    }
}

// ============================================
// 13. SCROLL ANIMATIONS
// ============================================

function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
    
    animatedElements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

function addScrollAnimationClasses() {
    // Add animation classes to sections
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-in-up');
    });
    
    document.querySelectorAll('.about-image').forEach(el => {
        el.classList.add('fade-in-left');
    });
    
    document.querySelectorAll('.about-text').forEach(el => {
        el.classList.add('fade-in-right');
    });
    
    document.querySelectorAll('.stat-card').forEach(el => {
        el.classList.add('fade-in-up');
    });
    
    document.querySelectorAll('.social-card').forEach(el => {
        el.classList.add('scale-in');
    });
    
    document.querySelectorAll('.recruit-info').forEach(el => {
        el.classList.add('fade-in-left');
    });
    
    document.querySelectorAll('.recruit-form-container').forEach(el => {
        el.classList.add('fade-in-right');
    });
}

// ============================================
// 14. BACK TO TOP
// ============================================

function handleBackToTop() {
    if (window.scrollY > 500) {
        DOM.backToTop.classList.add('visible');
    } else {
        DOM.backToTop.classList.remove('visible');
    }
}

function setupBackToTop() {
    DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// 15. INITIALIZE APP
// ============================================

async function initApp() {
    console.log('🔥 RAVI ESPORTS Website Initializing...');
    
    // Set current year in footer
    if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
    }
    
    // Add body class to prevent scroll during loading
    document.body.classList.add('no-scroll');
    
    // Create particles
    createParticles();
    
    // Setup event listeners
    setupSmoothScroll();
    setupMobileMenu();
    setupGalleryFilter();
    setupLightbox();
    setupRecruitmentForm();
    setupBackToTop();
    addScrollAnimationClasses();
    
    // Scroll event listener
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Initial scroll check
    handleScroll();
    
    // Fetch data from Supabase
    try {
        await Promise.all([
            fetchGuildSettings(),
            fetchTeams(),
            fetchAchievements(),
            fetchGallery()
        ]);
        console.log('✅ All data loaded successfully!');
    } catch (error) {
        console.error('Error loading data:', error);
    }
    
    // Hide loading screen
    hideLoadingScreen();
    
    console.log('🎮 RAVI ESPORTS Website Ready!');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recreate particles on resize
    DOM.particlesContainer.innerHTML = '';
    createParticles();
}, 250));