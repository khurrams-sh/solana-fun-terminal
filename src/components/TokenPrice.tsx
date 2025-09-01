'use client';

import { useState, useEffect } from 'react';

interface TokenPriceProps {
  tokenAddress: string;
}

interface PriceData {
  price: number;
  priceChange24h: number;
}

export function TokenPrice({ tokenAddress }: TokenPriceProps) {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://public-api.birdeye.so/defi/price?address=${tokenAddress}`,
          {
            headers: {
              'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setPriceData({
              price: data.data.value || 0,
              priceChange24h: data.data.priceChange24h || 0,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="text-right">
        <div className="text-sm font-mono text-gray-500">Loading...</div>
        <div className="text-xs text-gray-500">--</div>
      </div>
    );
  }

  if (!priceData) {
    return (
      <div className="text-right">
        <div className="text-sm font-mono text-gray-500">--</div>
        <div className="text-xs text-gray-500">--</div>
      </div>
    );
  }

  return (
    <div className="text-right">
      <div className="text-sm font-mono">
        ${priceData.price < 0.01 ? priceData.price.toExponential(2) : priceData.price.toFixed(4)}
      </div>
      <div className={`text-xs ${priceData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {priceData.priceChange24h >= 0 ? '+' : ''}{priceData.priceChange24h.toFixed(2)}%
      </div>
    </div>
  );
}
