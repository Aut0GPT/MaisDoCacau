import { Product } from '@/components/ProductCard';

// Product categories
export enum ProductCategory {
  CHOCOLATE = 'chocolate',
  BEVERAGE = 'beverage',
  SNACK = 'snack',
  CONFECTIONERY = 'confectionery',
  ALCOHOL = 'alcohol',
  CONDIMENT = 'condiment',
  TEA = 'tea',
}

// Product data
export const products: Product[] = [
  {
    id: 'amendo-cacau-caramelizada',
    name: 'Amêndoa de Cacau Caramelizada',
    description: 'Deliciosas amêndoas de cacau caramelizadas, um petisco irresistível com o sabor autêntico do cacau. Perfeito para um lanche saudável e energético.',
    price: 28.90,
    image: '/images/products/Amendo de cacau Caramelizada 125g.jpg',
    category: ProductCategory.SNACK,
    weight: '125g',
    featured: true,
    new: false,
    containsAlcohol: false,
  },
  {
    id: 'cauchaca-carvalho-500ml',
    name: 'Cauchaça Armazenada em Barril de Carvalho',
    description: 'Nossa cauchaça premium armazenada em barril de carvalho, conferindo um sabor amadeirado único e aroma complexo. Perfeita para apreciadores de destilados finos.',
    price: 89.90,
    image: '/images/products/CauchacaArmazenadaembarrildecarvalho 500ml.jpg',
    category: ProductCategory.ALCOHOL,
    weight: '500ml',
    featured: true,
    new: false,
    containsAlcohol: true,
  },
  {
    id: 'cauchaca-carvalho-mini',
    name: 'Mini Cauchaça Armazenada em Barril de Carvalho',
    description: 'Versão compacta da nossa cauchaça premium armazenada em barril de carvalho. Ideal para experimentar ou presentear.',
    price: 29.90,
    image: '/images/products/CauchacaArmazenadaembarrildecarvalho mini 30ml.jpg',
    category: ProductCategory.ALCOHOL,
    weight: '30ml',
    featured: false,
    new: true,
    containsAlcohol: true,
  },
  {
    id: 'cha-de-cacau',
    name: 'Chá de Cacau',
    description: 'Chá natural feito a partir da casca do cacau, rico em antioxidantes e com sabor suave e aromático. Uma bebida reconfortante para qualquer hora do dia.',
    price: 18.50,
    image: '/images/products/Cha de cacau 30g.jpg',
    category: ProductCategory.TEA,
    weight: '30g',
    featured: false,
    new: false,
    containsAlcohol: false,
  },
  {
    id: 'granola-baiana',
    name: 'Granola Baiana',
    description: 'Granola artesanal com ingredientes típicos da Bahia, incluindo nibs de cacau. Um café da manhã nutritivo com o sabor autêntico da culinária baiana.',
    price: 24.90,
    image: '/images/products/Granola Baiana 150g.jpg',
    category: ProductCategory.SNACK,
    weight: '150g',
    featured: true,
    new: false,
    containsAlcohol: false,
  },
  {
    id: 'mel-de-cacau',
    name: 'Mel de Cacau',
    description: 'Mel natural extraído da polpa do cacau, com sabor adocicado e notas frutadas. Perfeito para acompanhar pães, queijos ou adicionar em receitas.',
    price: 32.90,
    image: '/images/products/Mell de cacau 175ml.jpg',
    category: ProductCategory.CONDIMENT,
    weight: '175ml',
    featured: true,
    new: false,
    containsAlcohol: false,
  },
  {
    id: 'mellato-reducao-mel-cacau',
    name: 'Mellato - Redução de Mel de Cacau',
    description: 'Redução concentrada do mel de cacau, com sabor intenso e textura encorpada. Ideal para finalizar sobremesas ou criar molhos gourmet.',
    price: 38.50,
    image: '/images/products/Mellato reducao de mell de cacau 140g.jpg',
    category: ProductCategory.CONDIMENT,
    weight: '140g',
    featured: false,
    new: true,
    containsAlcohol: false,
  },
  {
    id: 'mel-de-cacau-gelado',
    name: 'Mel de Cacau Gelado',
    description: 'Versão refrescante do nosso mel de cacau, pronto para consumo. Uma bebida natural e energética para os dias quentes.',
    price: 45.90,
    image: '/images/products/Melldecacau gelado 1litro.jpg',
    category: ProductCategory.BEVERAGE,
    weight: '1 litro',
    featured: false,
    new: true,
    containsAlcohol: false,
  },
  {
    id: 'nibs-de-cacau',
    name: 'Nibs de Cacau',
    description: 'Pedaços de amêndoa de cacau torrados, com sabor intenso e levemente amargo. Rico em antioxidantes e nutrientes, perfeito para adicionar em receitas ou consumir puro.',
    price: 19.90,
    image: '/images/products/Nibsdecacau50g.jpg',
    category: ProductCategory.SNACK,
    weight: '50g',
    featured: true,
    new: false,
    containsAlcohol: false,
  },
  {
    id: 'vinagre-balsamico-cacau',
    name: 'Vinagre Balsâmico de Cacau',
    description: 'Vinagre balsâmico artesanal produzido a partir da fermentação do cacau. Um toque gourmet para saladas e marinadas.',
    price: 34.90,
    image: '/images/products/Vinagre balsamico de cacau 250ml.jpg',
    category: ProductCategory.CONDIMENT,
    weight: '250ml',
    featured: false,
    new: false,
    containsAlcohol: false,
  },
  {
    id: 'vinagre-fruta-cacau',
    name: 'Vinagre de Fruta de Cacau',
    description: 'Vinagre artesanal produzido com a polpa fresca do cacau. Sabor único e refrescante para suas receitas.',
    price: 29.90,
    image: '/images/products/VinagreDeFrutaCacau250ml.jpg',
    category: ProductCategory.CONDIMENT,
    weight: '250ml',
    featured: false,
    new: true,
    containsAlcohol: false,
  },
  {
    id: 'cauchaca-original',
    name: 'Cauchaça Original',
    description: 'Nossa cauchaça tradicional, destilada artesanalmente a partir da polpa fermentada do cacau. Um destilado único com aroma e sabor inconfundíveis.',
    price: 59.90,
    image: '/images/products/cauchaca original 160ml.jpg',
    category: ProductCategory.ALCOHOL,
    weight: '160ml',
    featured: true,
    new: false,
    containsAlcohol: true,
  },
];

// Helper functions
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewProducts = (): Product[] => {
  return products.filter(product => product.new);
};

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
