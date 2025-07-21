// wwwroot/scripts/contact-appointment-form.js
(function () {
    'use strict';

    const form = document.getElementById('contactAppointmentForm');
    if (!form) return;

    const formContainer = document.getElementById('contactFormContainer');
    const tabButtons = form.querySelectorAll('.tab-button');
    const tabContents = form.querySelectorAll('.tab-content');
    const formTypeInput = form.querySelector('#formType');
    const submitButton = form.querySelector('.btn-submit');

    // --- Sekme (Tab) Fonksiyonları ---
    function initializeTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                switchTab(tabId);
            });
        });
        // Başlangıçta doğru sekmenin elemanları aktif olsun
        switchTab('contact'); 
    }

    function switchTab(tabId) {
        // Butonların aktif durumunu güncelle
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        
        // Gizli inputun değerini güncelle
        if (formTypeInput) formTypeInput.value = tabId;

        tabContents.forEach(content => {
            const isActive = content.id === `${tabId}Tab`;
            content.classList.toggle('active', isActive);
            
            // --- ANAHTAR DEĞİŞİKLİK BURADA ---
            // Sekmedeki tüm form elemanlarını bul
            const fields = content.querySelectorAll('input, textarea, select');
            
            // Sekme aktif değilse, içindeki tüm elemanları devre dışı bırak
            // Sekme aktif ise, tüm elemanları etkinleştir
            fields.forEach(field => {
                field.disabled = !isActive;
            });
        });

        clearAllErrors();
    }

    // --- Form Gönderme ve Sunucu Yanıtı ---
    async function handleFormSubmit(event) {
        event.preventDefault();
        if (!validateForm()) {
            showGlobalError('Lütfen işaretli alanları doğru bir şekilde doldurunuz.');
            return;
        }

        submitButton.disabled = true;
        submitButton.classList.add('loading');

        const formData = new FormData(form);
        const actionUrl = form.getAttribute('action');
        const token = form.querySelector('input[name="__RequestVerificationToken"]').value;

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'RequestVerificationToken': token,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            const data = await response.json();
            handleServerResponse(data);

        } catch (error) {
            console.error('Sunucuya gönderilirken hata oluştu:', error);
            showGlobalError('Ağ hatası oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    function handleServerResponse(data) {
        clearAllErrors();
        if (data.success) {
            formContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; animation: fadeIn 0.5s;">
                    <h2 style="font-size: 4rem; color: #28a745;">✓</h2>
                    <h3>Teşekkür Ederiz!</h3>
                    <p>${data.message}</p>
                </div>`;
        } else if (data.errors) {
            displayFieldErrors(data.errors);
            showGlobalError('Lütfen formdaki hataları düzelterek tekrar deneyin.');
        } else if (data.error) {
            showGlobalError(data.error);
        }
    }

    // --- Doğrulama (Validation) ve Hata Yönetimi ---
    function validateForm() {
        clearAllErrors();
        let isValid = true;
        const activeTab = form.querySelector('.tab-content.active');
        
        activeTab.querySelectorAll('[required]').forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        const kvkkCheckbox = form.querySelector('#kvkkConsent');
        if (kvkkCheckbox && !validateField(kvkkCheckbox)) isValid = false;

        return isValid;
    }

    function validateField(field) {
        const group = field.closest('.form-group, .checkbox-label, .appointment-types');
        let message = '';

        if (field.type === 'radio') {
            const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
            if (![...radioGroup].some(r => r.checked)) message = 'Lütfen bir seçim yapınız.';
        } else if (field.type === 'checkbox') {
            if (!field.checked) message = 'Bu alanı onaylamanız gerekmektedir.';
        } else if (!field.value.trim()) {
            message = 'Bu alan zorunludur.';
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            message = 'Geçerli bir e-posta adresi giriniz.';
        } else if (field.type === 'tel' && !/^[0-9\s\(\)\-\+]{10,}$/.test(field.value)) {
            message = 'Geçerli bir telefon numarası giriniz.';
        }

        if (message) {
            showFieldError(group, message);
            return false;
        }
        return true;
    }
    
    function showFieldError(group, message) {
        group.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error-message';
        errorElement.textContent = message;
        group.appendChild(errorElement);
    }
    
    function showGlobalError(message) {
        let container = form.querySelector('#global-error-container');
        if (container) {
             container.innerHTML = `<div class="global-error-message">${message}</div>`;
        }
    }

    function clearAllErrors() {
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.form-error-message, .global-error-message').forEach(el => el.remove());
    }
    
    function displayFieldErrors(errors) {
        Object.keys(errors).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                const group = field.closest('.form-group, .checkbox-label, .appointment-types');
                if (group) showFieldError(group, errors[key][0]);
            }
        });
    }

    // --- Başlatma ---
    initializeTabs();
    form.addEventListener('submit', handleFormSubmit);

})();