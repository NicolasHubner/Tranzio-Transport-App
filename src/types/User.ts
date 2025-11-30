interface UserRole {
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole | null;
  isShiftOpen: boolean | null;
  isFirstLogin: boolean;
}
