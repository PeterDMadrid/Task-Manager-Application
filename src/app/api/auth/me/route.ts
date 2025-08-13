// app/api/auth/me/route.ts
import { getCurrentUserFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUserFromCookies();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401 }
      );
    }
    
    return new Response(
      JSON.stringify({ user }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
}