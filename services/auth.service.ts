import { User, LoginCredentials } from '@/types/auth';

const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'teacher@school.com',
    name: 'John Teacher',
    role: 'teacher',
  },
  {
    id: '2',
    email: 'principal@school.com',
    name: 'Sarah Principal',
    role: 'principal',
  },
];

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && credentials.password === 'password123'
    );

    if (user) {
      const token = `mock_token_${user.role}_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }

    throw new Error('Invalid email or password. Use password123');
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },
};
