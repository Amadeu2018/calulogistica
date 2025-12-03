import React from 'react';
import { ShoppingCart, User as UserIcon, Package, FileText, Menu, X, Truck } from 'lucide-react';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User | null;
  cartCount: number;
  onNavigate: (view: string) => void;
  onLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, cartCount, onNavigate, onLogin, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsOpen(false);
      }}
      className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50 w-full md:w-auto text-left"
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
          <div className="hidden md:flex items-center space-x-4">
            <NavItem view="home" icon={Package} label="Mercado" />
            <NavItem view="tracking" icon={Truck} label="Rastreio" />
            
            {currentUser?.role !== UserRole.CLIENT && currentUser && (
              <NavItem view="admin" icon={FileText} label="Gestão & Contratos" />
            )}
            
            <button 
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="text-sm text-right hidden lg:block">
                  <p className="font-medium text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.role}</p>
                </div>
                <button onClick={onLogout} className="text-sm font-medium text-red-500 hover:text-red-700">
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
              >
                <UserIcon size={16} />
                <span>Entrar</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
             <button 
              onClick={() => onNavigate('cart')}
              className="mr-4 relative p-2 text-slate-600"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                 <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
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
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem view="home" icon={Package} label="Mercado" />
            <NavItem view="tracking" icon={Truck} label="Rastreio" />
            {currentUser?.role !== UserRole.CLIENT && currentUser && (
              <NavItem view="admin" icon={FileText} label="Gestão & Contratos" />
            )}
            <div className="pt-4 border-t border-slate-100">
               {currentUser ? (
                  <div className="px-3">
                     <p className="font-medium text-slate-900">{currentUser.name}</p>
                     <button onClick={onLogout} className="mt-2 text-sm font-medium text-red-500 w-full text-left">
                      Sair
                    </button>
                  </div>
               ) : (
                 <button
                  onClick={() => { onLogin(); setIsOpen(false); }}
                  className="w-full text-left px-3 py-2 text-blue-600 font-medium"
                 >
                   Entrar
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
