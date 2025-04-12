from flask import Flask, render_template, request, jsonify  # 导入 Flask 库，用于创建 Web 应用
import logging  # 导入 logging 库，用于记录日志
from datetime import datetime  # 导入 datetime 库，用于处理日期和时间
from lunardate import LunarDate  # 导入 lunardate 库，用于处理农历日期
from flask_sqlalchemy import SQLAlchemy  # 导入 SQLAlchemy 库，用于操作数据库
import os  # 导入 os 库，用于访问操作系统功能，例如环境变量
from sqlalchemy.orm import DeclarativeBase  # 导入 DeclarativeBase，用于定义数据库模型
from dotenv import load_dotenv  # 导入 load_dotenv，用于加载 .env 文件中的环境变量

# 加载 .env 文件中的环境变量
load_dotenv()

# 定义一个基类，所有数据库模型都将继承自它
class Base(DeclarativeBase):
    pass

# 创建 SQLAlchemy 数据库实例
db = SQLAlchemy(model_class=Base)

# 创建 Flask 应用实例
app = Flask(__name__)

# 设置应用的 secret key，用于保护 session 数据
# 从环境变量中获取 FLASK_SECRET_KEY，如果不存在则使用 "a secret key" 作为默认值
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"

# 配置数据库连接 URI
# 从环境变量中获取 DATABASE_URL，例如 "sqlite:///./test.db" 或 "postgresql://user:password@host:port/database"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL") or "sqlite:///app.db"

# 配置 SQLAlchemy 引擎选项，用于优化数据库连接
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,  # 设置连接池中连接的回收时间，单位为秒
    "pool_pre_ping": True,  # 每次使用连接前，先 ping 一下数据库，确保连接有效
}

# 初始化 Flask 应用与 SQLAlchemy
db.init_app(app)

# 使用 app.app_context() 创建应用上下文
with app.app_context():
    # 导入 models 模块，确保数据库模型被创建
    import models  # noqa: F401  # noqa: F401 表示忽略 F401 错误（models 模块虽然被导入但没有直接使用）

    # 创建所有数据库表
    db.create_all()

# 定义路由，当用户访问根路径 '/' 时，返回 index.html 模板
@app.route('/')
def index():
    return render_template('index.html')  # 使用 render_template 函数渲染 index.html 模板

# 定义路由，当用户访问 '/dates' 且使用 GET 方法时，返回所有日期数据
@app.route('/dates', methods=['GET'])
def get_dates():
    dates = models.ImportantDate.query.all()  # 从数据库中查询所有 ImportantDate 对象
    return jsonify([date.to_dict() for date in dates])  # 将查询结果转换为 JSON 格式并返回

# 定义路由，当用户访问 '/dates' 且使用 POST 方法时，添加新的日期数据
@app.route('/dates', methods=['POST'])
def add_date():
    try:
        data = request.json  # 从请求中获取 JSON 数据
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()  # 将字符串日期转换为 datetime.date 对象

        # 转换为农历日期
        lunar = LunarDate.fromSolarDate(date.year, date.month, date.day)
        lunar_str = format_lunar_date(lunar)

        new_date = models.ImportantDate(  # 创建新的 ImportantDate 对象
            name=data['name'],  # 从 JSON 数据中获取日期名称
            date=date,  # 从 JSON 数据中获取日期
            type=data['type'],  # 从 JSON 数据中获取日期类型
            lunar_date=lunar_str # 农历日期
        )

        db.session.add(new_date)  # 将新日期添加到数据库会话
        db.session.commit()  # 提交数据库会话，保存更改

        return jsonify(new_date.to_dict()), 201  # 将新日期转换为 JSON 格式并返回，状态码为 201 (Created)
    except Exception as e:  # 捕获所有异常
        logging.error(f"Error adding date: {str(e)}")  # 记录错误日志
        return jsonify({'error': str(e)}), 500  # 返回错误信息，状态码为 500 (Internal Server Error)

# 定义路由，当用户访问 '/dates/<int:date_id>' 且使用 DELETE 方法时，删除指定 ID 的日期数据
@app.route('/dates/<int:date_id>', methods=['DELETE'])
def delete_date(date_id):
    try:
        date = models.ImportantDate.query.get_or_404(date_id)  # 从数据库中查询指定 ID 的 ImportantDate 对象，如果不存在则返回 404 错误
        db.session.delete(date)  # 从数据库会话中删除日期
        db.session.commit()  # 提交数据库会话，保存更改
        return '', 204  # 返回空字符串，状态码为 204 (No Content)
    except Exception as e:  # 捕获所有异常
        logging.error(f"Error deleting date: {str(e)}")  # 记录错误日志
        return jsonify({'error': str(e)}), 500  # 返回错误信息，状态码为 500 (Internal Server Error)

# 格式化农历日期
def format_lunar_date(lunar):
    # 中文数字映射
    chinese_numbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

    # 获取中文年份
    def get_year_chinese(year):
        result = ''
        for digit in str(year):
            result += chinese_numbers[int(digit)]
        return result

    # 获取中文月份
    def get_month_chinese(month):
        if month == 1:
            return '正'
        elif month <= 10:
            return chinese_numbers[month]
        else:
            return '十' + ('' if month == 10 else chinese_numbers[month-10])

    # 获取中文日期
    def get_day_chinese(day):
        if day <= 10:
            return '初' + chinese_numbers[day]
        elif day < 20:
            return '十' + ('' if day == 10 else chinese_numbers[day-10])
        elif day == 20:
            return '二十'
        elif day < 30:
            return '廿' + chinese_numbers[day-20]
        elif day == 30:
            return '三十'
        else:
            return '三十' + chinese_numbers[day-30]

    return f"{get_year_chinese(lunar.year)}年{get_month_chinese(lunar.month)}月{get_day_chinese(lunar.day)}日"

# 如果当前文件作为主程序运行
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)  # 将端口从 5000 改为 5001