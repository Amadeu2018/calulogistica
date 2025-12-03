import React, { useState } from 'react';
import { Store, MapPin, FileText, Mail, Phone, Upload, CheckCircle, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface SellerRegistrationProps {
  onRegister: (sellerData: any) => void;
  onCancel: () => void;
}

export const SellerRegistration: React.FC<SellerRegistrationProps> = ({ onRegister, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: '',
    nif: '',
    category: 'Eletrónica',
    email: '',
    phone: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Venda na KwanzaLogistics</h2>
            <p className="text-slate-300">Alcance milhões de clientes em Angola. Registe a sua loja hoje.</p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-8 gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>1</div>
              <span className="font-medium text-sm">Dados da Empresa</span>
            </div>
            <div className="h-0.5 w-12 bg-slate-700"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-400' : 'text-slate-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800'}`}>2</div>
              <span className="font-medium text-sm">Contactos & Localização</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Loja</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.storeName}
                      onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: Tech Angola Lda"
                    />
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">NIF (Número de Identificação Fiscal)</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.nif}
                      onChange={(e) => setFormData({...formData, nif: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="000000000LA000"
                    />
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria Principal</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option>Eletrónica</option>
                  <option>Moda</option>
                  <option>Casa & Decoração</option>
                  <option>Beleza & Saúde</option>
                  <option>Automóvel</option>
                  <option>Imobiliário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição da Loja</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Conte um pouco sobre o que vende..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                <Upload className="text-blue-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-blue-900">Logótipo da Loja (Opcional)</p>
                  <p className="text-sm text-blue-700">Formatos aceites: JPG, PNG. Máx 2MB.</p>
                  <button type="button" className="mt-2 text-sm font-bold text-blue-600 hover:underline">Escolher Ficheiro</button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Comercial</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="contacto@sualoja.ao"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="+244 923 000 000"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Localização Operacional</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Ex: Luanda, Talatona, Edifício Kilamba"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Esta localização será exibida nos seus produtos.</p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <input type="checkbox" required className="mt-1 w-4 h-4 text-blue-600 rounded" />
                <p className="text-sm text-slate-600">
                  Li e aceito os <a href="#" className="text-blue-600 hover:underline">Termos de Vendedor</a> e a Política de Privacidade. Confirmo que possuo licença comercial válida.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            {step === 1 ? (
              <button 
                type="button" 
                onClick={onCancel}
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Voltar
              </button>
            )}

            {step === 1 ? (
              <button 
                type="button" 
                onClick={() => {
                  if (formData.storeName && formData.nif) setStep(2);
                  else alert("Por favor preencha os dados obrigatórios");
                }}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                Próximo Passo <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                type="submit"
                className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
              >
                <CheckCircle size={18} /> Finalizar Registo
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};