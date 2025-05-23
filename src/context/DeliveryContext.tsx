'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// São Paulo neighborhoods with delivery support
export const saoPaulo = {
  zones: [
    {
      name: 'Zona Central',
      neighborhoods: ['Sé', 'República', 'Santa Cecília', 'Consolação', 'Bela Vista', 'Liberdade', 'Cambuci', 'Bom Retiro'],
      deliveryFee: 12.90,
      estimatedTime: '30-45 min'
    },
    {
      name: 'Zona Oeste',
      neighborhoods: ['Pinheiros', 'Alto de Pinheiros', 'Jardim Paulista', 'Itaim Bibi', 'Perdizes', 'Vila Madalena', 'Lapa', 'Butantã'],
      deliveryFee: 14.90,
      estimatedTime: '40-55 min'
    },
    {
      name: 'Zona Sul',
      neighborhoods: ['Vila Mariana', 'Moema', 'Ipiranga', 'Saúde', 'Campo Belo', 'Brooklin', 'Jabaquara', 'Santo Amaro'],
      deliveryFee: 16.90,
      estimatedTime: '45-60 min'
    },
    {
      name: 'Zona Leste',
      neighborhoods: ['Tatuapé', 'Mooca', 'Belém', 'Penha', 'Vila Formosa', 'Carrão', 'Vila Prudente', 'Anália Franco'],
      deliveryFee: 18.90,
      estimatedTime: '50-65 min'
    },
    {
      name: 'Zona Norte',
      neighborhoods: ['Santana', 'Tucuruvi', 'Vila Guilherme', 'Casa Verde', 'Mandaqui', 'Tremembé', 'Jaçanã', 'Vila Maria'],
      deliveryFee: 18.90,
      estimatedTime: '50-65 min'
    }
  ],
  // Flat array of all neighborhoods for easy lookup
  allNeighborhoods: [] as string[]
};

// Populate the allNeighborhoods array
saoPaulo.zones.forEach(zone => {
  zone.neighborhoods.forEach(neighborhood => {
    saoPaulo.allNeighborhoods.push(neighborhood);
  });
});

export interface DeliveryAddress {
  fullName: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface DeliveryInfo {
  address: DeliveryAddress | null;
  fee: number;
  estimatedTime: string;
  zone: string;
}

interface DeliveryContextType {
  deliveryInfo: DeliveryInfo;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  clearDeliveryInfo: () => void;
  isValidNeighborhood: (neighborhood: string) => boolean;
  getDeliveryFee: (neighborhood: string) => number;
  getEstimatedTime: (neighborhood: string) => string;
  getZone: (neighborhood: string) => string;
  getSupportedNeighborhoods: () => string[];
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: null,
    fee: 0,
    estimatedTime: '',
    zone: ''
  });
  const [isClient, setIsClient] = useState(false);

  // Initialize delivery info from localStorage on client-side
  useEffect(() => {
    setIsClient(true);
    const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
    if (savedDeliveryInfo) {
      try {
        setDeliveryInfo(JSON.parse(savedDeliveryInfo));
      } catch (error) {
        console.error('Failed to parse delivery info from localStorage:', error);
        localStorage.removeItem('deliveryInfo');
      }
    }
  }, []);

  // Save delivery info to localStorage whenever it changes
  useEffect(() => {
    if (isClient && deliveryInfo.address) {
      localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
    }
  }, [deliveryInfo, isClient]);

  // Check if a neighborhood is supported for delivery
  const isValidNeighborhood = (neighborhood: string): boolean => {
    return saoPaulo.allNeighborhoods.includes(neighborhood);
  };

  // Get delivery fee for a neighborhood
  const getDeliveryFee = (neighborhood: string): number => {
    for (const zone of saoPaulo.zones) {
      if (zone.neighborhoods.includes(neighborhood)) {
        return zone.deliveryFee;
      }
    }
    return 0;
  };

  // Get estimated delivery time for a neighborhood
  const getEstimatedTime = (neighborhood: string): string => {
    for (const zone of saoPaulo.zones) {
      if (zone.neighborhoods.includes(neighborhood)) {
        return zone.estimatedTime;
      }
    }
    return '';
  };

  // Get zone name for a neighborhood
  const getZone = (neighborhood: string): string => {
    for (const zone of saoPaulo.zones) {
      if (zone.neighborhoods.includes(neighborhood)) {
        return zone.name;
      }
    }
    return '';
  };

  // Get all supported neighborhoods
  const getSupportedNeighborhoods = (): string[] => {
    return saoPaulo.allNeighborhoods;
  };

  // Set delivery address and calculate fee and estimated time
  const setDeliveryAddress = (address: DeliveryAddress) => {
    const fee = getDeliveryFee(address.neighborhood);
    const estimatedTime = getEstimatedTime(address.neighborhood);
    const zone = getZone(address.neighborhood);

    setDeliveryInfo({
      address,
      fee,
      estimatedTime,
      zone
    });
  };

  // Clear delivery info
  const clearDeliveryInfo = () => {
    setDeliveryInfo({
      address: null,
      fee: 0,
      estimatedTime: '',
      zone: ''
    });
    localStorage.removeItem('deliveryInfo');
  };

  return (
    <DeliveryContext.Provider value={{
      deliveryInfo,
      setDeliveryAddress,
      clearDeliveryInfo,
      isValidNeighborhood,
      getDeliveryFee,
      getEstimatedTime,
      getZone,
      getSupportedNeighborhoods
    }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}
