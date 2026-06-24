// components/SearchBar.tsx
import { Search, Loader2, X, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { searchIndicators, getSearchSuggestions, type SearchResult } from '../services/searchService';

interface SearchBarProps {
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  theme?: 'dark' | 'light';
  inputClassName?: string;
}

export function SearchBar({
  onSelect,
  placeholder = "Buscar indicador...",
  className = "",
  theme = 'dark',
  inputClassName = "",
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout>();

  const isLight = theme === 'light';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchIndicators(searchQuery);
      setResults(searchResults);
      setShowResults(searchResults.length > 0);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (value: string) => {
    setQuery(value);
    setShowResults(false);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim().length >= 2) {
      const sugg = await getSearchSuggestions(value);
      setSuggestions(sugg);
      
      searchTimeout.current = setTimeout(() => {
        handleSearch(value);
      }, 500);
    } else {
      setSuggestions([]);
      setResults([]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    setQuery(result.text);
    setShowResults(false);
    setResults([]);
    setSuggestions([]);
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    setResults([]);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch(query);
            }
          }}
          placeholder={placeholder}
          className={`
            w-full rounded-xl px-4 py-3.5 pl-11 pr-10 text-sm transition-all
            focus:outline-none focus:border-[#008b8b]/60 focus:ring-1 focus:ring-[#008b8b]/30
            ${isLight
              ? 'warm-input text-[#1a100a] placeholder:text-[rgba(26,16,10,0.35)]'
              : 'bg-white/5 border border-white/10 text-white placeholder:text-white/30'
            }
            ${inputClassName}
          `}
        />
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-muted)' }}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            type="button"
          >
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
        {isLoading && (
          <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
        )}
      </div>

      {/* Sugerencias */}
      {suggestions.length > 0 && !showResults && (
        <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: isLight ? '#ffffff' : 'rgba(11, 22, 31, 0.98)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,139,139,0.3)',
            boxShadow: isLight
              ? '0 12px 40px rgba(0,0,0,0.10)'
              : '0 12px 40px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="p-2">
            <p className="text-[10px] tracking-widest uppercase font-medium px-3 py-1.5"
              style={{ color: 'var(--text-muted)' }}>
              Sugerencias
            </p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Sparkles size={12} className="inline mr-2" style={{ color: '#008b8b' }} />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: isLight ? '#ffffff' : 'rgba(11, 22, 31, 0.98)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,139,139,0.3)',
            boxShadow: isLight
              ? '0 12px 40px rgba(0,0,0,0.10)'
              : '0 12px 40px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(16px)',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="text-[10px] tracking-widest uppercase font-medium"
                style={{ color: 'var(--text-muted)' }}>
                Resultados ({results.length})
              </p>
              <button
                onClick={clearSearch}
                className="text-xs px-2 py-1 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                Cerrar
              </button>
            </div>
            {results.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full text-left px-3 py-2.5 rounded-lg transition-all hover:bg-white/5 group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #2e5871, #008b8b)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {result.text}
                    </p>
                    {result.category && (
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Categoría: {result.category}
                      </p>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        background: 'rgba(0,139,139,0.1)',
                        color: '#008b8b'
                      }}>
                      Seleccionar
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}