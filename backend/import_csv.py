import pandas as pd
from models import db, Word, UserWord,User
from app import app

def import_csv(file_path):
    df = pd.read_csv(file_path)
    with app.app_context():
        for index, row in df.iterrows():
            new_word = Word(word=row['English Word'], definition=row['Meaning'])
            db.session.add(new_word)
        db.session.commit()

def link_user_words(user_id):
    with app.app_context():
        user = User.query.get(user_id)
        if user:
            word_ids = [word.id for word in Word.query.all()]
            for word_id in word_ids:
                user_word = UserWord(user_id=user_id, word_id=word_id, status='not_learned')
                db.session.add(user_word)
            db.session.commit()
        else:
            print(f"User with ID {user_id} does not exist.")

if __name__ == '__main__':
   

    # 假设你已经有一个用户 ID
    user_id = 2  # 你需要根据实际情况调整这个 ID

    # 将用户与单词关联并插入到 UserWord 表中
    link_user_words(user_id)
