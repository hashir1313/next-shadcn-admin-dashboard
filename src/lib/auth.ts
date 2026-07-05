import { cookies } from "next/headers";

import { prisma } from "./prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.user.findUnique({
    where: { id: sessionId },
    select: { id: true, email: true, name: true },
  });

  return session;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
