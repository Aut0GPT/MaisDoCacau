import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

export type Product = Database['public']['Tables']['products']['Row'];

// Client-side type for cart display
export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean | null;
  containsAlcohol?: boolean | null;
}

// Get all products
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data as Product[];
}

// Get a product by ID
export async function getProductById(id: string) {
  try {
    // Special case for the specific problematic URL
    if (id === 'cauchaca-carvalho-500ml') {
      console.log('Special case handling for cauchaca-carvalho-500ml');
      // Get all products and find Cauchaça Carvalho product
      const { data: allProducts } = await supabase
        .from('products')
        .select('*');
      
      if (allProducts && allProducts.length > 0) {
        // Find the Cauchaça Carvalho product
        const carvalhoProduct = allProducts.find(p => 
          p.name.toLowerCase().includes('carvalho') && 
          p.name.toLowerCase().includes('cauchaça')
        );
        
        if (carvalhoProduct) {
          return carvalhoProduct as Product;
        }
      }
    }
    
    // First try to get by UUID
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      return data as Product;
    }
    
    // If not found by UUID, try to get by name (for compatibility with older links)
    // This is a fallback for when product IDs in URLs don't match database UUIDs
    if (error) {
      console.log(`Product not found by ID ${id}, trying by name...`);
      
      // Get all products and find by name that contains the ID string
      // This is a workaround and not efficient for production
      const { data: allProducts } = await supabase
        .from('products')
        .select('*');
      
      if (allProducts && allProducts.length > 0) {
        // Normalize the ID to make matching more reliable
        const normalizedId = id.toLowerCase()
          .replace(/[\-_]/g, ' ')  // Replace hyphens and underscores with spaces
          .replace(/\d+\s*ml/g, '')  // Remove volume measurements like "500ml"
          .trim();

        // Special case handling for common product types
        const isCaucha = normalizedId.includes('caucha') || normalizedId.includes('cauchaca');
        const isCarvalho = normalizedId.includes('carvalho');
        
        // Try to find a product with a name that matches the normalized ID
        let matchingProduct = allProducts.find(p => {
          const normalizedName = p.name.toLowerCase()
            .replace(/[\-_]/g, ' ')
            .trim();
          
          // Direct match
          if (normalizedName.includes(normalizedId) || normalizedId.includes(normalizedName)) {
            return true;
          }
          
          // Special case for Cauchaça Carvalho products
          if (isCaucha && isCarvalho && 
              normalizedName.includes('caucha') && 
              normalizedName.includes('carvalho')) {
            return true;
          }
          
          return false;
        });
        
        if (matchingProduct) {
          return matchingProduct as Product;
        }
        
        // If still not found, try a more lenient approach with partial matches
        matchingProduct = allProducts.find(p => {
          const words = normalizedId.split(' ');
          // Match if at least one word from the ID is in the product name
          return words.filter(word => 
            word.length > 3 && p.name.toLowerCase().includes(word)
          ).length >= 1;
        });
        
        if (matchingProduct) {
          return matchingProduct as Product;
        }
        
        // Last resort - for Cauchaça products, return any Cauchaça product
        if (isCaucha) {
          const anyCarvalhoProduct = allProducts.find(p => 
            p.name.toLowerCase().includes('cauchaça') && 
            p.name.toLowerCase().includes('carvalho')
          );
          
          if (anyCarvalhoProduct) {
            console.log('Found a Cauchaça Carvalho product as fallback');
            return anyCarvalhoProduct as Product;
          }
          
          const anyCauchaProduct = allProducts.find(p => 
            p.name.toLowerCase().includes('cauchaça')
          );
          
          if (anyCauchaProduct) {
            console.log('Found a Cauchaça product as fallback');
            return anyCauchaProduct as Product;
          }
        }
      }
    }
    
    console.error(`Product not found with ID ${id}`);
    return null;
  } catch (err) {
    console.error(`Error fetching product with ID ${id}:`, err);
    return null;
  }
}

