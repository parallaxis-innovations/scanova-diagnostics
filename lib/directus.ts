// lib/directus.ts
import {
  createDirectus,
  rest,
  authentication,
  login,
  readMe,
  createUser,
  readItems, createItem, updateItems
} from "@directus/sdk";

const DIRECTUS_URL =
  process.env.DIRECTUS_URL || "http://185.165.240.191:8057";

// Create a Directus client with auth support
const client = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(authentication());

class DirectusAPI {
  private client: typeof client;

  constructor() {
    this.client = client;
  }

  // ✅ Native login
  async loginUser(email: string, password: string) {
    try {
      console.log("Email", email, "Password", password)
      const auth = await this.client.request(login(email, password));

      const me = await this.client.request(
        readMe({ fields: ["id", "email", "first_name", "role"] })
      );

      return {
        id: me.id,
        email: me.email,
        name: me.first_name || me.email,
        role: me.role as string,
         access_token: auth.access_token ?? undefined, // ✅ fix
      };
    } catch (error) {
      console.error("❌ Directus login failed:", error);
      return null;
    }
  }

  // ✅ Register new user into `directus_users`
// async registerUser(userData: {
//   email: string;
//   password: string;
//   first_name?: string;
// }) {
//   try {
//     const newUser = await this.client.request(
//       createUser({
//         email: userData.email,
//         password: userData.password,
//         first_name: userData.first_name,
//         role: process.env.DIRECTUS_DEFAULT_ROLE_ID as string, // must exist
//         status: 'active',
//       })
//     );

//     return newUser;
//   } catch (error) {
//     console.error("❌ Directus register failed:", error);
//     throw error;
//   }
// }

async registerUser(userData: {
  email: string;
  password: string;
  first_name?: string;
}) {
  try {
    const newUser = await this.client.request(
      createItem("users", {
        email: userData.email,
        password: userData.password,
        first_name: userData.first_name,
        role: process.env.DIRECTUS_DEFAULT_ROLE_ID as string, // must exist
        status: 'active',
      })
    );

    console.log("New user:", newUser);

    
    return newUser;
  } catch (error) {
    console.error("❌ Directus register failed:", error);
    throw error;
  }

  }

// ✅ Forgot password
  async forgotPassword(email: string) {
    try {
      const res = await fetch(`${DIRECTUS_URL}/auth/password/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to request password reset");
      return true;
    } catch (error) {
      console.error("❌ Forgot password failed:", error);
      throw error;
    }
  }

  // ✅ Reset password
  async resetPassword(token: string, password: string) {
    try {
      const res = await fetch(`${DIRECTUS_URL}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) throw new Error("Failed to reset password");
      return true;
    } catch (error) {
      console.error("❌ Reset password failed:", error);
      throw error;
    }
  }
  
}



export const directusApi = new DirectusAPI();
