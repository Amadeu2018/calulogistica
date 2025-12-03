import React, { useState } from 'react';
import { Search, MapPin, Truck, CheckCircle, Clock, ClipboardList, Box, Home, AlertCircle } from 'lucide-react';
import { MOCK_DELIVERIES } from '../constants';
import { Delivery, DeliveryStatus } from '../types';

export const TrackingView: React.FC = () => {
  const [code, setCode] = useState('');
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [error, setError] = useState('');

  const handleTrack = () => {
    const found = MOCK_DELIVERIES.find(d => d.trackingCode === code);
    if (found) {
      setDelivery(found);
      setError('');
    } else {
      setDelivery(null);
      setError('Código de rastreio não encontrado. Tente ex: KZ-998877');
    }
  };

  const getEventIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('recebido') || s.includes('criado')) return <ClipboardList size={24} />;
    if (s.includes('processado') || s.includes('armazém')) return <Box size={24} />;
    if (s.includes('saiu') || s.includes('trânsito') || s.includes('caminho')) return <Truck size={24} />;
    if (s.includes('entregue')) return <Home size={24} />;
    if (s.includes('falhou') || s.includes('tentativa')) return <AlertCircle size={24} />;
    return <CheckCircle size={24} />;
  };

  const getStatusColorClass = (isLast: boolean, status: string, deliveryStatus: DeliveryStatus) => {
    if (!isLast) return 'bg-white border-slate-200 text-slate-400';

    switch (deliveryStatus) {
      case DeliveryStatus.DELIVERED:
        return 'bg-green-50 border-green-500 text-green-600 shadow-green-100';
      case DeliveryStatus.FAILED:
        return 'bg-red-50 border-red-500 text-red-600 shadow-red-100';
      default:
        return 'bg-blue-50 border-blue-500 text-blue-600 shadow-blue-100';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Rastreio de Encomendas</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Introduza o seu código de rastreio para acompanhar o estado da sua entrega em tempo real.
        </p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-10 max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Ex: KZ-998877"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              className="w-full pl-12 pr-4 py-3.5 border-none rounded-xl focus:ring-2 focus:ring-blue-100 bg-slate-50 text-slate-900 font-mono tracking-wide placeholder:font-sans transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>
          <button
            onClick={handleTrack}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap"
          >
            Localizar
          </button>
        </div>
        {error && (
          <div className="px-4 py-3 text-red-500 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>

      {delivery && (
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Produto</p>
                  <h3 className="text-xl font-bold text-slate-900">{delivery.productName}</h3>
                  <p className="text-sm text-slate-500 mt-1">ID: <span className="font-mono text-slate-700">{delivery.trackingCode}</span></p>
               </div>
               <div className="md:text-right bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Previsão de Entrega</p>
                  <p className="font-bold text-blue-600 flex items-center md:justify-end gap-2">
                    <Clock size={16} /> {delivery.estimatedDate}
                  </p>
               </div>
            </div>
            
            {/* Simple Status Bar */}
            <div className="mt-6 flex items-center gap-2">
               <div className="h-2 flex-grow bg-slate-200 rounded-full overflow-hidden">
                 <div 
                    className={`h-full rounded-full ${
                        delivery.status === DeliveryStatus.DELIVERED ? 'bg-green-500 w-full' : 
                        delivery.status === DeliveryStatus.FAILED ? 'bg-red-500 w-full' : 'bg-blue-500 w-2/3'
                    }`} 
                 />
               </div>
               <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{delivery.status}</span>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-100" />
              
              <div className="space-y-12">
                {delivery.history.map((event, idx) => {
                  const isLast = idx === delivery.history.length - 1;
                  return (
                    <div key={idx} className={`relative flex items-start gap-6 group ${isLast ? 'opacity-100' : 'opacity-70 hover:opacity-100 transition-opacity'}`}>
                      {/* Icon */}
                      <div 
                        className={`relative z-10 w-16 h-16 rounded-full border-[3px] flex items-center justify-center shrink-0 transition-all duration-500 
                        ${getStatusColorClass(isLast, event.status, delivery.status)} 
                        ${isLast ? 'scale-110 ring-4 ring-white shadow-lg' : 'bg-white'}`}
                      >
                        {getEventIcon(event.status)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-grow pt-2.5">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <h4 className={`text-lg font-bold ${isLast ? 'text-slate-900' : 'text-slate-600'}`}>
                                {event.status}
                            </h4>
                            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 w-fit">
                                {event.date}
                            </span>
                        </div>
                        <p className="text-slate-500 mt-1 flex items-center gap-1.5 text-sm">
                          <MapPin size={14} className="text-slate-400" /> 
                          {event.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};