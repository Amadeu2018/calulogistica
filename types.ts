export enum UserRole {
  ADMIN = 'Administrador',
  SELLER = 'Vendedor',
  CLIENT = 'Cliente'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  nif?: string; // Angolan Tax ID
  email: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  location: string; // e.g., "Luanda, Talatona"
  imageUrl: string;
  category: string;
}

export enum DeliveryStatus {
  PENDING = 'Pendente',
  PROCESSING = 'Em Processamento',
  IN_TRANSIT = 'Em Trânsito',
  DELIVERED = 'Entregue',
  FAILED = 'Falhou'
}

export interface Delivery {
  id: string;
  trackingCode: string; // e.g., KZ-123456
  productId: string;
  productName: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  deliveryAddress?: string;
  status: DeliveryStatus;
  estimatedDate: string;
  history: {
    date: string;
    status: string;
    location: string;
  }[];
}

export interface Contract {
  id: string;
  sellerName: string;
  clientName: string;
  clientNif: string;
  date: string;
  terms: string;
  value: number;
  status: 'Ativo' | 'Finalizado';
}

export interface CartItem extends Product {
  quantity: number;
}