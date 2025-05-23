from flask import Flask, render_template, request, jsonify
import logging
from datetime import datetime
from lunardate import LunarDate
# VSCode 编辑框里的 cSpell: Unknown word 是什么呢
from flask_sqlalchemy import SQLAlchemy
import os
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__)

app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL") or "sqlite:///app.db"

app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

db.init_app(app)

with app.app_context():
    import models
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dates', methods=['GET'])
def get_dates():
    dates = models.ImportantDate.query.all()
    return jsonify([date.to_dict() for date in dates])

@app.route('/dates', methods=['POST'])
def add_date():
    try:
        data = request.json
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()

        lunar = LunarDate.fromSolarDate(date.year, date.month, date.day)
        lunar_str = format_lunar_date(lunar)

        new_date = models.ImportantDate(
            name=data['name'],
            date=date,
            type=data['type'],
            lunar_date=lunar_str
        )

        db.session.add(new_date)
        db.session.commit()

        return jsonify(new_date.to_dict()), 201
    except Exception as e:
        logging.error(f"Error adding date: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/dates/<int:date_id>', methods=['DELETE'])
def delete_date(date_id):
    try:
        date = models.ImportantDate.query.get_or_404(date_id)
        db.session.delete(date)
        db.session.commit()
        return '', 204
    except Exception as e:
        logging.error(f"Error deleting date: {str(e)}")
        return jsonify({'error': str(e)}), 500

def format_lunar_date(lunar):
    chinese_numbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

    def get_year_chinese(year):
        result = ''
        for digit in str(year):
            result += chinese_numbers[int(digit)]
        return result

    def get_month_chinese(month):
        if month == 1:
            return '正'
        elif month <= 10:
            return chinese_numbers[month]
        else:
            return '十' + ('' if month == 10 else chinese_numbers[month-10])

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