      
      <main className="flex-grow container mx-auto px-4 py-6 overflow-y-auto">
        <div className="mb-4">
          <Link 
            href="/" 
            className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{getCategoryTitle(categoryId)}</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-6">Nenhum produto encontrado nesta categoria.</p>
            <Link 
              href="/" 
              className="inline-block px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white rounded-md transition-colors"
            >
              Voltar para a página inicial
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: Product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
