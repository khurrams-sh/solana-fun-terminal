'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const { user, logout } = usePrivy();
  const { wallets } = useSolanaWallets();

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🚀</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">FunTerminal</h1>
        </div>
        
        <nav className="flex items-center space-x-6 ml-8">
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            Discover
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Pulse
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Trackers
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Perpetuals
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Yield
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Vision
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Portfolio
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            Rewards
          </button>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-300">Connection is stable</span>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
          Deposit
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm text-gray-300">
            {wallets.length > 0 ? 
              `${wallets[0].address.slice(0, 4)}...${wallets[0].address.slice(-4)}` : 
              user?.email?.address?.slice(0, 10) + '...' || 'User'
            }
          </span>
          <button
            onClick={logout}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
