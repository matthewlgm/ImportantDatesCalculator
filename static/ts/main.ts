// declare 声明一个变量，告诉 TypeScript 编译器，我们知道有这么一个全局变量存在，它的类型是 any (任意类型)。
// bootstrap 是一个 JavaScript 库，用于快速开发响应式的网页。这里假设 bootstrap 已经在其他地方被引入（例如，通过 HTML 的 <script> 标签）。
declare const bootstrap: any;

// interface 是 TypeScript 中定义接口的关键字。接口用于描述一个对象应该具有的结构。
// ImportantDate 接口定义了一个重要日期的结构，包括 id（唯一标识符），name（名称），date（日期字符串），type（类型），以及可选的 lunar_date（农历日期字符串）。
interface ImportantDate {
    id: number; // id 属性，类型是 number（数字），表示日期的唯一标识符。
    name: string; // name 属性，类型是 string（字符串），表示日期的名称。
    date: string; // date 属性，类型是 string（字符串），表示日期的字符串形式，通常是 ISO 8601 格式。
    type: 'birthday' | 'anniversary' | 'other'; // type 属性，类型是字符串字面量类型，只能是 'birthday'、'anniversary' 或 'other' 中的一个。这是一种 TypeScript 的类型约束，用于限制变量的取值范围。
    lunar_date?: string; // lunar_date 属性，类型是 string（字符串），表示农历日期。? 表示这个属性是可选的，即可以存在，也可以不存在。
}

// class 是 TypeScript 中定义类的关键字。类是创建对象的模板。
// AgeCalculator 类用于计算和显示重要日期的年龄信息。
class AgeCalculator {
    private dates: ImportantDate[] = []; // dates 属性，类型是 ImportantDate 类型的数组。private 关键字表示这个属性只能在 AgeCalculator 类内部访问。[] 表示这是一个数组。= [] 表示初始化为空数组。
    private modal: any; // modal 属性，类型是 any (任意类型)。private 关键字表示这个属性只能在 AgeCalculator 类内部访问。这里用于存储 Bootstrap 的模态框对象。

