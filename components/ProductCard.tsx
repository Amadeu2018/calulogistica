import React, { useState } from 'react';
import { Product } from '../types';
import { MapPin, ShoppingBag, CheckCircle, AlertCircle, Share2, Store, Zap, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewSeller: (sellerId: string) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewSeller, onBuyNow }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatter = new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  });

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Produto "${product.name}" compartilhado com sucesso!`);
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewSeller(product.sellerId);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges Container - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          <span className="bg-white/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm text-slate-700 w-fit">
            {product.category}
          </span>
          
          {/* Low Stock Warning Badge */}
          {product.stock > 0 && product.stock <= 4 && (
             <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 w-fit animate-pulse">
               <AlertCircle size={12} /> Restam {product.stock}
             </span>
          )}
        </div>

        {/* Share Button - Top Right */}
        <button 
          onClick={handleShare}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-slate-600 hover:text-blue-600 hover:scale-110 transition-all z-10"
          title="Compartilhar"
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
            </h3>
            <div className="flex items-center text-slate-500 text-sm mt-1 mb-2">
            <MapPin size={14} className="mr-1 text-slate-400" />
            <span className="truncate">{product.location}</span>
            </div>
            
            <p className={`text-slate-600 text-sm mb-4 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {product.description}
            </p>
        </div>

        <div className="border-t border-slate-100 pt-4 mt-auto">
          <div className="flex items-end justify-between mb-3">
             <div>
               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Preço</p>
               <p className="text-xl font-bold text-blue-900">
                 {formatter.format(product.price)}
               </p>
             </div>
             <div className="text-right flex flex-col items-end">
                <p className="text-xs text-slate-400">Vendedor</p>
                <button 
                  onClick={handleSellerClick}
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 hover:underline flex items-center gap-1.5 transition-colors group/seller"
                >
                  <Store size={14} className="text-slate-400 group-hover/seller:text-blue-600 transition-colors" />
                  {product.sellerName}
                </button>
             </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={`w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                product.stock > 0
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? (
                <>
                  <ShoppingBag size={16} />
                  <span>Adicionar</span>
                </>
              ) : (
                <span>Esgotado</span>
              )}
            </button>

            {product.stock > 0 && (
              <button
                onClick={() => onBuyNow(product)}
                className="w-full py-2 rounded-lg flex items-center justify-center space-x-2 font-bold transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
              >
                <Zap size={16} className="fill-current" />
                <span>Comprar Agora</span>
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-1.5 mt-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-1 transition-all"
            >
              {isExpanded ? 'Ver Menos' : 'Ver Mais'}
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};