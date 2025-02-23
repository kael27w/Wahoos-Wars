from supabase import create_client, Client

url = "https://fshaklvzcnmbxelegzyy.supabase.co"
api_key = """eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6
                ImZzaGFrbHZ6Y25tYnhlbGVnenl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzc0N
                    jIsImV4cCI6MjA1NTgxMzQ2Mn0.M1BHsy7oKMJcNKJ9-iBybbjUaA5Kbn-RqCT9BFvjR7k"""

supabase: Client = create_client(url, api_key)

