from supabase import create_client, Client

# Supabse url and api key
url = "https://fshaklvzcnmbxelegzyy.supabase.co"
api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaGFrbHZ6Y25tYnhlbGVnenl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMzc0NjIsImV4cCI6MjA1NTgxMzQ2Mn0.M1BHsy7oKMJcNKJ9-iBybbjUaA5Kbn-RqCT9BFvjR7k"

# Initializes the Supabase client
supabase: Client = create_client(url, api_key)

"""Update a user's points giver their id and points to be added."""
def update_user_points(user_id: str, new_points: int):

    # Execute the update query
    response = supabase.table('users').update({'points': new_points}).eq('id', user_id).execute()

    # Check for errors in the response
    if 'error' in response:
        print(f"Error updating points: {response['error']}")
    else:
        print(f"Points updated successfully for user {user_id}")


# Rolando's fake user id
user_id = "c2cf8b42-3677-4a00-b292-c2d3b00ccfda"

# Fake event points
event_points = 500

update_user_points(user_id, event_points)