from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import uvicorn
import sys
import jwt
from io import StringIO
from models import UserCodeExecutionRequest, NotebookRequest, GetNotebook, User, UserId
from mongo import Mongo
from supabase_db import SupabaseDatabase

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the list of allowed origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongodb = Mongo.get_instance()
supabase_db = SupabaseDatabase.get_instance()
my_globals = {}
SECRET_KEY = "some_super_duper_secret"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    This function makes sure the users is authenticated. It takes the JWT token from the frontend
    and validates the user_id by checking with Supabase. If a user is found, it returns the user id.
    :param token: str
    :return: UserId
    """

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_exists, user = supabase_db.get_user(user_id)

        if user_exists is False:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return UserId(id=user.get('user_id'))
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.DecodeError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not decode token",
            headers={"WWW-Authenticate": "Bearer"},
        )


active_notebooks = {}

class NotebookSession:
    def __init__(self, websocket):
        self.websocket = websocket
        self.execution_globals = {}


# This is the new way to handle running code blocks
@app.websocket("/notebook/{notebook_id}")
async def notebook_socket(notebook_id: str, websocket: WebSocket):
    """
    This function gets the users code from the frontend and runs it.
    The websocket receives code. The websocket sends the output after the code has run.
    The connection is kept open until the notebook is closed.

    :param notebook_id: Id of the notebook
    :param websocket: Websocket connection
    :return:
    """
    await websocket.accept()

    # Create a new NotebookSession for the current WebSocket connection
    session = NotebookSession(websocket)
    active_notebooks[notebook_id] = session

    try:
        while True:
            data = await websocket.receive_json()
            print(data)
            if "code" in data:
                code = data["code"]
                try:
                    old_stdout = sys.stdout
                    redirected_output = sys.stdout = StringIO()
                    exec(code, session.execution_globals)
                    sys.stdout = old_stdout
                    output = redirected_output.getvalue()
                except Exception as e:
                    output = str(e)

                await websocket.send_json({"output": output, "block_id": data.get('block_id')})

    except WebSocketDisconnect:
        print("WebSocket disconnected")
        del active_notebooks[notebook_id]


# This was the old way to do it
@app.post("/execute")
async def execute(request: UserCodeExecutionRequest, user: UserId = Depends(get_current_user)):
    """
    This is a simple REST endpoint which takes the user code passed into the request, and runs the code
    using the exec() function and returns the output. It uses a global variable called my_globals to keep
    track of all the variables being declared.
    :param request:
    :param user:
    :return:
    """
    try:
        old_stdout = sys.stdout
        redirected_output = sys.stdout = StringIO()
        exec(request.code, my_globals)
        sys.stdout = old_stdout
        output = redirected_output.getvalue()
        print("output: ", output)
    except Exception as e:
        output = str(e)
    return {"output": output}


@app.get("/get_all_notebooks")
async def get_all_notebooks(user: UserId = Depends(get_current_user)):
    """
    Gets all the notebooks for a particular user
    :param user:
    :return:
    """
    print(user.id)
    res = mongodb.get_all_notebooks(user.id)
    return res


@app.post("/save_notebook")
async def save_notebook(request: NotebookRequest, user: UserId = Depends(get_current_user)):
    """
    This endpoint is used for both creating a new notebook and saving an existing notebook.
    If the notebook already exists, the new contents get saved. If the notebook does not exist,
    it gets created in mongodb.
    :param request:
    :param user:
    :return:
    """
    # check if notebook already exists based on id
    # update notebook if exists
    notebook = mongodb.get_notebook(user.id, request.notebook_id)
    if notebook.get('status') == 200:
        res = mongodb.update_existing_notebook(user.id, request.notebook_id, request.notebook_name, request.code_blocks)
    else:
        res = mongodb.create_new_notebook(user.id, request.notebook_id, request.notebook_name, request.code_blocks)
    return res


@app.post("/delete_notebook")
async def delete_notebook(request: GetNotebook, user: UserId = Depends(get_current_user)):
    """
    Deletes a notebook based on a notebookId for a user
    :param request:
    :param user:
    :return:
    """
    notebook_id = request.notebook_id
    user_id = user.id
    res = mongodb.delete_notebook(user_id, notebook_id)
    return res


@app.post("/get_notebook")
async def get_notebook(request: GetNotebook, user: UserId = Depends(get_current_user)):
    """
    Gets a notebook based on a notebook Id for a user
    :param request:
    :param user:
    :return:
    """
    print("user get notebook: ", user)
    notebook = mongodb.get_notebook(user.id, request.notebook_id)
    return notebook


@app.post("/signup")
async def register(request: User):
    """
    Create a new user
    :param request:
    :return:
    """
    email = request.email
    password = request.password
    res = supabase_db.create_new_user(email, password)
    return res


@app.post("/login")
async def login(request: User):
    """
    Login existing user
    :param request:
    :return:
    """
    res = supabase_db.login_user(request.email, request.password)
    return res


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

