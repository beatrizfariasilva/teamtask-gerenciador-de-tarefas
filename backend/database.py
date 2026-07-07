from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()

# configuração da conexão com o Supabase
url=os.getenv("SUPABASE_URL")
key=os.getenv("SUPABASE_KEY")

supabase=create_client(url, key)