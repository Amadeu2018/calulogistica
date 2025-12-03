import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User as UserIcon, Package, FileText, Menu, X, Truck, Store, LayoutDashboard, Heart, Bell, Check, LogOut, ClipboardList } from 'lucide-react';
import { User, UserRole, Notification } from '../types';

interface NavbarProps {
  currentUser: User | null;
  cartCount: number;
  notifications: Notification[];
  onNavigate: (view: string) => void;
  onLogin: () => void;
  onLogout: () => void;
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  cartCount, 
  notifications,
  onNavigate, 
  onLogin, 
  onLogout,
  onMarkNotificationRead,
  onClearNotifications
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavItem = ({ view, icon: Icon, label, className }: { view: string, icon: any, label: string, className?: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsOpen(false);
      }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-50 w-full md:w-auto text-left transition-colors ${className || 'text-slate-600 hover:text-blue-600'}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-blue-600 text-white p-1.5 rounded-lg mr-2">
              <Truck size={24} />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              Kwanza<span className="text-blue-600">Logistics</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem view="home" icon={Package} label="Mercado" />
            <NavItem view="stores" icon={Store} label="Lojas" />
            <NavItem view="tracking" icon={Truck} label="Rastreio" />
            
            {currentUser?.role === UserRole.SELLER && (
               <NavItem view="seller-dashboard" icon={LayoutDashboard} label="Painel da Loja" className="text-blue-600 font-medium bg-blue-50 hover:bg-blue-100" />
            )}

            {currentUser?.role === UserRole.ADMIN && (
              <NavItem view="admin" icon={FileText} label="Gestão Geral" />
            )}
            
            {/* Notifications */}
            <div className="relative ml-2" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-50"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-900">Notificações</h3>
                    {notifications.length > 0 && (
                      <button onClick={onClearNotifications} className="text-xs text-blue-600 hover:underline">Limpar</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => onMarkNotificationRead(notif.id)}
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                        >
                           <div className="flex gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                              <div>
                                <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{notif.title}</p>
                                <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                                <p className="text-[10px] text-slate-400 mt-2">{notif.time}</p>
                              </div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-50"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 pl-2 hover:bg-slate-50 rounded-lg p-1 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-sm text-left hidden lg:block">
                    <p className="font-medium text-slate-900 leading-tight">{currentUser.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase">{currentUser.role}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                     <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                        <p className="font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500">{currentUser.email}</p>
                     </div>
                     <div className="p-1">
                        {currentUser.role === UserRole.CLIENT && (
                          <>
                            <button onClick={() => { onNavigate('client-orders'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                              <ClipboardList size={16} /> Meus Pedidos
                            </button>
                            <button onClick={() => { onNavigate('wishlist'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                              <Heart size={16} /> Lista de Desejos
                            </button>
                          </>
                        )}
                        {currentUser.role === UserRole.SELLER && (
                          <button onClick={() => { onNavigate('seller-dashboard'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                             <Store size={16} /> Minha Loja
                          </button>
                        )}
                        <hr className="my-1 border-slate-100" />
                        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                           <LogOut size={16} /> Sair
                        </button>
                     </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                 <button
                   onClick={() => onNavigate('seller-register')}
                   className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 hidden lg:block"
                 >
                   Vender na Kwanza
                 </button>
                 <button
                  onClick={onLogin}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-200"
                >
                  <UserIcon size={16} />
                  <span>Entrar</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-slate-600"
              >
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
             <button 
              onClick={() => onNavigate('cart')}
              className="relative text-slate-600"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                 <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem view="home" icon={Package} label="Mercado" />
            <NavItem view="stores" icon={Store} label="Lojas Parceiras" />
            <NavItem view="tracking" icon={Truck} label="Rastreio" />
            
            {currentUser?.role === UserRole.SELLER && (
              <NavItem view="seller-dashboard" icon={LayoutDashboard} label="Painel da Loja" className="text-blue-600 bg-blue-50" />
            )}

            {currentUser?.role === UserRole.ADMIN && (
              <NavItem view="admin" icon={FileText} label="Gestão Geral" />
            )}

            {currentUser?.role === UserRole.CLIENT && (
              <>
                <NavItem view="client-orders" icon={ClipboardList} label="Meus Pedidos" />
                <NavItem view="wishlist" icon={Heart} label="Lista de Desejos" />
              </>
            )}

            {!currentUser && (
               <NavItem view="seller-register" icon={Store} label="Vender na Kwanza" />
            )}
            
            <div className="pt-4 border-t border-slate-100">
               {currentUser ? (
                  <div className="px-3">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                           {currentUser.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-medium text-slate-900">{currentUser.name}</p>
                           <p className="text-xs text-slate-500">{currentUser.role}</p>
                        </div>
                     </div>
                     <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
               ) : (
                 <button
                  onClick={() => { onLogin(); setIsOpen(false); }}
                  className="w-full text-center px-3 py-2 text-white font-medium bg-blue-600 rounded-lg shadow-sm"
                 >
                   Entrar na Conta
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};