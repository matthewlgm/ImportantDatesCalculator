declare const bootstrap: any;

interface AgeData {
    years: number;
    months: number;
    days: number;
}

class AgeCalculator {
    private birthdate: Date | null = null;
    private modal: any = null;
    private updateInterval: number | null = null;

    constructor() {
        console.log('AgeCalculator: Constructor called');
        this.initializeComponents();
    }

    private async initializeComponents(): Promise<void> {
        console.log('AgeCalculator: Initializing components');
        await this.initializeModal();
        this.loadBirthdate();
        this.setupEventListeners();
    }

    private async initializeModal(): Promise<void> {
        console.log('AgeCalculator: Initializing modal');
        return new Promise((resolve) => {
            const checkModal = () => {
                const modalElement = document.getElementById('birthdayModal');
                if (modalElement && window.bootstrap && window.bootstrap.Modal) {
                    console.log('AgeCalculator: Bootstrap Modal found');
                    this.modal = new bootstrap.Modal(modalElement, {
                        keyboard: false,
                        backdrop: 'static'
                    });
                    resolve();
                } else {
                    console.log('AgeCalculator: Waiting for Bootstrap...');
                    setTimeout(checkModal, 100);
                }
            };
            checkModal();
        });
    }

    private loadBirthdate(): void {
        console.log('AgeCalculator: Loading birthdate');
        const savedBirthdate = localStorage.getItem('birthdate');
        if (savedBirthdate) {
            console.log('AgeCalculator: Found saved birthdate');
            this.birthdate = new Date(savedBirthdate);
            this.startUpdating();
        } else {
            console.log('AgeCalculator: No saved birthdate, showing modal');
            this.showBirthdayModal();
        }
    }

    private setupEventListeners(): void {
        console.log('AgeCalculator: Setting up event listeners');

        // Birthday form submission
        const birthdayForm = document.getElementById('birthdayForm');
        if (birthdayForm) {
            console.log('AgeCalculator: Found birthday form');
            birthdayForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBirthdaySubmit();
            });
        } else {
            console.error('AgeCalculator: Birthday form not found');
        }

        // Change birthday button
        const changeBirthdayBtn = document.getElementById('changeBirthday');
        if (changeBirthdayBtn) {
            console.log('AgeCalculator: Found change birthday button');
            changeBirthdayBtn.addEventListener('click', () => {
                this.showBirthdayModal();
            });
        } else {
            console.error('AgeCalculator: Change birthday button not found');
        }
    }

    private showBirthdayModal(): void {
        console.log('AgeCalculator: Attempting to show modal');
        if (!this.modal) {
            console.error('AgeCalculator: Modal not initialized');
            return;
        }

        if (this.birthdate) {
            const birthdateInput = document.getElementById('birthdate') as HTMLInputElement;
            if (birthdateInput) {
                birthdateInput.value = this.birthdate.toISOString().split('T')[0];
            }
        }

        try {
            console.log('AgeCalculator: Showing modal');
            this.modal.show();
        } catch (error) {
            console.error('AgeCalculator: Error showing modal:', error);
        }
    }

    private handleBirthdaySubmit(): void {
        console.log('AgeCalculator: Handling birthday submit');
        const birthdateInput = document.getElementById('birthdate') as HTMLInputElement;
        const newBirthdate = new Date(birthdateInput.value);

        if (newBirthdate > new Date()) {
            alert('Birthday cannot be in the future!');
            return;
        }

        this.birthdate = newBirthdate;
        localStorage.setItem('birthdate', newBirthdate.toISOString());
        this.modal?.hide();
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

        const yearsElement = document.getElementById('years');
        const monthsElement = document.getElementById('months');
        const daysElement = document.getElementById('days');

        if (yearsElement) yearsElement.textContent = age.years.toString();
        if (monthsElement) monthsElement.textContent = age.months.toString();
        if (daysElement) daysElement.textContent = age.days.toString();
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

// Wait for DOM and Bootstrap to load
window.addEventListener('load', () => {
    console.log('Window loaded, waiting for Bootstrap...');
    if (document.readyState === 'complete') {
        console.log('Document ready, creating AgeCalculator');
        new AgeCalculator();
    }
});