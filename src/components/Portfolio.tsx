'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { Wallet, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface Balance {
  mint: string;
  symbol: string;
  amount: number;
  uiAmount: number;
  decimals: number;
  usdValue: number;
}

export function Portfolio() {
  const { wallets } = useSolanaWallets();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!wallets.length) return;

    try {
      setRefreshing(true);
      const response = await fetch(
        `https://lite-api.jup.ag/ultra/v1/balances/${wallets[0].address}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.balances) {
          setBalances(data.balances);
          const total = data.balances.reduce((sum: number, balance: Balance) => sum + balance.usdValue, 0);
          setTotalValue(total);
        }
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [wallets]);

  useEffect(() => {
    fetchBalances();
  }, [wallets, fetchBalances]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Portfolio Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <button
            onClick={fetchBalances}
            disabled={refreshing}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Total Value</span>
            </div>
            <div className="text-2xl font-bold font-mono">${totalValue.toFixed(2)}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">24h P&L</span>
            </div>
            <div className="text-2xl font-bold font-mono text-gray-400">--</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Assets</span>
            </div>
            <div className="text-2xl font-bold font-mono">{balances.length}</div>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Holdings</h3>
          
          {balances.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tokens found in your wallet</p>
              <p className="text-sm text-gray-500 mt-2">
                Start trading to see your holdings here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {balances.map((balance, index) => (
                <div
                  key={`${balance.mint}-${index}`}
                  className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">
                          {balance.symbol?.slice(0, 2) || 'TK'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{balance.symbol || 'Unknown'}</div>
                        <div className="text-sm text-gray-400">
                          {balance.mint.slice(0, 8)}...{balance.mint.slice(-8)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-medium">
                        {balance.uiAmount.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-400 font-mono">
                        ${balance.usdValue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
