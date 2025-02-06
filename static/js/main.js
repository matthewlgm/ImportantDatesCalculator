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
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize modal
            const modalElement = document.getElementById('dateModal');
            if (modalElement) {
                this.modal = new bootstrap.Modal(modalElement);
            }
            // Set up event listeners
            this.setupEventListeners();
            // Load dates from server
            yield this.loadDates();
            // Start updating ages
            setInterval(() => this.updateAllAges(), 1000);
        });
    }
    loadDates() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/dates');
                if (!response.ok) {
                    throw new Error('Failed to load dates');
                }
                this.dates = yield response.json();
                this.updateDisplay();
            }
            catch (error) {
                console.error('Error loading dates:', error);
                alert('Error loading dates. Please try again.');
            }
        });
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
        // Delete date event delegation
        const container = document.getElementById('datesContainer');
        container === null || container === void 0 ? void 0 : container.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('delete-date')) {
                const dateId = target.getAttribute('data-id');
                if (dateId) {
                    this.handleDateDelete(parseInt(dateId));
                }
            }
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
                const response = yield fetch('/dates', {
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
                const addedDate = yield response.json();
                this.dates.push(addedDate);
                this.modal.hide();
                this.updateDisplay();
            }
            catch (error) {
                console.error('Error adding date:', error);
                alert('Error adding date. Please try again.');
            }
        });
    }
    handleDateDelete(dateId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm('Are you sure you want to delete this date?')) {
                return;
            }
            try {
                const response = yield fetch(`/dates/${dateId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Failed to delete date');
                }
                this.dates = this.dates.filter(date => date.id !== dateId);
                this.updateDisplay();
            }
            catch (error) {
                console.error('Error deleting date:', error);
                alert('Error deleting date. Please try again.');
            }
        });
    }
    showDateModal() {
        if (this.modal) {
            const input = document.getElementById('date');
            const nameInput = document.getElementById('dateName');
            const typeSelect = document.getElementById('dateType');
            input.value = '';
            nameInput.value = '';
            typeSelect.value = 'birthday';
            this.modal.show();
        }
    }
    calculateAge(dateStr) {
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
