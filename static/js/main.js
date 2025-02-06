"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AgeCalculator {
    constructor() {
        this.dates = [];
        this.initialize();
    }
    initialize() {
        // Initialize modal
        const modalElement = document.getElementById('dateModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        }
        // Load saved dates or show modal
        const savedDates = localStorage.getItem('important_dates');
        if (savedDates) {
            this.dates = JSON.parse(savedDates).map((date) => (Object.assign(Object.assign({}, date), { date: new Date(date.date) })));
            this.updateAllAges();
        }
        else {
            this.showDateModal();
        }
        // Set up event listeners
        this.setupEventListeners();
        // Start updating ages
        setInterval(() => this.updateAllAges(), 1000);
    }
    setupEventListeners() {
        // Date form submission
        const form = document.getElementById('dateForm');
        form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDateSubmit();
        });
        // Add new date button
        const addBtn = document.getElementById('addDate');
        addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', () => {
            this.showDateModal();
        });
    }
    handleDateSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            const input = document.getElementById('date');
            const nameInput = document.getElementById('dateName');
            const typeSelect = document.getElementById('dateType');
            const newDate = new Date(input.value);
            if (newDate > new Date()) {
                alert('Date cannot be in the future!');
                return;
            }
            try {
                // 获取农历日期
                const response = yield fetch('/get_lunar_date', {
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
                const lunarData = yield response.json();
                const importantDate = {
                    id: Date.now().toString(),
                    name: nameInput.value,
                    date: newDate,
                    type: typeSelect.value,
                    lunarDate: lunarData.lunar_date
                };
                this.dates.push(importantDate);
                localStorage.setItem('important_dates', JSON.stringify(this.dates));
                this.modal.hide();
                this.updateDisplay();
            }
            catch (error) {
                console.error('Error getting lunar date:', error);
                alert('Error getting lunar date. Please try again.');
            }
        });
    }
    showDateModal(dateToEdit) {
        if (this.modal) {
            const input = document.getElementById('date');
            const nameInput = document.getElementById('dateName');
            const typeSelect = document.getElementById('dateType');
            if (dateToEdit) {
                input.value = dateToEdit.date.toISOString().split('T')[0];
                nameInput.value = dateToEdit.name;
                typeSelect.value = dateToEdit.type;
            }
            else {
                input.value = '';
                nameInput.value = '';
                typeSelect.value = 'birthday';
            }
            this.modal.show();
        }
    }
    calculateAge(date) {
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
    updateAllAges() {
        this.dates.forEach((date) => {
            const age = this.calculateAge(date.date);
            const dateContainer = document.getElementById(`date-${date.id}`);
            if (dateContainer) {
                const yearsEl = dateContainer.querySelector('.years');
                const monthsEl = dateContainer.querySelector('.months');
                const daysEl = dateContainer.querySelector('.days');
                if (yearsEl)
                    yearsEl.textContent = age.years.toString();
                if (monthsEl)
                    monthsEl.textContent = age.months.toString();
                if (daysEl)
                    daysEl.textContent = age.days.toString();
            }
        });
    }
    updateDisplay() {
        const container = document.getElementById('datesContainer');
        if (!container)
            return;
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
    getTypeColor(type) {
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
