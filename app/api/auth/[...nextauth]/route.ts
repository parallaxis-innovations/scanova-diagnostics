import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`${DIRECTUS_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const refreshedData = await res.json();
    if (!res.ok || !refreshedData.data) {
      return { ...token, error: "RefreshAccessTokenError" };
    }
    
    return {
      ...token,
      accessToken: refreshedData.data.access_token,
      refreshToken: refreshedData.data.refresh_token,
      expires: Date.now() + (refreshedData.data.expires * 1000),
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${DIRECTUS_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const userData = await res.json();
          
          if (!res.ok || !userData.data) {
            return null;
          }

          // Fetch user details from Directus
          const userRes = await fetch(`${DIRECTUS_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${userData.data.access_token}`,
            },
          });

          const userDetails = await userRes.json();
          
          if (!userRes.ok || !userDetails.data) {
            return null;
          }

          return {
            id: userDetails.data.id,
            email: userDetails.data.email,
            name: userDetails.data.first_name ? 
              `${userDetails.data.first_name} ${userDetails.data.last_name || ''}`.trim() : 
              userDetails.data.email,
            role: userDetails.data.role?.name || 'user',
            accessToken: userData.data.access_token,
            refreshToken: userData.data.refresh_token,
            expires: userData.data.expires,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expires = Date.now() + (user.expires * 1000);
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.error) {
        session.error = token.error;
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        expires: token.expires as number,
        error: token.error,
      };
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
