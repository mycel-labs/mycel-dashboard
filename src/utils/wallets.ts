import { onboarding } from "@dydxprotocol/v4-client-js";
import { ChainInfo } from "@keplr-wallet/types";

export type EvmAddress = `0x${string}`;
export type MycelAddress = `mycel${string}`;

export type PrivateInformation = ReturnType<typeof onboarding.deriveHDKeyFromEthereumSignature>;

export const BECH32_PREFIX = "mycel";

export const MYCEL_CHAIN_INFO: ChainInfo = {
  rpc: import.meta.env.VITE_WS_TENDERMINT ?? "",
  rest: import.meta.env.VITE_WS_TENDERMINT ?? "",
  chainId: import.meta.env.VITE_CHAIN_ID ?? "",
  chainName: import.meta.env.VITE_CHAIN_NAME ?? "",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: BECH32_PREFIX,
    bech32PrefixAccPub: BECH32_PREFIX + "pub",
    bech32PrefixValAddr: BECH32_PREFIX + "valoper",
    bech32PrefixValPub: BECH32_PREFIX + "valoperpub",
    bech32PrefixConsAddr: BECH32_PREFIX + "valcons",
    bech32PrefixConsPub: BECH32_PREFIX + "valconspub",
  },
  currencies: [
    {
      coinDenom: "MYCEL",
      coinMinimalDenom: "umycel",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "MYCEL",
      coinMinimalDenom: "umycel",
      coinDecimals: 6,
    },
  ],
  stakeCurrency: {
    coinDenom: "MYCEL",
    coinMinimalDenom: "umycel",
    coinDecimals: 6,
  },
  beta: true,
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
