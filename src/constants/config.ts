export const config = {
  from: {
    blockchains: [
      "ETHEREUM_MAINNET_MAINNET",
      "ETHEREUM_TESTNET_GOERLI",
      "SOLANA_MAINNET_MAINNET",
      "SOLANA_TESTNET_TESTNET",
      "ARBITRUM_MAINNET_MAINNET",
      "BNB_MAINNET_MAINNET",
      "POLYGON_MAINNET_MAINNET",
      "OPTIMISM_MAINNET_MAINNET",
      "AVALANCHE_MAINNET_CCHAIN",
      "GNOSIS_MAINNET_MAINNET",
      "APTOS_MAINNET_MAINNET",
      "APTOS_TESTNET_TESTNET",
      "SUI_MAINNET_MAINNET",
      "SUI_TESTNET_TESTNET",
    ],
    tokens: [
      {
        blockchain: "ETHEREUM_MAINNET_MAINNET",
        address: null,
        symbol: "ETH",
      },
      {
        blockchain: "ETHEREUM_TESTNET_GOERLI",
        address: "0xdd69db25f6d620a7bad3023c5d32761d353d3de9",
        symbol: "ETH",
      },
      {
        blockchain: "BNB_MAINNET_MAINNET",
        address: null,
        symbol: "BNB",
      },
      {
        blockchain: "ARBITRUM_MAINNET_MAINNET",
        address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
        symbol: "ARB",
      },
      {
        blockchain: "POLYGON_MAINNET_MAINNET",
        address: null,
        symbol: "MATIC",
      },
      {
        blockchain: "OPTIMISM_MAINNET_MAINNET",
        address: "0x4200000000000000000000000000000000000042",
        symbol: "OP",
      },
      {
        blockchain: "AVALANCHE_MAINNET_CCHAIN",
        address: null,
        symbol: "AVAX",
      },
      {
        blockchain: "SOLANA_MAINNET_MAINNET",
        address: null,
        symbol: "SOL",
      },
      {
        blockchain: "SOLANA_TESTNET_TESTNET",
        address: null,
        symbol: "SOL",
      },
      {
        blockchain: "GNOSIS_MAINNET_MAINNET",
        address: "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
        symbol: "GNO",
      },
      {
        blockchain: "APTOS_MAINNET_MAINNET",
        address: null,
        symbol: "APT",
      },
      {
        blockchain: "APTOS_TESTNET_TESTNET",
        address: null,
        symbol: "APT",
      },
      {
        blockchain: "SUI_MAINNET_MAINNET",
        address: null,
        symbol: "SUI",
      },
      {
        blockchain: "SUI_TESTNET_TESTNET",
        address: null,
        symbol: "SUI",
      },
    ],
  },
  wallets: ["metamask", "bitget", "okx", "petra", "sui"],
  theme: {
    mode: "dark",
    colors: {
      dark: {
        background: "#f3e49d",
        primary: "#f1cab2",
        foreground: "#000",
        success: "#198754",
        surface: "#fff",
        neutral: "#fffcdf",
        warning: "#ffc107",
      },
    },
  },
  multiWallets: false,
};
