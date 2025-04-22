declare const bootstrap: any;

interface ImportantDate {
    id: number; // id 属性，类型是 number（数字），表示日期的唯一标识符。
    name: string; // name 属性，类型是 string（字符串），表示日期的名称。
    date: string; // date 属性，类型是 string（字符串），表示日期的字符串形式，通常是 ISO 8601 格式。
    type: 'birthday' | 'anniversary' | 'other'; // type 属性，类型是字符串字面量类型，只能是 'birthday'、'anniversary' 或 'other' 中的一个。这是一种 TypeScript 的类型约束，用于限制变量的取值范围。
    lunar_date?: string; // lunar_date 属性，类型是 string（字符串），表示农历日期。? 表示这个属性是可选的，即可以存在，也可以不存在。
}

class AgeCalculator {
    private dates: ImportantDate[] = [];
    private modal: any;

    constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        const modalElement = document.getElementById('dateModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        }

        this.setupEventListeners();
        await this.loadDates();
        setInterval(() => this.updateAllAges(), 1000);
    }

    private async loadDates(): Promise<void> {
        try {
            const response = await fetch('/dates');
            if (!response.ok) {
                throw new Error('Failed to load dates');
            }
            this.dates = await response.json();
            this.updateDisplay();
        } catch (error) {
            console.error('Error loading dates:', error);
            alert('Error loading dates. Please try again.');
        }
    }

    private setupEventListeners(): void {
        const form = document.getElementById('dateForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDateSubmit();
        });

        const addBtn = document.getElementById('addDate');
        addBtn?.addEventListener('click', () => {
            this.showDateModal();
        });

        const container = document.getElementById('datesContainer');
        container?.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('delete-date')) {
                const dateId = target.getAttribute('data-id');
                if (dateId) {
                    this.handleDateDelete(parseInt(dateId));
                }
            }
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
            const response = await fetch('/dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    date: input.value,
                    type: typeSelect.value
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add date');
            }

            const addedDate = await response.json();
            this.dates.push(addedDate);
            this.modal.hide();
            this.updateDisplay();
        } catch (error) {
            console.error('Error adding date:', error);
            alert('Error adding date. Please try again.');
        }
    }

    private async handleDateDelete(dateId: number): Promise<void> {
        if (!confirm('Are you sure you want to delete this date?')) {
            return;
        }

        try {
            const response = await fetch(`/dates/${dateId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete date');
            }

            this.dates = this.dates.filter(date => date.id !== dateId);
            this.updateDisplay();
        } catch (error) {
            console.error('Error deleting date:', error);
            alert('Error deleting date. Please try again.');
        }
    }

    private showDateModal(): void {
        if (this.modal) {
            const input = document.getElementById('date') as HTMLInputElement;
            const nameInput = document.getElementById('dateName') as HTMLInputElement;
            const typeSelect = document.getElementById('dateType') as HTMLSelectElement;

            input.value = '';
            nameInput.value = '';
            typeSelect.value = 'birthday';

            this.modal.show();
        }
    }

    private calculateAge(dateStr: string): { years: number; months: number; days: number } {
        const date = new Date(dateStr);
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
                                ${new Date(date.date).toLocaleDateString()} 
                                ${date.lunar_date ? `(农历: ${date.lunar_date})` : ''}
                            </small>
                        </div>
                        <div>
                            <span class="badge bg-${this.getTypeColor(date.type)} me-2">${date.type}</span>
                            <button class="btn btn-sm btn-outline-danger delete-date" data-id="${date.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
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

window.addEventListener('load', () => {
    new AgeCalculator();
});