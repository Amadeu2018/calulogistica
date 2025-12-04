
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { TrackingView } from './components/TrackingView';
import { AdminView } from './components/AdminView';
import { ChatWidget } from './components/ChatWidget';
import { SellerDashboard } from './components/SellerDashboard';
import { SellerRegistration } from './components/SellerRegistration';
import { StoresView } from './components/StoresView';
import { MOCK_PRODUCTS, MOCK_USERS, MOCK_DELIVERIES } from './constants';
import { Product, User, UserRole, CartItem, Notification, DeliveryStatus } from './types';
import { Filter, ShoppingCart, CreditCard, Banknote, CheckCircle, Smartphone, Store, Mail, Phone, MapPin, X, Calendar, Star, ChevronRight, User as UserIcon, ShieldCheck, Zap, Search, ChevronDown, LogOut, Heart, ArrowRight, Package, Minus, Plus, Trash2, ArrowLeft, ChevronLeft, SlidersHorizontal, Clock, Tag, Check, AlertTriangle, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, tracking, admin, cart, seller-dashboard, seller-register, wishlist, client-orders, stores
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS); // Lifted state for Users/Sellers
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS); // Lifted state for Products
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {id: 'n1', title: 'Bem-vindo!', message: 'Explore as melhores ofertas de Angola.', time: 'Agora', read: false, type: 'info'}
  ]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // Product Options Selection State (For Adding and Editing)
  const [productToSelectOptions, setProductToSelectOptions] = useState<Product | null>(null);
  const [cartItemToEdit, setCartItemToEdit] = useState<CartItem | null>(null); // New state for editing cart items
  const [currentSelection, setCurrentSelection] = useState<{ [key: string]: string }>({});

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Shipping, 2: Review, 3: Payment, 4: Processing, 5: Success
  const [paymentMethod, setPaymentMethod] = useState<'mcx' | 'transfer'>('mcx');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    province: 'Luanda',
    city: '',
    address: '',
    notes: ''
  });

  const [filterCategory, setFilterCategory] = useState<string>('Todos');
  const [filterSeller, setFilterSeller] = useState<string>('Todos'); // New Seller Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Carousel State
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isPromoPaused, setIsPromoPaused] = useState(false);

  // Constants
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
  
  // Extract Unique Sellers for Filter
  const uniqueSellers = Array.from(new Map(products.map(item => [item.sellerId, item.sellerName])).entries());
  
  // Get Sellers Users from dynamic state
  const sellerUsers = users.filter(u => u.role === UserRole.SELLER);

  const angolaProvinces = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango', 'Cuanza Norte', 'Cuanza Sul', 
    'Cunene', 'Huambo', 'Huíla', 'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 
    'Namibe', 'Uíge', 'Zaire'
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCategory === 'Todos' || p.category === filterCategory;
    const matchesSeller = filterSeller === 'Todos' || p.sellerId === filterSeller;
    const query = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(query) || 
                          p.sellerName.toLowerCase().includes(query);
    return matchesCategory && matchesSearch && matchesSeller;
  });

  const promoProducts = products.filter(p => 
    (p.originalPrice && p.originalPrice > p.price) && 
    (filterSeller === 'Todos' || p.sellerId === filterSeller)
  );

  const wishlistProducts = products.filter(p => favoriteIds.includes(p.id));

  // Client Orders (Mocked based on User Name for this demo)
  const clientOrders = MOCK_DELIVERIES.filter(d => 
    currentUser && d.clientName.toLowerCase() === currentUser.name.toLowerCase().split(' (')[0].toLowerCase() // Simple fuzzy match for demo
  );

  // Utility class for hiding scrollbar but keeping functionality
  const hideScrollbarClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']";

  // Effects
  useEffect(() => {
    if (currentUser && isCheckoutModalOpen) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: currentUser.name,
        phone: currentUser.phone || '',
        address: currentUser.location || ''
      }));
    }
  }, [currentUser, isCheckoutModalOpen]);

  // Carousel Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel Auto-play
  useEffect(() => {
    if (isPromoPaused || promoProducts.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentPromoSlide(prev => {
        const maxIndex = promoProducts.length - itemsPerView;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [isPromoPaused, itemsPerView, promoProducts.length]);

  // Handlers
  const handleAddToCartClick = (product: Product) => {
    if (product.options && product.options.length > 0) {
       setProductToSelectOptions(product);
       setCartItemToEdit(null); // Ensure we are not editing
       setCurrentSelection({});
    } else {
       addToCart(product);
    }
  };

  const addToCart = (product: Product, selectedOptions?: { [key: string]: string }) => {
    setCart(prev => {
      // Find item with same ID AND same Options
      const existing = prev.find(item => {
         if (item.id !== product.id) return false;
         if (!selectedOptions && !item.selectedOptions) return true;
         if (selectedOptions && item.selectedOptions) {
            // Compare objects
            return JSON.stringify(selectedOptions) === JSON.stringify(item.selectedOptions);
         }
         return false;
      });

      if (existing) {
        addNotification(`Mais uma unidade de ${product.name} adicionada.`, 'info');
        return prev.map(item => item.cartItemId === existing.cartItemId ? {...item, quantity: item.quantity + 1} : item);
      }
      
      addNotification(`${product.name} adicionado ao carrinho.`, 'success');
      return [...prev, { 
         ...product, 
         quantity: 1, 
         cartItemId: `${product.id}-${Date.now()}`,
         selectedOptions: selectedOptions
      }];
    });
  };

  const handleEditCartItem = (item: CartItem) => {
    setCartItemToEdit(item);
    setProductToSelectOptions(null);
    setCurrentSelection(item.selectedOptions || {});
  };

  const handleUpdateCartItemOptions = () => {
    if (!cartItemToEdit) return;
    
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemToEdit.cartItemId) {
        return {
          ...item,
          selectedOptions: currentSelection
        };
      }
      return item;
    }));
    
    addNotification('Opções do produto atualizadas com sucesso!', 'success');
    setCartItemToEdit(null);
    setCurrentSelection({});
  };

  const confirmOptionsSelection = () => {
     if (cartItemToEdit) {
       handleUpdateCartItemOptions();
     } else if (productToSelectOptions) {
       addToCart(productToSelectOptions, currentSelection);
       setProductToSelectOptions(null);
       setCurrentSelection({});
     }
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty > item.stock) {
           addNotification(`Apenas ${item.stock} unidades disponíveis.`, 'warning');
           return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    addNotification('Item removido do carrinho.', 'info');
  };

  const handleToggleFavorite = (productId: string) => {
    setFavoriteIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        addNotification('Produto adicionado à Lista de Desejos', 'success');
        return [...prev, productId];
      }
    });
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      title: type === 'success' ? 'Sucesso' : type === 'warning' ? 'Atenção' : 'Informação',
      message,
      time: 'Agora',
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleBuyNow = (product: Product) => {
    if (product.options && product.options.length > 0) {
      handleAddToCartClick(product); // Trigger modal, logic there needs to redirect to checkout if needed, but for simplicity we add to cart then user goes to checkout
      // A small improvement could be adding a "Proceed to Checkout" param to confirmOptionsSelection
    } else {
      addToCart(product);
      handleCheckout();
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
       alert("Por favor, faça login para continuar a compra.");
       handleLogin(); // Auto login for demo
       return;
    }
    setIsCheckoutModalOpen(true);
    setCheckoutStep(1);
  };

  const processPayment = () => {
    setCheckoutStep(4);
    // Simulate API call
    setTimeout(() => {
      setCheckoutStep(5);
      setCart([]);
      addNotification('Sua encomenda foi confirmada com sucesso!', 'success');
    }, 2500);
  };

  const handleLogin = () => {
    if (!currentUser) {
      setCurrentUser(users[1]); // Default to Client (Maria Santos) for better demo flow
      addNotification(`Bem-vindo de volta, ${users[1].name}!`, 'success');
    }
    else if (currentUser.role === UserRole.CLIENT) setCurrentUser(users[2]); // Switch to Admin
    else if (currentUser.role === UserRole.ADMIN) setCurrentUser(users[0]); // Switch to Seller
    else setCurrentUser(null);
    setCurrentView('home');
  };

  // Seller Management Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    addNotification('Produto criado com sucesso!', 'success');
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addNotification('Produto atualizado.', 'info');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    addNotification('Produto removido.', 'warning');
  };

  const handleUpdateSellerProfile = (updatedSeller: User) => {
     setUsers(prev => prev.map(u => u.id === updatedSeller.id ? updatedSeller : u));
     setCurrentUser(updatedSeller); // Update current user session
     addNotification('Perfil da loja atualizado!', 'success');
  };

  const handleRegisterSeller = (sellerData: any) => {
    // Mock Registration
    const newSeller: User = {
      id: `u${Date.now()}`,
      name: sellerData.storeName,
      role: UserRole.SELLER,
      email: sellerData.email,
      phone: sellerData.phone,
      nif: sellerData.nif,
      location: sellerData.location,
      storeDescription: sellerData.description,
      coverImage: sellerData.storeLogo || '', // Map Logo URL to Cover Image
      isVerified: false,
      openingHours: '09:00 - 18:00',
      tags: [sellerData.category]
    };
    setUsers(prev => [...prev, newSeller]);
    setCurrentUser(newSeller);
    setCurrentView('seller-dashboard');
    addNotification(`Loja ${sellerData.storeName} registada com sucesso!`, 'success');
  };

  const handlePromoNext = () => {
    const maxIndex = promoProducts.length - itemsPerView;
    setCurrentPromoSlide(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePromoPrev = () => {
    const maxIndex = promoProducts.length - itemsPerView;
    setCurrentPromoSlide(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Calculations
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = shippingInfo.province === 'Luanda' ? 2000 : 5000;
  const finalTotal = cartTotal + shippingCost;
  const formatter = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' });

  // Seller Data Helper (using dynamic users list)
  const selectedSeller = users.find(u => u.id === selectedSellerId);
  const sellerProducts = products.filter(p => p.sellerId === selectedSellerId);

  // Modal Variables
  const activeModalProduct = cartItemToEdit || productToSelectOptions;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        currentUser={currentUser} 
        cartCount={cart.reduce((a,b) => a + b.quantity, 0)}
        notifications={notifications}
        onNavigate={setCurrentView}
        onLogin={handleLogin}
        onLogout={() => { setCurrentUser(null); setCurrentView('home'); }}
        onMarkNotificationRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n))}
        onClearNotifications={() => setNotifications([])}
      />

      <main className="flex-grow">
        {currentView === 'home' && (
          <div>
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/20 skew-x-12 transform translate-x-20"></div>
               <div className="max-w-7xl mx-auto relative z-10">
                 <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                   A Logística que move <span className="text-blue-400">Angola</span>
                 </h1>
                 <p className="text-lg text-slate-300 max-w-2xl mb-8">
                   Conectamos vendedores locais a clientes em todo o país. Entregas rápidas, pagamentos seguros via Multicaixa e gestão completa para o seu negócio.
                 </p>
                 <div className="flex gap-4">
                   <button 
                    onClick={() => setCurrentView('tracking')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg shadow-blue-900/50"
                   >
                     Rastrear Encomenda
                   </button>
                   {!currentUser && (
                     <button 
                      onClick={() => setCurrentView('seller-register')}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-semibold transition-colors backdrop-blur-sm"
                     >
                       Quero Vender
                     </button>
                   )}
                 </div>
               </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
               {/* Lightning Deals Section - Animated Carousel */}
               {promoProducts.length > 0 && (
                 <div className="mb-12 relative group" 
                      onMouseEnter={() => setIsPromoPaused(true)}
                      onMouseLeave={() => setIsPromoPaused(false)}
                 >
                   <div className="flex items-center justify-between mb-4">
                     <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                       <Zap className="text-yellow-500 fill-current animate-pulse" /> Ofertas Relâmpago
                       {filterSeller !== 'Todos' && <span className="text-sm font-normal text-slate-500 ml-2">(Filtrado por: {uniqueSellers.find(s => s[0] === filterSeller)?.[1]})</span>}
                     </h2>
                     <button 
                       onClick={() => { setFilterCategory('Todos'); setSearchQuery(''); setFilterSeller('Todos'); }}
                       className="text-blue-600 font-medium hover:underline text-sm"
                     >
                       Ver todas
                     </button>
                   </div>

                   {/* Carousel Container */}
                   <div className="relative overflow-hidden -mx-2 p-2">
                      <div 
                        className="flex transition-transform duration-700 ease-out will-change-transform"
                        style={{ transform: `translateX(-${currentPromoSlide * (100 / itemsPerView)}%)` }}
                      >
                         {promoProducts.map(product => (
                            <div 
                              key={product.id} 
                              className="flex-shrink-0 px-3 transition-all duration-300"
                              style={{ width: `${100 / itemsPerView}%` }}
                            >
                              <ProductCard 
                                  product={product} 
                                  isFavorite={favoriteIds.includes(product.id)}
                                  onToggleFavorite={handleToggleFavorite}
                                  onAddToCart={handleAddToCartClick}
                                  onBuyNow={handleBuyNow}
                                  onViewSeller={(id) => setSelectedSellerId(id)}
                              />
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* Navigation Arrows */}
                   {promoProducts.length > itemsPerView && (
                     <>
                        <button 
                          onClick={handlePromoPrev}
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur shadow-lg border border-slate-100 p-2 rounded-full text-slate-700 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 -ml-2 z-10 hidden md:block"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={handlePromoNext}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur shadow-lg border border-slate-100 p-2 rounded-full text-slate-700 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 -mr-2 z-10 hidden md:block"
                        >
                          <ChevronRight size={24} />
                        </button>
                     </>
                   )}

                   {/* Dot Indicators */}
                   {promoProducts.length > itemsPerView && (
                      <div className="flex justify-center gap-1.5 mt-4">
                        {Array.from({ length: Math.ceil(promoProducts.length - itemsPerView + 1) }).map((_, idx) => (
                           <button 
                              key={idx}
                              onClick={() => setCurrentPromoSlide(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                 currentPromoSlide === idx ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                              }`}
                           />
                        ))}
                      </div>
                   )}
                 </div>
               )}

               {/* Search & Filter Section */}
               <div className="mb-6 sticky top-16 z-30 bg-slate-50/95 backdrop-blur-md py-4 space-y-3 shadow-sm border-b border-slate-200/50 -mx-4 px-4 transition-all">
                 
                 {/* Top Row: Search + Mobile Filter Toggle */}
                 <div className="flex gap-2 max-w-7xl mx-auto">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="text-slate-400" size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por produto, marca ou vendedor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm bg-white transition-shadow"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Filter Button */}
                    <button 
                      onClick={() => setShowMobileFilters(true)}
                      className="md:hidden bg-white p-3.5 rounded-2xl ring-1 ring-slate-200 shadow-sm text-slate-700 hover:text-blue-600 hover:bg-slate-50 shrink-0"
                    >
                       <SlidersHorizontal size={20} />
                    </button>
                 </div>

                 {/* Desktop Filters Row */}
                 <div className={`hidden md:flex items-center gap-3 overflow-x-auto pb-1 max-w-7xl mx-auto w-full pt-2 ${hideScrollbarClass}`}>
                   <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex-shrink-0">
                      <Filter size={16} className="text-slate-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Filtros</span>
                   </div>
                   
                   {/* Seller Filter */}
                   <div className="relative flex-shrink-0 group">
                      <select
                        value={filterSeller}
                        onChange={(e) => setFilterSeller(e.target.value)}
                        className={`appearance-none pl-4 pr-10 py-2 rounded-full text-sm font-medium border transition-all outline-none cursor-pointer shadow-sm ${
                           filterSeller !== 'Todos' 
                           ? 'bg-slate-900 text-white border-slate-900' 
                           : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <option value="Todos" className="text-slate-900 bg-white">Todos os Vendedores</option>
                        {uniqueSellers.map(([id, name]) => (
                           <option key={id} value={id} className="text-slate-900 bg-white">{name}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-0 ${filterSeller !== 'Todos' ? 'text-white' : 'text-slate-400'}`} />
                   </div>

                   <div className="w-px h-6 bg-slate-300 mx-1 flex-shrink-0"></div>

                   {/* Category Filters Desktop */}
                   {categories.map(cat => (
                     <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm flex-shrink-0 ${
                        filterCategory === cat 
                          ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                     >
                       {cat}
                     </button>
                   ))}
                 </div>

                 {/* Mobile Quick Categories (Horizontal Scroll) */}
                 <div className={`md:hidden flex overflow-x-auto pb-1 gap-3 ${hideScrollbarClass} -mx-4 px-4`}>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                          filterCategory === cat 
                            ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                            : 'bg-white border border-slate-200 text-slate-600 shadow-sm'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
               </div>

               {/* Product Grid */}
               {filteredProducts.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   {filteredProducts.map(product => (
                     <ProductCard 
                        key={product.id} 
                        product={product} 
                        isFavorite={favoriteIds.includes(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToCart={handleAddToCartClick}
                        onBuyNow={handleBuyNow}
                        onViewSeller={(id) => setSelectedSellerId(id)}
                      />
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed mx-auto max-w-2xl">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Search size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-slate-500 mb-6">Tente buscar por outro termo ou ajuste os filtros selecionados.</p>
                    <button 
                      onClick={() => { setSearchQuery(''); setFilterCategory('Todos'); setFilterSeller('Todos'); }}
                      className="text-blue-600 hover:text-blue-700 hover:underline font-bold flex items-center justify-center gap-2"
                    >
                      <X size={16} /> Limpar Todos os Filtros
                    </button>
                 </div>
               )}
            </div>
          </div>
        )}

        {currentView === 'stores' && (
           <StoresView 
              sellers={sellerUsers} 
              onViewSeller={(id) => setSelectedSellerId(id)} 
           />
        )}

        {currentView === 'tracking' && <TrackingView />}
        
        {currentView === 'admin' && <AdminView />}

        {currentView === 'seller-register' && (
          <SellerRegistration 
            onRegister={handleRegisterSeller}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'seller-dashboard' && currentUser && (
          <SellerDashboard 
            currentUser={currentUser}
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateSeller={handleUpdateSellerProfile}
          />
        )}

        {currentView === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
             <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-slate-900">
               <Heart className="text-red-500 fill-current" /> Lista de Desejos
             </h2>
             {wishlistProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {wishlistProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      isFavorite={true}
                      onToggleFavorite={handleToggleFavorite}
                      onAddToCart={handleAddToCartClick}
                      onBuyNow={handleBuyNow}
                      onViewSeller={(id) => setSelectedSellerId(id)}
                    />
                 ))}
               </div>
             ) : (
               <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Sua lista está vazia</h3>
                  <p className="text-slate-500 mt-2">Guarde os produtos que você ama para comprar depois.</p>
                  <button onClick={() => setCurrentView('home')} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">
                    Explorar Produtos
                  </button>
               </div>
             )}
          </div>
        )}

        {currentView === 'client-orders' && (
          <div className="max-w-5xl mx-auto px-4 py-12">
             <h2 className="text-3xl font-bold mb-2 text-slate-900">Meus Pedidos</h2>
             <p className="text-slate-500 mb-8">Histórico completo das suas compras na plataforma.</p>
             
             {clientOrders.length > 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                          <tr>
                            <th className="px-6 py-4 font-medium">Produto</th>
                            <th className="px-6 py-4 font-medium">Data</th>
                            <th className="px-6 py-4 font-medium">Estado</th>
                            <th className="px-6 py-4 font-medium">Cód. Rastreio</th>
                            <th className="px-6 py-4 text-right font-medium">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {clientOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4">
                                <span className="font-bold text-slate-900 block">{order.productName}</span>
                                <span className="text-xs text-slate-500">{order.productId}</span>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{order.estimatedDate}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                                  ${order.status === DeliveryStatus.DELIVERED ? 'bg-green-100 text-green-700' : 
                                    order.status === DeliveryStatus.IN_TRANSIT ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${order.status === DeliveryStatus.DELIVERED ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-slate-500">{order.trackingCode}</td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => setCurrentView('tracking')}
                                  className="text-blue-600 hover:underline font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md"
                                >
                                  Rastrear
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
             ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
                   <Package size={48} className="mx-auto mb-4 text-slate-300" />
                   <h3 className="text-xl font-bold text-slate-900">Nenhum pedido encontrado</h3>
                   <p className="text-slate-500 mt-2">Você ainda não fez nenhuma compra conosco.</p>
                   <button onClick={() => setCurrentView('home')} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                     Começar a Comprar
                   </button>
                </div>
             )}
          </div>
        )}

        {currentView === 'cart' && (
          <div className="max-w-6xl mx-auto px-4 py-12">
             <div className="flex items-center gap-2 mb-8">
               <button onClick={() => setCurrentView('home')} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <ArrowLeft size={24} />
               </button>
               <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                 <ShoppingCart className="text-blue-600 fill-current" size={32} /> Seu Carrinho
               </h2>
               <span className="bg-slate-100 text-slate-600 text-sm font-bold px-2 py-0.5 rounded-full ml-2">
                 {cart.length} {cart.length === 1 ? 'Item' : 'Itens'}
               </span>
             </div>

             {cart.length === 0 ? (
               <div className="bg-white py-20 px-4 rounded-3xl text-center border border-slate-200 border-dashed max-w-2xl mx-auto">
                 <div className="w-24 h-24 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart size={48} />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">Seu carrinho está vazio</h3>
                 <p className="text-slate-500 mb-8 max-w-sm mx-auto">Parece que você ainda não adicionou nenhum item. Explore nossas categorias para encontrar o que precisa.</p>
                 <button 
                  onClick={() => setCurrentView('home')} 
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 hover:-translate-y-1"
                >
                  Começar a Comprar
                 </button>
               </div>
             ) : (
               <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Cart Items List */}
                  <div className="lg:col-span-8 space-y-4">
                    {cart.map(item => (
                      <div key={item.cartItemId} className="bg-white p-4 rounded-2xl flex flex-col sm:flex-row gap-5 border border-slate-100 shadow-sm transition-shadow hover:shadow-md relative overflow-hidden group">
                         {/* Image */}
                         <div className="w-full sm:w-32 h-32 shrink-0 bg-slate-100 rounded-xl overflow-hidden">
                           <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                         </div>

                         {/* Details */}
                         <div className="flex-grow flex flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                   <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{item.category}</p>
                                   <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{item.name}</h3>
                                   <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                      <Store size={14} className="text-blue-500" />
                                      <span className="font-medium">Vendido por: {item.sellerName}</span>
                                   </div>
                                   {/* Selected Variants */}
                                   {item.selectedOptions && (
                                     <div className="mt-2 flex flex-wrap gap-2 items-center">
                                        {Object.entries(item.selectedOptions).map(([key, value]) => (
                                           <span key={key} className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-xs border border-slate-200">
                                              {key}: <span className="font-bold text-slate-800">{value}</span>
                                           </span>
                                        ))}
                                        {/* Edit Options Button */}
                                        {item.options && item.options.length > 0 && (
                                          <button 
                                            onClick={() => handleEditCartItem(item)}
                                            className="text-blue-600 hover:bg-blue-50 p-1 rounded-md transition-colors"
                                            title="Alterar Opções"
                                          >
                                            <SlidersHorizontal size={14} />
                                          </button>
                                        )}
                                     </div>
                                   )}
                                </div>
                                <p className="font-bold text-lg text-blue-600">{formatter.format(item.price * item.quantity)}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 sm:mt-0">
                               <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                  <button 
                                    onClick={() => updateQuantity(item.cartItemId, -1)}
                                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                  >
                                     <Minus size={16} />
                                  </button>
                                  <span className="w-8 text-center font-bold text-sm text-slate-900">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.cartItemId, 1)}
                                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
                                  >
                                     <Plus size={16} />
                                  </button>
                               </div>

                               <button 
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                               >
                                  <Trash2 size={18} /> <span className="sm:hidden">Remover</span>
                               </button>
                            </div>
                         </div>
                      </div>
                    ))}
                    
                    <button 
                       onClick={() => setCurrentView('home')}
                       className="flex items-center gap-2 text-blue-600 font-bold hover:underline mt-4 px-2"
                    >
                       <ArrowLeft size={18} /> Continuar a Comprar
                    </button>
                  </div>

                  {/* Summary Card */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 h-fit shadow-sm sticky top-24">
                     <h3 className="font-bold text-xl mb-6 text-slate-900">Resumo do Pedido</h3>
                     
                     <div className="space-y-4 mb-6">
                       <div className="flex justify-between text-slate-600">
                         <span>Subtotal ({cart.reduce((a,b) => a + b.quantity, 0)} itens)</span>
                         <span className="font-medium">{formatter.format(cartTotal)}</span>
                       </div>
                       <div className="flex justify-between text-slate-600">
                         <span className="flex items-center gap-1.5">Estimativa de Entrega <span className="bg-slate-100 text-slate-400 text-[10px] px-1.5 py-0.5 rounded uppercase">Info</span></span>
                         <span className="font-medium text-slate-400 italic">Calculado no checkout</span>
                       </div>
                     </div>

                     <div className="border-t border-slate-100 pt-4 mb-6">
                        <div className="flex justify-between items-end">
                           <span className="font-bold text-lg text-slate-900">Total Parcial</span>
                           <span className="font-bold text-2xl text-blue-600">{formatter.format(cartTotal)}</span>
                        </div>
                        <p className="text-xs text-slate-400 text-right mt-1">Impostos incluídos onde aplicável</p>
                     </div>

                     <button 
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-lg"
                     >
                       <CheckCircle size={20} />
                       Finalizar Compra
                     </button>

                     {/* Security Badges */}
                     <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center text-center gap-2">
                           <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                              <ShieldCheck size={20} />
                           </div>
                           <span className="text-xs font-bold text-slate-500">Compra 100% Segura</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                              <Zap size={20} />
                           </div>
                           <span className="text-xs font-bold text-slate-500">Entrega Rápida</span>
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-sm">
           <div>
             <h4 className="text-white font-bold text-lg mb-4">KwanzaLogistics</h4>
             <p className="mb-6">A maior rede de entregas de Angola. Conectando Cabinda ao Cunene.</p>
             <div className="flex gap-4">
                <a href="#" className="hover:text-white transition-colors p-2 bg-slate-800 rounded-full"><Facebook size={20} /></a>
                <a href="#" className="hover:text-white transition-colors p-2 bg-slate-800 rounded-full"><Instagram size={20} /></a>
                <a href="#" className="hover:text-white transition-colors p-2 bg-slate-800 rounded-full"><Twitter size={20} /></a>
                <a href="#" className="hover:text-white transition-colors p-2 bg-slate-800 rounded-full"><Linkedin size={20} /></a>
             </div>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4">Links Úteis</h4>
             <ul className="space-y-2">
               <li><button onClick={() => setCurrentView('tracking')} className="hover:text-white">Rastrear Encomenda</button></li>
               <li><button onClick={() => setCurrentView('seller-register')} className="hover:text-white">Vender na Kwanza</button></li>
               <li>Termos e Condições</li>
             </ul>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4">Contacto</h4>
             <p>Luanda, Angola</p>
             <p>suporte@kwanzalogistics.ao</p>
             <p>+244 923 000 000</p>
           </div>
        </div>
      </footer>

      <ChatWidget />

      {/* Product Options Selection Modal (Shared for Adding and Editing) */}
      {(activeModalProduct) && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-900">
                    {cartItemToEdit ? 'Editar Opções' : 'Personalizar Produto'}
                  </h3>
                  <button 
                    onClick={() => { setProductToSelectOptions(null); setCartItemToEdit(null); }} 
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={20} />
                  </button>
               </div>
               
               <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                     <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <img src={activeModalProduct.imageUrl} alt={activeModalProduct.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 text-lg">{activeModalProduct.name}</h4>
                        <p className="text-blue-600 font-bold">{formatter.format(activeModalProduct.price)}</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {activeModalProduct.options?.map(option => (
                        <div key={option.name}>
                           <p className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">{option.name}</p>
                           <div className="flex flex-wrap gap-2">
                              {option.values.map(val => {
                                 // Check unavailable logic
                                 const isUnavailable = activeModalProduct.unavailableOptions?.includes(val);
                                 
                                 return (
                                 <button
                                    key={val}
                                    onClick={() => {
                                      if (isUnavailable) {
                                         addNotification(`A opção "${val}" está esgotada no momento.`, 'warning');
                                         return;
                                      }
                                      setCurrentSelection({...currentSelection, [option.name]: val});
                                    }}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium border transition-all 
                                      ${isUnavailable 
                                        ? 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed opacity-70' 
                                        : currentSelection[option.name] === val 
                                          ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-offset-1 ring-slate-900' 
                                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                      }`}
                                 >
                                    {val}
                                    {/* Unavailable Strike-through or Tooltip */}
                                    {isUnavailable && (
                                       <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="w-full h-px bg-slate-400 rotate-12"></div>
                                       </div>
                                    )}
                                 </button>
                              )})}
                           </div>
                           {/* Warning msg if selection is unavailable */}
                           {activeModalProduct.options?.some(opt => {
                              const selectedVal = currentSelection[opt.name];
                              return selectedVal && activeModalProduct.unavailableOptions?.includes(selectedVal);
                           }) && (
                             <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                               <AlertTriangle size={12} /> Alguma opção selecionada não está disponível.
                             </p>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button 
                     onClick={confirmOptionsSelection}
                     disabled={activeModalProduct.options?.some(opt => !currentSelection[opt.name])}
                     className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                     <CheckCircle size={18} /> {cartItemToEdit ? 'Salvar Alterações' : 'Confirmar e Adicionar'}
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
           <div className="bg-white w-full max-w-xs h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal size={20} /> Filtros
                 </h3>
                 <button onClick={() => setShowMobileFilters(false)} className="bg-white p-2 rounded-full shadow-sm text-slate-500">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-5 space-y-8">
                 {/* Seller Filter Block */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Vendedor</h4>
                    <div className="space-y-2">
                       <button 
                          onClick={() => setFilterSeller('Todos')}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${filterSeller === 'Todos' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                       >
                          Todos os Vendedores
                       </button>
                       {uniqueSellers.map(([id, name]) => (
                          <button
                             key={id}
                             onClick={() => setFilterSeller(id)}
                             className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors border ${filterSeller === id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                          >
                             {name}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Category Filter Block */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Categoria</h4>
                    <div className="flex flex-wrap gap-2">
                       {categories.map(cat => (
                          <button
                             key={cat}
                             onClick={() => setFilterCategory(cat)}
                             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filterCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                          >
                             {cat}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50">
                 <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-200"
                 >
                    Ver {filteredProducts.length} Resultados
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Seller Profile Modal (Enhanced) */}
      {selectedSellerId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200 flex flex-col">
              
              {/* Sticky Close Button */}
              <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => setSelectedSellerId(null)}
                  className="bg-white/20 hover:bg-white/40 backdrop-blur text-white hover:text-white md:text-slate-900 md:bg-white md:hover:bg-slate-100 p-2 rounded-full transition-colors shadow-lg ring-1 ring-white/20 md:ring-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Header / Banner */}
              <div className="bg-slate-900 h-64 md:h-72 relative w-full shrink-0 overflow-hidden">
                  {selectedSeller?.coverImage ? (
                     <img src={selectedSeller.coverImage} className="w-full h-full object-cover opacity-60" alt="Cover" />
                  ) : (
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 opacity-95"></div>
                  )}
                  {/* Decorative Elements */}
                  {!selectedSeller?.coverImage && (
                     <div className="absolute -bottom-10 -right-10 text-white/5 transform rotate-12 pointer-events-none">
                        <Store size={240} />
                     </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
              </div>
              
              <div className="px-6 md:px-10 pb-10">
                 {/* Seller Info Header */}
                 <div className="relative -mt-24 mb-10 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                    {/* Logo/Avatar */}
                    <div className="w-40 h-40 rounded-2xl bg-white p-1.5 shadow-xl relative z-20 shrink-0 ring-4 ring-white">
                       <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-inner overflow-hidden">
                          <Store size={56} />
                       </div>
                       {/* Verified Badge */}
                       <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full ring-4 ring-white shadow-sm" title="Vendedor Verificado">
                          <CheckCircle size={20} className="fill-white text-blue-500" />
                       </div>
                    </div>
                    
                    <div className="flex-grow bg-white/80 backdrop-blur border border-slate-100/50 rounded-2xl p-6 shadow-sm relative z-10 md:mb-2 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                              <h2 className="text-3xl md:text-4xl font-bold text-slate-950 mb-2 leading-tight">
                                 {selectedSeller?.name || 'Vendedor Desconhecido'}
                              </h2>
                              <p className="text-slate-600 max-w-lg">
                                 {selectedSeller?.storeDescription || selectedSeller?.role}
                              </p>
                           </div>
                           {/* Rating */}
                           {selectedSeller?.rating && (
                              <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100 flex flex-col items-center justify-center shrink-0">
                                 <div className="flex items-center gap-1 text-yellow-600 font-bold text-xl">
                                    {selectedSeller.rating} <Star className="fill-current" size={20} />
                                 </div>
                                 <span className="text-xs text-yellow-700 font-medium">{selectedSeller.reviewCount} Avaliações</span>
                              </div>
                           )}
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-slate-950 mt-4 font-medium pt-4 border-t border-slate-100/50">
                           {selectedSeller?.email && (
                             <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                               <Mail size={16} className="text-slate-500" />
                               <a href={`mailto:${selectedSeller.email}`}>{selectedSeller.email}</a>
                             </div>
                           )}
                           {selectedSeller?.phone && (
                             <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                               <Phone size={16} className="text-slate-500" />
                               <a href={`tel:${selectedSeller.phone}`}>{selectedSeller.phone}</a>
                             </div>
                           )}
                           <div className="flex items-center gap-2">
                             <MapPin size={16} className="text-slate-500" />
                             <span>{selectedSeller?.location || 'Localização não disponível'}</span>
                           </div>
                        </div>
                    </div>
                 </div>

                 {/* New Store Details Section (Hours & Tags) */}
                 <div className="grid md:grid-cols-3 gap-6 mb-8">
                     <div className="md:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                           <Clock size={16} /> Horário de Funcionamento
                        </h4>
                        <p className="text-slate-700 font-medium flex items-center gap-2">
                           {selectedSeller?.openingHours ? (
                              <>
                                 <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                                 {selectedSeller.openingHours}
                              </>
                           ) : (
                              <span className="text-slate-400 italic">Horário não disponível</span>
                           )}
                        </p>
                     </div>
                     <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                           <Tag size={16} /> Especialidades
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {selectedSeller?.tags ? (
                              selectedSeller.tags.map(tag => (
                                 <span key={tag} className="bg-white px-2 py-1 rounded border border-slate-200 text-xs font-medium text-slate-600">
                                    {tag}
                                 </span>
                              ))
                           ) : (
                              <span className="text-slate-400 text-sm italic">Geral</span>
                           )}
                        </div>
                     </div>
                 </div>

                 <hr className="border-slate-100 mb-8" />
                 
                 {/* Action Bar */}
                 <div className="flex justify-end mb-6">
                    <button 
                       onClick={() => {
                          if (selectedSellerId) {
                             setFilterSeller(selectedSellerId);
                             setSelectedSellerId(null);
                             setCurrentView('home'); // Ensure we are not in grid
                             window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                       }}
                       className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                    >
                       <Filter size={18} /> Ver Produtos na Grelha Principal
                    </button>
                 </div>

                 {/* Seller Products Grid */}
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Store size={20} className="text-slate-400" />
                      Catálogo do Vendedor
                    </h3>
                    
                    {sellerProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sellerProducts.map(product => (
                          <ProductCard 
                              key={product.id} 
                              product={product} 
                              isFavorite={favoriteIds.includes(product.id)}
                              onToggleFavorite={handleToggleFavorite}
                              onAddToCart={handleAddToCartClick}
                              onBuyNow={handleBuyNow}
                              onViewSeller={() => {}} // Already in view
                            />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                         <Store size={48} className="mx-auto text-slate-300 mb-4" />
                         <p className="text-slate-500 font-medium">Este vendedor ainda não publicou outros produtos.</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Checkout Wizard Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
              
              {/* Header with Steps */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Finalizar Encomenda</h3>
                    <button onClick={() => setIsCheckoutModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
                      <X size={20} />
                    </button>
                 </div>
                 
                 {/* Stepper */}
                 <div className="flex items-center justify-between px-2 sm:px-8">
                    {['Dados de Envio', 'Revisão', 'Pagamento'].map((label, index) => {
                      const stepNum = index + 1;
                      const isActive = checkoutStep >= stepNum;
                      const isCurrent = checkoutStep === stepNum;
                      return (
                        <div key={label} className="flex flex-col items-center relative z-10">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'} ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}>
                             {isActive ? <CheckCircle size={16} /> : stepNum}
                           </div>
                           <span className={`text-xs mt-2 font-medium ${isActive ? 'text-blue-700' : 'text-slate-400'}`}>{label}</span>
                        </div>
                      );
                    })}
                    {/* Progress Bar Background */}
                    <div className="absolute left-0 right-0 top-[88px] h-0.5 bg-slate-200 mx-12 sm:mx-20 -z-0"></div>
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute left-0 top-[88px] h-0.5 bg-blue-600 mx-12 sm:mx-20 -z-0 transition-all duration-300"
                      style={{ width: `${((Math.min(checkoutStep, 3) - 1) / 2) * (window.innerWidth < 640 ? 70 : 80)}%` }} // Approximate calc for demo
                    ></div>
                 </div>
              </div>

              {/* Body Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow">
                
                {/* STEP 1: SHIPPING INFO */}
                {checkoutStep === 1 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                     <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <MapPin size={20} className="text-blue-500" /> Onde devemos entregar?
                     </h4>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              value={shippingInfo.fullName}
                              onChange={e => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                              className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Quem irá receber?"
                            />
                            <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Telemóvel</label>
                          <div className="relative">
                            <input 
                              type="tel" 
                              value={shippingInfo.phone}
                              onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})}
                              className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="9XX XXX XXX"
                            />
                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Província</label>
                          <div className="relative">
                             <select 
                                value={shippingInfo.province}
                                onChange={e => setShippingInfo({...shippingInfo, province: e.target.value})}
                                className="w-full border border-slate-300 rounded-lg pl-3 pr-8 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
                             >
                                {angolaProvinces.map(prov => (
                                  <option key={prov} value={prov}>{prov}</option>
                                ))}
                             </select>
                             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-180" size={16} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-slate-700">Cidade / Município</label>
                          <input 
                            type="text" 
                            value={shippingInfo.city}
                            onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Viana, Talatona..."
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-sm font-medium text-slate-700">Endereço Detalhado</label>
                          <textarea 
                            value={shippingInfo.address}
                            onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            placeholder="Rua, número da casa, ponto de referência..."
                          />
                        </div>
                     </div>
                  </div>
                )}

                {/* STEP 2: REVIEW */}
                {checkoutStep === 2 && (
                   <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                         <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Resumo do Pedido</h4>
                         <div className="space-y-3">
                            {cart.map(item => (
                               <div key={item.cartItemId} className="flex justify-between items-center text-sm">
                                  <div className="text-slate-700 flex flex-col">
                                     <span className="flex items-center gap-2">
                                       <span className="bg-white border border-slate-200 px-1.5 rounded text-xs font-bold text-slate-500">{item.quantity}x</span>
                                       {item.name}
                                     </span>
                                     {item.selectedOptions && (
                                       <span className="text-xs text-slate-400 pl-8">
                                          {Object.values(item.selectedOptions).join(', ')}
                                       </span>
                                     )}
                                  </div>
                                  <span className="font-medium text-slate-900">{formatter.format(item.price * item.quantity)}</span>
                               </div>
                            ))}
                         </div>
                         <div className="border-t border-slate-200 mt-4 pt-3 space-y-2">
                            <div className="flex justify-between text-sm text-slate-600">
                               <span>Subtotal</span>
                               <span>{formatter.format(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                               <span>Taxa de Entrega ({shippingInfo.province})</span>
                               <span>{formatter.format(shippingCost)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                               <span>Total a Pagar</span>
                               <span className="text-blue-600">{formatter.format(finalTotal)}</span>
                            </div>
                         </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                         <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={20} />
                         <div>
                            <p className="font-bold text-blue-900 text-sm">Confirmar Dados de Entrega</p>
                            <p className="text-sm text-blue-700/80 mt-1">
                               {shippingInfo.fullName} • {shippingInfo.phone}<br/>
                               {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.province}
                            </p>
                            <button onClick={() => setCheckoutStep(1)} className="text-xs font-bold text-blue-600 underline mt-2 hover:text-blue-800">Editar</button>
                         </div>
                      </div>
                   </div>
                )}

                {/* STEP 3: PAYMENT */}
                {checkoutStep === 3 && (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <p className="text-sm text-slate-500 mb-4">Selecione o método de pagamento seguro:</p>
                    <div className="space-y-3 mb-6">
                      <button 
                        onClick={() => setPaymentMethod('mcx')}
                        className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'mcx' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                        <div className="bg-orange-500 text-white p-2.5 rounded-lg shadow-sm">
                          <Smartphone size={24} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900">Multicaixa Express</p>
                          <p className="text-xs text-slate-500">Pagamento automático via telemóvel</p>
                        </div>
                        <div className="ml-auto">
                           {paymentMethod === 'mcx' && <CheckCircle className="text-blue-500" size={20} />}
                        </div>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('transfer')}
                        className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-md' : 'border-slate-200 hover:bg-slate-50'}`}
                      >
                         <div className="bg-slate-700 text-white p-2.5 rounded-lg shadow-sm">
                          <Banknote size={24} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900">Transferência Bancária</p>
                          <p className="text-xs text-slate-500">IBAN / Comprovativo</p>
                        </div>
                        <div className="ml-auto">
                           {paymentMethod === 'transfer' && <CheckCircle className="text-blue-500" size={20} />}
                        </div>
                      </button>
                    </div>
                    
                    {paymentMethod === 'mcx' && (
                       <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Número associado ao Express</label>
                          <input type="tel" defaultValue={shippingInfo.phone} className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                             <ShieldCheck size={12} /> Seus dados estão protegidos por criptografia de ponta a ponta.
                          </p>
                       </div>
                    )}
                  </div>
                )}

                {/* STEP 4: PROCESSING */}
                {checkoutStep === 4 && (
                  <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                     <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <Store className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
                     </div>
                     <h4 className="text-xl font-bold text-slate-900 mb-2">Processando Pagamento...</h4>
                     <p className="text-slate-500">Por favor, verifique seu telemóvel para confirmar a transação.</p>
                  </div>
                )}

                {/* STEP 5: SUCCESS */}
                {checkoutStep === 5 && (
                  <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                     <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                       <CheckCircle size={40} strokeWidth={3} />
                     </div>
                     <h4 className="text-2xl font-bold text-slate-900 mb-2">Encomenda Confirmada!</h4>
                     <p className="text-slate-600 mb-8 max-w-sm mx-auto">Obrigado pela sua compra. Enviamos um email com os detalhes do rastreio.</p>
                     
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 max-w-sm mx-auto text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase">Código de Rastreio</p>
                        <p className="font-mono font-bold text-xl text-slate-800 tracking-wider">KZ-{Math.floor(100000 + Math.random() * 900000)}</p>
                     </div>

                     <button 
                       onClick={() => { setIsCheckoutModalOpen(false); setCurrentView('tracking'); }}
                       className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:-translate-y-1"
                     >
                       Acompanhar Encomenda
                     </button>
                  </div>
                )}

              </div>

              {/* Footer Actions */}
              {checkoutStep < 4 && (
                 <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
                    {checkoutStep > 1 ? (
                       <button onClick={() => setCheckoutStep(curr => curr - 1)} className="text-slate-500 font-medium hover:text-slate-800 px-4 py-2">
                          Voltar
                       </button>
                    ) : (
                       <div></div>
                    )}

                    <button 
                       onClick={() => {
                          if (checkoutStep === 1) {
                             if (!shippingInfo.address || !shippingInfo.phone || !shippingInfo.fullName) {
                                alert('Por favor, preencha os dados obrigatórios.');
                                return;
                             }
                             setCheckoutStep(2);
                          } else if (checkoutStep === 2) {
                             setCheckoutStep(3);
                          } else if (checkoutStep === 3) {
                             processPayment();
                          }
                       }}
                       className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all"
                    >
                       {checkoutStep === 3 ? `Pagar ${formatter.format(finalTotal)}` : 'Continuar'}
                       {checkoutStep < 3 && <ChevronRight size={18} />}
                    </button>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
