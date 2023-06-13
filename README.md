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

![Alt text](../../Desktop/jupyter_shot_1.png)

![Alt text](../../Desktop/Screen%20Shot%202023-06-13%20at%208.44.14%20AM.png)

![Alt text](../../Desktop/Screen%20Shot%202023-06-13%20at%208.46.18%20AM.png)

