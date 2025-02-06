import * as bootstrap from 'bootstrap';

interface AgeData {
    years: number;
    months: number;
    days: number;
}

class AgeCalculator {
    private birthdate: Date | null = null;
    private modal: bootstrap.Modal;
    private updateInterval: number | null = null;

    constructor() {
        this.initializeModal();
        this.loadBirthdate();
        this.setupEventListeners();
    }

    private initializeModal(): void {
        const modalElement = document.getElementById('birthdayModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        }
    }

    private loadBirthdate(): void {
        const savedBirthdate = localStorage.getItem('birthdate');
        if (savedBirthdate) {
            this.birthdate = new Date(savedBirthdate);
            this.startUpdating();
        } else {
            this.showBirthdayModal();
        }
    }

    private setupEventListeners(): void {
        // Birthday form submission
        const birthdayForm = document.getElementById('birthdayForm') as HTMLFormElement;
        birthdayForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBirthdaySubmit();
        });

        // Change birthday button
        const changeBirthdayBtn = document.getElementById('changeBirthday');
        changeBirthdayBtn?.addEventListener('click', () => {
            this.showBirthdayModal();
        });
    }

    private showBirthdayModal(): void {
        if (this.birthdate) {
            const birthdateInput = document.getElementById('birthdate') as HTMLInputElement;
            birthdateInput.value = this.birthdate.toISOString().split('T')[0];
        }
        this.modal.show();
    }

    private handleBirthdaySubmit(): void {
        const birthdateInput = document.getElementById('birthdate') as HTMLInputElement;
        const newBirthdate = new Date(birthdateInput.value);

        if (newBirthdate > new Date()) {
            alert('Birthday cannot be in the future!');
            return;
        }

        this.birthdate = newBirthdate;
        localStorage.setItem('birthdate', newBirthdate.toISOString());
        this.modal.hide();
        this.startUpdating();
    }

    private calculateAge(): AgeData {
        if (!this.birthdate) {
            return { years: 0, months: 0, days: 0 };
        }

        const now = new Date();
        let years = now.getFullYear() - this.birthdate.getFullYear();
        let months = now.getMonth() - this.birthdate.getMonth();
        let days = now.getDate() - this.birthdate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, this.birthdate.getDate());
            days = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    private updateDisplay(): void {
        const age = this.calculateAge();

        document.getElementById('years')!.textContent = age.years.toString();
        document.getElementById('months')!.textContent = age.months.toString();
        document.getElementById('days')!.textContent = age.days.toString();
    }

    private startUpdating(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateDisplay();
        this.updateInterval = window.setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AgeCalculator();
});