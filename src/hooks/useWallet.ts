import { useCallback, useEffect, useState, useMemo } from "react";
import { useStore } from "@/store/index";
import {
  useConnect as useConnectWagmi,
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  // usePublicClient as usePublicClientWagmi,
  useWalletClient as useWalletClientWagmi,
} from "wagmi";
import {
  useSuggestChainAndConnect as useConnectGraz,
  useAccount as useAccountGraz,
  useDisconnect as useDisconnectGraz,
  useOfflineSigners as useOfflineSignersGraz,
  WalletType as CosmosWalletType,
} from "graz";
import {
  BECH32_PREFIX,
  CompositeClient,
  FaucetClient,
  IndexerConfig,
  LocalWallet,
  onboarding,
  Network,
  ValidatorConfig,
} from '@dydxprotocol/v4-client-js';
import { MYCEL_CHAIN_INFO, type EvmAddress, type MycelAddress, type PrivateInformation } from "@/utils/wallets";


export const WalletConfig = {
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

export type WalletType = keyof typeof WalletConfig;

export const useWallet = () => {
  // EVM
  const evmAddress = useStore((state) => state.evmAddress);
  const updateEvmAddress = useStore((state) => state.updateEvmAddress);
  const { address: evmAddressWagmi, isConnected: isConnectedWagmi } = useAccountWagmi();
  // const publicClientWagmi = usePublicClientWagmi();
  const { data: signerWagmi } = useWalletClientWagmi();
  const { disconnectAsync: disconnectWagmi } = useDisconnectWagmi();

  // Cosmos
  const mycelAddress = useStore((state) => state.mycelAddress);
  const updateMycelAddress = useStore((state) => state.updateMycelAddress);
  const { data: mycelAccountGraz, isConnected: isConnectedGraz } = useAccountGraz();
  const { offlineSigner: signerGraz } = useOfflineSignersGraz();
  const { disconnectAsync: disconnectGraz } = useDisconnectGraz();
  const mycelAddressGraz = mycelAccountGraz?.bech32Address as MycelAddress | undefined;

  // current wallet
  const currentWalletType = useStore((state) => state.currentWalletType);
  const updateCurrentWalletType = useStore((state) => state.updateCurrentWalletType);

  const { connectAsync: connectWagmi, connectors: connectorsWagmi } = useConnectWagmi();
  const { suggestAndConnect: connectGraz } = useConnectGraz();

  const connectWallet = useCallback(
    async ({ walletType }: { walletType: WalletType }) => {
      try {
        if (WalletConfig[walletType].chainType === "cosmos") {
          if (!isConnectedGraz) {
            await connectGraz({
              chainInfo: MYCEL_CHAIN_INFO,
              walletType: CosmosWalletType.KEPLR,
            });
          }
        } else if (WalletConfig[walletType].chainType === "evm") {
          if (!isConnectedWagmi) {
            await connectWagmi({
              connector: connectorsWagmi.find((cn: any) => cn.id === WalletConfig[walletType].id),
            });
          }
        }
        updateCurrentWalletType(walletType);
      } catch (error) {
        console.log(error);
      }

      // return {
      //   walletType,
      //   walletConnectionType: walletConnection.type,
      // };
    },
    [isConnectedGraz, signerGraz, isConnectedWagmi, signerWagmi],
  );

  // Disconnect
  const disconnectWallet = useCallback(async () => {
    updateEvmAddress(undefined);
    updateMycelAddress(undefined);

    if (isConnectedWagmi) await disconnectWagmi();
    if (isConnectedGraz) await disconnectGraz();

    updateCurrentWalletType(undefined);
  }, [isConnectedGraz, isConnectedWagmi]);


  // mycel wallet
  const [localMycelWallet, setLocalMycelWallet] = useState<LocalWallet>();
  const [hdKey, setHdKey] = useState<PrivateInformation>();

  const mycelAccounts = useMemo(() => localMycelWallet?.accounts, [localMycelWallet]);

  const getWalletFromEvmSignature = async ({ signature }: { signature: string }) => {
    const { mnemonic, privateKey, publicKey } =
      onboarding.deriveHDKeyFromEthereumSignature(signature);

    return {
      wallet: await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX),
      mnemonic,
      privateKey,
      publicKey,
    };
  };

  const setWalletFromEvmSignature = async (signature: string) => {
    const { wallet, mnemonic, privateKey, publicKey } = await getWalletFromEvmSignature({
      signature,
    });
    setLocalMycelWallet(wallet);
    setHdKey({ mnemonic, privateKey, publicKey });
  };

  const saveEvmSignature = useCallback(
    (encryptedSignature: string) => {
      evmDerivedAddresses[evmAddress!].encryptedSignature = encryptedSignature;
      saveEvmDerivedAddresses(evmDerivedAddresses);
    },
    [evmDerivedAddresses, evmAddress]
  );

  const forgetEvmSignature = useCallback(
    (_evmAddress = evmAddress) => {
      if (_evmAddress) {
        delete evmDerivedAddresses[_evmAddress]?.encryptedSignature;
        saveEvmDerivedAddresses(evmDerivedAddresses);
      }
    },
    [evmDerivedAddresses, evmAddress]
  );

  useEffect(() => {
    if (evmAddressWagmi) {
      updateEvmAddress(evmAddressWagmi);
    }
    if (mycelAddressGraz) {
      updateMycelAddress(mycelAddressGraz);
    }
  }, [evmAddressWagmi, mycelAddressGraz]);

  return {
    // Wallet connection
    isConnected: isConnectedGraz || isConnectedWagmi,
    connectWallet,
    disconnectWallet,
    currentWalletType,
    // EVM
    evmAddress,
    evmAddressWagmi,
    signerWagmi,
    // Cosmos
    mycelAddress,
    mycelAddressGraz,
    signerGraz,
    // EVM → mycel account derivation
    setWalletFromEvmSignature,
    saveEvmSignature,
    forgetEvmSignature,
    // mycel accounts
    hdKey,
    localMycelWallet,
    mycelAccounts,
  };
};

export default useWallet;
