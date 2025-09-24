'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import SmartSearch from './SmartSearch';
import products from '../../../lib/products.json';
import CartIcon from '../cart/CartIcon';

const slugify = (text) => {
  if (typeof text !== 'string' || text === null) {
    return ''; // Devuelve una cadena vacía si el texto es nulo o no es una cadena
  }
  return text
    .normalize('NFD') // Split accented characters into base character and diacritic
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritic marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-zA-Z0-9-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const menuRef = useRef(null);
  const categoriesRef = useRef(null);

  const categories = [...new Set(products.map(p => p.category).filter(category => category && typeof category === 'string'))];

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, showCategories]);

  // Cerrar menú al presionar Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Efecto de scroll para ocultar/mostrar navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Solo aplicar el efecto después de cierto scroll
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setIsVisible(false);
        setIsOpen(false); // Cerrar menú móvil si está abierto
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle para mejor rendimiento
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  // Agregar padding al body para compensar el navbar fijo
  useEffect(() => {
    document.body.style.paddingTop = '80px';
    
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, []);

  return (
    <nav className={`${styles.navbar} ${!isVisible ? styles.hidden : ''}`} ref={menuRef}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          TiendaMayor
        </Link>
        
        {/* Barra de búsqueda inteligente */}
        <SmartSearch />
        
        <div 
          className={`${styles.menuIcon} ${isOpen ? styles.active : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
        
        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <Link 
            href="/" 
            className={styles.navLink}
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>
          
          {/* Menú de categorías desplegable */}
          <div 
            className={styles.categoriesContainer}
            ref={categoriesRef}
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
          >
            <button 
              className={styles.categoriesButton}
              onClick={() => setShowCategories(!showCategories)}
              aria-expanded={showCategories}
              aria-haspopup="true"
            >
              Categorías
              <svg 
                className={`${styles.arrow} ${showCategories ? styles.arrowUp : ''}`} 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {showCategories && (
              <div className={styles.categoriesDropdown}>
                <div className={styles.categoriesGrid}>
                  {categories.map(category => (
                    <Link 
                      key={category} 
                      href={`/${slugify(category)}`} 
                      className={styles.categoryLink}
                      onClick={() => {
                        setShowCategories(false);
                        setIsOpen(false);
                      }}
                    >
                      {category && category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
          </div>
      {/* Cart Icon */}
          <CartIcon />
    </nav>
  );
};

export default Navbar;