from pydantic import BaseModel
from typing import List


class UserCodeExecutionRequest(BaseModel):
    code: str | None


class CodeBlock(BaseModel):
    id: str
    code: str
    output: str


class NotebookRequest(BaseModel):
    notebook_id: str
    notebook_name: str
    code_blocks: List[CodeBlock]


class GetNotebook(BaseModel):
    notebook_id: str


class User(BaseModel):
    email: str
    password: str


class UserId(BaseModel):
    id: str






