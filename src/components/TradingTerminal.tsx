'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { TradingChart } from './TradingChart';
import { TradingPanel } from './TradingPanel';
import { Portfolio } from './Portfolio';
import { TokenSearch } from './TokenSearch';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { WalletConnector } from './WalletConnector';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface MarketData {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export default function TradingTerminal() {
  const { ready, authenticated } = usePrivy();
  const [selectedToken, setSelectedToken] = useState<Token>({
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
  });
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [activeView, setActiveView] = useState<'trade' | 'portfolio'>('trade');

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            FunTerminal 🚀
          </h1>
          <p className="text-gray-400 mb-8">Solana Trading Made Easy & Fun</p>
          <div className="space-y-4">
            <p className="text-gray-300 mb-4">Connect your wallet to start trading</p>
            <WalletConnector />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {activeView === 'trade' ? (
            <div className="flex h-full">
              {/* Chart Area */}
              <div className="flex-1 flex flex-col border-r border-gray-800">
                <div className="p-4 border-b border-gray-800">
                  <TokenSearch 
                    selectedToken={selectedToken}
                    onTokenSelect={setSelectedToken}
                  />
                </div>
                <div className="flex-1">
                  <TradingChart 
                    token={selectedToken}
                    onMarketDataUpdate={setMarketData}
                  />
                </div>
              </div>

              {/* Trading Panel */}
              <div className="w-80 border-l border-gray-800">
                <TradingPanel 
                  selectedToken={selectedToken}
                  marketData={marketData}
                />
              </div>
            </div>
          ) : (
            <Portfolio />
          )}
        </div>
      </div>
    </div>
  );
}
