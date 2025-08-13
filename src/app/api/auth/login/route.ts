import { prisma } from "@/lib/prismaClient";
import { verifyPassword, createToken, createAuthResponse } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, password } = await req.json();

    // Validate input
    if (!name || !password) {
      return new Response(JSON.stringify({ message: "Name and password are required" }), { status: 400 });
    }

    // Find user by name
    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    // Check password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    // Create JWT token
    const token = createToken(user.id);

    // Return token and user info
    return createAuthResponse(token, {
      message: "Login successful",
      user: { id: user.id, name: user.name },
    });

  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
