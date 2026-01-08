
export enum Role {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export interface User {
  id: string | number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  active: boolean;
  createdAt: string;
  profileImageUrl: string | null;
}

export interface SoapProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface SalesData {
  month: string;
  sales: number;
}
