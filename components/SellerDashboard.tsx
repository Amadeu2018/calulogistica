import React, { useState } from 'react';
import { Product, User, DeliveryStatus } from '../types';
import { MOCK_DELIVERIES } from '../constants';
import { LayoutDashboard, Package, ShoppingBag, Settings, Plus, Edit, Trash2, Search, TrendingUp, DollarSign, Percent, Zap, Image as ImageIcon, MapPin, CreditCard, Save, AlertCircle, CheckCircle, Truck, User as UserIcon, Calendar, Clock, X, Tag } from 'lucide-react';

interface SellerDashboardProps {
  currentUser: User;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateSeller?: (user: User) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ 
  currentUser, 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onUpdateSeller
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  
  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    category: 'Eletrónica',
    imageUrl: ''
  });

  // Withdrawal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawIban, setWithdrawIban] = useState('');

  // Settings State
  const [storeSettings, setStoreSettings] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '',
    location: currentUser.location || '',
    description: currentUser.storeDescription || '',
    openingHours: currentUser.openingHours || '08:00 - 18:00',
    tags: currentUser.tags?.join(', ') || '',
    coverImage: currentUser.coverImage || ''
  });

  const myProducts = products.filter(p => p.sellerId === currentUser.id);
  
  // Calculate specific Seller Orders
  const myOrders = MOCK_DELIVERIES.filter(d => {
    const product = products.find(p => p.id === d.productId);
    return product?.sellerId === currentUser.id;
  }).map(d => {
    const product = products.find(p => p.id === d.productId);
    return { ...d, price: product?.price || 0 };
  });

  // Stats
  const totalSales = myOrders.reduce((acc, order) => {
    // Only count completed sales for balance
    if (order.status === DeliveryStatus.DELIVERED) return acc + order.price;
    return acc;
  }, 0); 

  const pendingSales = myOrders.reduce((acc, order) => {
     if (order.status !== DeliveryStatus.DELIVERED && order.status !== DeliveryStatus.FAILED) return acc + order.price;
     return acc;
  }, 0);

  const totalViews = myProducts.length * 150; 
  const lowStockCount = myProducts.filter(p => p.stock < 5).length;
  const availableBalance = totalSales * 0.90; // 10% Platform fee deducted

  const formatter = new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' });

  // Handlers
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductModal(true);
  };

  const handleAddNewClick = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      stock: 1,
      category: 'Eletrónica',
      imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800'
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price) return;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...productForm as Product,
        originalPrice: productForm.originalPrice || undefined
      });
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        location: currentUser.location || 'Luanda',
        currency: 'AOA',
        ...productForm as any
      };
      onAddProduct(newProduct);
    }
    setShowProductModal(false);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (amount > availableBalance) {
      alert("Saldo insuficiente.");
      return;
    }
    alert(`Solicitação de saque de ${formatter.format(amount)} enviada com sucesso para o IBAN ${withdrawIban}.`);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setWithdrawIban('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSeller) {
       onUpdateSeller({
          ...currentUser,
          name: storeSettings.name,
          email: storeSettings.email,
          phone: storeSettings.phone,
          location: storeSettings.location,
          storeDescription: storeSettings.description,
          openingHours: storeSettings.openingHours,
          tags: storeSettings.tags.split(',').map(t => t.trim()).filter(t => t),
          coverImage: storeSettings.coverImage
       });
    }
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.DELIVERED: return 'bg-green-100 text-green-700';
      case DeliveryStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case DeliveryStatus.IN_TRANSIT: return 'bg-blue-100 text-blue-700';
      case DeliveryStatus.FAILED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4">
        <div className="mb-8 px-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={18} /> Visão Geral
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Package size={18} /> Meus Produtos
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ShoppingBag size={18} /> Encomendas
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings size={18} /> Configurações
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl p-4 text-white shadow-lg shadow-slate-200">
          <div className="flex items-center gap-2 mb-2">
             <CreditCard size={16} className="text-blue-400" />
             <p className="text-xs font-medium text-slate-300">Saldo Disponível</p>
          </div>
          <p className="text-2xl font-bold tracking-tight">{formatter.format(availableBalance)}</p>
          <p className="text-xs text-slate-400 mt-1 mb-3">Valor Pendente: {formatter.format(pendingSales)}</p>
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Solicitar Saque
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 md:p-8 overflow-y-auto">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-slate-900">Visão Geral da Loja</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Vendas Confirmadas</p>
                    <p className="text-2xl font-bold text-slate-900">{formatter.format(totalSales)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-slate-900">{myProducts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Encomendas Totais</p>
                    <p className="text-2xl font-bold text-slate-900">{myOrders.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {lowStockCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                 <div className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                   <Package size={20} />
                 </div>
                 <div className="flex-grow">
                   <p className="font-bold text-orange-800">Atenção ao Stock</p>
                   <p className="text-sm text-orange-700">Você tem {lowStockCount} produtos com stock baixo (menos de 5 unidades).</p>
                 </div>
                 <button onClick={() => setActiveTab('products')} className="px-4 py-2 bg-white border border-orange-200 text-orange-700 font-medium rounded-lg text-sm hover:bg-orange-100">
                   Gerir Stock
                 </button>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Gestão de Produtos</h2>
                <p className="text-slate-500 text-sm">Gerencie seu catálogo, preços e promoções.</p>
              </div>
              <button 
                onClick={handleAddNewClick}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200"
              >
                <Plus size={18} /> Novo Produto
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex gap-4">
                 <div className="relative flex-grow max-w-md">
                   <input 
                     type="text" 
                     placeholder="Pesquisar produtos..." 
                     className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 </div>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-4">Produto</th>
                       <th className="px-6 py-4">Preço Atual</th>
                       <th className="px-6 py-4">Promoção</th>
                       <th className="px-6 py-4">Stock</th>
                       <th className="px-6 py-4 text-right">Ações</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {myProducts.map(product => (
                       <tr key={product.id} className="hover:bg-slate-50">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <img src={product.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                             <div>
                               <p className="font-medium text-slate-900">{product.name}</p>
                               <p className="text-xs text-slate-500">{product.category}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 font-medium text-slate-900">
                           {formatter.format(product.price)}
                         </td>
                         <td className="px-6 py-4">
                           {product.originalPrice && product.originalPrice > product.price ? (
                             <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                               <Percent size={12} /> 
                               On Sale
                             </span>
                           ) : (
                             <span className="text-slate-400 text-xs">-</span>
                           )}
                         </td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                             {product.stock} un.
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right space-x-2">
                           <button 
                             onClick={() => handleEditClick(product)}
                             className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                             title="Editar"
                           >
                             <Edit size={16} />
                           </button>
                           <button 
                             onClick={() => onDeleteProduct(product.id)}
                             className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                             title="Apagar"
                           >
                             <Trash2 size={16} />
                           </button>
                         </td>
                       </tr>
                     ))}
                     {myProducts.length === 0 && (
                       <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                           Você ainda não tem produtos cadastrados.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
           <div className="space-y-6 animate-in fade-in duration-300">
             <div>
                <h2 className="text-2xl font-bold text-slate-900">Encomendas Recebidas</h2>
                <p className="text-slate-500 text-sm">Acompanhe as vendas e o estado de entrega dos seus produtos.</p>
             </div>

             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                         <tr>
                            <th className="px-6 py-4">Cód. Rastreio</th>
                            <th className="px-6 py-4">Produto</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Data Est.</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {myOrders.length > 0 ? (
                           myOrders.map((order) => (
                             <tr key={order.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono font-medium text-slate-500">{order.trackingCode}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{order.productName}</td>
                                <td className="px-6 py-4 text-slate-600">
                                   <div className="flex flex-col">
                                      <span>{order.clientName}</span>
                                      <span className="text-xs text-slate-400">{order.clientPhone}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">{formatter.format(order.price)}</td>
                                <td className="px-6 py-4">
                                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                      {order.status}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs flex items-center gap-1">
                                   <Calendar size={14} /> {order.estimatedDate}
                                </td>
                             </tr>
                           ))
                         ) : (
                           <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                 Ainda não recebeu nenhuma encomenda.
                              </td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
           </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
           <div className="max-w-2xl animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Configurações da Loja</h2>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
                 <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Loja</label>
                       <div className="relative">
                          <input 
                             type="text" 
                             value={storeSettings.name}
                             onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                             className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                          <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email de Contacto</label>
                          <input 
                             type="email" 
                             value={storeSettings.email}
                             onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                             className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Telefone Principal</label>
                          <input 
                             type="tel" 
                             value={storeSettings.phone}
                             onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                             className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Localização da Loja</label>
                       <div className="relative">
                          <input 
                             type="text" 
                             value={storeSettings.location}
                             onChange={(e) => setStoreSettings({...storeSettings, location: e.target.value})}
                             className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Horário de Funcionamento</label>
                        <div className="relative">
                           <input 
                              type="text" 
                              value={storeSettings.openingHours}
                              onChange={(e) => setStoreSettings({...storeSettings, openingHours: e.target.value})}
                              placeholder="08:00 - 18:00"
                              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                           />
                           <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tags (separadas por vírgula)</label>
                        <div className="relative">
                           <input 
                              type="text" 
                              value={storeSettings.tags}
                              onChange={(e) => setStoreSettings({...storeSettings, tags: e.target.value})}
                              placeholder="Eletrónica, Premium, Ofertas"
                              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                           />
                           <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                      </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">URL Imagem de Capa</label>
                       <div className="relative">
                          <input 
                             type="text" 
                             value={storeSettings.coverImage}
                             onChange={(e) => setStoreSettings({...storeSettings, coverImage: e.target.value})}
                             placeholder="https://..."
                             className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Sobre a Loja</label>
                       <textarea 
                          rows={4}
                          value={storeSettings.description}
                          onChange={(e) => setStoreSettings({...storeSettings, description: e.target.value})}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                       />
                       <p className="text-xs text-slate-500 mt-1">Esta descrição aparecerá no seu perfil público.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                       <button 
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-colors"
                       >
                          <Save size={18} /> Salvar Alterações
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        )}

      </div>

      {/* Product Modal (Add/Edit) */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
                    <input 
                      type="text" 
                      value={productForm.name} 
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Preço Atual (AOA)</label>
                    <input 
                      type="number" 
                      value={productForm.price} 
                      onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock Disponível</label>
                    <input 
                      type="number" 
                      value={productForm.stock} 
                      onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})}
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>

                 <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm">
                       <Zap size={16} /> Área de Promoções
                    </div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Preço Original / "De" (Opcional - Para criar oferta)</label>
                    <input 
                      type="number" 
                      value={productForm.originalPrice || ''} 
                      onChange={e => setProductForm({...productForm, originalPrice: Number(e.target.value)})}
                      placeholder="Ex: Se preencher, o preço atual aparecerá como oferta."
                      className="w-full border border-blue-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({...productForm, category: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option>Eletrónica</option>
                      <option>Moda</option>
                      <option>Casa & Decoração</option>
                      <option>Informática</option>
                      <option>Imobiliário</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Link da Imagem</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={productForm.imageUrl} 
                        onChange={e => setProductForm({...productForm, imageUrl: e.target.value})}
                        className="w-full border border-slate-300 rounded-lg pl-10 pr-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                 </div>

                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
                    <textarea 
                      rows={4}
                      value={productForm.description} 
                      onChange={e => setProductForm({...productForm, description: e.target.value})}
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                 </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
              <button 
                onClick={() => setShowProductModal(false)}
                className="px-6 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveProduct}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-900">Solicitar Saque</h3>
                 <button onClick={() => setShowWithdrawModal(false)}><X className="text-slate-400 hover:text-slate-600" /></button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                 <p className="text-sm text-blue-700 mb-1">Saldo Disponível</p>
                 <p className="text-2xl font-bold text-blue-900">{formatter.format(availableBalance)}</p>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Valor a Retirar (AOA)</label>
                    <input 
                      type="number" 
                      required
                      max={availableBalance}
                      min={1000}
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">IBAN de Destino</label>
                    <input 
                      type="text" 
                      required
                      value={withdrawIban}
                      onChange={e => setWithdrawIban(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      placeholder="AO06 ...."
                    />
                 </div>
                 <div className="flex items-start gap-2 text-xs text-slate-500 mt-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <p>O valor será transferido em até 24 horas úteis. Taxa de saque de 1% pode aplicar-se dependendo do banco.</p>
                 </div>
                 <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors mt-2"
                 >
                    Confirmar Saque
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};