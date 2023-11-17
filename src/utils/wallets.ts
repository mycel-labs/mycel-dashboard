import { onboarding } from "@dydxprotocol/v4-client-js";

export type EvmAddress = `0x${string}`;
export type MycelAddress = `mycel${string}`;

export type PrivateInformation = ReturnType<typeof onboarding.deriveHDKeyFromEthereumSignature>;

export const BECH32_PREFIX = "mycel";

export const MYCEL_CHAIN_INFO = {
  rpc: import.meta.env.VITE_WS_TENDERMINT ?? "",
  rest: import.meta.env.VITE_WS_TENDERMINT ?? "",
  chainId: import.meta.env.VITE_CHAIN_ID ?? "",
  currencies: [],
};

export const WALLET_CONFIG = {
  // BitKeep: {
  //   chainType: 'cosmos',
  //   name: 'BITKEEP'
  // },
  // BitPie: {
  //   chainType: 'cosmos',
  //   name:"BITPIE"
  // },
  // CloverWallet = "CLOVER_WALLET",
  // CoinbaseWallet = "COINBASE_WALLET",
  // Coin98 = "COIN98",
  // HuobiWallet = "HUOBI_WALLET",
  // ImToken = "IMTOKEN",
  Keplr: {
    id: "keplr",
    name: "KEPLR",
    chainType: "cosmos",
  },
  // Ledger = 'LEDGER',
  // MathWallet = "MATH_WALLET",
  MetaMask: {
    id: "metaMask",
    name: "MetaMask",
    chainType: "evm",
  },
  // Rainbow = "RAINBOW_WALLET",
  // TokenPocket = "TOKEN_POCKET",
  // TrustWallet = "TRUST_WALLET",
  // WalletConnect2 = "WALLETCONNECT_2",
  Injected: {
    id: "injected",
    name: "Injected",
    chainType: "evm",
  },
};

export type WalletType = keyof typeof WALLET_CONFIG;

export const getSignTypedData = () =>
  ({
    primaryType: "mycel",
    domain: {
      name: "Mycel Chain",
    },
    types: {
      mycel: [{ name: "action", type: "string" }],
    },
    message: {
      action: "Mycel Chain Authentication",
    },
  }) as const;

export const shortAddress = (address: string | undefined) => {
  if (!address) return "";
  return `${address.slice(0, 8)}...${address.slice(-4)}`;
};
