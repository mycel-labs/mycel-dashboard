import { useStore } from '@/store/index'
import {
  BECH32_PREFIX,
  EVM_CHAINID,
  type EvmAddress,
  MYCEL_CHAIN_INFO,
  type MycelAddress,
  type PrivateInformation,
  WALLET_CONFIG,
  type WalletType,
  getSignTypedData,
} from '@/utils/wallets'
import { DirectSecp256k1HdWallet, OfflineSigner } from '@cosmjs/proto-signing'
import { LocalWallet, onboarding } from '@dydxprotocol/v4-client-js'
import { AES, enc } from 'crypto-js'
import {
  WalletType as CosmosWalletType,
  useAccount as useAccountGraz,
  useDisconnect as useDisconnectGraz,
  useOfflineSigners as useOfflineSignersGraz,
  useSuggestChainAndConnect as useConnectGraz,
} from 'graz'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAccount as useAccountWagmi,
  useConnect as useConnectWagmi,
  useDisconnect as useDisconnectWagmi,
  useNetwork as useNetworkWagmi,
  useSignTypedData,
  useSwitchNetwork as useSwitchNetworkWagmi,
  // usePublicClient as usePublicClientWagmi,
  useWalletClient as useWalletClientWagmi,
} from 'wagmi'

export const useWallet = () => {
  // EVM
  const evmAddress = useStore(state => state.evmAddress)
  const updateEvmAddress = useStore(state => state.updateEvmAddress)
  const { address: evmAddressWagmi, isConnected: isConnectedWagmi } = useAccountWagmi()
  // const publicClientWagmi = usePublicClientWagmi();
  const { data: signerWagmi } = useWalletClientWagmi()
  const { disconnectAsync: disconnectWagmi } = useDisconnectWagmi()

  // Cosmos
  const mycelAddress = useStore(state => state.mycelAddress)
  const updateMycelAddress = useStore(state => state.updateMycelAddress)
  const { data: mycelAccountGraz, isConnected: isConnectedGraz } = useAccountGraz()
  const { data: signerGraz } = useOfflineSignersGraz()
  const { disconnectAsync: disconnectGraz } = useDisconnectGraz()
  const mycelAddressGraz = mycelAccountGraz?.bech32Address as MycelAddress | undefined

  // current wallet
  const currentWalletType = useStore(state => state.currentWalletType)
  const updateCurrentWalletType = useStore(state => state.updateCurrentWalletType)

  const { connectAsync: connectWagmi, connectors: connectorsWagmi } = useConnectWagmi()
  const { suggestAndConnect: connectGraz } = useConnectGraz()

  // EVM → mycel account derivation
  const evmDerivedAddresses = useStore(state => state.evmDerivedAddresses)
  const updateEvmDerivedAddress = useStore(state => state.updateEvmDerivedAddress)
  const staticEncryptionKey = import.meta.env.VITE_PK_ENCRYPTION_KEY

  const connectWallet = useCallback(
    async ({ walletType }: { walletType: WalletType }) => {
      try {
        if (WALLET_CONFIG[walletType].chainType === 'cosmos') {
          if (!isConnectedGraz) {
            connectGraz({
              chainInfo: MYCEL_CHAIN_INFO,
              walletType: WALLET_CONFIG[walletType].id,
            })
          }
        } else if (WALLET_CONFIG[walletType].chainType === 'evm') {
          if (!isConnectedWagmi) {
            await connectWagmi({
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              connector: connectorsWagmi.find((cn: any) => cn.name === WALLET_CONFIG[walletType].name),
            })
          }
        }
        updateCurrentWalletType(walletType)
      } catch (error) {
        console.log(error)
      }
    },
    [isConnectedGraz, isConnectedWagmi, connectGraz, updateCurrentWalletType, connectWagmi, connectorsWagmi],
  )

  // Disconnect
  const disconnectLocalWallet = () => {
    setLocalMycelWallet(undefined)
    setHdKey(undefined)
  }

  const disconnectWallet = useCallback(async () => {
    if (isConnectedWagmi) await disconnectWagmi()
    if (isConnectedGraz) await disconnectGraz()
    updateEvmAddress(undefined)
    updateMycelAddress(undefined)
    disconnectLocalWallet()
    // forgetEvmSignature();
    updateCurrentWalletType(undefined)
  }, [
    isConnectedGraz,
    isConnectedWagmi,
    disconnectLocalWallet,
    updateEvmAddress,
    updateMycelAddress,
    updateCurrentWalletType,
    disconnectWagmi,
    disconnectGraz,
  ])

  // mycel wallet
  const [localMycelWallet, setLocalMycelWallet] = useState<LocalWallet>()
  const [mycelOfflineSigner, setMycelOfflineSigner] = useState<OfflineSigner>()
  const [hdKey, setHdKey] = useState<PrivateInformation>()

  const mycelAccounts = useMemo(() => localMycelWallet?.accounts, [localMycelWallet])

  const getWalletFromEvmSignature = async ({ signature }: { signature: string }) => {
    const { mnemonic, privateKey, publicKey } = onboarding.deriveHDKeyFromEthereumSignature(signature)

    return {
      wallet: await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX),
      mnemonic,
      privateKey,
      publicKey,
    }
  }

  const setWalletFromEvmSignature = async (signature: string) => {
    const { wallet, mnemonic, privateKey, publicKey } = await getWalletFromEvmSignature({
      signature,
    })
    setLocalMycelWallet(wallet)
    setHdKey({ mnemonic, privateKey, publicKey })
    setMycelOfflineSigner(await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: BECH32_PREFIX }))
  }

  const saveEvmSignature = useCallback(
    (encryptedSignature: string) => {
      if (evmAddress) {
        updateEvmDerivedAddress({
          evmAddress,
          mycelAddress,
          encryptedSignature,
        })
      }
    },
    [mycelAddress, evmAddress, updateEvmDerivedAddress],
  )

  const forgetEvmSignature = useCallback(
    (_evmAddress = evmAddress) => {
      if (_evmAddress) {
        updateEvmDerivedAddress({
          evmAddress: _evmAddress,
          mycelAddress,
          encryptedSignature: undefined,
        })
      }
    },
    [evmAddress, updateEvmDerivedAddress, mycelAddress],
  )

  const signTypedData = getSignTypedData()
  const { signTypedDataAsync } = useSignTypedData({
    ...signTypedData,
    domain: {
      ...signTypedData.domain,
      chainId: EVM_CHAINID,
    },
  })

  const deriveKeys = async () => {
    const signature = await signTypedDataAsync()
    await setWalletFromEvmSignature(signature)
    const encryptedSignature = AES.encrypt(signature, staticEncryptionKey).toString()
    saveEvmSignature(encryptedSignature)
  }

  const decryptSignature = (encryptedSignature: string | undefined) => {
    if (!staticEncryptionKey) throw new Error('No decryption key found')
    if (!encryptedSignature) throw new Error('No signature found')

    const decrypted = AES.decrypt(encryptedSignature, staticEncryptionKey)
    const signature = decrypted.toString(enc.Utf8)
    return signature
  }

  useEffect(() => {
    if (evmAddressWagmi) {
      if (evmAddress && evmAddress !== evmAddressWagmi) {
        disconnectLocalWallet()
        forgetEvmSignature(evmAddressWagmi)
      }
      updateEvmAddress(evmAddressWagmi)
    }
    if (mycelAddressGraz) {
      updateMycelAddress(mycelAddressGraz)
    }
  }, [
    evmAddress,
    evmAddressWagmi,
    mycelAddressGraz,
    forgetEvmSignature,
    updateMycelAddress,
    updateEvmAddress,
    disconnectLocalWallet,
  ])

  // Change EVM network
  const { chain: chainWagmi } = useNetworkWagmi()
  const { switchNetworkAsync: switchNetworkAsyncWagmi } = useSwitchNetworkWagmi({ chainId: EVM_CHAINID })
  const switchEvmNetworkAsync = useCallback(() => {
    if (chainWagmi?.id !== EVM_CHAINID) {
      switchNetworkAsyncWagmi?.()
    }
  }, [chainWagmi?.id, switchNetworkAsyncWagmi])

  // LocalWallet
  const updateDialog = useStore(state => state.updateDialog)
  useEffect(() => {
    ;(async () => {
      if (mycelAddress && signerGraz?.offlineSigner) {
        try {
          setLocalMycelWallet(await LocalWallet.fromOfflineSigner(signerGraz?.offlineSigner))
          setMycelOfflineSigner(signerGraz?.offlineSigner)
        } catch (error) {
          console.log(error)
        }
      } else if (evmAddress) {
        if (!localMycelWallet) {
          const evmDerivedAccount = evmDerivedAddresses[evmAddress]
          if (evmDerivedAccount?.encryptedSignature) {
            try {
              const signature = decryptSignature(evmDerivedAccount.encryptedSignature)
              await setWalletFromEvmSignature(signature)
            } catch (error) {
              console.log(error)
              forgetEvmSignature()
            }
          } else {
            updateDialog('wallet2')
          }
        }
      }
    })()
  }, [
    evmAddress,
    evmDerivedAddresses,
    mycelAddress,
    signerGraz,
    decryptSignature,
    updateDialog,
    setWalletFromEvmSignature,
    localMycelWallet,
    forgetEvmSignature,
  ])

  return {
    // Wallet connection
    isConnected: isConnectedGraz || isConnectedWagmi,
    isConnectedGraz,
    isConnectedWagmi,
    connectWallet,
    disconnectWallet,
    currentWalletType,
    // EVM
    evmAddress,
    evmAddressWagmi,
    signerWagmi,
    connectorsWagmi,
    evmChainId: chainWagmi?.id,
    switchEvmNetworkAsync,
    // Cosmos
    mycelAddress,
    mycelAddressGraz,
    signerGraz,
    // EVM → mycel account derivation
    setWalletFromEvmSignature,
    saveEvmSignature,
    // forgetEvmSignature,
    deriveKeys,
    // mycel accounts
    hdKey,
    localMycelWallet,
    mycelOfflineSigner,
    mycelAccount: mycelAccounts?.[0],
  }
}

export default useWallet
