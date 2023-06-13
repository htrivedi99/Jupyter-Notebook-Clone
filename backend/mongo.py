from pymongo import MongoClient
import os
from typing import List
from models import CodeBlock


class Mongo:
    _instance = None

    def __init__(self):
        self.mongo_url = ""
        self.mongo_client = ""
        self.db = None
        self.notebooks = None
        self.connect()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def connect(self):
        self.mongo_url = os.getenv('MONGO_URL') or "mongodb://127.0.0.1:27017"
        self.mongo_client = MongoClient(self.mongo_url)
        print("Connected to mongodb")
        self.db = self.mongo_client['database']
        print(self.db)
        self.notebooks = self.db.notebooks

    def create_new_notebook(self, user_id: str, notebook_id: str, notebook_name: str, code_blocks: List[CodeBlock]):
        json_blocks = []
        for block in code_blocks:
            json_blocks.append({"id": block.id, "code": block.code, "output": block.output})

        payload = {
            "user_id": user_id,
            "notebook_id": notebook_id,
            "notebook_name": notebook_name,
            "code_blocks": json_blocks
        }
        try:
            self.notebooks.insert_one(payload)
            return {"status": 200, "msg": "Notebook created and saved"}
        except Exception as e:
            print(e)
            return {"status": 500, "msg": "Failed to create notebook"}

    def update_existing_notebook(self, user_id: str, notebook_id: str, notebook_name: str, code_blocks: List[CodeBlock]):
        json_blocks = []
        for block in code_blocks:
            json_blocks.append({"id": block.id, "code": block.code, "output": block.output})

        try:
            self.notebooks.find_one_and_update({"user_id": user_id, "notebook_id": notebook_id},
                                                       {"$set": {
                                                           "notebook_name": notebook_name,
                                                           "code_blocks": json_blocks
                                                       }
                                                       })
            return {"status": 200, "msg": "Notebook saved"}
        except Exception as e:
            print(e)
            return {"status": 500, "msg": "Failed to save notebook"}

    def delete_notebook(self, user_id: str, notebook_id: str):
        try:
            self.notebooks.delete_one({"user_id": user_id, "notebook_id": notebook_id})
            return {"status": 200, "msg": "Notebook deleted"}
        except Exception as e:
            print(e)
            return {"status": 500, "msg": "Failed to delete notebook"}

    def get_all_notebooks(self, user_id: str):
        try:
            result = []
            notebook = self.notebooks.find({"user_id": user_id})
            for item in notebook:
                item.pop("_id")
                result.append(item)
            return {"status": 200, "data": result}
        except Exception as e:
            print(e)
            return {"status": 500, "msg": "Failed to get notebook"}

    def get_notebook(self, user_id: str, notebook_id: str):
        try:
            result = []
            notebook = self.notebooks.find({"user_id": user_id, "notebook_id": notebook_id})
            for item in notebook:
                item.pop("_id")
                result.append(item)
            return {"status": 200, "data": result[0]}
        except Exception as e:
            print(e)
            return {"status": 500, "msg": "Failed to get notebook"}


if __name__ == "__main__":
    mongodb = Mongo()

