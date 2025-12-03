import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { TrackingView } from './components/TrackingView';
import { AdminView } from './components/AdminView';
import { ChatWidget } from './components/ChatWidget';
import { MOCK_PRODUCTS, MOCK_USERS } from './constants';
import { Product, User, UserRole, CartItem } from './types';
import { Filter, ShoppingCart, CreditCard, Banknote, CheckCircle, Smartphone, Store, Mail, Phone, MapPin, X, Calendar, Star } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, tracking, admin, cart
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mcx' | 'transfer'>('mcx');
  const [paymentStep, setPaymentStep] = useState(1); // 1: method, 2: processing, 3: success
  const [filterCategory, setFilterCategory] = useState<string>('Todos');
  
  // Seller Modal State
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Categories extraction
  const categories = ['Todos', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  const filteredProducts = filterCategory === 'Todos' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === filterCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    handleCheckout();
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const formatter = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' });

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
    setPaymentStep(1);
  };

  const processPayment = () => {
    setPaymentStep(2);
    // Simulate API call
    setTimeout(() => {
      setPaymentStep(3);
      setCart([]);
    }, 2500);
  };

  // Mock Login
  const handleLogin = () => {
    // Rotating login for demo purposes: Admin -> Seller -> Client
    if (!currentUser) setCurrentUser(MOCK_USERS[2]); // Default to Admin
    else if (currentUser.role === UserRole.ADMIN) setCurrentUser(MOCK_USERS[0]);
    else if (currentUser.role === UserRole.SELLER) setCurrentUser(MOCK_USERS[1]);
    else setCurrentUser(null);
  };

  // Seller Data Helper
  const selectedSeller = MOCK_USERS.find(u => u.id === selectedSellerId);
  const sellerProducts = MOCK_PRODUCTS.filter(p => p.sellerId === selectedSellerId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        currentUser={currentUser} 
        cartCount={cart.reduce((a,b) => a + b.quantity, 0)}
        onNavigate={setCurrentView}
        onLogin={handleLogin}
        onLogout={() => { setCurrentUser(null); setCurrentView('home'); }}
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
                 <button 
                  onClick={() => setCurrentView('tracking')}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                 >
                   Rastrear Encomenda
                 </button>
               </div>
            </div>

            {/* Filters & Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
               <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                 <Filter size={20} className="text-slate-400 mr-2 flex-shrink-0" />
                 {categories.map(cat => (
                   <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      filterCategory === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {filteredProducts.map(product => (
                   <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart}
                      onBuyNow={handleBuyNow}
                      onViewSeller={(id) => setSelectedSellerId(id)}
                    />
                 ))}
               </div>
            </div>
          </div>
        )}

        {currentView === 'tracking' && <TrackingView />}
        
        {currentView === 'admin' && <AdminView />}

        {currentView === 'cart' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
               <ShoppingCart /> Seu Carrinho
             </h2>
             {cart.length === 0 ? (
               <div className="bg-white p-8 rounded-xl text-center border border-slate-200">
                 <p className="text-slate-500">Seu carrinho está vazio.</p>
                 <button onClick={() => setCurrentView('home')} className="mt-4 text-blue-600 font-medium">Voltar a comprar</button>
               </div>
             ) : (
               <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-xl flex gap-4 border border-slate-100">
                         <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-slate-100"/>
                         <div className="flex-grow">
                            <h3 className="font-semibold text-slate-900">{item.name}</h3>
                            <p className="text-slate-500 text-sm">{formatter.format(item.price)}</p>
                            <div className="mt-2 flex items-center text-sm text-slate-600">
                              Quantidade: {item.quantity}
                            </div>
                         </div>
                         <div className="text-right font-bold text-slate-800">
                           {formatter.format(item.price * item.quantity)}
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit shadow-sm">
                     <h3 className="font-bold text-lg mb-4">Resumo</h3>
                     <div className="flex justify-between mb-2 text-slate-600">
                       <span>Subtotal</span>
                       <span>{formatter.format(cartTotal)}</span>
                     </div>
                     <div className="flex justify-between mb-4 text-slate-600">
                       <span>Entrega (Estimada)</span>
                       <span>{formatter.format(2500)}</span>
                     </div>
                     <div className="border-t border-slate-100 pt-4 mb-6 flex justify-between font-bold text-xl text-slate-900">
                        <span>Total</span>
                        <span>{formatter.format(cartTotal + 2500)}</span>
                     </div>
                     <button 
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                     >
                       Finalizar Compra
                     </button>
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
             <p>A maior rede de entregas de Angola. Conectando Cabinda ao Cunene.</p>
           </div>
           <div>
             <h4 className="text-white font-bold mb-4">Links Úteis</h4>
             <ul className="space-y-2">
               <li><button onClick={() => setCurrentView('tracking')} className="hover:text-white">Rastrear Encomenda</button></li>
               <li><button onClick={() => setCurrentView('admin')} className="hover:text-white">Área do Vendedor</button></li>
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

      {/* Seller Profile Modal */}
      {selectedSellerId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Modal Header / Banner */}
              <div className="bg-slate-900 h-32 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-slate-900 opacity-90"></div>
                  <div className="absolute top-4 left-6 text-white/20">
                     <Store size={64} />
                  </div>
                  <button 
                    onClick={() => setSelectedSellerId(null)}
                    className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-md z-10"
                  >
                    <X size={20} />
                  </button>
              </div>
              
              <div className="px-8 pb-8 flex-grow overflow-y-auto">
                 {/* Seller Info Header */}
                 <div className="relative -mt-12 mb-8 flex flex-col md:flex-row items-start md:items-end gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-lg relative z-10">
                       <div className="w-full h-full bg-blue-600 rounded-xl flex items-center justify-center text-white">
                          <Store size={40} />
                       </div>
                    </div>
                    <div className="flex-grow pt-2 md:pt-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-3xl font-bold text-slate-900">
                            {selectedSeller?.name || 'Vendedor Desconhecido'}
                          </h2>
                          <CheckCircle size={20} className="text-blue-500" fill="white" />
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                           {selectedSeller?.email && (
                             <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                               <Mail size={16} className="text-slate-400" />
                               <a href={`mailto:${selectedSeller.email}`}>{selectedSeller.email}</a>
                             </div>
                           )}
                           {selectedSeller?.phone && (
                             <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                               <Phone size={16} className="text-slate-400" />
                               <a href={`tel:${selectedSeller.phone}`}>{selectedSeller.phone}</a>
                             </div>
                           )}
                           <div className="flex items-center gap-1.5">
                             <MapPin size={16} className="text-slate-400" />
                             <span>Luanda, Angola</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                             <Calendar size={16} className="text-slate-400" />
                             <span>Membro desde 2023</span>
                           </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-2xl font-bold text-slate-900">{sellerProducts.length}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Produtos</p>
                       </div>
                       <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-2xl font-bold text-slate-900 flex items-center gap-1">
                             4.8 <Star size={16} className="text-yellow-400 fill-yellow-400" />
                          </p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Avaliação</p>
                       </div>
                    </div>
                 </div>

                 <hr className="border-slate-100 mb-8" />

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
                              onAddToCart={(p) => {
                                addToCart(p);
                                setSelectedSellerId(null);
                              }}
                              onBuyNow={(p) => {
                                addToCart(p);
                                handleCheckout();
                                setSelectedSellerId(null);
                              }}
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

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Pagamento Seguro</h3>
                <button onClick={() => setIsCheckoutModalOpen(false)} className="text-slate-400 hover:text-slate-600"><span className="text-2xl">&times;</span></button>
              </div>

              {paymentStep === 1 && (
                <>
                  <p className="text-sm text-slate-500 mb-4">Selecione o método de pagamento:</p>
                  <div className="space-y-3 mb-6">
                    <button 
                      onClick={() => setPaymentMethod('mcx')}
                      className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'mcx' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className="bg-orange-500 text-white p-2 rounded-lg">
                        <Smartphone size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900">Multicaixa Express</p>
                        <p className="text-xs text-slate-500">Pagamento instantâneo via telemóvel</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('transfer')}
                      className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                       <div className="bg-slate-700 text-white p-2 rounded-lg">
                        <Banknote size={24} />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900">Transferência Bancária</p>
                        <p className="text-xs text-slate-500">Enviar comprovativo posteriormente</p>
                      </div>
                    </button>
                  </div>
                  
                  {paymentMethod === 'mcx' && (
                     <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Número de Telemóvel</label>
                        <input type="tel" placeholder="9XX XXX XXX" className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500" />
                     </div>
                  )}

                  <button 
                    onClick={processPayment}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  >
                    Pagar {formatter.format(cartTotal + 2500)}
                  </button>
                </>
              )}

              {paymentStep === 2 && (
                <div className="text-center py-8">
                   <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="font-medium text-slate-900">A processar pagamento...</p>
                   <p className="text-sm text-slate-500">Por favor, aguarde a confirmação no seu telemóvel.</p>
                </div>
              )}

              {paymentStep === 3 && (
                <div className="text-center py-8">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle size={32} />
                   </div>
                   <h4 className="text-xl font-bold text-slate-900 mb-2">Pagamento Confirmado!</h4>
                   <p className="text-slate-600 mb-6">Sua encomenda foi registrada e será enviada em breve.</p>
                   <button 
                     onClick={() => { setIsCheckoutModalOpen(false); setCurrentView('home'); }}
                     className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800"
                   >
                     Voltar à Loja
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