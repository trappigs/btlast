// Contact & Appointment Form Handler
class ContactAppointmentForm {
    constructor(formElement) {
        this.form = formElement;
        this.currentType = 'contact';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDateInput();
        this.setupTimeAvailability();
    }

    setupEventListeners() {
        // Form type selector
        const selectorButtons = this.form.parentElement.querySelectorAll('.selector-btn');
        selectorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchFormType(e.target.dataset.formType);
            });
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Appointment type change
        const appointmentTypeSelect = this.form.querySelector('select[name="appointmentType"]');
        if (appointmentTypeSelect) {
            appointmentTypeSelect.addEventListener('change', () => {
                this.updateTimeSlots();
            });
        }

        // Date change
        const dateInput = this.form.querySelector('input[name="appointmentDate"]');
        if (dateInput) {
            dateInput.addEventListener('change', () => {
                this.updateTimeSlots();
            });
        }
    }

    setupDateInput() {
        const dateInput = this.form.querySelector('input[name="appointmentDate"]');
        if (dateInput) {
            // Set minimum date to today
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            dateInput.min = todayString;

            // Set maximum date to 3 months from now
            const maxDate = new Date(today);
            maxDate.setMonth(maxDate.getMonth() + 3);
            const maxDateString = maxDate.toISOString().split('T')[0];
            dateInput.max = maxDateString;
        }
    }

    setupTimeAvailability() {
        // Mock time availability - in real implementation, this would come from backend
        this.timeAvailability = {
            'phone': {
                'weekdays': ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
                'weekends': ['10:00', '11:00', '14:00', '15:00', '16:00']
            },
            'online': {
                'weekdays': ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
                'weekends': ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
            },
            'face-to-face': {
                'weekdays': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
                'weekends': []
            }
        };
    }

    switchFormType(type) {
        this.currentType = type;
        this.form.dataset.formType = type;

        // Update active button
        const buttons = this.form.parentElement.querySelectorAll('.selector-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.formType === type);
        });

        // Show/hide form content
        const contents = this.form.querySelectorAll('.form-content');
        contents.forEach(content => {
            content.classList.toggle('active', content.classList.contains(`${type}-form-content`));
        });

        // Clear messages
        this.hideMessages();
    }

    updateTimeSlots() {
        const appointmentType = this.form.querySelector('select[name="appointmentType"]').value;
        const selectedDate = this.form.querySelector('input[name="appointmentDate"]').value;
        const timeSelect = this.form.querySelector('select[name="appointmentTime"]');

        if (!appointmentType || !selectedDate || !timeSelect) return;

        const selectedDateObj = new Date(selectedDate);
        const dayOfWeek = selectedDateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const availableSlots = this.timeAvailability[appointmentType]?.[isWeekend ? 'weekends' : 'weekdays'] || [];

        // Clear existing options except the first one
        timeSelect.innerHTML = '<option value="">Saat Seçin</option>';

        // Add available time slots
        availableSlots.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });

        // If no slots available, show message
        if (availableSlots.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Bu tarih için uygun saat bulunmuyor';
            option.disabled = true;
            timeSelect.appendChild(option);
        }
    }

    async handleSubmit() {
        if (!this.validateForm()) return;

        const submitBtn = this.form.querySelector('.submit-btn');
        submitBtn.classList.add('loading');

        try {
            const formData = this.getFormData();
            const response = await this.submitForm(formData);
            
            if (response.success) {
                this.showSuccessMessage();
                this.resetForm();
            } else {
                this.showErrorMessage(response.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            submitBtn.classList.remove('loading');
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        // Clear previous validation styles
        requiredFields.forEach(field => {
            field.style.borderColor = '';
        });

        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e74c3c';
                isValid = false;
            }
        });

        // Email validation
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.style.borderColor = '#e74c3c';
                isValid = false;
            }
        }

        // Phone validation
        const phoneField = this.form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^[0-9+\-\s()]{10,}$/;
            if (!phoneRegex.test(phoneField.value)) {
                phoneField.style.borderColor = '#e74c3c';
                isValid = false;
            }
        }

        // Date validation for appointments
        if (this.currentType === 'appointment') {
            const dateField = this.form.querySelector('input[name="appointmentDate"]');
            if (dateField && dateField.value) {
                const selectedDate = new Date(dateField.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    dateField.style.borderColor = '#e74c3c';
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            this.showErrorMessage('Lütfen tüm gerekli alanları doğru şekilde doldurun.');
        }

        return isValid;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {
            type: this.currentType,
            timestamp: new Date().toISOString()
        };

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    async submitForm(formData) {
        // Simulate API call - replace with actual endpoint
        const endpoint = this.currentType === 'appointment' ? '/api/appointments' : '/api/contact';
        
        // Mock response - replace with actual fetch call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success response
                resolve({
                    success: true,
                    message: 'Form submitted successfully'
                });
            }, 1500);
        });

        // Actual implementation would be:
        /*
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        return await response.json();
        */
    }

    showSuccessMessage() {
        this.hideMessages();
        const successMessage = this.form.querySelector('.success-message');
        if (successMessage) {
            successMessage.style.display = 'flex';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    }

    showErrorMessage(message) {
        this.hideMessages();
        const errorMessage = this.form.querySelector('.error-message');
        if (errorMessage) {
            const messageText = errorMessage.querySelector('span');
            if (messageText) {
                messageText.textContent = message;
            }
            errorMessage.style.display = 'flex';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }

    hideMessages() {
        const messages = this.form.querySelectorAll('.success-message, .error-message');
        messages.forEach(msg => {
            msg.style.display = 'none';
        });
    }

    resetForm() {
        this.form.reset();
        
        // Clear validation styles
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '';
        });

        // Reset time slots
        const timeSelect = this.form.querySelector('select[name="appointmentTime"]');
        if (timeSelect) {
            timeSelect.innerHTML = '<option value="">Saat Seçin</option>';
        }
    }
}

// Initialize forms when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        new ContactAppointmentForm(form);
    });
});

// Export for use in other scripts if needed
window.ContactAppointmentForm = ContactAppointmentForm;