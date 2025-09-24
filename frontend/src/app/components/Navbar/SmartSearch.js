'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './SmartSearch.module.css';
import products from '../../../lib/products.json';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  // Función de búsqueda inteligente con algoritmo de relevancia
  const smartSearch = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    const query = searchQuery.toLowerCase().trim();
    const words = query.split(/\s+/);
    
    const scoredResults = products.map(product => {
      let score = 0;
      const title = (product.title || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      
      // Búsqueda exacta en título (máxima puntuación)
      if (title.includes(query)) {
        score += 100;
        if (title.startsWith(query)) score += 50; // Bonus si empieza con la búsqueda
      }
      
      // Búsqueda por palabras individuales
      words.forEach(word => {
        if (word.length > 2) { // Solo palabras de más de 2 caracteres
          if (title.includes(word)) score += 30;
          if (category.includes(word)) score += 20;
          if (description.includes(word)) score += 10;
        }
      });
      
      // Búsqueda en categoría
      if (category.includes(query)) {
        score += 40;
      }
      
      // Búsqueda parcial en título
      if (title.includes(query.substring(0, Math.max(3, query.length - 1)))) {
        score += 15;
      }
      
      return { ...product, score };
    })
    .filter(product => product.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8); // Máximo 8 resultados
    
    setResults(scoredResults);
    setIsLoading(false);
  }, []);

  // Debounce para evitar búsquedas excesivas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      smartSearch(query);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, smartSearch]);

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.length > 1) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Agregar a historial
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      
      // Navegar a resultados
      if (results.length > 0) {
        router.push(`/product/${results[0].slug}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
      
      setShowSuggestions(false);
      setQuery('');
    }
  };

  // Manejar clic en sugerencia
  const handleSuggestionClick = (product) => {
    const newHistory = [product.title, ...searchHistory.filter(item => item !== product.title)].slice(0, 5);
    setSearchHistory(newHistory);
    
    router.push(`/product/${product.slug}`);
    setShowSuggestions(false);
    setQuery('');
  };

  // Manejar navegación con teclado
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSuggestionClick(results[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer} ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            placeholder="Buscar productos en TiendaMayor..."
            className={styles.searchInput}
            autoComplete="off"
          />
          <button type="submit" className={styles.searchButton}>
            {isLoading ? (
              <div className={styles.spinner}></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Sugerencias inteligentes */}
      {showSuggestions && (
        <div className={styles.suggestionsContainer}>
          {isLoading ? (
            <div className={styles.loadingItem}>
              <div className={styles.spinner}></div>
              <span>Buscando...</span>
            </div>
          ) : results.length > 0 ? (
            <div className={styles.suggestionsList}>
              {results.map((product, index) => (
                <div
                  key={product.id}
                  className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ''}`}
                  onClick={() => handleSuggestionClick(product)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={styles.productImage}>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className={styles.image}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.noImage}>
                        <span>📦</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productTitle}>{product.title}</div>
                    <div className={styles.productMeta}>
                      {product.category && (
                        <span className={styles.category}>{product.category}</span>
                      )}
                      {product.providerPrice && (
                        <span className={styles.price}>
                          ${(product.providerPrice * 3).toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                    <div className={styles.relevanceScore}>
                      Relevancia: {Math.round(product.score)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className={styles.noResults}>
              <span>{`No se encontraron productos para "${query}"`}</span>
              <div className={styles.searchTips}>
                <p>💡 Sugerencias:</p>
                <ul>
                  <li>Verifica la ortografía</li>
                  <li>Usa términos más generales</li>
                  <li>Prueba con sinónimos</li>
                </ul>
              </div>
            </div>
          ) : null}
          
          {/* Historial de búsquedas */}
          {query.length <= 1 && searchHistory.length > 0 && (
            <div className={styles.historySection}>
              <div className={styles.historyTitle}>Búsquedas recientes</div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className={styles.historyItem}
                  onClick={() => setQuery(item)}
                >
                  <span>🕒</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
