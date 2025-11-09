import os
from dotenv import load_dotenv
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

print(f"Loading .env file from: {dotenv_path}")
load_dotenv(dotenv_path=dotenv_path)

class Environment:
    base_url = os.getenv("BASE_URL")
    mongo_uri = os.getenv("MONGO_CONNECTION_STRING")
    password = os.getenv("PASSWORD")
    standard_user = os.getenv("STANDARD_USER")
    locked_out_user = os.getenv("LOCKED_OUT_USER")
    problem_user = os.getenv("PROBLEM_USER")
    glitch_user = os.getenv("GLITCH_USER")
    error_user = os.getenv("ERROR_USER")
    visual_user = os.getenv("VISUAL_USER")

env = Environment()
