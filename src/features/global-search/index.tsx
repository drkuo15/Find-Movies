import { useSearchParams } from 'react-router-dom';
import Search from '../../components/search';

export default function GlobalSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const handleSearch = (value: string) => {
    const sanitizedValue = value.trim();
    setSearchParams(sanitizedValue ? { q: sanitizedValue } : {});
  };

  return (
    <Search
      placeholder="Search for a movie..."
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
