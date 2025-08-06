document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // ELEMENT SEÇİMLERİ
    // ========================================
    const navbar = document.querySelector('.modern-nav');
    const body = document.body;

    // Mobil Menü Elementleri
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.nav-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    // Yan Panel Elementleri
    const sidePanelToggle = document.querySelector('.side-panel-toggle');
    const sidePanelContainer = document.querySelector('.side-panel-container');
    const sidePanelOverlay = document.querySelector('.side-panel-overlay');
    const sidePanelClose = document.querySelector('.side-panel-close');

    // Dropdown Menü Elementleri
    const dropdownWrappers = document.querySelectorAll('.nav-item-wrapper');
    const mobileSubmenuButtons = document.querySelectorAll('.nav-item.has-dropdown');

    // Null kontrolleri: Elementler bulunamazsa hata vermemesi için.
    if (!navbar || !mobileMenuBtn || !mobileMenu || !mobileMenuOverlay) {
        console.warn('Navigasyon elementlerinden bazıları bulunamadı. Script sonlandırılıyor.');
        return;
    }

    // ========================================
    // MOBİL MENÜ FONKSİYONLARI
    // ========================================
    function openMobileMenu() {
        const navHeight = navbar.offsetHeight;
        mobileMenu.style.top = `${navHeight}px`;
        mobileMenu.style.height = `calc(100vh - ${navHeight}px)`;

        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        mobileMenuBtn.classList.add('open');
        body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        mobileMenuBtn.classList.remove('open');
        body.style.overflow = '';
        mobileMenu.style.top = '';
        mobileMenu.style.height = '';

        document.querySelectorAll('.dropdown-menu.mobile-active').forEach(submenu => {
            submenu.classList.remove('mobile-active');
            const trigger = submenu.closest('.nav-item-wrapper').querySelector('.has-dropdown');
            if (trigger) {
                trigger.classList.remove('active');
            }
        });
    }

    mobileMenuBtn.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // ========================================
    // MOBİL ALT MENÜ (DROPDOWN) FONKSİYONLARI
    // ========================================
    mobileSubmenuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const wrapper = this.closest('.nav-item-wrapper');
                const submenu = wrapper.querySelector('.dropdown-menu');
                if (!submenu) return;

                const isActive = submenu.classList.contains('mobile-active');

                // Diğer açık menüleri kapat
                document.querySelectorAll('.dropdown-menu.mobile-active').forEach(otherSubmenu => {
                    if (otherSubmenu !== submenu) {
                        otherSubmenu.classList.remove('mobile-active');
                        otherSubmenu.closest('.nav-item-wrapper').querySelector('.has-dropdown').classList.remove('active');
                    }
                });

                // Mevcut menüyü ve trigger'ı aç/kapat
                submenu.classList.toggle('mobile-active', !isActive);
                this.classList.toggle('active', !isActive);
            }
        });
    });

    // ========================================
    // YAN PANEL (SIDE PANEL) FONKSİYONLARI
    // ========================================
    function openSidePanel() {
        if (!sidePanelContainer || !sidePanelOverlay) return;
        sidePanelContainer.classList.add('active');
        sidePanelOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeSidePanel() {
        if (!sidePanelContainer || !sidePanelOverlay) return;
        sidePanelContainer.classList.remove('active');
        sidePanelOverlay.classList.remove('active');
        if (!mobileMenu.classList.contains('active')) {
            body.style.overflow = '';
        }
    }

    if (sidePanelToggle) sidePanelToggle.addEventListener('click', openSidePanel);
    if (sidePanelOverlay) sidePanelOverlay.addEventListener('click', closeSidePanel);
    if (sidePanelClose) sidePanelClose.addEventListener('click', closeSidePanel);


    // ========================================
    // MASAÜSTÜ DROPDOWN (HOVER) FONKSİYONLARI
    // ========================================
    dropdownWrappers.forEach(wrapper => {
        let timeoutId;
        const dropdown = wrapper.querySelector('.dropdown-menu');
        if (!dropdown) return;

        wrapper.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                clearTimeout(timeoutId);
                dropdown.style.display = 'block';
                setTimeout(() => {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateX(-50%) translateY(0)';
                }, 10);
            }
        });

        wrapper.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateX(-50%) translateY(-10px)';
                timeoutId = setTimeout(() => {
                    dropdown.style.display = 'none';
                }, 300);
            }
        });
    });


    // ========================================
    // SCROLL VE GENEL OLAY DİNLEYİCİLERİ
    // ========================================
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.innerWidth > 768) {
            if (currentScrollTop > lastScrollTop && currentScrollTop > navbar.offsetHeight) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
            if (sidePanelContainer && sidePanelContainer.classList.contains('active')) {
                closeSidePanel();
            }
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    console.log('Bereketli Topraklar navigasyon scripti başarıyla yüklendi. 🌿');
});