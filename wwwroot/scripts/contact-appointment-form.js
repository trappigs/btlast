// wwwroot/scripts/contact-appointment-form.js
(function () {
    'use strict';

    const form = document.getElementById('contactAppointmentForm');
    if (!form) return;

    const formContainer = document.getElementById('contactFormContainer');
    const submitButton = form.querySelector('.btn-submit');
    const appointmentTypes = form.querySelectorAll('input[name="AppointmentType"]');
    const dateTimeWrapper = document.getElementById('appointment-date-time-wrapper');
    const dateField = form.querySelector('#apptDate');
    const timeField = form.querySelector('#apptTime');

    function initializeAppointmentTypeListener() {
        appointmentTypes.forEach(radio => {
            radio.addEventListener('change', handleAppointmentTypeChange);
        });
        handleAppointmentTypeChange();
    }

    function handleAppointmentTypeChange() {
        const selectedType = form.querySelector('input[name="AppointmentType"]:checked').value;
        const showDateTime = selectedType === 'Online Görüşme' || selectedType === 'Yüz Yüze Görüşme';

        if (showDateTime) {
            dateTimeWrapper.style.display = 'flex';
            dateField.required = true;
            timeField.required = true;
            dateField.disabled = false;
            timeField.disabled = false;
        } else {
            dateTimeWrapper.style.display = 'none';
            dateField.required = false;
            timeField.required = false;
            dateField.disabled = true;
            timeField.disabled = true;
            dateField.value = '';
            timeField.value = '';
        }
    }

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
            formContainer.scrollIntoView({ behavior: 'smooth' });
        } else if (data.errors) {
            displayFieldErrors(data.errors);
            showGlobalError('Lütfen formdaki hataları düzelterek tekrar deneyin.');
        } else if (data.error) {
            showGlobalError(data.error);
        }
    }
    function validateForm() {
        clearAllErrors();
        let isValid = true;
        
        form.querySelectorAll('[required]:not([disabled])').forEach(field => {
            if (!validateField(field)) isValid = false;
        });

        // E-posta alanı zorunlu değil ama doluysa formatını kontrol et
        const emailField = form.querySelector('#apptEmail');
        if (emailField && emailField.value.trim() !== '' && !validateField(emailField)) {
            isValid = false;
        }
        
        return isValid;
    }

    function validateField(field) {
        const group = field.closest('.form-group, .checkbox-label, .appointment-types');
        let message = '';

        if (field.required) {
            if (field.type === 'radio') {
                const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
                if (![...radioGroup].some(r => r.checked)) message = 'Lütfen bir seçim yapınız.';
            } else if (field.type === 'checkbox') {
                if (!field.checked) message = 'Bu alanı onaylamanız gerekmektedir.';
            } else if (!field.value.trim()) {
                message = 'Bu alan zorunludur.';
            }
        }
        
        if (field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            message = 'Geçerli bir e-posta adresi giriniz.';
        } else if (field.type === 'tel' && field.required && !/^[0-9\s\(\)\-\+]{10,}$/.test(field.value)) {
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
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-error-container';
            form.insertBefore(container, form.firstChild);
        }
        container.innerHTML = `<div class="global-error-message">${message}</div>`;
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

    initializeAppointmentTypeListener();
    form.addEventListener('submit', handleFormSubmit);
})();