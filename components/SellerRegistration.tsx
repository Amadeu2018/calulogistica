
import React, { useState, useRef } from 'react';
import { Store, MapPin, FileText, Mail, Phone, Upload, CheckCircle, ArrowRight, X, ShieldCheck, DollarSign, Clock, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface SellerRegistrationProps {
  onRegister: (sellerData: any) => void;
  onCancel: () => void;
}

export const SellerRegistration: React.FC<SellerRegistrationProps> = ({ onRegister, onCancel }) => {
  const [step, setStep] = useState(1);
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    storeName: '',
    nif: '',
    category: 'Eletrónica',
    email: '',
    phone: '',
    location: '',
    description: '',
    storeLogo: '' // Accepts URL or Base64
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Você precisa aceitar os Termos e Condições para continuar.");
      return;
    }
    onRegister(formData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, storeLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Logótipo / Imagem de Capa</label>
                 <div className="space-y-3">
                    {/* URL Input */}
                    <div className="relative">
                       <input
                         type="text"
                         value={formData.storeLogo}
                         onChange={(e) => setFormData({...formData, storeLogo: e.target.value})}
                         className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                         placeholder="Cole a URL da imagem aqui..."
                       />
                       <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 uppercase font-bold">OU</span>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden" 
                          accept="image/*"
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                          <Upload size={16} /> Carregar do Dispositivo
                        </button>
                    </div>

                    {/* Preview */}
                    {formData.storeLogo && (
                       <div className="mt-2 w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group">
                          <img src={formData.storeLogo} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                             type="button"
                             onClick={() => setFormData({...formData, storeLogo: ''})}
                             className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X size={14} />
                          </button>
                       </div>
                    )}
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

              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer" 
                  id="terms-check"
                />
                <label htmlFor="terms-check" className="text-sm text-slate-600 cursor-pointer">
                  Li e aceito os <button type="button" onClick={() => setShowTerms(true)} className="text-blue-600 hover:underline font-medium">Termos de Parceria e Contrato de Vendedor</button>. Confirmo que possuo licença comercial válida.
                </label>
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

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600" /> Contrato de Parceria
                 </h3>
                 <button onClick={() => setShowTerms(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              
              <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4 leading-relaxed">
                 <p className="font-bold text-slate-900">1. Objeto</p>
                 <p>O presente contrato estabelece os termos para a utilização da plataforma KwanzaLogistics pelo Vendedor para a comercialização de produtos em Angola.</p>

                 <p className="font-bold text-slate-900 mt-4">2. Comissões e Taxas</p>
                 <ul className="list-disc pl-5 space-y-1">
                    <li>A KwanzaLogistics cobra uma <strong>taxa de serviço de 10%</strong> sobre o valor total de cada venda realizada com sucesso.</li>
                    <li>Não há custos de adesão ou mensalidades fixas.</li>
                 </ul>

                 <p className="font-bold text-slate-900 mt-4">3. Pagamentos e Saques</p>
                 <ul className="list-disc pl-5 space-y-1">
                    <li>O saldo das vendas fica disponível na carteira virtual após a confirmação de entrega ao cliente.</li>
                    <li>Os saques para contas bancárias angolanas são processados em até <strong>24 horas úteis</strong>.</li>
                    <li>O Vendedor deve fornecer um IBAN válido titularidade da empresa ou representante legal.</li>
                 </ul>

                 <p className="font-bold text-slate-900 mt-4">4. Obrigações do Vendedor</p>
                 <p>O Vendedor compromete-se a:</p>
                 <ul className="list-disc pl-5 space-y-1">
                    <li>Vender apenas produtos originais e legais em território angolano.</li>
                    <li>Manter o stock atualizado na plataforma para evitar cancelamentos.</li>
                    <li>Preparar a encomenda para recolha em até 24 horas após a notificação de venda.</li>
                    <li>Emitir faturas válidas para os clientes finais.</li>
                 </ul>

                 <p className="font-bold text-slate-900 mt-4">5. Política de Entregas</p>
                 <p>A logística de recolha e entrega é de responsabilidade exclusiva da KwanzaLogistics e seus parceiros. O Vendedor deve garantir que o produto esteja devidamente embalado.</p>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                 <button 
                   onClick={() => setShowTerms(false)} 
                   className="px-4 py-2 text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-colors"
                 >
                    Fechar
                 </button>
                 <button 
                   onClick={() => { setAgreedToTerms(true); setShowTerms(false); }} 
                   className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                 >
                    Li e Aceito os Termos
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
