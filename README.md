# 🚀 FunTerminal - Solana Trading Made Easy

A modern, user-friendly trading terminal for Solana blockchain built with Next.js, TypeScript, and Tailwind CSS. Experience seamless trading with real-time charts, wallet integration, and an intuitive interface.

![FunTerminal Preview](https://via.placeholder.com/800x400/000000/FFFFFF?text=FunTerminal+Preview)

## ✨ Features

- **🔐 Wallet Integration**: Connect with Privy for secure wallet authentication
- **📊 Real-time Charts**: Live price charts powered by Birdeye API
- **💱 Instant Trading**: Buy/sell tokens using Jupiter DEX aggregator
- **🔍 Token Search**: Find and analyze any Solana token
- **📱 Portfolio Management**: Track your holdings and performance
- **⚡ Fast Transactions**: Execute trades with customizable slippage settings
- **📈 Market Data**: 24h volume, price changes, and market statistics
- **🎨 Modern UI**: Dark theme with responsive design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Wallet**: Privy.io for Solana wallet integration
- **DEX**: Jupiter Ultra API for token swaps
- **Charts**: Birdeye API for price data and real-time updates
- **Deployment**: Ready for Vercel/Netlify

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- A Solana-compatible wallet (Phantom, Solflare, etc.)
- API keys from required services (see below)

## 🔑 API Keys Setup

This project requires API keys from external services. Get them from:

### 1. Privy.io (Wallet Authentication)
- Sign up at [privy.io](https://privy.io)
- Create a new app in your dashboard
- Copy your App ID

### 2. Birdeye (Price Data & Charts)
- Sign up at [birdeye.so](https://birdeye.so)
- Get your API key from the developer dashboard

## 🚀 Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/funterminal.git
cd funterminal
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure your API keys in `.env.local`**
```bash
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
NEXT_PUBLIC_BIRDEYE_API_KEY=your_birdeye_api_key_here
```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Getting Started
1. **Connect Wallet**: Click "Connect Wallet" and choose your preferred Solana wallet
2. **Browse Tokens**: Use the search bar to find tokens or browse popular ones
3. **View Charts**: Analyze price movements with real-time candlestick charts
4. **Execute Trades**: Buy or sell tokens with customizable slippage settings

### Trading Features
- **Buy/Sell Toggle**: Switch between buying and selling modes
- **Slippage Control**: Set custom slippage tolerance (0.1% - 50%)
- **Real-time Quotes**: Get instant price quotes from Jupiter DEX
- **Route Optimization**: View the best trading routes and price impact
- **Transaction History**: Track your trading activity

### Chart Analysis
- **Multiple Timeframes**: 1m, 5m, 15m, 1h, 4h, 1d intervals
- **Price Indicators**: Current price, 24h change, volume data
- **Market Statistics**: High/low prices, market cap, volume metrics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Your Privy app ID | ✅ |
| `NEXT_PUBLIC_BIRDEYE_API_KEY` | Your Birdeye API key | ✅ |

### Customization

The terminal is highly customizable. Key files to modify:

- `src/components/TradingTerminal.tsx` - Main terminal component
- `src/components/TradingChart.tsx` - Chart customization
- `src/components/TradingPanel.tsx` - Trading interface
- `src/app/globals.css` - Global styles and themes

## 🔒 Security & API Keys

**Important Security Notes:**

- ✅ API keys are stored as environment variables (never in code)
- ✅ Users connect their own wallets (no private key storage)
- ✅ All transactions are signed client-side only
- ✅ No sensitive data is stored on our servers

**For Production:**
- Use environment-specific API keys
- Enable API key rate limiting
- Implement proper error handling
- Add transaction confirmation dialogs

## 📊 API Integrations

### Privy.io
- Handles wallet connection and authentication
- Supports multiple Solana wallets
- Manages embedded wallet creation

### Birdeye API
- Real-time price data and charts
- Historical OHLCV data
- WebSocket connections for live updates

### Jupiter DEX
- Token swap execution
- Route optimization
- Slippage protection
- MEV protection

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main page (update to use TradingTerminal)
│   ├── providers.tsx      # Privy and React Query providers
│   └── globals.css        # Global styles
├── components/
│   ├── TradingTerminal.tsx # Main trading interface
│   ├── TradingChart.tsx    # Price chart component
│   ├── TradingPanel.tsx    # Buy/sell panel
│   ├── TokenSearch.tsx     # Token search functionality
│   ├── WalletConnector.tsx # Wallet connection
│   ├── Portfolio.tsx       # Portfolio management
│   ├── TokenBalance.tsx    # Token balance display
│   ├── Header.tsx          # App header
│   └── Sidebar.tsx         # Navigation sidebar
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app works with any platform supporting Next.js:
- Netlify
- Railway
- Render
- Self-hosted

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This is a trading interface for educational and development purposes. Always do your own research before trading. Cryptocurrency trading involves risk of loss.

## 📞 Support

- Create an issue on GitHub
- Check the documentation
- Join our Discord community

---

**Built with ❤️ for the Solana ecosystem**
