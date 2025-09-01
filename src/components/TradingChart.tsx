'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Token, MarketData } from './TradingTerminal';

interface TradingChartProps {
  token: Token;
  onMarketDataUpdate: (data: MarketData) => void;
}

interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function TradingChart({ token, onMarketDataUpdate }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [ohlcvData, setOhlcvData] = useState<OHLCVData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch historical OHLCV data from Birdeye
  const fetchOHLCVData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://public-api.birdeye.so/defi/ohlcv?address=${token.address}&type=1m&time_from=${Date.now() - 24 * 60 * 60 * 1000}&time_to=${Date.now()}`,
        {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.items) {
          const formattedData = data.data.items.map((item: {
            unixTime: number;
            o: number;
            h: number;
            l: number;
            c: number;
            v: number;
          }) => ({
            time: item.unixTime * 1000,
            open: item.o,
            high: item.h,
            low: item.l,
            close: item.c,
            volume: item.v,
          }));
          setOhlcvData(formattedData);
          
          if (formattedData.length > 0) {
            const latest = formattedData[formattedData.length - 1];
            const previous = formattedData[formattedData.length - 2];
            setCurrentPrice(latest.close);
            setPriceChange(previous ? ((latest.close - previous.close) / previous.close) * 100 : 0);
            
            const newMarketData = {
              price: latest.close,
              change24h: priceChange,
              volume24h: formattedData.reduce((sum, item) => sum + item.volume, 0),
              marketCap: 0, // Would need additional API call
            };
            setMarketData(newMarketData);
            onMarketDataUpdate(newMarketData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching OHLCV data:', error);
    } finally {
      setLoading(false);
    }
  }, [token.address, onMarketDataUpdate, priceChange]);

  // Subscribe to real-time price updates
  const subscribeToPrice = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket('wss://ws.birdeye.so');
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'SUBSCRIBE_PRICE',
        data: {
          queryType: 'simple',
          chartType: '1m',
          address: token.address,
          currency: 'usd',
        },
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PRICE_DATA' && data.data) {
          const priceData = data.data;
          setCurrentPrice(priceData.o); // Open price
          const change = priceData.pc || 0; // Price change
          setPriceChange(change);
          
          const newMarketData = {
            price: priceData.o,
            change24h: change,
            volume24h: priceData.v || 0,
            marketCap: 0, // Market cap would need separate API call
          };
          setMarketData(newMarketData);
          onMarketDataUpdate(newMarketData);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [token.address, onMarketDataUpdate]);

  useEffect(() => {
    fetchOHLCVData();
    subscribeToPrice();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token.address, fetchOHLCVData, subscribeToPrice]);

  // Simple candlestick chart implementation
  const renderChart = () => {
    if (loading || ohlcvData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading chart data...</p>
          </div>
        </div>
      );
    }

    const maxPrice = Math.max(...ohlcvData.map(d => d.high));
    const minPrice = Math.min(...ohlcvData.map(d => d.low));
    const priceRange = maxPrice - minPrice;
    const chartHeight = 400;
    const chartWidth = ohlcvData.length * 8;

    return (
      <div className="relative overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="min-w-full">
          {ohlcvData.map((candle, index) => {
            const x = index * 8 + 4;
            const bodyTop = ((maxPrice - Math.max(candle.open, candle.close)) / priceRange) * chartHeight;
            const bodyBottom = ((maxPrice - Math.min(candle.open, candle.close)) / priceRange) * chartHeight;
            const wickTop = ((maxPrice - candle.high) / priceRange) * chartHeight;
            const wickBottom = ((maxPrice - candle.low) / priceRange) * chartHeight;
            const isGreen = candle.close > candle.open;

            return (
              <g key={index}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={wickTop}
                  x2={x}
                  y2={wickBottom}
                  stroke={isGreen ? '#22c55e' : '#ef4444'}
                  strokeWidth={1}
                />
                {/* Body */}
                <rect
                  x={x - 2}
                  y={bodyTop}
                  width={4}
                  height={Math.max(1, bodyBottom - bodyTop)}
                  fill={isGreen ? '#22c55e' : '#ef4444'}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Chart Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold">{token.symbol}/USD</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-mono">${currentPrice.toFixed(4)}</span>
              <span className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700">1m</button>
            <button className="px-3 py-1 text-xs bg-blue-600 rounded">5m</button>
            <button className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700">15m</button>
            <button className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700">1h</button>
            <button className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700">4h</button>
            <button className="px-3 py-1 text-xs bg-gray-800 rounded hover:bg-gray-700">1d</button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartContainerRef} className="flex-1 bg-black">
        {renderChart()}
      </div>

      {/* Chart Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Volume 24h</span>
            <div className="font-mono">${(ohlcvData.reduce((sum, item) => sum + item.volume, 0) / 1000000).toFixed(2)}M</div>
          </div>
          <div>
            <span className="text-gray-400">High 24h</span>
            <div className="font-mono">${Math.max(...ohlcvData.map(d => d.high)).toFixed(4)}</div>
          </div>
          <div>
            <span className="text-gray-400">Low 24h</span>
            <div className="font-mono">${Math.min(...ohlcvData.map(d => d.low)).toFixed(4)}</div>
          </div>
          <div>
            <span className="text-gray-400">Market Cap</span>
            <div className="font-mono">
              {marketData?.marketCap ? `$${(marketData.marketCap / 1000000).toFixed(2)}M` : '--'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
