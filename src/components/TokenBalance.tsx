'use client';

import { useState, useEffect } from 'react';
import { useSolanaWallets } from '@privy-io/react-auth/solana';

interface TokenBalanceProps {
  tokenAddress: string;
}

export function TokenBalance({ tokenAddress }: TokenBalanceProps) {
  const { wallets } = useSolanaWallets();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallets.length) {
        setBalance(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://lite-api.jup.ag/ultra/v1/balances/${wallets[0].address}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.balances) {
            const tokenBalance = data.balances.find((b: any) => b.mint === tokenAddress);
            setBalance(tokenBalance ? tokenBalance.uiAmount : 0);
          }
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [tokenAddress, wallets]);

  if (loading) {
    return <span className="text-sm text-gray-400">Balance: ...</span>;
  }

  return (
    <span className="text-sm text-gray-400">
      Balance: {balance !== null ? balance.toFixed(6) : '0.00'}
    </span>
  );
}
