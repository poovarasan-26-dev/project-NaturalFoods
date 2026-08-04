import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <form className="nf-search-form nf-search-full" onSubmit={handleSubmit}>
      <FiSearch className="nf-search-icon" />
      <input
        type="text"
        placeholder="Search products, categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="nf-search-input"
      />
      {query && (
        <button type="button" className="nf-search-clear" onClick={handleClear}>
          <FiX />
        </button>
      )}
    </form>
  );
}
