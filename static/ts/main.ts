declare const bootstrap: any;

interface ImportantDate {
    id: string;
    name: string;
    date: Date;
    type: 'birthday' | 'anniversary' | 'other';
    lunarDate?: string;  // 农历日期字符串
}

class AgeCalculator {
    private dates: ImportantDate[] = [];
    private modal: any;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        // Initialize modal
        const modalElement = document.getElementById('dateModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        }

        // Load saved dates or show modal
        const savedDates = localStorage.getItem('important_dates');
        if (savedDates) {
            this.dates = JSON.parse(savedDates).map((date: any) => ({
                ...date,
                date: new Date(date.date)
            }));
            this.updateAllAges();
        } else {
            this.showDateModal();
        }

        // Set up event listeners
        this.setupEventListeners();

        // Start updating ages
        setInterval(() => this.updateAllAges(), 1000);
    }

    private setupEventListeners(): void {
        // Date form submission
        const form = document.getElementById('dateForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDateSubmit();
        });

        // Add new date button
        const addBtn = document.getElementById('addDate');
        addBtn?.addEventListener('click', () => {
            this.showDateModal();
        });
    }

    private async handleDateSubmit(): Promise<void> {
        const input = document.getElementById('date') as HTMLInputElement;
        const nameInput = document.getElementById('dateName') as HTMLInputElement;
        const typeSelect = document.getElementById('dateType') as HTMLSelectElement;

        const newDate = new Date(input.value);
        if (newDate > new Date()) {
            alert('Date cannot be in the future!');
            return;
        }

        try {
            // 获取农历日期
            const response = await fetch('/get_lunar_date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: input.value
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get lunar date');
            }

            const lunarData = await response.json();

            const importantDate: ImportantDate = {
                id: Date.now().toString(),
                name: nameInput.value,
                date: newDate,
                type: typeSelect.value as 'birthday' | 'anniversary' | 'other',
                lunarDate: lunarData.lunar_date
            };

            this.dates.push(importantDate);
            localStorage.setItem('important_dates', JSON.stringify(this.dates));
            this.modal.hide();
            this.updateDisplay();
        } catch (error) {
            console.error('Error getting lunar date:', error);
            alert('Error getting lunar date. Please try again.');
        }
    }

    private showDateModal(dateToEdit?: ImportantDate): void {
        if (this.modal) {
            const input = document.getElementById('date') as HTMLInputElement;
            const nameInput = document.getElementById('dateName') as HTMLInputElement;
            const typeSelect = document.getElementById('dateType') as HTMLSelectElement;

            if (dateToEdit) {
                input.value = dateToEdit.date.toISOString().split('T')[0];
                nameInput.value = dateToEdit.name;
                typeSelect.value = dateToEdit.type;
            } else {
                input.value = '';
                nameInput.value = '';
                typeSelect.value = 'birthday';
            }
            this.modal.show();
        }
    }

    private calculateAge(date: Date): { years: number; months: number; days: number } {
        const now = new Date();
        let years = now.getFullYear() - date.getFullYear();
        let months = now.getMonth() - date.getMonth();
        let days = now.getDate() - date.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, date.getDate());
            days = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    private updateAllAges(): void {
        this.dates.forEach((date) => {
            const age = this.calculateAge(date.date);
            const dateContainer = document.getElementById(`date-${date.id}`);
            if (dateContainer) {
                const yearsEl = dateContainer.querySelector('.years');
                const monthsEl = dateContainer.querySelector('.months');
                const daysEl = dateContainer.querySelector('.days');

                if (yearsEl) yearsEl.textContent = age.years.toString();
                if (monthsEl) monthsEl.textContent = age.months.toString();
                if (daysEl) daysEl.textContent = age.days.toString();
            }
        });
    }

    private updateDisplay(): void {
        const container = document.getElementById('datesContainer');
        if (!container) return;

        container.innerHTML = this.dates.map(date => `
            <div id="date-${date.id}" class="date-card mb-4">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-0">${date.name}</h5>
                            <small class="text-muted">
                                ${date.date.toLocaleDateString()} 
                                ${date.lunarDate ? `(农历: ${date.lunarDate})` : ''}
                            </small>
                        </div>
                        <span class="badge bg-${this.getTypeColor(date.type)}">${date.type}</span>
                    </div>
                    <div class="card-body">
                        <div class="age-display">
                            <div class="row g-3">
                                <div class="col">
                                    <div class="time-unit">
                                        <span class="years number">0</span>
                                        <span class="label">Years</span>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="time-unit">
                                        <span class="months number">0</span>
                                        <span class="label">Months</span>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="time-unit">
                                        <span class="days number">0</span>
                                        <span class="label">Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateAllAges();
    }

    private getTypeColor(type: string): string {
        switch (type) {
            case 'birthday':
                return 'primary';
            case 'anniversary':
                return 'success';
            default:
                return 'info';
        }
    }
}

// Initialize when the window loads
window.addEventListener('load', () => {
    new AgeCalculator();
});