'use client';

import { useState, useEffect } from 'react';
import { useSolanaWallets, useSendTransaction } from '@privy-io/react-auth/solana';
import { Transaction } from '@solana/web3.js';
import { ArrowUpDown, Zap, Settings } from 'lucide-react';
import { Token, MarketData } from './TradingTerminal';
import { TokenBalance } from './TokenBalance';

interface TradingPanelProps {
  selectedToken: Token;
  marketData: MarketData | null;
}

export function TradingPanel({ selectedToken, marketData }: TradingPanelProps) {
  const { wallets } = useSolanaWallets();
  const { sendTransaction } = useSendTransaction();
  const [amount, setAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [swapDirection, setSwapDirection] = useState<'buy' | 'sell'>('buy');

  const inputToken = swapDirection === 'buy' 
    ? { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', decimals: 6 }
    : selectedToken;
  
  const outputToken = swapDirection === 'buy' 
    ? selectedToken 
    : { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', decimals: 6 };

  // Get quote from Jupiter Ultra API
  const getQuote = async () => {
    if (!amount || !wallets.length) return;

    try {
      const amountInSmallestUnit = Math.floor(parseFloat(amount) * Math.pow(10, inputToken.decimals));
      
      const response = await fetch(
        `https://lite-api.jup.ag/ultra/v1/order?inputMint=${inputToken.address}&outputMint=${outputToken.address}&amount=${amountInSmallestUnit}&taker=${wallets[0].address}&slippageBps=${Math.floor(slippage * 100)}`
      );

      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
        const outputAmountFormatted = parseFloat(data.outAmount) / Math.pow(10, outputToken.decimals);
        setOutputAmount(outputAmountFormatted.toFixed(6));
      }
    } catch (error) {
      console.error('Error getting quote:', error);
    }
  };

  // Execute swap
  const executeSwap = async () => {
    if (!orderData || !wallets.length) return;

    setIsSwapping(true);
    try {
      // Deserialize the transaction from Jupiter
      const transaction = Transaction.from(Buffer.from(orderData.transaction, 'base64'));

      // Send the transaction using Privy - it handles signing automatically
      const signature = await sendTransaction({
        transaction,
        address: wallets[0].address,
      });

      console.log('Swap executed with signature:', signature);
      
      // Handle successful swap
      setAmount('');
      setOutputAmount('');
      setOrderData(null);
    } catch (error) {
      console.error('Error executing swap:', error);
    } finally {
      setIsSwapping(false);
    }
  };

  useEffect(() => {
    const delayedQuote = setTimeout(() => {
      if (amount) {
        getQuote();
      }
    }, 500);

    return () => clearTimeout(delayedQuote);
  }, [amount, inputToken.address, outputToken.address, slippage]);

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Trading Panel Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Trade</h3>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSwapDirection('buy')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              swapDirection === 'buy'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setSwapDirection('sell')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              swapDirection === 'sell'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sell
          </button>
        </div>
      </div>

      {/* Trading Form */}
      <div className="flex-1 p-4 space-y-4">
        {/* Input Token */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You pay</span>
            <TokenBalance tokenAddress={inputToken.address} />
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-xl font-mono focus:outline-none"
            />
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{inputToken.symbol.slice(0, 2)}</span>
              </div>
              <span className="font-medium">{inputToken.symbol}</span>
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setSwapDirection(swapDirection === 'buy' ? 'sell' : 'buy')}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Output Token */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You receive</span>
            <TokenBalance tokenAddress={outputToken.address} />
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="0.00"
              value={outputAmount}
              readOnly
              className="flex-1 bg-transparent text-xl font-mono focus:outline-none text-gray-300"
            />
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{outputToken.symbol.slice(0, 2)}</span>
              </div>
              <span className="font-medium">{outputToken.symbol}</span>
            </div>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Slippage Tolerance</span>
            <span className="text-sm font-mono">{slippage}%</span>
          </div>
          <div className="flex space-x-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  slippage === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {value}%
              </button>
            ))}
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Order Info */}
        {orderData && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Route</span>
              <span className="text-blue-400">{orderData.router}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Impact</span>
              <span className={`${orderData.priceImpact > 1 ? 'text-red-400' : 'text-green-400'}`}>
                {orderData.priceImpact?.toFixed(3)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network Fee</span>
              <span className="text-gray-300">
                {(orderData.prioritizationFeeLamports / 1e9).toFixed(6)} SOL
              </span>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <button
          onClick={executeSwap}
          disabled={!orderData || isSwapping || !amount}
          className={`w-full py-3 rounded-lg font-medium transition-all ${
            swapDirection === 'buy'
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-700'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-gray-700'
          } disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
        >
          {isSwapping ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Swapping...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>{swapDirection === 'buy' ? 'Buy' : 'Sell'} {selectedToken.symbol}</span>
            </>
          )}
        </button>

        {/* Market Info */}
        {marketData && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 text-gray-300">Market Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Price</span>
                <span className="font-mono">${marketData.price.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className={`font-mono ${marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">24h Volume</span>
                <span className="font-mono">${(marketData.volume24h / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
