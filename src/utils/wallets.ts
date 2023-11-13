import { onboarding } from "@dydxprotocol/v4-client-js";

export type EvmAddress = `0x${string}`;
export type MycelAddress = `mycel${string}`;

export type PrivateInformation = ReturnType<typeof onboarding.deriveHDKeyFromEthereumSignature>;

export const MYCEL_CHAIN_INFO = {
  rpc: import.meta.env.VITE_WS_TENDERMINT ?? "",
  rest: import.meta.env.VITE_WS_TENDERMINT ?? "",
  chainId: import.meta.env.VITE_CHAIN_ID ?? "",
  currencies: [],
};
