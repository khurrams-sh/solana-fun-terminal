'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          loginMethods: ['wallet', 'email'],
          appearance: {
            theme: 'dark',
            accentColor: '#4F46E5',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            requireUserPasswordOnCreate: false,
          },
          externalWallets: {
            solana: {
              connectors: toSolanaWalletConnectors(),
            },
          },
        }}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  );
}
