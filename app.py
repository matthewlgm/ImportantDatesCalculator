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

        def num_to_chinese(num):
            if num <= 10:
                return chinese_numbers[num]
            elif num < 20:
                return f"十{chinese_numbers[num-10]}" if num > 10 else "十"
            else:
                return f"{chinese_numbers[num//10]}十{chinese_numbers[num%10]}" if num % 10 != 0 else f"{chinese_numbers[num//10]}十"

        # Format lunar date string with Chinese characters
        lunar_str = f"{num_to_chinese(lunar.year)}年{num_to_chinese(lunar.month)}月{num_to_chinese(lunar.day)}日"

        return jsonify({
            'lunar_date': lunar_str
        })
    except Exception as e:
        logging.error(f"Error converting date: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)