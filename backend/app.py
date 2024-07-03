from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from routes import routes
from models import db
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_SECRET_KEY'] = 'your_secret_key'

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(routes)

def init_db():
    if not os.path.exists('database.db'):
        with app.app_context():
            db.create_all()

init_db()

if __name__ == '__main__':
    app.run(debug=True)
