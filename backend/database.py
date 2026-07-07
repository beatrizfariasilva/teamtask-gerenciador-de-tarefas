from supabase import create_client
from dotenv import load_dotenv
import os

load_dotenv()
url=os.getenv("SUPABASE_URL")
key=os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Configure SUPABASE_URL e SUPABASE_KEY no seu arquivo .env.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

supabase=create_client(url, key)