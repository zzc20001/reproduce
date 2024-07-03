from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)


class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(80), nullable=False)
    definition = db.Column(db.String(200), nullable=False)
   # image_url = db.Column(db.String(200), nullable=False)  # 添加图片URL字段

class UserWord(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    word_id = db.Column(db.Integer, db.ForeignKey('word.id'), primary_key=True)
    status = db.Column(db.String(20), nullable=False, default='not_learned')  # 'not_learned' 或 'learned'
    user = db.relationship('User', back_populates='words')
    word = db.relationship('Word', back_populates='users')

User.words = db.relationship('UserWord', back_populates='user')
Word.users = db.relationship('UserWord', back_populates='word')