import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import Search from '../../components/search';

function GlobalSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();
  const location = useLocation();

  const debouncedUpdateSearchQuery = useDebounce((value: string) => {
    const sanitizedValue = value.trim();
    if (location.pathname !== '/') {
      navigate(`/?q=${encodeURIComponent(sanitizedValue)}`);
      return;
    }
    setSearchParams(sanitizedValue ? { q: sanitizedValue } : {});
  }, 500);

  const handleSearch = (value: string) => {
    setInputValue(value);
    debouncedUpdateSearchQuery(value);
  };

  return (
    <Search
      placeholder="Search for a movie..."
      value={inputValue}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}

export default GlobalSearch;
