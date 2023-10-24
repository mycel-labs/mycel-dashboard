export const config = {
  from: {
    blockchains: [
      "SOLANA",
      "SOLANA_TESTNET",
      "ARBITRUM",
      "ETH",
      "GETH",
      "BSC",
      "POLYGON",
      "OPTIMISM",
      "AVAX_CCHAIN",
      "BTC",
      "GNOSIS",
      "APTOS",
      "APTOS_TESTNET",
      "SUI",
      "SUI_TESTNET",
    ],
    tokens: [
      {
        blockchain: "ETH",
        address: null,
        symbol: "ETH",
      },
      {
        blockchain: "ETH",
        address: "0xdd69db25f6d620a7bad3023c5d32761d353d3de9",
        symbol: "GETH",
      },
      {
        blockchain: "GETH",
        address: "0xdd69db25f6d620a7bad3023c5d32761d353d3de9",
        symbol: "GETH",
      },
      {
        blockchain: "BSC",
        address: null,
        symbol: "BNB",
      },
      {
        blockchain: "ARBITRUM",
        address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
        symbol: "ARB",
      },
      {
        blockchain: "POLYGON",
        address: null,
        symbol: "MATIC",
      },
      {
        blockchain: "OPTIMISM",
        address: "0x4200000000000000000000000000000000000042",
        symbol: "OP",
      },
      {
        blockchain: "AVAX_CCHAIN",
        address: null,
        symbol: "AVAX",
      },
      {
        blockchain: "BTC",
        address: null,
        symbol: "BTC",
      },
      {
        blockchain: "SOLANA",
        address: null,
        symbol: "SOL",
      },
      {
        blockchain: "SOLANA_TESTNET",
        address: null,
        symbol: "SOL",
      },
      {
        blockchain: "GNOSIS",
        address: "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
        symbol: "GNO",
      },
      {
        blockchain: "APTOS",
        address: null,
        symbol: "APT",
      },
      {
        blockchain: "APTOS_TESTNET",
        address: null,
        symbol: "APT",
      },
      {
        blockchain: "SUI",
        address: null,
        symbol: "SUI",
      },
      {
        blockchain: "SUI_TESTNET",
        address: null,
        symbol: "SUI",
      },
    ],
  },
  wallets: ["metamask", "bitget"],
  theme: {
    mode: "dark",
    colors: {
      dark: {
        background: "#f3e49d",
        // background: "#fffcdf",
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
  apiKey: "c6381a79-2817-4602-83bf-6a641a409e32",
};
