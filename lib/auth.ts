import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, NextAuthOptions } from "next-auth";
// import { authOptions } from "@/app/api/auth/[[...nextauth]]/route";
import { redirect } from "next/navigation";
import { directusService } from "./directus";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return session;
}

export async function requireNoAuth() {
  const session = await getSession();
  
  if (session?.user) {
    redirect("/");
  }
}

export async function requireAdmin() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Check if user has admin role
  if ((session.user as any).role !== 'admin') {
    redirect("/unauthorized");
  }
  
  return session;
}

export async function getUserData(userId: string, accessToken: string) {
  try {
    const response = await directusService.getUserById(userId, accessToken);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function updateUserData(userId: string, userData: any, accessToken: string) {
  try {
    const response = await directusService.updateUser(userId, userData, accessToken);
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}
