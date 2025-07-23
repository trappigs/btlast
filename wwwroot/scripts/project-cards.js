// wwwroot/scripts/project-cards.js dosyasının yeni içeriği

(function() {
    'use strict';

    // Bu fonksiyon, "Form Doldurun" butonlarına tıklama işlevselliği ekler.
    function initializeProjectCards() {
        const formButtons = document.querySelectorAll('.open-form-btn');
        if (!formButtons.length) return;

        formButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.project-card');
                const location = card.getAttribute('data-location');
                openProjectForm(location);
            });
        });
    }

    function openProjectForm(location) {
        // Ana sayfadaki iletişim formunu bulup oraya kaydırır.
        const contactFormSection = document.getElementById('contactFormContainer');
        if (contactFormSection) {
            // Formdaki Konu alanını otomatik doldur
            const subjectField = contactFormSection.querySelector('[name="Subject"]');
            if (subjectField) {
                subjectField.value = `${location} Projesi Hakkında Bilgi`;
            }
            
            // Forma doğru pürüzsüz bir şekilde kaydır
            contactFormSection.scrollIntoView({ behavior: 'smooth' });

            // İletişim sekmesinin aktif olduğundan emin ol
            const contactTabButton = contactFormSection.querySelector('.tab-button[data-tab="contact"]');
            if (contactTabButton) {
                contactTabButton.click();
            }

        } else {
            console.error('İletişim formu (contactFormContainer) bulunamadı.');
        }
    }
    
    // Script'i başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProjectCards);
    } else {
        initializeProjectCards();
    }
})();