'use client';

import { useSendTransaction, useSolanaWallets } from '@privy-io/react-auth/solana';
import { Transaction } from '@solana/web3.js';

interface SwapExecutorProps {
  orderData: any;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function SwapExecutor({ orderData, onSuccess, onError }: SwapExecutorProps) {
  const { sendTransaction } = useSendTransaction();
  const { wallets } = useSolanaWallets();

  const executeSwap = async () => {
    try {
      if (!orderData || !wallets.length) {
        throw new Error('No order data or wallet found');
      }

      // Find the first wallet (embedded or EOA)
      const wallet = wallets[0];
      
      // Deserialize the transaction from Jupiter
      const transaction = Transaction.from(Buffer.from(orderData.transaction, 'base64'));

      // Send the transaction using Privy
      const signature = await sendTransaction({
        transaction,
        address: wallet.address,
      });

      console.log('Transaction sent:', signature);
      onSuccess();
    } catch (error) {
      console.error('Error executing swap:', error);
      onError(error as Error);
    }
  };

  return { executeSwap };
}
