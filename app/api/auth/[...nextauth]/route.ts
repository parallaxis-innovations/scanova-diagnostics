import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;

// Extend the User type to include our custom properties
interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expires: number;
}

// Extend the JWT type to include our custom properties
interface ExtendedJWT {
  id: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expires: number;
  error?: string;
}

// Extend the Session type to include our custom properties
interface ExtendedSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expires: number;
  error?: string;
}

async function refreshAccessToken(token: any) {
  console.log("token", token);
  try {
    const res = await fetch(`${DIRECTUS_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const refreshedData = await res.json();
    console.log("refreshedData", JSON.stringify(refreshedData, null, 2));
    
    if (!res.ok || !refreshedData.data) {
      console.log("Token refresh failed, forcing re-authentication");
      return { ...token, error: "RefreshAccessTokenError" };
    }
    
    return {
      ...token,
      accessToken: refreshedData.data.access_token,
      refreshToken: refreshedData.data.refresh_token,
      expires: Date.now() + (refreshedData.data.expires * 1000),
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.log("Token refresh error:", error);
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
      async authorize(credentials): Promise<ExtendedUser | null> {
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
        console.log("user", user);
        const extendedUser = user as any;
        return {
          ...token,
          id: extendedUser.id,
          role: extendedUser.role,
          accessToken: extendedUser.accessToken,
          refreshToken: extendedUser.refreshToken,
          expires: Date.now() + (extendedUser.expires * 1000),
          error: undefined,
        };
      }

      // Check if token has expired (with 5 minute buffer)
      const isExpired = Date.now() >= (token.expires as number) - (5 * 60 * 1000);
      console.log("Token expired check:", isExpired, "Current time:", Date.now(), "Expires:", token.expires);

      // If token is not expired, return it
      if (!isExpired) {
        return token;
      }

      // If token has expired, try to refresh it
      console.log("Token expired, attempting refresh...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // If there's a token error, force re-authentication
      if (token.error === "RefreshAccessTokenError") {
        console.log("Session has token error, forcing re-authentication");
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
        } as any;
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
      } as any;
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
