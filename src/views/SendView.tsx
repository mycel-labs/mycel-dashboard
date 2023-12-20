import { Send } from 'lucide-react'
import { Widget } from 'mycel-widget'
import { env } from '@/env'

const config = {
  from: {
    blockchains: [
      'ETHEREUM_MAINNET_MAINNET',
      'ETHEREUM_TESTNET_GOERLI',
      'SOLANA_MAINNET_MAINNET',
      'SOLANA_TESTNET_TESTNET',
      'ARBITRUM_MAINNET_MAINNET',
      'ARBITRUM_TESTNET_GOERLI',
      'BNB_MAINNET_MAINNET',
      'BNB_TESTNET_TESTNET',
      'POLYGON_MAINNET_MAINNET',
      'POLYGON_TESTNET_MUMBAI',
      'OPTIMISM_MAINNET_MAINNET',
      'OPTIMISM_TESTNET_GOERLI',
      'AVALANCHE_MAINNET_CCHAIN',
      'AVALANCHE_TESTNET_FUJI',
      'GNOSIS_MAINNET_MAINNET',
      'GNOSIS_TESTNET_CHIADO',
      'APTOS_MAINNET_MAINNET',
      'APTOS_TESTNET_TESTNET',
      'SUI_MAINNET_MAINNET',
      'SUI_TESTNET_TESTNET',
      'SHARDEUM_BETANET_SPHINX',
      'ZETA_TESTNET_ATHENS',
    ],
    tokens: [
      {
        blockchain: 'ETHEREUM_MAINNET_MAINNET',
        address: null,
        symbol: 'ETH',
      },
      {
        blockchain: 'ETHEREUM_TESTNET_GOERLI',
        address: '0xdd69db25f6d620a7bad3023c5d32761d353d3de9',
        symbol: 'ETH',
      },
      {
        blockchain: 'BNB_MAINNET_MAINNET',
        address: null,
        symbol: 'BNB',
      },
      {
        blockchain: 'BNB_TESTNET_TESTNET',
        address: null,
        symbol: 'BNB',
      },
      {
        blockchain: 'ARBITRUM_MAINNET_MAINNET',
        address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
        symbol: 'ARB',
      },
      {
        blockchain: 'ARBITRUM_TESTNET_GOERLI',
        address: null,
        symbol: 'ARB',
      },
      {
        blockchain: 'POLYGON_MAINNET_MAINNET',
        address: null,
        symbol: 'MATIC',
      },
      {
        blockchain: 'POLYGON_TESTNET_MUMBAI',
        address: null,
        symbol: 'MATIC',
      },
      {
        blockchain: 'OPTIMISM_MAINNET_MAINNET',
        address: '0x4200000000000000000000000000000000000042',
        symbol: 'OP',
      },
      {
        blockchain: 'OPTIMISM_TESTNET_GOERLI',
        address: null,
        symbol: 'OP',
      },
      {
        blockchain: 'AVALANCHE_MAINNET_CCHAIN',
        address: null,
        symbol: 'AVAX',
      },
      {
        blockchain: 'AVALANCHE_TESTNET_FUJI',
        address: null,
        symbol: 'AVAX',
      },
      {
        blockchain: 'SOLANA_MAINNET_MAINNET',
        address: null,
        symbol: 'SOL',
      },
      {
        blockchain: 'SOLANA_TESTNET_TESTNET',
        address: null,
        symbol: 'SOL',
      },
      {
        blockchain: 'GNOSIS_MAINNET_MAINNET',
        address: null,
        symbol: 'GNO',
      },
      {
        blockchain: 'GNOSIS_TESTNET_CHIADO',
        address: null,
        symbol: 'XDAI',
      },
      {
        blockchain: 'APTOS_MAINNET_MAINNET',
        address: null,
        symbol: 'APT',
      },
      {
        blockchain: 'APTOS_TESTNET_TESTNET',
        address: null,
        symbol: 'APT',
      },
      {
        blockchain: 'SUI_MAINNET_MAINNET',
        address: null,
        symbol: 'SUI',
      },
      {
        blockchain: 'SUI_TESTNET_TESTNET',
        address: null,
        symbol: 'SUI',
      },
      {
        blockchain: 'SHARDEUM_BETANET_SPHINX',
        address: null,
        symbol: 'SHM',
      },
      {
        blockchain: 'ZETA_TESTNET_ATHENS',
        address: null,
        symbol: 'aZETA',
      },
    ],
  },
  wallets: ['metamask', 'bitget', 'okx', 'phantom', 'petra'],
  theme: {
    mode: 'dark',
    colors: {
      dark: {
        background: '#fffcdf',
        primary: '#f1cab2',
        foreground: '#000',
        success: '#198754',
        surface: '#fff',
        neutral: '#fffcdf',
        warning: '#ffc107',
      },
    },
  },
  multiWallets: false,
  mycelEnv: env,
}

export default function SendView() {
  return (
    <div>
      <div className="container my-12 widget">
        <h2 className="font-cursive text-3xl text-black font-semibold mb-6 flex items-center justify-center">
          <Send className="opacity-70 mr-2" size={28} />
          Send Token
        </h2>
        <Widget config={config} />
      </div>
    </div>
  )
}
