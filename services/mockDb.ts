
import { SoapProduct, User, Role } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'simosh_products',
  USERS: 'simosh_users',
  SESSION: 'simosh_session'
};

const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: "mahinur",
    email: "akbarovamohinur23@gmail.com",
    firstName: "Mohinur",
    lastName: "Akbarova",
    role: Role.ADMIN,
    active: true,
    createdAt: "2026-01-08T10:30:00",
    profileImageUrl: null
  }
];

const INITIAL_PRODUCTS: SoapProduct[] = [
  {
    id: '1',
    name: 'Lavanda Nafasi',
    description: 'Tinchlantiruvchi lavanda efir moyi bilan boyitilgan tabiiy sovun.',
    price: 25000,
    stock: 45,
    imageUrl: 'https://picsum.photos/seed/lavender/400/400',
    category: 'Tinchlantiruvchi',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Limon va Zanjabil',
    description: 'Tetiklashtiruvchi va antibakterial xususiyatga ega sovun.',
    price: 22000,
    stock: 30,
    imageUrl: 'https://picsum.photos/seed/lemon/400/400',
    category: 'Tetiklashtiruvchi',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Sutli Shokolad',
    description: 'Terini yumshatuvchi va oziqlantiruvchi shokoladli sovun.',
    price: 28000,
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/chocolate/400/400',
    category: 'Oziqlantiruvchi',
    createdAt: new Date().toISOString()
  }
];

export const mockDb = {
  // --- USERS ---
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  },

  // --- PRODUCTS ---
  getProducts: (): SoapProduct[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },

  addProduct: (product: Omit<SoapProduct, 'id' | 'createdAt'>): SoapProduct => {
    const products = mockDb.getProducts();
    const newProduct: SoapProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    const updated = [...products, newProduct];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return newProduct;
  },

  deleteProduct: (id: string) => {
    const products = mockDb.getProducts();
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  },

  // --- AUTH ---
  login: (username: string, password: string): User | null => {
    const users = mockDb.getUsers();
    // Logic: find user by username. 
    // Demo password for "mahinur" is "mahinur23"
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser && (
      (username === 'mahinur' && password === 'mahinur23') || 
      (username === 'admin' && password === 'admin123')
    )) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(foundUser));
      return foundUser;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  }
};
