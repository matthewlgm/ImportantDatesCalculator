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
// 定义 AgeCalculator 类，用于计算年龄和管理重要日期
class AgeCalculator {
    // 构造函数，在创建 AgeCalculator 对象时自动调用
    constructor() {
        this.dates = []; // dates 是 ImportantDate 类型的数组，用于存储所有重要日期
        this.initialize(); // 调用 initialize 方法进行初始化
    }
    // 初始化方法，用于设置事件监听器和加载日期数据
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // 初始化模态框
            const modalElement = document.getElementById('dateModal'); // 获取 id 为 'dateModal' 的 HTML 元素
            if (modalElement) { // 如果找到了该元素
                this.modal = new bootstrap.Modal(modalElement); // 创建 Bootstrap 模态框对象
            }
            // 设置事件监听器
            this.setupEventListeners();
            // 从服务器加载日期数据
            yield this.loadDates();
            // 开始定时更新年龄
            setInterval(() => this.updateAllAges(), 1000); // 每隔 1000 毫秒（1 秒）调用一次 updateAllAges 方法
        });
    }
    // 从服务器加载日期数据的方法
    loadDates() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/dates'); // 使用 fetch API 发送 GET 请求到 '/dates' 路径
                if (!response.ok) { // 如果响应状态码不是 200-299，表示请求失败
                    throw new Error('Failed to load dates'); // 抛出错误
                }
                this.dates = yield response.json(); // 将响应的 JSON 数据解析为 ImportantDate 类型的数组
                this.updateDisplay(); // 更新页面显示
            }
            catch (error) {
                console.error('Error loading dates:', error); // 在控制台输出错误信息
                alert('Error loading dates. Please try again.'); // 弹出错误提示框
            }
        });
    }
    // 设置事件监听器的方法
    setupEventListeners() {
        // 日期表单提交事件
        const form = document.getElementById('dateForm'); // 获取 id 为 'dateForm' 的 HTML 元素
        form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => {
            e.preventDefault(); // 阻止表单的默认提交行为
            this.handleDateSubmit(); // 调用 handleDateSubmit 方法处理表单提交
        });
        // 添加新日期按钮点击事件
        const addBtn = document.getElementById('addDate'); // 获取 id 为 'addDate' 的 HTML 元素
        addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', () => {
            this.showDateModal(); // 调用 showDateModal 方法显示模态框
        });
        // 删除日期事件委托
        const container = document.getElementById('datesContainer'); // 获取 id 为 'datesContainer' 的 HTML 元素
        container === null || container === void 0 ? void 0 : container.addEventListener('click', (e) => {
            const target = e.target; // 获取事件目标元素
            if (target.classList.contains('delete-date')) { // 如果目标元素包含 'delete-date' 类名
                const dateId = target.getAttribute('data-id'); // 获取目标元素的 'data-id' 属性值
                if (dateId) { // 如果找到了 'data-id' 属性
                    this.handleDateDelete(parseInt(dateId)); // 调用 handleDateDelete 方法处理日期删除
                }
            }
        });
    }
    // 处理日期表单提交的方法
    handleDateSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            const input = document.getElementById('date'); // 获取 id 为 'date' 的 HTML 元素
            const nameInput = document.getElementById('dateName'); // 获取 id 为 'dateName' 的 HTML 元素
            const typeSelect = document.getElementById('dateType'); // 获取 id 为 'dateType' 的 HTML 元素
            const newDate = new Date(input.value); // 创建 Date 对象
            if (newDate > new Date()) { // 如果选择的日期是未来日期
                alert('Date cannot be in the future!'); // 弹出提示框
                return; // 结束方法
            }
            try {
                const response = yield fetch('/dates', {
                    method: 'POST', // 设置请求方法为 POST
                    headers: {
                        'Content-Type': 'application/json', // 设置 Content-Type 为 application/json
                    },
                    body: JSON.stringify({
                        name: nameInput.value, // 日期名称
                        date: input.value, // 日期
                        type: typeSelect.value // 日期类型
                    })
                });
                if (!response.ok) { // 如果响应状态码不是 200-299，表示请求失败
                    throw new Error('Failed to add date'); // 抛出错误
                }
                const addedDate = yield response.json(); // 将响应的 JSON 数据解析为 ImportantDate 类型的对象
                this.dates.push(addedDate); // 将新添加的日期添加到 dates 数组中
                this.modal.hide(); // 隐藏模态框
                this.updateDisplay(); // 更新页面显示
            }
            catch (error) {
                console.error('Error adding date:', error); // 在控制台输出错误信息
                alert('Error adding date. Please try again.'); // 弹出错误提示框
            }
        });
    }
    // 处理日期删除的方法
    handleDateDelete(dateId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm('Are you sure you want to delete this date?')) { // 弹出确认对话框
                return; // 如果用户点击取消，结束方法
            }
            try {
                const response = yield fetch(`/dates/${dateId}`, {
                    method: 'DELETE' // 设置请求方法为 DELETE
                });
                if (!response.ok) { // 如果响应状态码不是 200-299，表示请求失败
                    throw new Error('Failed to delete date'); // 抛出错误
                }
                this.dates = this.dates.filter(date => date.id !== dateId); // 从 dates 数组中移除已删除的日期
                this.updateDisplay(); // 更新页面显示
            }
            catch (error) {
                console.error('Error deleting date:', error); // 在控制台输出错误信息
                alert('Error deleting date. Please try again.'); // 弹出错误提示框
            }
        });
    }
    // 显示日期模态框的方法
    showDateModal() {
        if (this.modal) { // 如果模态框对象存在
            const input = document.getElementById('date'); // 获取 id 为 'date' 的 HTML 元素
            const nameInput = document.getElementById('dateName'); // 获取 id 为 'dateName' 的 HTML 元素
            const typeSelect = document.getElementById('dateType'); // 获取 id 为 'dateType' 的 HTML 元素
            input.value = ''; // 清空日期输入框
            nameInput.value = ''; // 清空名称输入框
            typeSelect.value = 'birthday'; // 设置类型选择框的默认值为 'birthday'
            this.modal.show(); // 显示模态框
        }
    }
    // 计算年龄的方法
    calculateAge(dateStr) {
        const date = new Date(dateStr); // 创建 Date 对象
        const now = new Date(); // 获取当前时间
        let years = now.getFullYear() - date.getFullYear(); // 计算年份差
        let months = now.getMonth() - date.getMonth(); // 计算月份差
        let days = now.getDate() - date.getDate(); // 计算天数差
        if (days < 0) { // 如果天数差小于 0
            months--; // 月份减 1
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, date.getDate()); // 获取上个月的日期
            days = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24)); // 重新计算天数差
        }
        if (months < 0) { // 如果月份差小于 0
            years--; // 年份减 1
            months += 12; // 月份加 12
        }
        return { years, months, days }; // 返回包含年、月、日的对象
    }
    // 更新所有日期年龄的方法
    updateAllAges() {
        this.dates.forEach((date) => {
            const age = this.calculateAge(date.date); // 计算年龄
            const dateContainer = document.getElementById(`date-${date.id}`); // 获取 id 为 'date-:dateId' 的 HTML 元素
            if (dateContainer) { // 如果找到了该元素
                const yearsEl = dateContainer.querySelector('.years'); // 获取年份元素
                const monthsEl = dateContainer.querySelector('.months'); // 获取月份元素
                const daysEl = dateContainer.querySelector('.days'); // 获取天数元素
                if (yearsEl)
                    yearsEl.textContent = age.years.toString(); // 更新年份元素的文本内容
                if (monthsEl)
                    monthsEl.textContent = age.months.toString(); // 更新月份元素的文本内容
                if (daysEl)
                    daysEl.textContent = age.days.toString(); // 更新天数元素的文本内容
            }
        });
    }
    // 更新页面显示的方法
    updateDisplay() {
        const container = document.getElementById('datesContainer'); // 获取 id 为 'datesContainer' 的 HTML 元素
        if (!container)
            return; // 如果没有找到该元素，结束方法
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
        `).join(''); // 将 dates 数组转换为 HTML 字符串
        this.updateAllAges(); // 更新所有日期的年龄
    }
    // 获取类型颜色
    getTypeColor(type) {
        switch (type) {
            case 'birthday': // 如果类型是 'birthday'
                return 'primary'; // 返回 'primary'
            case 'anniversary': // 如果类型是 'anniversary'
                return 'success'; // 返回 'success'
            default: // 否则
                return 'info'; // 返回 'info'
        }
    }
}
// 在窗口加载完成后初始化
window.addEventListener('load', () => {
    new AgeCalculator(); // 创建 AgeCalculator 对象
});
