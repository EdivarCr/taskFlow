const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://fastapi-zero-1.onrender.com";
const getToken = () => localStorage.getItem('access_token');

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  state: 'draft' | 'todo' | 'doing' | 'done' | 'trash';
}

export interface TodoCreate {
  title: string;
  description?: string;
  state?: 'draft' | 'todo' | 'doing' | 'done' | 'trash';
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  state?: 'draft' | 'todo' | 'doing' | 'done' | 'trash';
}

export interface TodoFilters {
  title?: string;
  description?: string;
  state?: string;
  offset?: number;
  limit?: number;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ access_token: string; token_type: string }> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    return handleResponse(response);
  },

  async refreshToken(refreshToken: string): Promise<{ access_token: string; token_type: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    return handleResponse(response);
  },
};

export const usersApi = {
  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/Users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  async getUser(id: string): Promise<User> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  async updateUser(id: string, data: Partial<RegisterData>): Promise<User> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  async deleteUser(id: string): Promise<void> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/Users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};

export const todosApi = {
  async list(filters?: TodoFilters): Promise<{ todos: Todo[] }> {
    const token = getToken();
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/todos${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  async create(data: TodoCreate): Promise<Todo> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  async update(id: string, data: TodoUpdate): Promise<Todo> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },
};
