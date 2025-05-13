export interface User {
  userId: number;
  fullName: string;
  email: string;
  role: 'User' | 'Admin';
  isConfirmed: boolean;
  createdAt?: string;
}
