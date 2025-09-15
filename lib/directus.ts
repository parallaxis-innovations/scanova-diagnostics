// lib/directus.ts
import {
  createDirectus,
  rest,
  authentication,
  login,
  readMe,
  createUser,
  readItems,
  createItem,
  updateItem,
  passwordReset,
  updateUser,
  readItem,
  deleteItem,
} from "@directus/sdk";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://185.165.240.191:8057";

// Create a Directus client with auth support
const client = createDirectus(DIRECTUS_URL).with(rest());

class DirectusService {
  private client: typeof client;
  private baseUrl: string;
  private adminToken: string;

  constructor() {
    this.client = client;
    this.baseUrl = process.env.NEXT_DIRECTUS_API_URL || "http://185.165.240.191:8057";
    this.adminToken = process.env.DIRECTUS_STATIC_ADMIN_TOKEN || "a8MtC6ERaY8fbWMhTzSgLdKzXTb-9w4s";
  }

  // Generic fetch method for Directus API
  private async directusFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error("Directus API Error:", {
        url,
        status: response.status,
        error: data.errors?.[0]?.message || data.message
      });
      throw new Error(data.errors?.[0]?.message || data.message || 'Directus API error');
    }

    return data;
  }

  // ✅ Native login using SDK
  async loginUser(email: string, password: string) {
    try {
      const auth = await this.client.request(login(email, password));
      const me = await this.client.request(
        readMe({ fields: ["id", "email", "first_name", "role"] })
      );

      return {
        id: me.id,
        email: me.email,
        name: me.first_name || me.email,
        role: me.role as string,
        access_token: auth.access_token ?? undefined,
      };
    } catch (error) {
      console.error("❌ Directus login failed:", error);
      return null;
    }
  }

  // ✅ Register user using SDK
  async registerUser(userData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) {
    try {
      const newUser = await this.client.request(() => ({
        path: '/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          role: process.env.DIRECTUS_USER_ROLE_ID,
          status: 'active',
        }),
      }));

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

  // Refresh token
  async refreshToken(refreshToken: string) {
    return this.directusFetch('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // Get current user info
  async getCurrentUser(accessToken: string) {
    return this.directusFetch('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Create user (admin only)
  async createUser(userData: any) {
    return this.directusFetch('/users', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.adminToken}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // Get user by ID
  async getUserById(userId: string, accessToken: string) {
    return this.directusFetch(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Update user
  async updateUser(userId: string, userData: any, accessToken: string) {
    return this.directusFetch(`/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // Get collection items with authentication
  async getCollection(collection: string, accessToken: string, params: Record<string, any> = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/items/${collection}${queryString ? `?${queryString}` : ''}`;

    return this.directusFetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Create item in collection
  async createItem(collection: string, data: any, accessToken: string) {
    return this.directusFetch(`/items/${collection}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Update item in collection
  async updateItem(collection: string, itemId: string, data: any, accessToken: string) {
    return this.directusFetch(`/items/${collection}/${itemId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Delete item from collection
  async deleteItem(collection: string, itemId: string, accessToken: string) {
    return this.directusFetch(`/items/${collection}/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  // Create personal information record
  async createPersonalInformation(personalData: {
    full_name: string;
    phone_number?: string;
    email_id: string;
    address: string;
    age: number;
    gender: string;
    blood_group: string;
    password?: string;
    user_id?: string;
  }) {
    return this.directusFetch('/items/personal_information', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.adminToken}`,
      },
      body: JSON.stringify({
        ...personalData,
        status: 'published',
      }),
    });
  }

  // Get personal information by user email
  async getPersonalInformationByEmail(email: string) {
    return this.directusFetch(`/items/personal_information?filter[email_id][_eq]=${email}`, {
      headers: {
        Authorization: `Bearer ${this.adminToken}`,
      },
    });
  }

  // Get personal information by user id
  async getPersonalInformationByUserId(
    userId: string,
    accessToken?: string
  ): Promise<any> {
    // Specify only the fields that exist to avoid schema conflicts
    const fields = [
      'id', 'status', 'user_created', 'date_created', 'user_updated', 'date_updated',
      'full_name', 'phone_number', 'email_id', 'address', 'age', 'gender', 'blood_group', 'user_id'
    ].join(',');
    
    return this.directusFetch(
      `/items/personal_information?fields=${fields}&limit=1&filter[user_id][_eq]=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken || this.adminToken}`,
        },
      }
    );
  }

  // Create or update personal information for user
  async upsertPersonalInformation(
    userId: string,
    data: Partial<{
      full_name: string;
      phone_number: string;
      email_id: string;
      address: string;
      age: number;
      gender: string;
      blood_group: string;
      password?: string;
    }>,
    accessToken: string
  ) {
    const existing = await this.getPersonalInformationByUserId(userId, accessToken);
    const item = existing?.data?.[0];
    if (item?.id) {
      return this.directusFetch(`/items/personal_information/${item.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ ...data, user_id: userId }),
      });
    }
    return this.directusFetch('/items/personal_information', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ ...data, user_id: userId, status: 'published' }),
    });
  }

  // Medical information helpers
  async getMedicalInformationByUserId(userId: string, accessToken: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const url = `/items/medical_information?filter[users][_eq]=${userId}&limit=1`;

      return await this.directusFetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error fetching medical info:", error);
      return { data: [] };
    }
  }

  async upsertMedicalInformation(
    userId: string,
    data: Partial<{
      pre_existing_conditions: string;
      chronic_illnesses: string;
      allergies: string;
    }>,
    accessToken: string
  ) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const existing = await this.getMedicalInformationByUserId(userId, accessToken);
      const existingRecord = existing?.data?.[0];

      const payload = {
        ...data,
        users: userId,
        status: 'published'
      };

      if (existingRecord?.id) {
        return await this.directusFetch(`/items/medical_information/${existingRecord.id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(data),
        });
      } else {
        return await this.directusFetch('/items/medical_information', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(payload),
        });
      }
    } catch (error) {
      console.error("Error upserting medical info:", error);
      throw error;
    }
  }
}

export const directusService = new DirectusService();
export const directusApi = directusService; // Backward compatibility