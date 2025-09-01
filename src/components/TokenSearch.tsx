'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Token } from './TradingTerminal';

interface TokenSearchProps {
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
}

interface JupiterToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export function TokenSearch({ selectedToken, onTokenSelect }: TokenSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchTokens = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search using Jupiter's token list
      const response = await fetch('https://tokens.jup.ag/tokens?tags=verified,strict');
      
      if (response.ok) {
        const tokens = await response.json();
        const filtered = tokens.filter((token: JupiterToken) =>
          token.symbol.toLowerCase().includes(query.toLowerCase()) ||
          token.name.toLowerCase().includes(query.toLowerCase()) ||
          token.address.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

        setSearchResults(filtered.map((token: JupiterToken) => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          logoURI: token.logoURI
        })));
      }
    } catch (error) {
      console.error('Error searching tokens:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchTokens(searchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">{selectedToken.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">{selectedToken.symbol}</h3>
            <p className="text-sm text-gray-400">{selectedToken.name}</p>
          </div>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onTokenSelect(token);
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{token.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{token.symbol}</div>
                    <div className="text-xs text-gray-400">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              No tokens found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