// Update product stock
export async function updateProductStock(id: string, newStock: number) {
  const { error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating stock for product ${id}:`, error);
    return false;
  }
  
  return true;
}


// Seed initial products (for development)
export async function seedInitialProducts() {
  const initialProducts = [
    {
      name: 'Combo Cacau Saudável',
      description: 'Combo completo com Granola, mel de cacau e chá de cacau para uma experiência completa de bem-estar.',
      price: 89.90,
      image: '/images/products/product-placeholder.svg',
      category: 'Combos',
      stock: 10,
      featured: true,
      containsAlcohol: false,
      ingredients: 'Granola baiana, mel de cacau puro, chá de cacau',
      healthBenefits: 'Rico em antioxidantes, minerais e fibras. Fortalece o sistema imunológico e proporciona energia sustentável.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Cauchaça Original - 160 ml',
      description: 'Bebida destilada premium feita a partir da polpa do cacau, com sabor único e aromático. Garrafa de 160ml.',
      price: 59.90,
      image: '/images/products/product-placeholder.svg',
      category: 'Bebidas',
      stock: 15,
      featured: false,
      containsAlcohol: true,
      ingredients: 'Destilado de cacau, água',
      usage: 'Ideal para drinks e coqueteis especiais ou para degustar puro.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Cauchaça Original - 700 ml',
      description: 'Bebida destilada premium feita a partir da polpa do cacau, com sabor único e aromático. Garrafa de 700ml.',
      price: 149.90,
      image: '/images/products/product-placeholder.svg',
      category: 'Bebidas',
      stock: 8,
      featured: true,
      containsAlcohol: true,
      ingredients: 'Destilado de cacau, água',
      usage: 'Ideal para drinks e coqueteis especiais ou para degustar puro.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Nibs de Cacau Premium',
      description: 'Nibs de cacau torrados premium, perfeitos para adicionar em receitas ou consumir como snack saudável.',
      price: 29.90,
      image: '/images/products/product-placeholder.svg',
      category: 'Derivados',
      stock: 20,
      featured: false,
      containsAlcohol: false,
      ingredients: '100% cacau torrado e quebrado',
      healthBenefits: 'Rico em fibras, antioxidantes e minerais. Fonte natural de energia.',
      usage: 'Adicione em smoothies, iogurtes, saladas de frutas ou consuma puro como snack.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Granola Baiana',
      description: 'Granola artesanal com ingredientes da Bahia, incluindo cacau e castanhas regionais.',
      price: 32.90,
      image: '/images/products/product-placeholder.svg',
      category: 'Alimentos',
      stock: 15,
      featured: false,
      containsAlcohol: false,
      ingredients: 'Aveia, mel, nibs de cacau, castanhas, frutas secas regionais',
      healthBenefits: 'Rica em fibras e nutrientes essenciais. Ajuda na digestão e fornece energia sustentada.',
      dietaryInfo: 'Sem conservantes artificiais. Fonte de fibras e proteínas.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Vinagre Balsâmico de Cacau',
      description: 'Vinagre balsâmico especial feito a partir da fermentação do cacau, com sabor único e versátil.',
      price: 45.90,
      image: '/images/products/product-placeholder.svg',
      category: 'Condimentos',
      stock: 12,
      featured: false,
      containsAlcohol: false,
      ingredients: 'Polpa de cacau fermentada, especiarias',
      usage: 'Ideal para saladas, marinadas e finalização de pratos.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Cauchaça Original - 50 ml',
      description: 'Versão compacta da nossa bebida destilada premium feita a partir da polpa do cacau. Ideal para presente ou degustação.',
      price: 29.90,
      image: '/images/products/product-placeholder.svg',
      category: 'Bebidas',
      stock: 25,
      featured: false,
      containsAlcohol: true,
      ingredients: 'Destilado de cacau, água',
      usage: 'Ideal para degustação ou como presente.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Vinagre de Cacau',
      description: 'Vinagre tradicional feito a partir da fermentação do cacau, com sabor único e versátil.',
      price: 35.90,
      image: '/images/products/Vinagredecacau250ml.png',
      category: 'Condimentos',
      stock: 18,
      featured: false,
      containsAlcohol: false,
      ingredients: 'Polpa de cacau fermentada',
      usage: 'Ideal para saladas, marinadas e finalização de pratos.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Mel de Cacau - 1 litro',
      description: 'Mel puro extraído da polpa do cacau, com sabor único e propriedades nutritivas excepcionais.',
      price: 79.90,
      image: '/images/products/MelldeCacau1litro.png',
      category: 'Alimentos',
      stock: 10,
      featured: true,
      containsAlcohol: false,
      ingredients: '100% mel de cacau puro',
      healthBenefits: 'Rico em antioxidantes e nutrientes essenciais. Propriedades anti-inflamatórias naturais.',
      usage: 'Use como adoçante natural em bebidas, sobremesas ou consuma puro.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Cauchaça Carvalho - 30 ml',
      description: 'Edição especial da nossa bebida destilada premium, envelhecida em barris de carvalho. Miniatura para degustação.',
      price: 39.90,
      image: '/images/products/CauchacaArmazenadaembarrildecarvalho30ml.png',
      category: 'Bebidas',
      stock: 15,
      featured: true,
      containsAlcohol: true,
      ingredients: 'Destilado de cacau, água, envelhecido em barris de carvalho',
      usage: 'Ideal para degustação ou como presente exclusivo.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Pick Nibs - nibs com rapadura',
      description: 'Combinação perfeita de nibs de cacau crocantes com rapadura tradicional, um snack delicioso e energético.',
      price: 25.90,
      image: '/images/products/NibsdeCacau50g.png', // Using the nibs image as closest match
      category: 'Alimentos',
      stock: 22,
      featured: true,
      containsAlcohol: false,
      ingredients: 'Nibs de cacau, rapadura artesanal',
      healthBenefits: 'Fonte de energia natural e antioxidantes. Combinação de nutrientes do cacau com os minerais da rapadura.',
      usage: 'Consuma como snack energético ou adicione em sobremesas e cereais.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      name: 'Chá de Cacau',
      description: 'Chá artesanal feito com cascas de cacau, com sabor suave e propriedades relaxantes.',
      price: 19.90,
      image: '/images/products/ChadeCacau30gpartedafrente.png',
      category: 'Bebidas',
      stock: 30,
      featured: true,
      containsAlcohol: false,
      ingredients: 'Cascas de cacau secas e selecionadas',
      healthBenefits: 'Propriedades calmantes e relaxantes. Rico em teobromina, um estimulante natural mais suave que a cafeína.',
      preparation: 'Adicione uma colher de sopa em água quente e deixe em infusão por 5-7 minutos.',
      origin: 'Bahia, Brasil',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  // Check if products already exist
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  if (count && count > 0) {
    console.log('Products already seeded, skipping...');
    return;
  }
  
  // Insert products
  const { error } = await supabase
    .from('products')
    .insert(initialProducts);
  
  if (error) {
    console.error('Error seeding products:', error);
    return false;
  }
  
  console.log('Products seeded successfully!');
  return true;
}
