"use strict";
class AgeCalculator {
    constructor() {
        this.birthdate = null;
        // Initialize when DOM is loaded
        this.initialize();
    }
    initialize() {
        // Initialize modal
        const modalElement = document.getElementById('birthdayModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        }
        // Load saved birthdate or show modal
        const savedBirthdate = localStorage.getItem('birthdate');
        if (savedBirthdate) {
            this.birthdate = new Date(savedBirthdate);
            this.updateAge();
        }
        else {
            this.showBirthdayModal();
        }
        // Set up event listeners
        this.setupEventListeners();
        // Start updating age
        setInterval(() => this.updateAge(), 1000);
    }
    setupEventListeners() {
        // Birthday form submission
        const form = document.getElementById('birthdayForm');
        form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBirthdaySubmit();
        });
        // Change birthday button
        const changeBtn = document.getElementById('changeBirthday');
        changeBtn === null || changeBtn === void 0 ? void 0 : changeBtn.addEventListener('click', () => {
            this.showBirthdayModal();
        });
    }
    showBirthdayModal() {
        if (this.modal) {
            if (this.birthdate) {
                const input = document.getElementById('birthdate');
                input.value = this.birthdate.toISOString().split('T')[0];
            }
            this.modal.show();
        }
    }
    handleBirthdaySubmit() {
        const input = document.getElementById('birthdate');
        const newBirthdate = new Date(input.value);
        if (newBirthdate > new Date()) {
            alert('Birthday cannot be in the future!');
            return;
        }
        this.birthdate = newBirthdate;
        localStorage.setItem('birthdate', newBirthdate.toISOString());
        this.modal.hide();
        this.updateAge();
    }
    updateAge() {
        if (!this.birthdate)
            return;
        const now = new Date();
        let years = now.getFullYear() - this.birthdate.getFullYear();
        let months = now.getMonth() - this.birthdate.getMonth();
        let days = now.getDate() - this.birthdate.getDate();
        // Adjust for negative days
        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, this.birthdate.getDate());
            days = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
        }
        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }
        // Update display
        const elements = {
            years: document.getElementById('years'),
            months: document.getElementById('months'),
            days: document.getElementById('days')
        };
        if (elements.years)
            elements.years.textContent = years.toString();
        if (elements.months)
            elements.months.textContent = months.toString();
        if (elements.days)
            elements.days.textContent = days.toString();
    }
}
// Initialize when the window loads
window.addEventListener('load', () => {
    new AgeCalculator();
});
