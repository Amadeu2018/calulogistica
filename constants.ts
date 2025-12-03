
import { Product, User, UserRole, Delivery, DeliveryStatus, Contract } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    name: 'Tech Angola', 
    role: UserRole.SELLER, 
    nif: '001234567LA032', 
    email: 'comercial@techangola.ao', 
    phone: '+244 923 000 000', 
    location: 'Luanda, Mutamba',
    storeDescription: 'Líder em tecnologia e gadgets em Angola. Representantes oficiais das melhores marcas como Apple, Samsung e HP.',
    coverImage: 'https://images.unsplash.com/photo-1531297461136-82lwDe4105q?auto=format&fit=crop&q=80&w=1200',
    rating: 4.8,
    reviewCount: 1240,
    openingHours: '08:00 - 18:00 (Seg-Sex)',
    tags: ['Eletrónica', 'Informática', 'Gadgets', 'Premium'],
    isVerified: true
  },
  { 
    id: 'u2', 
    name: 'Maria Santos', 
    role: UserRole.CLIENT, 
    nif: '009876543LA011', 
    email: 'maria@gmail.com', 
    phone: '+244 934 111 222', 
    location: 'Luanda, Maianga' 
  },
  { 
    id: 'u3', 
    name: 'Admin Geral', 
    role: UserRole.ADMIN, 
    email: 'admin@kwanza.ao' 
  },
  { 
    id: 'u4', 
    name: 'Energia Pura Lda', 
    role: UserRole.SELLER, 
    nif: '501239999LA001', 
    email: 'vendas@energiapura.ao', 
    phone: '+244 923 555 111', 
    location: 'Benguela, Centro',
    storeDescription: 'Soluções de energia industrial e doméstica. Geradores, painéis solares e manutenção especializada.',
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
    rating: 4.5,
    reviewCount: 85,
    openingHours: '07:30 - 17:00 (Seg-Sáb)',
    tags: ['Industrial', 'Energia', 'Construção', 'Serviços'],
    isVerified: true
  },
  { 
    id: 'u5', 
    name: 'Casa Bela', 
    role: UserRole.SELLER, 
    nif: '504443333LA002', 
    email: 'comercial@casabela.ao', 
    phone: '+244 945 888 777', 
    location: 'Lubango, Huíla',
    storeDescription: 'Transforme sua casa num lar. Mobiliário moderno, decoração de interiores e têxteis de alta qualidade.',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200',
    rating: 4.9,
    reviewCount: 312,
    openingHours: '09:00 - 19:00 (Todos os dias)',
    tags: ['Mobiliário', 'Decoração', 'Casa', 'Design'],
    isVerified: true
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 Pro Max',
    description: 'O mais recente iPhone com titânio aeroespacial. Entrega imediata em Luanda.',
    price: 1850000,
    originalPrice: 2100000,
    currency: 'AOA',
    stock: 5,
    sellerId: 'u1',
    sellerName: 'Tech Angola',
    location: 'Luanda, Mutamba',
    imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    category: 'Eletrónica',
    options: [
      { name: 'Cor', values: ['Titânio Natural', 'Titânio Azul', 'Titânio Preto'] },
      { name: 'Armazenamento', values: ['256GB', '512GB', '1TB'] }
    ]
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
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
    category: 'Informática',
    options: [
      { name: 'Processador', values: ['Intel i5', 'Intel i7'] },
      { name: 'RAM', values: ['8GB', '16GB'] }
    ]
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
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800',
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
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    category: 'Mobiliário',
    options: [
      { name: 'Cor do Tecido', values: ['Cinza', 'Bege', 'Azul Marinho'] },
      { name: 'Lado do Canto', values: ['Esquerdo', 'Direito'] }
    ]
  },
  {
    id: 'p5',
    name: 'Smart TV Samsung 65" 4K',
    description: 'Cinema em casa com cores vibrantes e som imersivo.',
    price: 950000,
    originalPrice: 1200000,
    currency: 'AOA',
    stock: 3,
    sellerId: 'u1',
    sellerName: 'Tech Angola',
    location: 'Luanda, Maianga',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a20506948430?auto=format&fit=crop&q=80&w=800',
    category: 'Eletrónica'
  },
  {
    id: 'p6',
    name: 'Ténis Nike Air Jordan',
    description: 'Estilo e conforto para o dia a dia. Tamanhos 40-44.',
    price: 85000,
    originalPrice: 120000,
    currency: 'AOA',
    stock: 4,
    sellerId: 'u5',
    sellerName: 'Casa Bela',
    location: 'Lubango, Huíla',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
    category: 'Moda',
    options: [
      { name: 'Tamanho', values: ['40', '41', '42', '43', '44'] },
      { name: 'Cor', values: ['Vermelho/Preto', 'Branco/Preto'] }
    ]
  },
  {
    id: 'p7',
    name: 'Relógio Inteligente Pro',
    description: 'Monitoramento de saúde, notificações e bateria de longa duração.',
    price: 45000,
    originalPrice: 70000,
    currency: 'AOA',
    stock: 1,
    sellerId: 'u1',
    sellerName: 'Tech Angola',
    location: 'Luanda, Mutamba',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
    category: 'Eletrónica',
    options: [
      { name: 'Cor da Bracelete', values: ['Preto', 'Rosa', 'Cinza'] }
    ]
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
  },
  {
    id: 'd4',
    trackingCode: 'KZ-888999',
    productId: 'p5',
    productName: 'Smart TV Samsung 65"',
    clientName: 'Carla Dias',
    clientPhone: '+244 923 888 999',
    clientEmail: 'carla.dias@gmail.com',
    deliveryAddress: 'Centralidade do Kilamba, Quarteirão X, Prédio 5',
    status: DeliveryStatus.PROCESSING,
    estimatedDate: '2024-06-05',
    history: [
      { date: '2024-06-01 10:30', status: 'Pedido Recebido', location: 'Loja Online' },
      { date: '2024-06-02 09:00', status: 'Em Processamento', location: 'Armazém Central' }
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
