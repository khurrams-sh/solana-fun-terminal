'use client';

import { useState } from 'react';
import { TrendingUp, Wallet, Search, Star, BarChart3 } from 'lucide-react';
import { Token } from './TradingTerminal';
import { TokenPrice } from './TokenPrice';

interface SidebarProps {
  activeView: 'trade' | 'portfolio';
  setActiveView: (view: 'trade' | 'portfolio') => void;
  selectedToken: Token;
  setSelectedToken: (token: Token) => void;
}

const popularTokens = [
  { address: 'So11111111111111111111111111111111111111112', symbol: 'SOL', name: 'Solana', decimals: 9 },
  { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', symbol: 'USDT', name: 'Tether USD', decimals: 6 },
  { address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', symbol: 'mSOL', name: 'Marinade SOL', decimals: 9 },
  { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk', decimals: 5 },
];

export function Sidebar({ activeView, setActiveView, selectedToken, setSelectedToken }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Navigation */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('trade')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors ${
              activeView === 'trade' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trade</span>
          </button>
          <button
            onClick={() => setActiveView('portfolio')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-colors ${
              activeView === 'portfolio' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Portfolio</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by token or CA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Trending Tokens */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-300">Trending</h3>
            <div className="flex space-x-1">
              <button className="px-2 py-1 text-xs bg-gray-800 rounded">1m</button>
              <button className="px-2 py-1 text-xs bg-blue-600 rounded">5m</button>
              <button className="px-2 py-1 text-xs bg-gray-800 rounded">30m</button>
              <button className="px-2 py-1 text-xs bg-gray-800 rounded">1h</button>
            </div>
          </div>

          <div className="space-y-2">
            {popularTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => setSelectedToken(token)}
                className={`w-full p-3 rounded-lg border transition-all hover:border-gray-600 ${
                  selectedToken.address === token.address
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{token.symbol.slice(0, 2)}</span>
                      </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{token.symbol}</div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <TokenPrice tokenAddress={token.address} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Global</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Markets Open</span>
          </div>
        </div>
      </div>
    </div>
  );
}
