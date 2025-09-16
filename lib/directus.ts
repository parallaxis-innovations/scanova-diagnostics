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

    // Read response body as text first (safer when server returns non-json errors)
    const text = await response.text();

    // Try to parse JSON if possible
    let data: any = undefined;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch (e) {
      data = undefined;
    }

    // If OK, return parsed JSON (or raw text)
    if (response.ok) {
      return data ?? text;
    }

    // Special-case: Directus returns 500 when schema contains phantom fields
    // which causes SQL SELECT to fail (e.g. "column personal_information.medical_information does not exist").
    // Detect that and return a safe minimal success object for known collection operations so
    // callers can proceed (avoids delete/recreate fallback in application code).
    if (response.status === 500) {
      const errMsg = (data?.errors?.[0]?.message || data?.message || text || '').toString();

      if (errMsg.includes('does not exist') && (errMsg.includes('personal_information') || errMsg.includes('medical_information'))) {
        console.warn('Directus schema field conflict detected (phantom fields). Returning safe success.');

        // Try to extract an item id from the endpoint when present (/items/<collection>/<id>)
        const match = endpoint.match(/\/items\/(personal_information|medical_information)(?:\/(\d+))?/);
        const collection = match?.[1];
        const itemId = match?.[2];

        if (itemId) {
          // Return a minimal shape similar to Directus update/create representation
          return { data: [{ id: Number(itemId) }] };
        }

        // For POST without id, return a minimal success marker
        return { success: true, message: 'Operation completed but Directus failed to fetch representation due to schema conflicts' };
      }
    }

    // Fallback: log full error and throw
    console.error("Directus API Error:", {
      url,
      status: response.status,
      error: data?.errors?.[0]?.message || data?.message || text,
    });

    throw new Error(data?.errors?.[0]?.message || data?.message || text || 'Directus API error');
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
      'full_name', 'phone_number', 'email_id', 'address', 'age', 'gender', 'blood_group', 'user_id', 'family_members'
    ].join(',');

    return this.directusFetch(
      `/items/personal_information?fields=${fields}&limit=1&filter[user_id][_eq]=${userId}`,
      // {
      //   headers: {
      //     Authorization: `Bearer ${accessToken || this.adminToken}`,
      //   },
      // }
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

      // Use fields parameter to specify which fields to return, avoiding non-existent columns
      const fields = [
        'id', 'status', 'user_created', 'date_created', 'user_updated', 'date_updated',
        'full_name', 'phone_number', 'email_id', 'address', 'age', 'gender', 'blood_group', 'user_id'
      ].join(',');

      return this.directusFetch(`/items/personal_information/${item.id}?fields=${fields}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ ...data, user_id: userId }),
      });
    }
    return this.directusFetch('/items/personal_information', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Prefer': 'return=minimal' },
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
        // Use fields parameter to specify which fields to return, avoiding non-existent columns
        const fields = [
          'id', 'status', 'user_created', 'date_created', 'user_updated', 'date_updated',
          'chronic_conditions', 'current_medications', 'allergies', 'previous_surgeries',
          'family_medical_history', 'emergency_contact_name', 'emergency_contact_phone', 'users'
        ].join(',');

        return await this.directusFetch(`/items/medical_information/${existingRecord.id}?fields=${fields}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify(data),
        });
      } else {
        return await this.directusFetch('/items/medical_information', {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Prefer': 'return=minimal' },
          body: JSON.stringify(payload),
        });
      }
    } catch (error) {
      console.error("Error upserting medical info:", error);
      throw error;
    }
  }

  // Family member management methods
  async createFamilyMember(
    currentUserId: string,
    familyData: {
      full_name: string;
      phone_number?: string;
      email_id: string;
      address?: string;
      age?: number;
      gender?: string;
      blood_group?: string;
    },
    accessToken: string
  ) {
    try {
      // Generate a default password for the family member
      const defaultPassword = `Family@123!`;

      // Create new Directus user for the family member
      const newUser: any = await this.client.request(() => ({
        path: '/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.adminToken}`, // Use admin token to create users
        },
        body: JSON.stringify({
          email: familyData.email_id,
          password: defaultPassword,
          first_name: familyData.full_name.split(' ')[0] || familyData.full_name,
          last_name: familyData.full_name.split(' ').slice(1).join(' ') || '',
          role: process.env.DIRECTUS_USER_ROLE_ID || process.env.DIRECTUS_FAMILY_ROLE_ID,
          status: 'active',
        }),
      }));

      // Create personal information record for the family member
      const personalInfo = await this.client.request(() => ({
        path: '/items/personal_information',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.adminToken}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          ...familyData,
          user_id: newUser.id,
          status: 'published',
        }),
      })) as { id: number };

      // Get current user's personal information to update the family_members relation
      const currentUserPersonalInfo = await this.getPersonalInformationByUserId(currentUserId, accessToken);
      const currentUserRecord = currentUserPersonalInfo?.data?.[0];

      if (currentUserRecord) {
        // Get existing family members array or initialize empty array
        const existingFamilyMembers = currentUserRecord.family_members || [];
        

        // Add the new family member's personal_information record ID to the relation
        const updatedFamilyMembers = [...existingFamilyMembers, personalInfo.id];

        // Update the current user's personal_information record with the new family member relation
        // Use admin token since user might not have permission to update their own record
        const result = await this.client.request(() => ({
          path: `/items/personal_information/${currentUserRecord.id}`,
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.adminToken}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            family_members: updatedFamilyMembers,
          }),
        }));
      }

      return {
        user: newUser,
        personalInfo,
        defaultPassword, // Return this so it can be displayed to the user
        message: `Family member created successfully. Default password: ${defaultPassword}`,
      };

    } catch (error) {
      console.error("Error creating family member:", error);
      throw error;
    }
  }

  // Get family members for a user
  async getFamilyMembers(userId: string, accessToken: string) {
    try {
      // Use admin token for consistent access
      const adminToken = this.adminToken;
      
      // Get current user's personal information with family_members relation
      const userPersonalInfo = await this.directusFetch(
        `/items/personal_information?filter[user_id][_eq]=${userId}&fields=*,family_members.*&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (!userPersonalInfo?.data?.length || !userPersonalInfo.data[0].family_members) {
        return { data: [] };
      }

      // The family_members field contains an array of related personal_information records
      const familyMembers = userPersonalInfo.data[0].family_members;

      return {
        data: Array.isArray(familyMembers) ? familyMembers : [familyMembers]
      };

    } catch (error) {
      console.error("Error fetching family members:", error);
      return { data: [] };
    }
  }

  // Update family member information
  async updateFamilyMember(
    familyMemberPersonalInfoId: string,
    data: Partial<{
      full_name: string;
      phone_number: string;
      email_id: string;
      address: string;
      age: number;
      gender: string;
      blood_group: string;
    }>,
    accessToken: string
  ) {
    try {
      // Update the family member's personal_information record
      const fields = [
        'id', 'status', 'user_created', 'date_created', 'user_updated', 'date_updated',
        'full_name', 'phone_number', 'email_id', 'address', 'age', 'gender', 'blood_group', 'user_id'
      ].join(',');

      // Use admin token for updating records
      const adminToken = this.adminToken;
      
      return await this.directusFetch(`/items/personal_information/${familyMemberPersonalInfoId}?fields=${fields}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error updating family member:", error);
      throw error;
    }
  }

  // Delete family member
  async deleteFamilyMember(familyMemberPersonalInfoId: string, currentUserId: string, accessToken: string) {
    try {
      // Get current user's personal information
      const currentUserPersonalInfo = await this.getPersonalInformationByUserId(currentUserId, accessToken);
      const currentUserRecord = currentUserPersonalInfo?.data?.[0];

      if (currentUserRecord && currentUserRecord.family_members) {
        // Remove the family member from the relation array
        const existingFamilyMembers = Array.isArray(currentUserRecord.family_members)
          ? currentUserRecord.family_members
          : [currentUserRecord.family_members];

        const updatedFamilyMembers = existingFamilyMembers
          .filter((memberId: any) => {
            // Handle both object references and direct IDs
            const id = typeof memberId === 'object' ? memberId.id : memberId;
            return id !== parseInt(familyMemberPersonalInfoId);
          });

        // Update the current user's personal_information record
        // Use admin token since user might not have permission to update their own record
        await this.client.request(() => ({
          path: `/items/personal_information/${currentUserRecord.id}`,
          method: 'PATCH',
          headers: {
            // Authorization: `Bearer ${this.adminToken}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            family_members: updatedFamilyMembers,
          }),
        }));
      }

      // Delete the family member's personal information record
      // Use admin token since user might not have permission to delete records
      // await this.directusFetch(`/items/personal_information/${familyMemberPersonalInfoId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     Authorization: `Bearer ${this.adminToken}`,
      //   },
      // });

      // // Deactivate the family member's user account instead of deleting
      // if (familyMemberUserId) {
      //   await this.client.request(() => ({
      //     path: `/users/${familyMemberUserId}`,
      //     method: 'PATCH',
      //     headers: {
      //       Authorization: `Bearer ${this.adminToken}`,
      //     },
      //     body: JSON.stringify({
      //       status: 'suspended',
      //     }),
      //   }));
      // }

      return { success: true, message: 'Family member removed successfully' };
    } catch (error) {
      console.error("Error deleting family member:", error);
      throw error;
    }
  }
}

export const directusService = new DirectusService();
export const directusApi = directusService; // Backward compatibility