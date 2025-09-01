'use client';

import { useLogin } from '@privy-io/react-auth';
import { Wallet, Mail, ArrowRight } from 'lucide-react';

export function WalletConnector() {
  const { login } = useLogin({
    onError: (error) => {
      console.error('Login error:', error);
    },
    onComplete: () => {
      // User successfully logged in
    }
  });



  return (
    <div className="space-y-4 max-w-md mx-auto">
      <button
        onClick={() => login()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 group"
      >
        <Wallet className="w-5 h-5" />
        <span>Connect Wallet</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1 h-px bg-gray-700"></div>
        <span className="text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-700"></div>
      </div>
      
      <button
        onClick={() => login()}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 group"
      >
        <Mail className="w-5 h-5" />
        <span>Continue with Email</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        New to crypto? We&apos;ll create a wallet for you automatically
      </p>
    </div>
  );
}
