import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Only POST requests allowed", { status: 405 });
  }

  try {
    const { user_id, points } = await req.json();

    if (!user_id || points === undefined || isNaN(points)) {
      return new Response("user_id and points (as a number) are required", { status: 400 });
    }

    const { data, error: fetchError } = await supabase
      .from("users") // Make sure this table name is correct
      .select("points")
      .eq("id", user_id)
      .single();

    if (fetchError) {
      console.error("Error fetching user:", fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 });
    }

    if (!data) {
      return new Response("User not found", { status: 404 });
    }

    const newPoints = (data.points || 0) + points;

    const { error: updateError } = await supabase
      .from("users")
      .update({ points: newPoints })
      .eq("id", user_id);

    if (updateError) {
      console.error("Error updating points:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Points updated successfully", newPoints }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), { status: 500 });
  }
});