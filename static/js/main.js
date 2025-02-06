var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var AgeCalculator = /** @class */ (function () {
    function AgeCalculator() {
        this.birthdate = null;
        this.modal = null;
        this.updateInterval = null;
        console.log('AgeCalculator: Constructor called');
        this.initializeComponents();
    }
    AgeCalculator.prototype.initializeComponents = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('AgeCalculator: Initializing components');
                        return [4 /*yield*/, this.initializeModal()];
                    case 1:
                        _a.sent();
                        this.loadBirthdate();
                        this.setupEventListeners();
                        return [2 /*return*/];
                }
            });
        });
    };
    AgeCalculator.prototype.initializeModal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('AgeCalculator: Initializing modal');
                return [2 /*return*/, new Promise(function (resolve) {
                        var checkModal = function () {
                            var modalElement = document.getElementById('birthdayModal');
                            if (modalElement && window.bootstrap && window.bootstrap.Modal) {
                                console.log('AgeCalculator: Bootstrap Modal found');
                                _this.modal = new bootstrap.Modal(modalElement, {
                                    keyboard: false,
                                    backdrop: 'static'
                                });
                                resolve();
                            }
                            else {
                                console.log('AgeCalculator: Waiting for Bootstrap...');
                                setTimeout(checkModal, 100);
                            }
                        };
                        checkModal();
                    })];
            });
        });
    };
    AgeCalculator.prototype.loadBirthdate = function () {
        console.log('AgeCalculator: Loading birthdate');
        var savedBirthdate = localStorage.getItem('birthdate');
        if (savedBirthdate) {
            console.log('AgeCalculator: Found saved birthdate');
            this.birthdate = new Date(savedBirthdate);
            this.startUpdating();
        }
        else {
            console.log('AgeCalculator: No saved birthdate, showing modal');
            this.showBirthdayModal();
        }
    };
    AgeCalculator.prototype.setupEventListeners = function () {
        var _this = this;
        console.log('AgeCalculator: Setting up event listeners');
        // Birthday form submission
        var birthdayForm = document.getElementById('birthdayForm');
        if (birthdayForm) {
            console.log('AgeCalculator: Found birthday form');
            birthdayForm.addEventListener('submit', function (e) {
                e.preventDefault();
                _this.handleBirthdaySubmit();
            });
        }
        else {
            console.error('AgeCalculator: Birthday form not found');
        }
        // Change birthday button
        var changeBirthdayBtn = document.getElementById('changeBirthday');
        if (changeBirthdayBtn) {
            console.log('AgeCalculator: Found change birthday button');
            changeBirthdayBtn.addEventListener('click', function () {
                _this.showBirthdayModal();
            });
        }
        else {
            console.error('AgeCalculator: Change birthday button not found');
        }
    };
    AgeCalculator.prototype.showBirthdayModal = function () {
        console.log('AgeCalculator: Attempting to show modal');
        if (!this.modal) {
            console.error('AgeCalculator: Modal not initialized');
            return;
        }
        if (this.birthdate) {
            var birthdateInput = document.getElementById('birthdate');
            if (birthdateInput) {
                birthdateInput.value = this.birthdate.toISOString().split('T')[0];
            }
        }
        try {
            console.log('AgeCalculator: Showing modal');
            this.modal.show();
        }
        catch (error) {
            console.error('AgeCalculator: Error showing modal:', error);
        }
    };
    AgeCalculator.prototype.handleBirthdaySubmit = function () {
        var _a;
        console.log('AgeCalculator: Handling birthday submit');
        var birthdateInput = document.getElementById('birthdate');
        var newBirthdate = new Date(birthdateInput.value);
        if (newBirthdate > new Date()) {
            alert('Birthday cannot be in the future!');
            return;
        }
        this.birthdate = newBirthdate;
        localStorage.setItem('birthdate', newBirthdate.toISOString());
        (_a = this.modal) === null || _a === void 0 ? void 0 : _a.hide();
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
        var yearsElement = document.getElementById('years');
        var monthsElement = document.getElementById('months');
        var daysElement = document.getElementById('days');
        if (yearsElement)
            yearsElement.textContent = age.years.toString();
        if (monthsElement)
            monthsElement.textContent = age.months.toString();
        if (daysElement)
            daysElement.textContent = age.days.toString();
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
// Wait for DOM and Bootstrap to load
window.addEventListener('load', function () {
    console.log('Window loaded, waiting for Bootstrap...');
    if (document.readyState === 'complete') {
        console.log('Document ready, creating AgeCalculator');
        new AgeCalculator();
    }
});
