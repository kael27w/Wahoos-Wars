from supabase import create_client, Client

# Supabse url and api key
url = "https://fshaklvzcnmbxelegzyy.supabase.co"
api_key = """eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6
                ImZzaGFrbHZ6Y25tYnhlbGVnenl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzc0N
                    jIsImV4cCI6MjA1NTgxMzQ2Mn0.M1BHsy7oKMJcNKJ9-iBybbjUaA5Kbn-RqCT9BFvjR7k"""

# Initializes the Supabase client
supabase: Client = create_client(url, api_key)

"""Update a user's points giver their id and points to be added."""
def update_user_points(user_id: str, new_points: int):
    response = supabase.table('user_profiles').update({'points': new_points}).eq('user_id', user_id).execute()
    if response.status_code == 200:
        print(f"Points updated for user {user_id} to {new_points}")
    else:
        print(f"Error updating points: {response.status_code}, {response.error_message}")
