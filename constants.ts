import { Product, User, UserRole, Delivery, DeliveryStatus, Contract } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'João Silva (Tech Angola)', role: UserRole.SELLER, nif: '001234567LA032', email: 'joao@loja.ao', phone: '+244 923 000 000' },
  { id: 'u2', name: 'Maria Santos', role: UserRole.CLIENT, nif: '009876543LA011', email: 'maria@gmail.com', phone: '+244 934 111 222' },
  { id: 'u3', name: 'Admin Geral', role: UserRole.ADMIN, email: 'admin@kwanza.ao' },
  { id: 'u4', name: 'Energia Pura Lda', role: UserRole.SELLER, nif: '501239999LA001', email: 'vendas@energiapura.ao', phone: '+244 923 555 111' },
  { id: 'u5', name: 'Casa Bela', role: UserRole.SELLER, nif: '504443333LA002', email: 'comercial@casabela.ao', phone: '+244 945 888 777' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max 256GB',
    description: 'O mais recente iPhone com titânio aeroespacial. Entrega imediata em Luanda.',
    price: 1850000,
    currency: 'AOA',
    stock: 5,
    sellerId: 'u1',
    sellerName: 'Tech Angola',
    location: 'Luanda, Mutamba',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    category: 'Eletrónica'
  },
  {
    id: 'p2',
    name: 'Computador HP Pavilion',
    description: 'Ideal para escritório e estudantes. Processador i7, 16GB RAM.',
    price: 650000,
    currency: 'AOA',
    stock: 12,
    sellerId: 'u1',
    sellerName: 'Tech Angola',
    location: 'Luanda, Talatona',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    category: 'Informática'
  },
  {
    id: 'p3',
    name: 'Gerador 20kVA Silencioso',
    description: 'Energia garantida para sua empresa ou residência.',
    price: 4500000,
    currency: 'AOA',
    stock: 2,
    sellerId: 'u4',
    sellerName: 'Energia Pura Lda',
    location: 'Benguela, Centro',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    category: 'Industrial'
  },
  {
    id: 'p4',
    name: 'Sofá de Canto Moderno',
    description: 'Conforto e elegância. Tecido importado.',
    price: 320000,
    currency: 'AOA',
    stock: 8,
    sellerId: 'u5',
    sellerName: 'Casa Bela',
    location: 'Lubango, Huíla',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    category: 'Mobiliário'
  }
];

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'd1',
    trackingCode: 'KZ-998877',
    productId: 'p1',
    productName: 'iPhone 15 Pro Max',
    clientName: 'Maria Santos',
    clientPhone: '+244 923 111 222',
    clientEmail: 'maria.santos@gmail.com',
    deliveryAddress: 'Rua Rainha Ginga, Edifício 23, 4º Andar, Luanda',
    status: DeliveryStatus.IN_TRANSIT,
    estimatedDate: '2024-05-25',
    history: [
      { date: '2024-05-20 10:00', status: 'Pedido Recebido', location: 'Loja Online' },
      { date: '2024-05-21 14:30', status: 'Processado no Armazém', location: 'Luanda, Viana' },
      { date: '2024-05-22 09:15', status: 'Saiu para Entrega', location: 'Luanda, Centro' }
    ]
  },
  {
    id: 'd2',
    trackingCode: 'KZ-554433',
    productId: 'p2',
    productName: 'Computador HP Pavilion',
    clientName: 'José Eduardo',
    clientPhone: '+244 934 555 666',
    clientEmail: 'jose.ed@outlook.com',
    deliveryAddress: 'Condomínio Austin, Vivenda 12, Talatona',
    status: DeliveryStatus.PENDING,
    estimatedDate: '2024-06-01',
    history: [
      { date: '2024-05-28 09:00', status: 'Pedido Recebido', location: 'Loja Online' }
    ]
  },
  {
    id: 'd3',
    trackingCode: 'KZ-112233',
    productId: 'p4',
    productName: 'Sofá de Canto',
    clientName: 'Ana Paula',
    clientPhone: '+244 912 333 444',
    clientEmail: 'ana.paula@yahoo.com',
    deliveryAddress: 'Bairro da Mapunda, Rua 5, Casa 10, Lubango',
    status: DeliveryStatus.DELIVERED,
    estimatedDate: '2024-05-15',
    history: [
      { date: '2024-05-10 09:00', status: 'Pedido Recebido', location: 'Loja Online' },
      { date: '2024-05-11 11:00', status: 'Processado no Armazém', location: 'Luanda, Viana' },
      { date: '2024-05-12 08:00', status: 'Em Trânsito Interprovincial', location: 'Estrada Nacional 100' },
      { date: '2024-05-15 16:00', status: 'Entregue', location: 'Lubango' }
    ]
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    sellerName: 'Tech Angola',
    clientName: 'Empresa XYZ',
    clientNif: '5412312312',
    date: '2024-05-20',
    terms: 'Fornecimento de equipamentos informáticos com garantia de 12 meses.',
    value: 6500000,
    status: 'Ativo'
  }
];