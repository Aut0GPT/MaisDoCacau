'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useDelivery, DeliveryAddress, saoPaulo } from '@/context/DeliveryContext';
import { toast } from 'react-toastify';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';

// Step enum for checkout process
enum CheckoutStep {
  DELIVERY_ADDRESS = 0,
  PAYMENT = 1,
  CONFIRMATION = 2,
}

export default function ClientCheckout() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { deliveryInfo, setDeliveryAddress, isValidNeighborhood, getDeliveryFee } = useDelivery();
  const { isInstalled } = useMiniKit();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(CheckoutStep.DELIVERY_ADDRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  // Address form state
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: user?.username || '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '',
    phone: '',
  });
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'pix' | 'credit'>('pix');
  
  // Validation states
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [neighborhoodError, setNeighborhoodError] = useState<string>('');
  
  // Load saved address if available
  useEffect(() => {
    if (deliveryInfo.address) {
      setAddress(deliveryInfo.address);
    }
    
    // Redirect to cart if cart is empty
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
      toast.info('Adicione itens ao carrinho para prosseguir com a compra');
    }
  }, [deliveryInfo.address, items.length, orderComplete, router]);
  
  // Handle address form change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear neighborhood error if neighborhood is being changed
    if (name === 'neighborhood') {
      setNeighborhoodError('');
    }
    
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate address form
  const validateAddressForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!address.fullName.trim()) errors.fullName = 'Nome completo é obrigatório';
    if (!address.street.trim()) errors.street = 'Rua é obrigatória';
    if (!address.number.trim()) errors.number = 'Número é obrigatório';
    if (!address.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório';
    if (!address.zipCode.trim()) errors.zipCode = 'CEP é obrigatório';
    if (!address.phone.trim()) errors.phone = 'Telefone é obrigatório';
    
    // Validate neighborhood for delivery
    if (address.neighborhood && !isValidNeighborhood(address.neighborhood)) {
      setNeighborhoodError(`Não realizamos entregas no bairro ${address.neighborhood}. Entregas disponíveis apenas em bairros selecionados de São Paulo.`);
      return false;
    }
    
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle address form submission
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAddressForm()) {
      setDeliveryAddress(address);
      setCurrentStep(CheckoutStep.PAYMENT);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (method: 'crypto' | 'pix' | 'credit') => {
    setPaymentMethod(method);
  };
  
  // Handle payment submission
  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (paymentMethod === 'crypto' && isInstalled) {
        // In a real implementation, this would use MiniKit.commandsAsync.pay
        toast.success('Pagamento com criptomoeda processado com sucesso!');
      } else {
        toast.success('Pagamento processado com sucesso!');
      }
      
      // Generate a random order ID
      const newOrderId = `MDC${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setOrderId(newOrderId);
      
      // Move to confirmation step
      setCurrentStep(CheckoutStep.CONFIRMATION);
      setOrderComplete(true);
      
      // Clear cart after successful order
      clearCart();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total with delivery fee
  const deliveryFee = address.neighborhood ? getDeliveryFee(address.neighborhood) : 0;
  const total = subtotal + deliveryFee;
  
  // Render address form step
  const renderAddressForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-[#6b4226]">Endereço de Entrega</h2>
      <p className="text-gray-600 mb-6">Entregamos apenas em bairros selecionados de São Paulo - SP</p>
      
      <form onSubmit={handleAddressSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-700 mb-1">Nome Completo*</label>
            <input
              type="text"
              name="fullName"
              value={address.fullName}
              onChange={handleAddressChange}
              className={`w-full p-2 border rounded ${addressErrors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {addressErrors.fullName && <p className="text-red-500 text-sm mt-1">{addressErrors.fullName}</p>}
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 mb-1">Rua/Avenida*</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              className={`w-full p-2 border rounded ${addressErrors.street ? 'border-red-500' : 'border-gray-300'}`}
            />
            {addressErrors.street && <p className="text-red-500 text-sm mt-1">{addressErrors.street}</p>}
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 mb-1">Número*</label>
            <input
              type="text"
              name="number"
              value={address.number}
              onChange={handleAddressChange}
              className={`w-full p-2 border rounded ${addressErrors.number ? 'border-red-500' : 'border-gray-300'}`}
            />
            {addressErrors.number && <p className="text-red-500 text-sm mt-1">{addressErrors.number}</p>}
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 mb-1">Complemento</label>
            <input
              type="text"
              name="complement"
              value={address.complement}
              onChange={handleAddressChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Apto, Bloco, etc. (opcional)"
            />
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 mb-1">Bairro*</label>
            <select
              name="neighborhood"
              value={address.neighborhood}
              onChange={handleAddressChange}
              className={`w-full p-2 border rounded ${addressErrors.neighborhood || neighborhoodError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecione o bairro</option>
              {saoPaulo.zones.map(zone => (
                <optgroup key={zone.name} label={zone.name}>
                  {zone.neighborhoods.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {addressErrors.neighborhood && <p className="text-red-500 text-sm mt-1">{addressErrors.neighborhood}</p>}
            {neighborhoodError && <p className="text-red-500 text-sm mt-1">{neighborhoodError}</p>}
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 mb-1">Cidade*</label>
            <input
              type="text"
              name="city"
              value={address.city}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 mb-1">Estado*</label>
            <input
              type="text"
              name="state"
              value={address.state}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 mb-1">CEP*</label>
            <input
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={handleAddressChange}
              className={`w-full p-2 border rounded ${addressErrors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="00000-000"
            />
            {addressErrors.zipCode && <p className="text-red-500 text-sm mt-1">{addressErrors.zipCode}</p>}
          </div>
          
          <div className="col-span-1">
            <label className="block text-gray-700 mb-1">Telefone*</label>
            <input
              type="text"
              name="phone"
              value={address.phone}
              onChange={handleAddressChange}
              className={`w-full p-2 border rounded ${addressErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="(00) 00000-0000"
            />
            {addressErrors.phone && <p className="text-red-500 text-sm mt-1">{addressErrors.phone}</p>}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Link
            href="/cart"
            className="px-4 py-2 border border-[#6b4226] text-[#6b4226] rounded-md hover:bg-[#f9f5eb]"
          >
            Voltar para o Carrinho
          </Link>
          
          <button
            type="submit"
            className="px-6 py-2 bg-[#6b4226] text-white rounded-md hover:bg-[#8b5d33]"
          >
            Continuar para Pagamento
          </button>
        </div>
      </form>
    </div>
  );
  
  // Render payment step
  const renderPaymentStep = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-[#6b4226]">Método de Pagamento</h2>
      
      <div className="space-y-4 mb-6">
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'pix' ? 'border-[#6b4226] bg-[#f9f5eb]' : 'border-gray-200'}`}
          onClick={() => handlePaymentMethodChange('pix')}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full border border-[#6b4226] flex items-center justify-center mr-3">
              {paymentMethod === 'pix' && <div className="w-4 h-4 rounded-full bg-[#6b4226]"></div>}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">PIX</h3>
              <p className="text-sm text-gray-600">Pagamento instantâneo</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
          </div>
        </div>
        
        <div 
          className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'credit' ? 'border-[#6b4226] bg-[#f9f5eb]' : 'border-gray-200'}`}
          onClick={() => handlePaymentMethodChange('credit')}
        >
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full border border-[#6b4226] flex items-center justify-center mr-3">
              {paymentMethod === 'credit' && <div className="w-4 h-4 rounded-full bg-[#6b4226]"></div>}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Cartão de Crédito</h3>
              <p className="text-sm text-gray-600">Visa, Mastercard, Elo, etc.</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>
        
        {isInstalled && (
          <div 
            className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'crypto' ? 'border-[#6b4226] bg-[#f9f5eb]' : 'border-gray-200'}`}
            onClick={() => handlePaymentMethodChange('crypto')}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full border border-[#6b4226] flex items-center justify-center mr-3">
                {paymentMethod === 'crypto' && <div className="w-4 h-4 rounded-full bg-[#6b4226]"></div>}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Pagamento com WLD</h3>
                <p className="text-sm text-gray-600">Pague com criptomoeda via World App</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep(CheckoutStep.DELIVERY_ADDRESS)}
          className="px-4 py-2 border border-[#6b4226] text-[#6b4226] rounded-md hover:bg-[#f9f5eb]"
        >
          Voltar para Endereço
        </button>
        
        <button
          onClick={handlePaymentSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-[#6b4226] text-white rounded-md hover:bg-[#8b5d33] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            'Finalizar Compra'
          )}
        </button>
      </div>
    </div>
  );
  
  // Render confirmation step
  const renderConfirmationStep = () => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-[#6b4226]">Pedido Confirmado!</h2>
      <p className="text-gray-600 mb-4">Seu pedido #{orderId} foi recebido e está sendo processado.</p>
      
      <div className="bg-[#f9f5eb] p-4 rounded-lg mb-6">
        <h3 className="font-medium mb-2">Detalhes da Entrega</h3>
        <p className="text-sm">{address.fullName}</p>
        <p className="text-sm">{address.street}, {address.number} {address.complement && `- ${address.complement}`}</p>
        <p className="text-sm">{address.neighborhood}, {address.city} - {address.state}</p>
        <p className="text-sm">CEP: {address.zipCode}</p>
        <p className="text-sm">Telefone: {address.phone}</p>
        
        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-sm font-medium">Tempo estimado de entrega: {deliveryInfo.estimatedTime}</p>
        </div>
      </div>
      
      <Link
        href="/"
        className="px-6 py-2 bg-[#6b4226] text-white rounded-md hover:bg-[#8b5d33] inline-block"
      >
        Continuar Comprando
      </Link>
    </div>
  );
  
  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#6b4226] mb-6">Checkout</h1>
      
      {/* Progress steps */}
      <div className="flex items-center mb-8">
        <div className={`flex flex-col items-center ${currentStep >= CheckoutStep.DELIVERY_ADDRESS ? 'text-[#6b4226]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= CheckoutStep.DELIVERY_ADDRESS ? 'bg-[#6b4226] text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <span className="text-sm mt-1">Endereço</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${currentStep >= CheckoutStep.PAYMENT ? 'bg-[#6b4226]' : 'bg-gray-200'}`}></div>
        
        <div className={`flex flex-col items-center ${currentStep >= CheckoutStep.PAYMENT ? 'text-[#6b4226]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= CheckoutStep.PAYMENT ? 'bg-[#6b4226] text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <span className="text-sm mt-1">Pagamento</span>
        </div>
        
        <div className={`flex-1 h-1 mx-2 ${currentStep >= CheckoutStep.CONFIRMATION ? 'bg-[#6b4226]' : 'bg-gray-200'}`}></div>
        
        <div className={`flex flex-col items-center ${currentStep >= CheckoutStep.CONFIRMATION ? 'text-[#6b4226]' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= CheckoutStep.CONFIRMATION ? 'bg-[#6b4226] text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
          <span className="text-sm mt-1">Confirmação</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {currentStep === CheckoutStep.DELIVERY_ADDRESS && renderAddressForm()}
          {currentStep === CheckoutStep.PAYMENT && renderPaymentStep()}
          {currentStep === CheckoutStep.CONFIRMATION && renderConfirmationStep()}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-[#6b4226]">Resumo do Pedido</h2>
            
            {items.length > 0 && (
              <div className="max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center py-2 border-b border-gray-100">
                    <div className="w-12 h-12 bg-[#f9f5eb] rounded-md flex-shrink-0 relative">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name}
                        width={40}
                        height={40}
                        className="object-contain absolute inset-0 m-auto"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x R$ {item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                <span>
                  {deliveryFee > 0 
                    ? `R$ ${deliveryFee.toFixed(2)}` 
                    : currentStep === CheckoutStep.DELIVERY_ADDRESS 
                      ? 'Selecione o bairro' 
                      : 'Grátis'}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {currentStep === CheckoutStep.DELIVERY_ADDRESS && (
              <div className="bg-[#f9f5eb] p-3 rounded-md text-sm text-[#6b4226]">
                <p className="font-medium mb-1">Entrega disponível apenas em São Paulo - SP</p>
                <p>Selecione seu bairro para calcular o frete e o tempo estimado de entrega.</p>
              </div>
            )}
            
            {currentStep === CheckoutStep.PAYMENT && deliveryInfo.estimatedTime && (
              <div className="bg-[#f9f5eb] p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Tempo estimado de entrega</p>
                <p className="text-[#6b4226]">{deliveryInfo.estimatedTime}</p>
                <p className="text-xs text-gray-600 mt-1">Região: {deliveryInfo.zone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
