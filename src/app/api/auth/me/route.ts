// app/api/auth/me/route.ts
import { getCurrentUserFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prismaClient";

export async function GET() {
  const currentUser = await getCurrentUserFromCookies();

  if (!currentUser) {
    return new Response(JSON.stringify(null), { status: 200 });
  }

  // Fetch full user info
  const user = await prisma.user.findUnique({
    where: { id: currentUser.userId },
    select: { id: true, name: true, email: true } // include name
  });

  return new Response(JSON.stringify(user), { status: 200 });
}
