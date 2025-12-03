import React, { useState } from 'react';
import { MOCK_CONTRACTS, MOCK_DELIVERIES } from '../constants';
import { Contract, Delivery, DeliveryStatus } from '../types';
import { FileText, Printer, Plus, Truck, Search, Filter, Calendar, Package, X, MapPin, User, Clock, Phone, Mail, Box, Home, CheckCircle, AlertCircle, ClipboardList, ArrowRight } from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'deliveries'>('contracts');
  
  // Contract State
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [newContract, setNewContract] = useState({
    clientName: '',
    clientNif: '',
    value: '',
    terms: ''
  });

  // Delivery Filter State
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  
  // Selected Delivery for Modal
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Contract Logic
  const handleCreateContract = () => {
    const contract: Contract = {
      id: `c${Date.now()}`,
      sellerName: 'KwanzaLogistics (Admin)',
      clientName: newContract.clientName,
      clientNif: newContract.clientNif,
      value: Number(newContract.value),
      terms: newContract.terms,
      date: new Date().toISOString().split('T')[0],
      status: 'Ativo'
    };
    setContracts([...contracts, contract]);
    setShowNewContractModal(false);
    setNewContract({ clientName: '', clientNif: '', value: '', terms: '' });
  };

  const formatter = new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
  });

  // Delivery Logic
  const filteredDeliveries = MOCK_DELIVERIES.filter(d => {
    const matchesStatus = filterStatus === 'Todos' || d.status === filterStatus;
    const matchesClient = d.clientName.toLowerCase().includes(filterClient.toLowerCase()) || 
                          d.trackingCode.toLowerCase().includes(filterClient.toLowerCase());
    
    // Date Range Logic
    let matchesDate = true;
    if (filterStartDate) {
      matchesDate = matchesDate && d.estimatedDate >= filterStartDate;
    }
    if (filterEndDate) {
      matchesDate = matchesDate && d.estimatedDate <= filterEndDate;
    }

    return matchesStatus && matchesClient && matchesDate;
  });

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.DELIVERED: return 'bg-green-100 text-green-700';
      case DeliveryStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case DeliveryStatus.IN_TRANSIT: return 'bg-blue-100 text-blue-700';
      case DeliveryStatus.FAILED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.PENDING: return <ClipboardList size={14} />;
      case DeliveryStatus.PROCESSING: return <Box size={14} />;
      case DeliveryStatus.IN_TRANSIT: return <Truck size={14} />;
      case DeliveryStatus.DELIVERED: return <Home size={14} />;
      case DeliveryStatus.FAILED: return <AlertCircle size={14} />;
      default: return <CheckCircle size={14} />;
    }
  };

  const getEventIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('recebido') || s.includes('criado')) return <ClipboardList size={18} />;
    if (s.includes('processado') || s.includes('armazém')) return <Box size={18} />;
    if (s.includes('saiu') || s.includes('trânsito') || s.includes('interprovincial')) return <Truck size={18} />;
    if (s.includes('entregue')) return <Home size={18} />;
    if (s.includes('falhou') || s.includes('tentativa')) return <AlertCircle size={18} />;
    return <CheckCircle size={18} />;
  };

  const getEventColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('entregue')) return 'bg-green-500 border-green-200 text-white';
    if (s.includes('falhou')) return 'bg-red-500 border-red-200 text-white';
    if (s.includes('trânsito') || s.includes('saiu')) return 'bg-blue-500 border-blue-200 text-white';
    if (s.includes('processado')) return 'bg-orange-500 border-orange-200 text-white';
    return 'bg-slate-500 border-slate-200 text-white';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Painel de Gestão</h2>
           <p className="text-slate-500">Gerencie contratos e acompanhe as entregas da plataforma.</p>
        </div>
        {activeTab === 'contracts' && (
          <button 
            onClick={() => setShowNewContractModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus size={18} /> Novo Contrato
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors border-b-2 ${
              activeTab === 'contracts' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={18} /> Contratos
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`pb-3 px-1 flex items-center gap-2 font-medium transition-colors border-b-2 ${
              activeTab === 'deliveries' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Truck size={18} /> Entregas
          </button>
        </div>
      </div>

      {/* Contracts View */}
      {activeTab === 'contracts' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">NIF</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">{contract.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{contract.clientName}</td>
                    <td className="px-6 py-4 text-slate-600">{contract.clientNif}</td>
                    <td className="px-6 py-4 text-slate-600">{contract.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{formatter.format(contract.value)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <button className="text-blue-600 hover:text-blue-800 p-1" title="Imprimir / PDF">
                          <Printer size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deliveries View */}
      {activeTab === 'deliveries' && (
        <div className="animate-in fade-in duration-300">
           {/* Filters */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-end md:items-center">
              <div className="w-full md:w-auto flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Estado</label>
                    <div className="relative">
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="Todos">Todos os Estados</option>
                        {Object.values(DeliveryStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Intervalo de Datas</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-grow">
                        <input 
                          type="date"
                          value={filterStartDate}
                          onChange={(e) => setFilterStartDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <span className="text-slate-400">
                        <ArrowRight size={14} />
                      </span>
                      <div className="relative flex-grow">
                        <input 
                          type="date"
                          value={filterEndDate}
                          onChange={(e) => setFilterEndDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Cliente / Código</label>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Nome ou Rastreio..."
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    </div>
                 </div>
              </div>
              
              <button 
                onClick={() => { setFilterStatus('Todos'); setFilterStartDate(''); setFilterEndDate(''); setFilterClient(''); }}
                className="text-sm text-slate-500 hover:text-red-500 font-medium px-4 py-2 whitespace-nowrap"
              >
                Limpar Filtros
              </button>
           </div>

           {/* Table */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Rastreio</th>
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Data Est.</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeliveries.length > 0 ? (
                    filteredDeliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-500 font-medium">{delivery.trackingCode}</td>
                        <td className="px-6 py-4 text-slate-900 flex items-center gap-2">
                          <Package size={16} className="text-slate-400" />
                          {delivery.productName}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{delivery.clientName}</td>
                        <td className="px-6 py-4 text-slate-600">{delivery.estimatedDate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(delivery.status)}`}>
                             {getStatusIcon(delivery.status)}
                            {delivery.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                              onClick={() => setSelectedDelivery(delivery)}
                              className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                           >
                              Detalhes
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Nenhuma entrega encontrada com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Contract Modal */}
      {showNewContractModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Novo Contrato Comercial</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Cliente</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newContract.clientName}
                  onChange={e => setNewContract({...newContract, clientName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIF (Angola)</label>
                <input 
                  type="text" 
                  placeholder="000000000LA000"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newContract.clientNif}
                  onChange={e => setNewContract({...newContract, clientNif: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor do Contrato (AOA)</label>
                <input 
                  type="number" 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newContract.value}
                  onChange={e => setNewContract({...newContract, value: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Termos e Condições</label>
                <textarea 
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newContract.terms}
                  onChange={e => setNewContract({...newContract, terms: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowNewContractModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateContract}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Gerar Contrato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
              
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Detalhes da Entrega</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono font-medium">{selectedDelivery.trackingCode}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(selectedDelivery.status)}`}>
                          {selectedDelivery.status}
                       </span>
                    </div>
                 </div>
                 <button 
                    onClick={() => setSelectedDelivery(null)}
                    className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-600 transition-colors"
                 >
                    <X size={20} />
                 </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-6">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Info Cards */}
                    <div className="lg:col-span-2 space-y-6">
                       
                       {/* Section: Client & Location */}
                       <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-5">
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <User size={16} /> Dados do Cliente
                          </h4>
                          <div className="grid md:grid-cols-2 gap-6">
                             <div className="md:col-span-2">
                                <p className="text-xs text-slate-400 font-medium mb-1">Nome Completo</p>
                                <p className="font-semibold text-slate-900 text-lg">{selectedDelivery.clientName}</p>
                             </div>
                             
                             <div>
                                <p className="text-xs text-slate-400 font-medium mb-1">Telefone</p>
                                <div className="flex items-center gap-2">
                                   <div className="bg-white p-2 rounded-md border border-slate-200 text-slate-500">
                                     <Phone size={16} />
                                   </div>
                                   <a 
                                     href={selectedDelivery.clientPhone ? `tel:${selectedDelivery.clientPhone.replace(/\s/g, '')}` : '#'}
                                     className={`font-medium ${selectedDelivery.clientPhone ? 'text-slate-900 hover:text-blue-600' : 'text-slate-400'}`}
                                   >
                                     {selectedDelivery.clientPhone || 'Não informado'}
                                   </a>
                                </div>
                             </div>

                             <div>
                                <p className="text-xs text-slate-400 font-medium mb-1">Email</p>
                                <div className="flex items-center gap-2">
                                   <div className="bg-white p-2 rounded-md border border-slate-200 text-slate-500">
                                     <Mail size={16} />
                                   </div>
                                   <a
                                     href={selectedDelivery.clientEmail ? `mailto:${selectedDelivery.clientEmail}` : '#'}
                                     className={`font-medium truncate ${selectedDelivery.clientEmail ? 'text-slate-900 hover:text-blue-600' : 'text-slate-400'}`}
                                   >
                                     {selectedDelivery.clientEmail || 'Não informado'}
                                   </a>
                                </div>
                             </div>

                             <div className="md:col-span-2 pt-4 border-t border-slate-200">
                                <p className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1">
                                   <MapPin size={12} /> Morada de Entrega
                                </p>
                                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-start gap-2">
                                    <MapPin size={18} className="text-red-500 shrink-0 mt-0.5" />
                                    <span>{selectedDelivery.deliveryAddress || 'Endereço padrão não registado'}</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Section: Product Info */}
                       <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                             <Package size={16} /> Informações do Item
                          </h4>
                          <div className="flex items-start gap-4">
                             <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                <Package size={32} />
                             </div>
                             <div>
                                <p className="font-bold text-lg text-slate-900">{selectedDelivery.productName}</p>
                                <p className="text-sm text-slate-500">ID do Produto: {selectedDelivery.productId}</p>
                                <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
                                   <Clock size={12} />
                                   Estimativa: {selectedDelivery.estimatedDate}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Right Column: Timeline */}
                    <div className="lg:col-span-1">
                       <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">
                          Histórico de Rastreamento
                       </h4>
                       <div className="relative pl-4 space-y-8">
                          {/* Vertical Line */}
                          <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

                          {selectedDelivery.history.map((event, idx) => (
                             <div key={idx} className="relative flex items-start gap-4 group">
                                {/* Icon Bubble */}
                                <div 
                                   className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition-transform group-hover:scale-110 ${getEventColor(event.status)}`}
                                >
                                   {getEventIcon(event.status)}
                                </div>
                                
                                {/* Content */}
                                <div className="pt-1">
                                   <p className="font-bold text-slate-900 text-sm leading-tight">{event.status}</p>
                                   <p className="text-xs text-slate-400 mt-1 font-mono">{event.date}</p>
                                   <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                      <MapPin size={10} />
                                      {event.location}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-between items-center">
                 <span className="text-xs text-slate-400">KwanzaLogistics Admin Panel &copy; 2024</span>
                 <button 
                    onClick={() => setSelectedDelivery(null)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
                 >
                    Fechar
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};