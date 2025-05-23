import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured?: boolean;
  containsAlcohol?: boolean;
  ingredients?: string;
  healthBenefits?: string;
  usage?: string;
  preparation?: string;
  dietaryInfo?: string;
  origin?: string;
  awards?: string;
  weight?: string;
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
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
  
  return data as Product;
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
  const initialProducts: Omit<Product, 'id'>[] = [
    {
      name: 'Chocolate 70% Cacau',
      description: 'Chocolate artesanal com 70% de cacau, produzido com cacau fino de São Paulo.',
      price: 25.90,
      image: '/products/chocolate-70.jpg',
      category: 'Chocolates',
      stock: 10,
      featured: true
    },
    {
      name: 'Chocolate ao Leite',
      description: 'Chocolate ao leite cremoso, feito com cacau de alta qualidade e leite fresco.',
      price: 18.90,
      image: '/products/chocolate-leite.jpg',
      category: 'Chocolates',
      stock: 15
    },
    {
      name: 'Nibs de Cacau',
      description: 'Nibs de cacau torrados, perfeitos para adicionar em receitas ou consumir como snack.',
      price: 22.50,
      image: '/products/nibs.jpg',
      category: 'Derivados',
      stock: 8
    },
    {
      name: 'Bombons Sortidos',
      description: 'Caixa com 12 bombons artesanais com recheios variados.',
      price: 45.00,
      image: '/products/bombons.jpg',
      category: 'Bombons',
      stock: 5,
      featured: true
    },
    {
      name: 'Pasta de Cacau',
      description: 'Pasta pura de cacau, ideal para preparo de bebidas e sobremesas.',
      price: 32.90,
      image: '/products/pasta.jpg',
      category: 'Derivados',
      stock: 7
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
