-- Mais do Cacau - Supabase Database Setup Script
-- Run this in the Supabase SQL Editor to set up your database

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  containsAlcohol BOOLEAN DEFAULT FALSE,
  ingredients TEXT,
  healthBenefits TEXT,
  usage TEXT,
  preparation TEXT,
  dietaryInfo TEXT,
  origin TEXT,
  awards TEXT,
  weight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  email TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  estimated_delivery TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table for demonstration
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Products: Anyone can read, only authenticated users can write
CREATE POLICY "Anyone can read products" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON products FOR UPDATE 
TO authenticated 
USING (true);

-- User profiles: Users can read all profiles but only update their own
CREATE POLICY "Anyone can read user profiles" 
ON user_profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON user_profiles FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid()::text = wallet_address);

-- Orders: Users can only see and modify their own orders
CREATE POLICY "Users can read their own orders" 
ON orders FOR SELECT 
TO authenticated 
USING (user_id IN (
  SELECT id FROM user_profiles WHERE wallet_address = auth.uid()::text
));

CREATE POLICY "Users can insert their own orders" 
ON orders FOR INSERT 
TO authenticated 
WITH CHECK (user_id IN (
  SELECT id FROM user_profiles WHERE wallet_address = auth.uid()::text
));

CREATE POLICY "Users can update their own orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (user_id IN (
  SELECT id FROM user_profiles WHERE wallet_address = auth.uid()::text
));

-- Order items: Users can only see and modify their own order items
CREATE POLICY "Users can read their own order items" 
ON order_items FOR SELECT 
TO authenticated 
USING (order_id IN (
  SELECT id FROM orders WHERE user_id IN (
    SELECT id FROM user_profiles WHERE wallet_address = auth.uid()::text
  )
));

CREATE POLICY "Users can insert their own order items" 
ON order_items FOR INSERT 
TO authenticated 
WITH CHECK (order_id IN (
  SELECT id FROM orders WHERE user_id IN (
    SELECT id FROM user_profiles WHERE wallet_address = auth.uid()::text
  )
));

-- Notes: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can read notes" 
ON notes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert notes" 
ON notes FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update their own notes" 
ON notes FOR UPDATE 
TO authenticated 
USING (user_id IN (
  SELECT id FROM user_profiles WHERE wallet_address = auth.uid()::text
));

-- Insert sample product data
INSERT INTO products (name, description, price, image, category, stock, featured, containsAlcohol, ingredients, healthBenefits, usage, preparation, dietaryInfo, origin)
VALUES
  ('Combo Cacau Saudável', 'Combo completo com Granola, mel de cacau e chá de cacau para uma experiência completa de bem-estar.', 89.90, '/products/combo-cacau.jpg', 'Combos', 10, TRUE, FALSE, 'Granola baiana, mel de cacau puro, chá de cacau', 'Rico em antioxidantes, minerais e fibras. Fortalece o sistema imunológico e proporciona energia sustentável.', NULL, NULL, NULL, 'Bahia, Brasil'),
  ('Cauchaça Original - 160 ml', 'Bebida destilada premium feita a partir da polpa do cacau, com sabor único e aromático. Garrafa de 160ml.', 59.90, '/products/cauchaça-160ml.jpg', 'Bebidas', 15, FALSE, TRUE, 'Destilado de cacau, água', NULL, 'Ideal para drinks e coqueteis especiais ou para degustar puro.', NULL, NULL, 'Bahia, Brasil'),
  ('Cauchaça Original - 700 ml', 'Bebida destilada premium feita a partir da polpa do cacau, com sabor único e aromático. Garrafa de 700ml.', 149.90, '/products/cauchaça-700ml.jpg', 'Bebidas', 8, TRUE, TRUE, 'Destilado de cacau, água', NULL, 'Ideal para drinks e coqueteis especiais ou para degustar puro.', NULL, NULL, 'Bahia, Brasil'),
  ('Nibs de Cacau Premium', 'Nibs de cacau torrados premium, perfeitos para adicionar em receitas ou consumir como snack saudável.', 29.90, '/products/nibs-premium.jpg', 'Derivados', 20, FALSE, FALSE, '100% cacau torrado e quebrado', 'Rico em fibras, antioxidantes e minerais. Fonte natural de energia.', 'Adicione em smoothies, iogurtes, saladas de frutas ou consuma puro como snack.', NULL, NULL, 'Bahia, Brasil'),
  ('Granola Baiana', 'Granola artesanal com ingredientes da Bahia, incluindo cacau e castanhas regionais.', 32.90, '/products/granola-baiana.jpg', 'Alimentos', 15, FALSE, FALSE, 'Aveia, mel, nibs de cacau, castanhas, frutas secas regionais', 'Rica em fibras e nutrientes essenciais. Ajuda na digestão e fornece energia sustentada.', NULL, NULL, 'Sem conservantes artificiais. Fonte de fibras e proteínas.', 'Bahia, Brasil'),
  ('Vinagre Balsâmico de Cacau', 'Vinagre balsâmico especial feito a partir da fermentação do cacau, com sabor único e versátil.', 45.90, '/products/vinagre-balsamico.jpg', 'Condimentos', 12, FALSE, FALSE, 'Polpa de cacau fermentada, especiarias', NULL, 'Ideal para saladas, marinadas e finalização de pratos.', NULL, NULL, 'Bahia, Brasil'),
  ('Mel de Cacau - 1 litro', 'Mel puro extraído da polpa do cacau, com sabor único e propriedades nutritivas excepcionais.', 79.90, '/products/mel-cacau-1l.jpg', 'Alimentos', 10, TRUE, FALSE, '100% mel de cacau puro', 'Rico em antioxidantes e nutrientes essenciais. Propriedades anti-inflamatórias naturais.', 'Use como adoçante natural em bebidas, sobremesas ou consuma puro.', NULL, NULL, 'Bahia, Brasil'),
  ('Chá de Cacau', 'Chá artesanal feito com cascas de cacau, com sabor suave e propriedades relaxantes.', 19.90, '/products/cha-cacau.jpg', 'Bebidas', 30, TRUE, FALSE, 'Cascas de cacau secas e selecionadas', 'Propriedades calmantes e relaxantes. Rico em teobromina, um estimulante natural mais suave que a cafeína.', NULL, 'Adicione uma colher de sopa em água quente e deixe em infusão por 5-7 minutos.', NULL, 'Bahia, Brasil');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON order_items
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample notes
INSERT INTO notes (title, content)
VALUES
  ('Bem-vindo ao Mais do Cacau', 'Bem-vindo à nossa loja online! Aqui você encontrará os melhores produtos de cacau da Bahia.'),
  ('Sobre o Cacau Baiano', 'O cacau da Bahia é conhecido mundialmente por sua qualidade e sabor único. Nossos produtos são feitos com cacau de origem sustentável.'),
  ('Dicas de Uso', 'Experimente adicionar nibs de cacau em sua granola matinal ou usar o mel de cacau para adoçar seu café!');
