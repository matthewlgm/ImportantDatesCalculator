from app import db

class ImportantDate(db.Model):
    __tablename__ = 'important_date'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    lunar_date = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'date': self.date.isoformat(),
            'type': self.type,
            'lunar_date': self.lunar_date
        }
