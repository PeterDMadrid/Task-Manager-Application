import { prisma } from "@/lib/prismaClient";
import { hashPassword, createToken, createAuthResponse } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !password) {
      return new Response(
        JSON.stringify({ message: "Name and password are required" }),
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { name },
          ...(email ? [{ email }] : [])
        ],
      },
    });

    if (existingUser) {
      const field = existingUser.name === name ? "Username" : "Email";
      return new Response(
        JSON.stringify({ message: `${field} already taken` }),
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email: email || null, password: hashedPassword }, // set email to null if not provided
    });

    const token = createToken(user.id);

    return createAuthResponse(token, {
      message: "Registration successful",
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
