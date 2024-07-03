from flask import Blueprint, request, jsonify
from models import User, Word, db, UserWord
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import pandas as pd 
routes = Blueprint('routes', __name__)
bcrypt = Bcrypt()

@routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')#使用 bcrypt 库对用户提供的密码进行哈希处理
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'username': user.username, 'email': user.email})
        return jsonify({'userId': user.id, 'token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@routes.route('/words/<int:user_id>', methods=['GET'])
def get_words(user_id):
    learned_count = UserWord.query.filter_by(user_id=user_id, status='learned').count()
    not_learned_count = UserWord.query.filter_by(user_id=user_id, status='not_learned').count()
    return jsonify({'learned': learned_count, 'not_learned': not_learned_count})
@routes.route('/unlearned_words/<int:user_id>', methods=['GET'])
def get_unlearned_words(user_id):
    words = UserWord.query.filter_by(user_id=user_id, status='not_learned').all()
    return jsonify([{'word': word.word.word, 'definition': word.word.definition} for word in words])

@routes.route('/mark_as_learned', methods=['POST'])
def mark_as_learned():
    try:
        data = request.json
        user_id = data.get('user_id')
        word = data.get('word')

        if not user_id or not word:
            return jsonify({'error': 'Missing user_id or word'}), 400

        # 查询单词对应的 word_id
        word_obj = Word.query.filter_by(word=word).first()
        if not word_obj:
            return jsonify({'error': 'Word not found'}), 404

        word_id = word_obj.id

        # 更新用户单词状态为已学过
        user_word = UserWord.query.filter_by(user_id=user_id, word_id=word_id).first()
        if user_word:
            user_word.status = 'learned'
            db.session.commit()
            return jsonify({'message': 'Word marked as learned'}), 200
        else:
            return jsonify({'error': 'UserWord not found'}), 404

    except Exception as e:
        traceback.print_exc()  # 打印异常信息到控制台
        return jsonify({'error': 'Internal server error'}), 500


