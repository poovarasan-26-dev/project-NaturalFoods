import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import { getProducts, getCategories } from '../services/cart';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.results || res.data || []);
      } catch {
        // silent
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        const res = await getProducts(params);
        setProducts(res.data.results || res.data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategoryFilter = (slug) => {
    const params = new URLSearchParams();
    if (slug) {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  return (
    <div className="nf-page">
      <section className="nf-page-header">
        <div className="nf-container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Fresh organic foods delivered to your doorstep
          </motion.p>
        </div>
      </section>

      <section className="nf-section">
        <div className="nf-container">
          <div className="nf-products-toolbar">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>

          <div className="nf-category-filters">
            <button
              className={`nf-category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`nf-category-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage={searchQuery || selectedCategory ? 'No products match your filters.' : 'No products available yet.'}
          />
        </div>
      </section>
    </div>
  );
}
