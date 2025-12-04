
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
  location?: string; // Main operational location
  // Store Profile Fields
  storeDescription?: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  openingHours?: string; // Ex: "08:00 - 18:00"
  tags?: string[];
  isVerified?: boolean;
}

export interface ProductOption {
  name: string; // Ex: "Cor", "Armazenamento", "Tamanho"
  values: string[]; // Ex: ["Preto", "Branco"], ["128GB", "256GB"]
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Preço original para promoções
  currency: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  location: string; // e.g., "Luanda, Talatona"
  imageUrl: string;
  category: string;
  options?: ProductOption[]; // Novas opções configuráveis
  unavailableOptions?: string[]; // Simulação de variantes específicas esgotadas (ex: "44", "Azul")
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
  cartItemId: string; // ID único para a linha do carrinho (para diferenciar variantes)
  quantity: number;
  selectedOptions?: { [key: string]: string }; // Ex: { "Cor": "Preto", "Tamanho": "42" }
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}
