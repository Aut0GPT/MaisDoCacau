'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProductById, Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  // Loading state used in useEffect
  const [, setLoading] = useState(true);
  const [stockAvailable, setStockAvailable] = useState(0);
  
  const productId = params.id as string;
  
  // Fetch product data from Supabase
  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        if (productData) {
          setStockAvailable(productData.stock || 0);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Erro ao carregar o produto. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [productId]);
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#6b4226' }}>Produto não encontrado</h1>
            <Link 
              href="/" 
              style={{ color: '#6b4226', textDecoration: 'underline' }}
            >
              Voltar para a página inicial
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Function to handle adding to cart
  const handleAddToCart = () => {
    try {
      // Check if there's enough stock available
      if (stockAvailable <= 0) {
        toast.error('Este produto está fora de estoque.');
        return;
      }
      
      if (quantity > stockAvailable) {
        toast.warning(`Apenas ${stockAvailable} unidades disponíveis em estoque.`);
        setQuantity(stockAvailable);
        return;
      }
      
      // Check if the product is alcoholic and requires age verification
      if (product.containsAlcohol) {
        // In a real implementation, we would verify age with World ID
        // For now, just show a confirmation
        const isAdult = confirm('Este produto contém álcool. Você confirma que é maior de 18 anos?');
        
        if (!isAdult) {
          return; // Don't add to cart if not adult
        }
      }
      
      // Add to cart and update stock in UI
      addToCart(product, quantity);
      setStockAvailable(prev => Math.max(0, prev - quantity));
      toast.success(`${quantity} ${quantity > 1 ? 'unidades' : 'unidade'} de ${product.name} adicionado ao carrinho!`);
      
      // In a production app, we would update the stock in Supabase here
      // updateProductStock(product.id, stockAvailable - quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erro ao adicionar produto ao carrinho. Tente novamente.');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', flex: '1' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link 
            href="/" 
            style={{ color: '#6b4226', display: 'flex', alignItems: 'center' }}
          >
            ← Voltar
          </Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '32px' }}>
          {/* Product Image */}
          <div style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', paddingBottom: '100%', backgroundColor: '#f9f5eb' }}>
            <Image
              src={product.image || '/images/products/product-placeholder.svg'}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                // If image fails to load, replace with a placeholder
                const target = e.target as HTMLImageElement;
                target.src = '/images/products/product-placeholder.svg';
              }}
            />
          </div>
          
          {/* Product Info */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>{product.name}</h1>
            
            {product.containsAlcohol && (
              <div style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 12px', borderRadius: '9999px', fontSize: '14px', marginBottom: '16px' }}>
                +18 Produto alcoólico - Venda proibida para menores
              </div>
            )}
            
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5d33', marginBottom: '16px' }}>
              R$ {product.price.toFixed(2)}
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="quantity" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Quantidade:
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px 0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: '64px', height: '40px', border: '1px solid #f3f4f6', textAlign: 'center' }}
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '0 4px 4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              style={{ width: '100%', padding: '12px', backgroundColor: '#6b4226', color: 'white', borderRadius: '4px', fontWeight: 'bold', fontSize: '18px', marginBottom: '24px', border: 'none', cursor: 'pointer' }}
            >
              Adicionar ao Carrinho
            </button>
            
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Descrição</h2>
              <p style={{ color: '#4b5563' }}>{product.description}</p>
            </div>
            
            {product.ingredients && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Ingredientes</h2>
                <p style={{ color: '#4b5563' }}>{product.ingredients}</p>
              </div>
            )}

            {product.healthBenefits && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Benefícios para a Saúde</h2>
                <p style={{ color: '#4b5563' }}>{product.healthBenefits}</p>
              </div>
            )}

            {product.usage && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Como Consumir</h2>
                <p style={{ color: '#4b5563' }}>{product.usage}</p>
              </div>
            )}

            {product.preparation && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Modo de Preparo</h2>
                <p style={{ color: '#4b5563' }}>{product.preparation}</p>
              </div>
            )}

            {product.dietaryInfo && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Informação Nutricional</h2>
                <p style={{ color: '#4b5563' }}>{product.dietaryInfo}</p>
              </div>
            )}

            {product.origin && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Origem</h2>
                <p style={{ color: '#4b5563' }}>{product.origin}</p>
              </div>
            )}

            {product.awards && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Premiações</h2>
                <p style={{ color: '#4b5563' }}>{product.awards}</p>
              </div>
            )}
            
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4226', marginBottom: '8px' }}>Detalhes</h2>
              <ul style={{ paddingLeft: '20px', color: '#4b5563' }}>
                {product.weight && <li>Peso/Volume: {product.weight}</li>}
                <li>Categoria: {product.category}</li>
                {product.containsAlcohol && (
                  <li style={{ color: '#b91c1c' }}>Contém álcool - Venda proibida para menores de 18 anos</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
