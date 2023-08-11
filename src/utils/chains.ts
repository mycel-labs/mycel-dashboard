import { Chain } from "@wagmi/chains";
import { RegistryWalletRecordType } from "mycel-client-ts/mycel.registry/rest";

import {
  mainnet,
  sepolia,
  goerli,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
  avalanche,
  avalancheFuji,
  gnosis,
  gnosisChiado,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  shardeumSphinx,
} from "wagmi/chains";

const zetaAthens: Chain = {
  id: 7001,
  name: "Zeta Athens 3",
  network: "zeta-athens-3",
  nativeCurrency: { name: "aZeta", symbol: "aZETA", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
    public: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    default: { name: "ZetaScan", url: "https://athens3.explorer.zetachain.com/ " },
  },
};

export const chains: Chain[] = [
  mainnet,
  sepolia,
  goerli,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
  avalanche,
  avalancheFuji,
  gnosis,
  gnosisChiado,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  shardeumSphinx,
  zetaAthens,
];

export const getConnectedWalletRecordType = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return RegistryWalletRecordType.ETHEREUM_MAINNET;
    case goerli.id:
      return RegistryWalletRecordType.ETHEREUM_GOERLI;
    case sepolia.id:
      return RegistryWalletRecordType.ETHEREUM_SEPOLIA;
    case polygon.id:
      return RegistryWalletRecordType.POLYGON_MAINNET;
    case polygonMumbai.id:
      return RegistryWalletRecordType.POLYGON_MUMBAI;
    case bsc.id:
      return RegistryWalletRecordType.BNB_MAINNET;
    case bscTestnet.id:
      return RegistryWalletRecordType.BNB_TESTNET;
    case avalanche.id:
      return RegistryWalletRecordType.AVALANCHE_CCHAIN;
    case avalancheFuji.id:
      return RegistryWalletRecordType.AVALANCHE_FUJI;
    case gnosis.id:
      return RegistryWalletRecordType.GNOSIS_MAINNET;
    case gnosisChiado.id:
      return RegistryWalletRecordType.GNOSIS_CHIADO;
    case optimism.id:
      return RegistryWalletRecordType.OPTIMISM_MAINNET;
    case optimismGoerli.id:
      return RegistryWalletRecordType.OPTIMISM_GOERLI;
    case arbitrum.id:
      return RegistryWalletRecordType.ARBITRUM_MAINNET;
    case arbitrumGoerli.id:
      return RegistryWalletRecordType.ARBITRUM_GOERLI;
    case shardeumSphinx.id:
      return RegistryWalletRecordType.SHARDEUM_BETANET;
    case zetaAthens.id:
      return RegistryWalletRecordType.ZETA_TESTNET;
    default:
      throw new Error(`Unknown chainId: ${chainId}`);
  }
};
