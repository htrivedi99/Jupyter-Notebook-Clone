# Jupyter Notebook Clone

### Project Breakdown:
 * Frontend
    - Built using Next JS and Tailwind CSS
 * Backend
    - Built using FastAPI, MongoDB, and Supabase

### Setting up the Frontend
   1. Install the node packages. Use the command `npm install`
   2. Run the frontend using the command `npm run dev`

### Setting up the Backend
   1. Create a python virtual environment with python version 3.10
   2. Install all of the required python packages via pip. `pip install -r requirements.txt`
   3. Install Mongodb locally
      * You need to install the mongo shell. View this link on how to install the mongo shell: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/
      * Once you have the mongodb downloaded, you should be able to run the `mongosh` command
      * Run this command to start up the mongodb server: `mongosh "mongodb://localhost:27017"`
   4. Setup Supabase
      * For this project I'm using the cloud based version of Supabase
      * You'll need to create an account
      * Once you have an account, create a new project
      * Select your project and go to the table editor
      * Create a new table called `users`
      * Create three fields for the table (user_id, email, password)
      * All three fields are of type `text`
      * The `user_id` is going to be the primary key in this table
      * Create the table and then go to the Project Settings tab
      * Copy the Project URL and paste the value inside the init function in supabase_db.py. `supabase_url = "Project URL Here"`
      * Back in the Project Settings tab copy the service_role secret NOT the anon public key.
      * Paste this value inside the init function of the supabase_db.py script. `supabase_key = "Your API Key Here"`
      * Run the main.py function to start the FastAPI server


### Screenshots

<img width="1374" alt="jupyter_shot_1" src="https://github.com/htrivedi99/Jupyter-Notebook-Clone/assets/15642666/f2c99355-baac-4fb4-9d46-e4a09a113b44">
<hr/>
<br/>


<img width="1128" alt="jupyter_shot_2" src="https://github.com/htrivedi99/Jupyter-Notebook-Clone/assets/15642666/eb0ad07a-7555-4efc-b20d-b85d3b339e7f">
<hr/>
<br/>

<img width="1143" alt="jupyter_shot_2" src="https://github.com/htrivedi99/Jupyter-Notebook-Clone/assets/15642666/5d8061be-b085-44f6-9a8d-2287727fa51e">


