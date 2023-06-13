from supabase import create_client, Client
import os
import uuid
import bcrypt
import jwt
import re
import datetime


class SupabaseDatabase:
    _instance = None

    def __init__(self):
        supabase_url = os.environ.get('SUPABASE_URL') # Put your Supabase URL here
        supabase_key = os.environ.get('SUPABASE_KEY') # Put your Supabase secret key here
        self.supabase = create_client(supabase_url, supabase_key)
        self.my_super_secret = "some_super_duper_secret"

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def validate_email(self, email):
        regex = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
        if re.fullmatch(regex, email):
            return True
        else:
            return False

    def encrypt_password(self, password):
        encoded_password = password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=5)
        hashed_password = bcrypt.hashpw(encoded_password, salt)
        return hashed_password.decode("utf-8")

    def create_new_user(self, email: str, password: str):
        if self.validate_email(email):
            encrypted_password = self.encrypt_password(password)
            user_data = self.add_user_to_database(email, encrypted_password)
            user_id = user_data.get('user_id')
            payload_data = {
                "user_id": user_id,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=120)
            }
            token = jwt.encode(payload=payload_data, key=self.my_super_secret)
            return {"status": 200, "token": token}


    def add_user_to_database(self, email: str, password: str):
        user_id = str(uuid.uuid4())
        data, count = self.supabase.table('users').insert({"user_id": user_id, "email": email, "password": password}).execute()
        return data[1][0]

    def login_user(self, email: str, password: str):
        user = self.supabase.table('users').select("*").filter('email', 'eq', email).execute()
        if len(user.data) == 1:
            password = password.encode('utf-8')
            user_data = user.data[0]
            stored_password = user_data.get('password').encode("utf-8")
            pwd_check = bcrypt.checkpw(password, stored_password)
            if pwd_check:
                payload_data = {
                    "user_id": user_data.get('user_id'),
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=120)
                }
                token = jwt.encode(payload=payload_data, key=self.my_super_secret)
                return {"status": 200, "token": token}
            else:
                return {"status": 400, "msg": "Password invalid"}
        else:
            return {"status": 400, "msg": "Email invalid"}

    def get_user(self, user_id: str):
        user = self.supabase.table('users').select("*").filter('user_id', 'eq', user_id).execute()
        if len(user.data) == 1:
            user_data = user.data[0]
            return True, {"user_id": user_data.get("user_id")}
        else:
            return False, {}


if __name__ == "__main__":
    db = SupabaseDatabase()
    # res = db.create_new_user("test@gmail.com", "my awesome password")
    res = db.login_user("test@gmail.com", "my awesome password")
    print(res)

