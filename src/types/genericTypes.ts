export interface response<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface userInfo {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
}
