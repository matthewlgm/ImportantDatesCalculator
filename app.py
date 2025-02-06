from flask import Flask, render_template, request, jsonify
import logging
from datetime import datetime
from lunardate import LunarDate

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = "age_calculator_secret_key"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_lunar_date', methods=['POST'])
def get_lunar_date():
    try:
        date_str = request.json.get('date')
        if not date_str:
            return jsonify({'error': 'No date provided'}), 400

        # Convert string to date
        date = datetime.strptime(date_str, '%Y-%m-%d')

        # Convert to lunar date
        lunar = LunarDate.fromSolarDate(date.year, date.month, date.day)

        # Chinese number mapping
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

        # Format lunar date string with Chinese characters
        lunar_str = f"{get_year_chinese(lunar.year)}年{get_month_chinese(lunar.month)}月{get_day_chinese(lunar.day)}日"

        return jsonify({
            'lunar_date': lunar_str
        })
    except Exception as e:
        logging.error(f"Error converting date: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)