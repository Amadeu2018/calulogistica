import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Store, MapPin, Star, Search, Filter, Clock, CheckCircle, Tag } from 'lucide-react';

interface StoresViewProps {
  sellers: User[];
  onViewSeller: (sellerId: string) => void;
}

export const StoresView: React.FC<StoresViewProps> = ({ sellers, onViewSeller }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(sellers.flatMap(s => s.tags || [])));

  const filteredSellers = sellers.filter(seller => 
    seller.role === UserRole.SELLER &&
    (selectedTag ? seller.tags?.includes(selectedTag) : true) &&
    (seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Lojas Parceiras</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Conheça as melhores lojas de Angola. Encontre produtos de qualidade, compare avaliações e compre com segurança.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-6 relative">
        <input
          type="text"
          placeholder="Buscar por nome da loja, localização ou categoria..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg shadow-slate-200/50 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/50 text-lg transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
      </div>

      {/* Quick Tags Filter */}
      {allTags.length > 0 && (
         <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button 
               onClick={() => setSelectedTag(null)}
               className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${!selectedTag ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
               Todos
            </button>
            {allTags.map(tag => (
               <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedTag === tag ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
               >
                  {tag}
               </button>
            ))}
         </div>
      )}

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSellers.map(store => (
          <div 
            key={store.id}
            onClick={() => onViewSeller(store.id)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
          >
            {/* Cover Image */}
            <div className="h-40 bg-slate-900 relative overflow-hidden">
               {store.coverImage ? (
                 <img src={store.coverImage} alt={store.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-900 flex items-center justify-center">
                    <Store className="text-white/20" size={64} />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6 pt-12 relative flex-grow flex flex-col">
               {/* Logo Avatar - Floating */}
               <div className="absolute -top-10 left-6">
                 <div className="w-20 h-20 rounded-xl bg-white p-1 shadow-md ring-4 ring-white">
                    <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                       <Store size={28} />
                    </div>
                 </div>
               </div>
               
               {/* Badge if Verified */}
               {store.isVerified && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                     <CheckCircle size={14} className="text-blue-400 fill-white" /> Oficial
                  </div>
               )}

               <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    {store.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="flex items-center text-yellow-500 gap-1 text-sm font-bold">
                        <Star size={16} className="fill-current" />
                        {store.rating || 'N/A'}
                     </div>
                     <span className="text-slate-400 text-sm">•</span>
                     <span className="text-slate-500 text-sm">{store.reviewCount || 0} avaliações</span>
                  </div>
               </div>

               <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">
                  {store.storeDescription || 'Visite nossa loja para ver as melhores ofertas.'}
               </p>

               {/* Store Meta */}
               <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                     <MapPin size={16} className="text-slate-400 shrink-0" />
                     <span className="truncate">{store.location}</span>
                  </div>
                  {store.openingHours && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                       <Clock size={16} className="text-slate-400 shrink-0" />
                       <span className="truncate text-green-600 font-medium">{store.openingHours}</span>
                    </div>
                  )}
               </div>

               {/* Tags */}
               {store.tags && (
                  <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                     {store.tags.map(tag => (
                        <span key={tag} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100 font-medium">
                           {tag}
                        </span>
                     ))}
                  </div>
               )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredSellers.length === 0 && (
         <div className="text-center py-20">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Store size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Nenhuma loja encontrada</h3>
            <p className="text-slate-500 mt-2">Tente ajustar os termos da sua pesquisa.</p>
         </div>
      )}
    </div>
  );
};