"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bootstrap = require("bootstrap");
var AgeCalculator = /** @class */ (function () {
    function AgeCalculator() {
        this.birthdate = null;
        this.updateInterval = null;
        this.initializeModal();
        this.loadBirthdate();
        this.setupEventListeners();
    }
    AgeCalculator.prototype.initializeModal = function () {
        var modalElement = document.getElementById('birthdayModal');
        if (modalElement) {
            this.modal = new bootstrap.Modal(modalElement);
        }
    };
    AgeCalculator.prototype.loadBirthdate = function () {
        var savedBirthdate = localStorage.getItem('birthdate');
        if (savedBirthdate) {
            this.birthdate = new Date(savedBirthdate);
            this.startUpdating();
        }
        else {
            this.showBirthdayModal();
        }
    };
    AgeCalculator.prototype.setupEventListeners = function () {
        var _this = this;
        // Birthday form submission
        var birthdayForm = document.getElementById('birthdayForm');
        birthdayForm === null || birthdayForm === void 0 ? void 0 : birthdayForm.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.handleBirthdaySubmit();
        });
        // Change birthday button
        var changeBirthdayBtn = document.getElementById('changeBirthday');
        changeBirthdayBtn === null || changeBirthdayBtn === void 0 ? void 0 : changeBirthdayBtn.addEventListener('click', function () {
            _this.showBirthdayModal();
        });
    };
    AgeCalculator.prototype.showBirthdayModal = function () {
        if (this.birthdate) {
            var birthdateInput = document.getElementById('birthdate');
            birthdateInput.value = this.birthdate.toISOString().split('T')[0];
        }
        this.modal.show();
    };
    AgeCalculator.prototype.handleBirthdaySubmit = function () {
        var birthdateInput = document.getElementById('birthdate');
        var newBirthdate = new Date(birthdateInput.value);
        if (newBirthdate > new Date()) {
            alert('Birthday cannot be in the future!');
            return;
        }
        this.birthdate = newBirthdate;
        localStorage.setItem('birthdate', newBirthdate.toISOString());
        this.modal.hide();
        this.startUpdating();
    };
    AgeCalculator.prototype.calculateAge = function () {
        if (!this.birthdate) {
            return { years: 0, months: 0, days: 0 };
        }
        var now = new Date();
        var years = now.getFullYear() - this.birthdate.getFullYear();
        var months = now.getMonth() - this.birthdate.getMonth();
        var days = now.getDate() - this.birthdate.getDate();
        if (days < 0) {
            months--;
            var lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, this.birthdate.getDate());
            days = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24));
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return { years: years, months: months, days: days };
    };
    AgeCalculator.prototype.updateDisplay = function () {
        var age = this.calculateAge();
        document.getElementById('years').textContent = age.years.toString();
        document.getElementById('months').textContent = age.months.toString();
        document.getElementById('days').textContent = age.days.toString();
    };
    AgeCalculator.prototype.startUpdating = function () {
        var _this = this;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateDisplay();
        this.updateInterval = window.setInterval(function () {
            _this.updateDisplay();
        }, 1000);
    };
    return AgeCalculator;
}());
// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new AgeCalculator();
});
