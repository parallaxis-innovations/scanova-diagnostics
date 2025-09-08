export class DirectusService {
  private baseUrl: string;
  private adminToken: string;

  constructor() {
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
      throw new Error(data.errors?.[0]?.message || 'Directus API error');
    }

    return data;
  }

  // Authenticate user
  async login(email: string, password: string) {
    return this.directusFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
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
    return this.directusFetch(`/${collection}/${itemId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
  }

  // Delete item from collection
  async deleteItem(collection: string, itemId: string, accessToken: string) {
    return this.directusFetch(`/${collection}/${itemId}`, {
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
}

export const directusService = new DirectusService();
