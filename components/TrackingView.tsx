import React, { useState, useEffect } from 'react';
import { Search, MapPin, Truck, CheckCircle, Clock, ClipboardList, Box, Home, AlertCircle, Navigation, CircleDot } from 'lucide-react';
import { MOCK_DELIVERIES } from '../constants';
import { Delivery, DeliveryStatus } from '../types';

export const TrackingView: React.FC = () => {
  const [code, setCode] = useState('');
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [error, setError] = useState('');
  
  // Mock Real-time states
  const [etaMinutes, setEtaMinutes] = useState(45);
  const [progress, setProgress] = useState(0);

  // Simulate live movement when delivery is loaded
  useEffect(() => {
    if (delivery && delivery.status === DeliveryStatus.IN_TRANSIT) {
      // Set initial state
      setProgress(40);
      setEtaMinutes(32);

      // Create a fake interval to move the truck and reduce time
      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 0.5 : prev)); // Move forward but don't finish
        setEtaMinutes(prev => (prev > 5 ? prev - 1 : 5)); // Reduce time but don't go to 0
      }, 2000);

      return () => clearInterval(interval);
    } else if (delivery && delivery.status === DeliveryStatus.DELIVERED) {
      setProgress(100);
      setEtaMinutes(0);
    } else if (delivery) {
      setProgress(10); // Processing/Pending
    }
  }, [delivery]);

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Rastreio de Encomendas</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Introduza o seu código de rastreio para acompanhar o estado da sua entrega em tempo real.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-10 max-w-xl mx-auto relative z-20">
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Real-time Map Visualization */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative h-80 w-full group">
            {/* Map Background Image */}
            <div className="absolute inset-0 bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" 
                alt="Map Background" 
                className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent"></div>
            </div>

            {/* Map Content Layer */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
               
               {/* Live Status Card - Floating */}
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 max-w-xs animate-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${delivery.status === DeliveryStatus.IN_TRANSIT ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${delivery.status === DeliveryStatus.IN_TRANSIT ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                     </span>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {delivery.status === DeliveryStatus.IN_TRANSIT ? 'Em Movimento' : 'Status Atual'}
                     </p>
                  </div>
                  
                  {delivery.status === DeliveryStatus.IN_TRANSIT ? (
                    <div>
                       <p className="text-2xl font-bold text-slate-900 font-mono">~{etaMinutes} min</p>
                       <p className="text-sm text-slate-500">Estimativa de chegada</p>
                       <p className="text-xs text-blue-600 mt-2 font-medium">Tráfego: Moderado</p>
                    </div>
                  ) : delivery.status === DeliveryStatus.DELIVERED ? (
                    <div>
                       <p className="text-lg font-bold text-green-600">Entregue</p>
                       <p className="text-sm text-slate-500">No endereço registado</p>
                    </div>
                  ) : (
                    <div>
                       <p className="text-lg font-bold text-slate-700">Aguardando Saída</p>
                       <p className="text-sm text-slate-500">Previsão: {delivery.estimatedDate}</p>
                    </div>
                  )}
               </div>

               {/* Visual Route Path */}
               <div className="relative w-full h-24 mb-4 select-none">
                  {/* Start Point */}
                  <div className="absolute left-0 bottom-4 flex flex-col items-center z-10">
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-slate-300 shadow-sm">
                        <Box size={14} className="text-slate-500" />
                     </div>
                     <span className="text-xs font-bold text-slate-500 mt-1 bg-white/80 px-2 py-0.5 rounded">Armazém</span>
                  </div>

                  {/* End Point */}
                  <div className="absolute right-0 bottom-4 flex flex-col items-center z-10">
                     <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                        <MapPin size={14} className="text-white" />
                     </div>
                     <span className="text-xs font-bold text-slate-900 mt-1 bg-white/80 px-2 py-0.5 rounded">Cliente</span>
                  </div>

                  {/* The Road Line */}
                  <div className="absolute left-4 right-4 bottom-[27px] h-1.5 bg-slate-300/50 rounded-full overflow-hidden backdrop-blur-sm">
                     {/* Progress Fill */}
                     <div 
                        className="h-full bg-blue-500 transition-all duration-1000 ease-linear" 
                        style={{ width: `${progress}%` }}
                     ></div>
                  </div>

                  {/* The Moving Truck */}
                  <div 
                     className="absolute bottom-[11px] transform -translate-x-1/2 transition-all duration-1000 ease-linear z-20"
                     style={{ left: `${progress}%` }}
                  >
                     <div className="relative">
                        <div className="bg-slate-900 text-white p-2 rounded-full shadow-lg border-2 border-white ring-2 ring-blue-500/30">
                           <Truck size={20} className={delivery.status === DeliveryStatus.IN_TRANSIT ? "animate-pulse" : ""} />
                        </div>
                        {/* Tooltip above truck */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-900">
                           {progress < 100 ? 'A caminho' : 'Chegou'}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
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
        </div>
      )}
    </div>
  );
};