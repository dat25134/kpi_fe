export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    // Add other user fields as needed
  };
} 