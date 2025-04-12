from app import db  # 从 app.py 文件中导入数据库实例 db

# 定义一个名为 ImportantDate 的类，它继承自 db.Model，表示数据库中的一张表
class ImportantDate(db.Model):
    __tablename__ = 'important_date'  # 定义表名为 'important_date'

    # 定义 id 列，类型为 Integer（整数），是主键
    id = db.Column(db.Integer, primary_key=True)
    # 定义 name 列，类型为 String（字符串），最大长度为 100，不能为空
    name = db.Column(db.String(100), nullable=False)
    # 定义 date 列，类型为 Date（日期），不能为空
    date = db.Column(db.Date, nullable=False)
    # 定义 type 列，类型为 String（字符串），最大长度为 20，不能为空
    type = db.Column(db.String(20), nullable=False)
    # 定义 lunar_date 列，类型为 String（字符串），最大长度为 50，可以为空
    lunar_date = db.Column(db.String(50))

    # 定义一个 to_dict 方法，用于将对象转换为字典
    def to_dict(self):
        return {
            'id': self.id,  # id
            'name': self.name,  # 日期名称
            'date': self.date.isoformat(),  # 日期，转换为 ISO 格式的字符串
            'type': self.type,  # 日期类型
            'lunar_date': self.lunar_date  # 农历日期
        }
