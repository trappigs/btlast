// wwwroot/scripts/project-cards.js
(function() {
    'use strict';

    function initializeProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        if (!projectCards.length) return;

        setupEventListeners(projectCards);
        setupIntersectionObserver(projectCards);
    }

    function setupEventListeners(projectCards) {
        // --- YENİ VE DÜZELTİLMİŞ KOD ---
        projectCards.forEach(card => {
            // "Form Doldur" butonlarını ayrıca ele alalım
            const formButton = card.querySelector('.btn-secondary');
            if (formButton) {
                formButton.addEventListener('click', (e) => {
                    e.preventDefault(); // Sadece bu butonun linke gitmesini engelle
                    e.stopPropagation();
                    const location = card.getAttribute('data-location');
                    openProjectForm(location);
                });
            }

            // Kartın kendisine tıklandığında (mobil için)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) { // Eğer bir linke tıklanmadıysa
                    handleCardClick(card);
                }
            });
        });
    }

    function handleCardClick(card) {
        // Mobil: Overlay'i aç/kapat
        if (window.innerWidth <= 768) {
            const overlay = card.querySelector('.card-overlay');
            const isVisible = overlay.style.opacity === '1';

            // Önce diğer tüm açık overlay'leri kapat
            document.querySelectorAll('.project-card .card-overlay').forEach(ov => {
                ov.style.opacity = '0';
                ov.style.visibility = 'hidden';
            });
            
            // Tıklanan kartın overlay'ini aç
            if (!isVisible) {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            }
        }
    }

    function openProjectForm(location) {
        // Bu fonksiyon, form doldur butonuna basıldığında
        // ana sayfadaki iletişim formunu bulup oraya kaydırır.
        const contactFormSection = document.getElementById('contactFormContainer');
        if (contactFormSection) {
            showNotification(`${location} için iletişim formu açılıyor...`, 'info');
            const subjectField = contactFormSection.querySelector('[name="Subject"]');
            if (subjectField) {
                subjectField.value = `${location} Projesi Hakkında Bilgi`;
            }
            contactFormSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Alternatif olarak, eğer form yoksa /iletisim sayfasına yönlendirilebilir.
            // window.location.href = `/iletisim?proje=${encodeURIComponent(location)}`;
            showNotification('İletişim formu bulunamadı.', 'error');
        }
    }

    // --- Diğer Yardımcı Fonksiyonlar (Aynı Kalabilir) ---

    function setupIntersectionObserver(projectCards) {
        if (!window.IntersectionObserver) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        projectCards.forEach(card => observer.observe(card));
    }
    
    function showNotification(message, type = 'info') {
        // Bildirim oluşturma mantığı... (Mevcut kodunuzdaki gibi kalabilir)
        // Eğer bu fonksiyon yoksa, aşağıdaki basit versiyonu kullanabilirsiniz
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 15px 25px; 
            background-color: ${type === 'info' ? '#007bff' : '#dc3545'}; 
            color: white; border-radius: 8px; z-index: 1001;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: opacity 0.3s;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Script'i başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProjectCards);
    } else {
        initializeProjectCards();
    }
})();