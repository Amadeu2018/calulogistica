
import React, { useState } from 'react';
import { Product } from '../types';
import { MapPin, ShoppingBag, CheckCircle, AlertCircle, Share2, Store, Zap, ChevronDown, ChevronUp, Star, Percent, SlidersHorizontal } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onAddToCart: (product: Product) => void;
  onViewSeller: (sellerId: string) => void;
  onBuyNow: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isFavorite = false,
  onAddToCart, 
  onViewSeller, 
  onBuyNow,
  onToggleFavorite
}) => {
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

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  const hasOptions = product.options && product.options.length > 0;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
      <div className="relative aspect-[9/16] overflow-hidden bg-slate-100">
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
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
             <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 w-fit">
               <Percent size={10} /> {discountPercentage}% OFF
             </span>
          )}

          {/* Low Stock Warning Badge */}
          {product.stock > 0 && product.stock <= 4 && (
             <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 w-fit animate-pulse">
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
               {product.originalPrice && product.originalPrice > product.price && (
                 <p className="text-xs text-slate-400 line-through decoration-red-400">
                    {formatter.format(product.originalPrice)}
                 </p>
               )}
               <p className={`font-bold text-blue-900 ${product.originalPrice ? 'text-xl text-red-600' : 'text-xl'}`}>
                 {formatter.format(product.price)}
               </p>
             </div>
             <div className="text-right flex flex-col items-end">
                <p className="text-xs text-slate-400 mb-1">Vendedor</p>
                <button 
                  onClick={handleSellerClick}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors border border-blue-100 hover:border-blue-200 group/seller"
                >
                  <Store size={14} className="text-blue-600" />
                  {product.sellerName}
                </button>
             </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className={`flex-grow py-2 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
                  product.stock > 0
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? (
                  <>
                    {hasOptions ? <SlidersHorizontal size={16} /> : <ShoppingBag size={16} />}
                    <span>{hasOptions ? 'Configurar' : 'Adicionar'}</span>
                  </>
                ) : (
                  <span>Esgotado</span>
                )}
              </button>
              
              <button
                onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
                className={`w-12 flex items-center justify-center rounded-lg border transition-all duration-300 ${
                  isFavorite
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-500 shadow-sm transform scale-105'
                    : 'bg-white border-slate-200 text-slate-400 hover:text-yellow-400 hover:border-yellow-200'
                }`}
                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <Star size={20} className={isFavorite ? "fill-current" : ""} />
              </button>
            </div>

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