    // constructor 是类的构造函数，用于在创建对象时进行初始化。
    constructor() {
        this.initialize(); // 在构造函数中调用 initialize 方法，进行初始化操作。this 关键字指向当前创建的对象。
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    // async 关键字表示这是一个异步方法，可以使用 await 关键字来等待异步操作完成。 
    private async initialize(): Promise<void> {
        // document 是 JavaScript 中的全局对象，表示当前网页的文档。
        // getElementById 是 document 对象的方法，用于通过 id 获取 HTML 元素。
        const modalElement = document.getElementById('dateModal');
        // if 语句用于判断 modalElement 是否存在。
        if (modalElement) {
            // bootstrap.Modal 是 Bootstrap 库中的一个类，用于创建模态框。
            // new bootstrap.Modal(modalElement) 创建一个新的模态框对象，并将其赋值给 this.modal。
            this.modal = new bootstrap.Modal(modalElement);
        }

        this.setupEventListeners(); // 调用 setupEventListeners 方法，设置事件监听器。
        await this.loadDates(); // 调用 loadDates 方法，加载日期数据。await 关键字用于等待异步操作完成。
        setInterval(() => this.updateAllAges(), 1000); // setInterval 是 JavaScript 中的全局函数，用于每隔一定时间执行一个函数。这里每隔 1000 毫秒（1 秒）调用一次 this.updateAllAges 方法，更新所有日期的年龄信息。
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    // async 关键字表示这是一个异步方法，可以使用 await 关键字来等待异步操作完成。
    private async loadDates(): Promise<void> {
        // try...catch 语句用于捕获和处理异常。
        try {
            // fetch 是 JavaScript 中的全局函数，用于发起网络请求。
            // '/dates' 是请求的 URL，这里假设服务器提供了一个 /dates 接口，用于获取日期数据。
            const response = await fetch('/dates');
            // if 语句用于判断 response.ok 是否为 true。response.ok 表示请求是否成功。
            if (!response.ok) {
                // throw 语句用于抛出一个异常。
                // new Error('Failed to load dates') 创建一个新的 Error 对象，并将其抛出。
                throw new Error('Failed to load dates');
            }
            // response.json() 方法用于将响应体解析为 JSON 对象。
            // await 关键字用于等待异步操作完成。
            this.dates = await response.json();
            this.updateDisplay(); // 调用 updateDisplay 方法，更新页面显示。
        } catch (error) {
            // console.error 是 JavaScript 中的全局对象 console 的方法，用于在控制台输出错误信息。
            console.error('Error loading dates:', error);
            // alert 是 JavaScript 中的全局函数，用于弹出一个警告框。
            alert('Error loading dates. Please try again.');
        }
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    private setupEventListeners(): void {
        // document 是 JavaScript 中的全局对象，表示当前网页的文档。
        // getElementById 是 document 对象的方法，用于通过 id 获取 HTML 元素。
        const form = document.getElementById('dateForm');
        // form?.addEventListener 是 TypeScript 中的可选链操作符。如果 form 为 null 或 undefined，则不会执行 addEventListener 方法。
        // addEventListener 是 JavaScript 中的方法，用于为一个 HTML 元素添加事件监听器。
        form?.addEventListener('submit', (e) => {
            // e 是事件对象，包含了事件的相关信息。
            // e.preventDefault() 方法用于阻止表单的默认提交行为。
            e.preventDefault();
            this.handleDateSubmit(); // 调用 handleDateSubmit 方法，处理日期提交事件。
        });

        const addBtn = document.getElementById('addDate');
        addBtn?.addEventListener('click', () => {
            this.showDateModal(); // 调用 showDateModal 方法，显示日期模态框。
        });

        const container = document.getElementById('datesContainer');
        container?.addEventListener('click', (e) => {
            // e.target 是事件的目标元素。
            const target = e.target as HTMLElement; // as HTMLElement 是 TypeScript 中的类型断言，用于告诉编译器 target 是一个 HTMLElement 对象。
            // target.classList 是 HTMLElement 对象的一个属性，表示元素的 class 列表。
            // target.classList.contains('delete-date') 方法用于判断元素是否包含 delete-date class。
            if (target.classList.contains('delete-date')) {
                // target.getAttribute('data-id') 方法用于获取元素 data-id 属性的值。
                const dateId = target.getAttribute('data-id');
                // if 语句用于判断 dateId 是否存在。
                if (dateId) {
                    this.handleDateDelete(parseInt(dateId)); // 调用 handleDateDelete 方法，处理日期删除事件。parseInt 是 JavaScript 中的全局函数，用于将字符串转换为整数。
                }
            }
        });
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    // async 关键字表示这是一个异步方法，可以使用 await 关键字来等待异步操作完成。
    private async handleDateSubmit(): Promise<void> {
        // document 是 JavaScript 中的全局对象，表示当前网页的文档。
        // getElementById 是 document 对象的方法，用于通过 id 获取 HTML 元素。
        const input = document.getElementById('date') as HTMLInputElement; // as HTMLInputElement 是 TypeScript 中的类型断言，用于告诉编译器 input 是一个 HTMLInputElement 对象。
        const nameInput = document.getElementById('dateName') as HTMLInputElement; // as HTMLInputElement 是 TypeScript 中的类型断言，用于告诉编译器 nameInput 是一个 HTMLInputElement 对象。
        const typeSelect = document.getElementById('dateType') as HTMLSelectElement; // as HTMLSelectElement 是 TypeScript 中的类型断言，用于告诉编译器 typeSelect 是一个 HTMLSelectElement 对象。

        // new Date(input.value) 创建一个新的 Date 对象，表示用户输入的日期。
        const newDate = new Date(input.value);
        // new Date() 创建一个新的 Date 对象，表示当前日期和时间。
        // if 语句用于判断 newDate 是否大于当前日期。
        if (newDate > new Date()) {
            // alert 是 JavaScript 中的全局函数，用于弹出一个警告框。
            alert('Date cannot be in the future!');
            return; // return 语句用于结束当前方法的执行。
        }

        // try...catch 语句用于捕获和处理异常。
        try {
            // fetch 是 JavaScript 中的全局函数，用于发起网络请求。
            // '/dates' 是请求的 URL，这里假设服务器提供了一个 /dates 接口，用于添加日期数据。
            const response = await fetch('/dates', {
                // method 属性指定请求的方法，这里是 POST 方法，表示向服务器提交数据。
                method: 'POST',
                // headers 属性指定请求的头部信息。
                headers: {
                    // 'Content-Type': 'application/json' 表示请求体的类型是 JSON。
                    'Content-Type': 'application/json',
                },
                // body 属性指定请求体的内容。
                // JSON.stringify() 方法用于将 JavaScript 对象转换为 JSON 字符串。
                body: JSON.stringify({
                    name: nameInput.value, // nameInput.value 获取用户输入的日期名称。
                    date: input.value, // input.value 获取用户输入的日期。
                    type: typeSelect.value // typeSelect.value 获取用户选择的日期类型。
                })
            });

            // if 语句用于判断 response.ok 是否为 true。response.ok 表示请求是否成功。
            if (!response.ok) {
                // throw 语句用于抛出一个异常。
                // new Error('Failed to add date') 创建一个新的 Error 对象，并将其抛出。
                throw new Error('Failed to add date');
            }

            // response.json() 方法用于将响应体解析为 JSON 对象。
            // await 关键字用于等待异步操作完成。
            const addedDate = await response.json();
            // this.dates.push(addedDate) 方法用于将 addedDate 添加到 this.dates 数组中。
            this.dates.push(addedDate);
            // this.modal.hide() 方法用于隐藏模态框。
            this.modal.hide();
            this.updateDisplay(); // 调用 updateDisplay 方法，更新页面显示。
        } catch (error) {
            // console.error 是 JavaScript 中的全局对象 console 的方法，用于在控制台输出错误信息。
            console.error('Error adding date:', error);
            // alert 是 JavaScript 中的全局函数，用于弹出一个警告框。
            alert('Error adding date. Please try again.');
        }
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    // async 关键字表示这是一个异步方法，可以使用 await 关键字来等待异步操作完成。
    private async handleDateDelete(dateId: number): Promise<void> {
        // confirm 是 JavaScript 中的全局函数，用于弹出一个确认框。
        if (!confirm('Are you sure you want to delete this date?')) {
            return; // return 语句用于结束当前方法的执行。
        }

        // try...catch 语句用于捕获和处理异常。
        try {
            // fetch 是 JavaScript 中的全局函数，用于发起网络请求。
            // `/dates/${dateId}` 是请求的 URL，这里假设服务器提供了一个 /dates/:id 接口，用于删除指定 id 的日期数据。
            const response = await fetch(`/dates/${dateId}`, {
                // method 属性指定请求的方法，这里是 DELETE 方法，表示删除服务器上的数据。
                method: 'DELETE'
            });

            // if 语句用于判断 response.ok 是否为 true。response.ok 表示请求是否成功。
            if (!response.ok) {
                // throw 语句用于抛出一个异常。
                // new Error('Failed to delete date') 创建一个新的 Error 对象，并将其抛出。
                throw new Error('Failed to delete date');
            }

            // this.dates.filter(date => date.id !== dateId) 方法用于创建一个新的数组，其中包含所有 id 不等于 dateId 的日期。
            this.dates = this.dates.filter(date => date.id !== dateId);
            this.updateDisplay(); // 调用 updateDisplay 方法，更新页面显示。
        } catch (error) {
            // console.error 是 JavaScript 中的全局对象 console 的方法，用于在控制台输出错误信息。
            console.error('Error deleting date:', error);
            // alert 是 JavaScript 中的全局函数，用于弹出一个警告框。
            alert('Error deleting date. Please try again.');
        }
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    private showDateModal(): void {
        // if 语句用于判断 this.modal 是否存在。
        if (this.modal) {
            // document 是 JavaScript 中的全局对象，表示当前网页的文档。
            // getElementById 是 document 对象的方法，用于通过 id 获取 HTML 元素。
            const input = document.getElementById('date') as HTMLInputElement; // as HTMLInputElement 是 TypeScript 中的类型断言，用于告诉编译器 input 是一个 HTMLInputElement 对象。
            const nameInput = document.getElementById('dateName') as HTMLInputElement; // as HTMLInputElement 是 TypeScript 中的类型断言，用于告诉编译器 nameInput 是一个 HTMLInputElement 对象。
            const typeSelect = document.getElementById('dateType') as HTMLSelectElement; // as HTMLSelectElement 是 TypeScript 中的类型断言，用于告诉编译器 typeSelect 是一个 HTMLSelectElement 对象。

            // input.value = '' 方法用于清空输入框的值。
            input.value = '';
            nameInput.value = '';
            typeSelect.value = 'birthday';

            // this.modal.show() 方法用于显示模态框。
            this.modal.show();
        }
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    private calculateAge(dateStr: string): { years: number; months: number; days: number } {
        // new Date(dateStr) 创建一个新的 Date 对象，表示传入的日期字符串。
        const date = new Date(dateStr);
        // new Date() 创建一个新的 Date 对象，表示当前日期和时间。
        const now = new Date();
        let years = now.getFullYear() - date.getFullYear(); // getFullYear() 方法用于获取 Date 对象的年份。
        let months = now.getMonth() - date.getMonth(); // getMonth() 方法用于获取 Date 对象的月份，从 0 开始计数。
        let days = now.getDate() - date.getDate(); // getDate() 方法用于获取 Date 对象的日期。

        // if 语句用于判断 days 是否小于 0。
        if (days < 0) {
            months--; // 如果 days 小于 0，则月份减 1。
            // new Date(now.getFullYear(), now.getMonth() - 1, date.getDate()) 创建一个新的 Date 对象，表示上个月的日期。
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, date.getDate());
            // Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24)) 计算当前日期和上个月日期之间的天数差。
            days = Math.floor((now.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24)); // getTime() 方法用于获取 Date 对象的时间戳，单位是毫秒。
        }

        // if 语句用于判断 months 是否小于 0。
        if (months < 0) {
            years--; // 如果 months 小于 0，则年份减 1。
            months += 12; // 月份加上 12。
        }

        // return 语句用于返回一个对象，包含 years、months 和 days 属性。
        return { years, months, days };
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    private updateAllAges(): void {
        // this.dates.forEach((date) => { ... }) 方法用于遍历 this.dates 数组中的每一个日期。
        this.dates.forEach((date) => {
            const age = this.calculateAge(date.date); // 调用 calculateAge 方法，计算日期的年龄。
            // document 是 JavaScript 中的全局对象，表示当前网页的文档。
            // getElementById 是 document 对象的方法，用于通过 id 获取 HTML 元素。
            const dateContainer = document.getElementById(`date-${date.id}`);
            // if 语句用于判断 dateContainer 是否存在。
            if (dateContainer) {
                // dateContainer.querySelector('.years') 方法用于在 dateContainer 元素中查找 class 为 years 的元素。
                const yearsEl = dateContainer.querySelector('.years');
                const monthsEl = dateContainer.querySelector('.months');
                const daysEl = dateContainer.querySelector('.days');

                // if 语句用于判断 yearsEl 是否存在。
                if (yearsEl) yearsEl.textContent = age.years.toString(); // yearsEl.textContent = age.years.toString() 方法用于将 age.years 的值设置为 yearsEl 元素的文本内容。toString() 方法用于将数字转换为字符串。
                if (monthsEl) monthsEl.textContent = age.months.toString(); // monthsEl.textContent = age.months.toString() 方法用于将 age.months 的值设置为 monthsEl 元素的文本内容。toString() 方法用于将数字转换为字符串。
                if (daysEl) daysEl.textContent = age.days.toString(); // daysEl.textContent = age.days.toString() 方法用于将 age.days 的值设置为 daysEl 元素的文本内容。toString() 方法用于将数字转换为字符串。
            }
        });
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    private updateDisplay(): void {
        // document 是 JavaScript 中的全局对象，表示当前网页的文档。
        // getElementById 是 document 对象的方法，用于通过 id 获取 HTML 元素。
        const container = document.getElementById('datesContainer');
        // if 语句用于判断 container 是否存在。
        if (!container) return; // 如果 container 不存在，则直接返回。

        // this.dates.map(date => `...`).join('') 方法用于将 this.dates 数组中的每一个日期转换为一个 HTML 字符串，并将所有字符串连接起来。
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
        `).join(''); // join('') 方法用于将数组中的所有元素连接成一个字符串，使用空字符串作为分隔符。

        this.updateAllAges(); // 调用 updateAllAges 方法，更新所有日期的年龄信息。
    }

    // private 关键字表示这个方法只能在 AgeCalculator 类内部访问。
    private getTypeColor(type: string): string {
        // switch 语句用于根据 type 的值选择不同的代码块执行。
        switch (type) {
            case 'birthday': // 如果 type 的值是 'birthday'，则执行下面的代码块。
                return 'primary'; // 返回 'primary' 字符串。
            case 'anniversary': // 如果 type 的值是 'anniversary'，则执行下面的代码块。
                return 'success'; // 返回 'success' 字符串。
            default: // 如果 type 的值不是 'birthday' 或 'anniversary'，则执行下面的代码块。
                return 'info'; // 返回 'info' 字符串。
        }
    }
}

// window 是 JavaScript 中的全局对象，表示当前浏览器窗口。
// window.addEventListener('load', () => { ... }) 方法用于在页面加载完成后执行一个函数。
window.addEventListener('load', () => {
    new AgeCalculator(); // 创建一个新的 AgeCalculator 对象。
});