import Toaster from '@/components/Toaster'
import router from '@/router'
import { MYCEL_CHAIN_INFO } from '@/utils/wallets'
import { GrazProvider, WalletType as WalletTypeCosmos } from 'graz'
import { RouterProvider } from 'react-router-dom'
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet], [publicProvider()])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'OKXWallet',
        shimDisconnect: true,
        getProvider: () => (typeof window !== 'undefined' ? window.okxwallet : undefined),
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'BitGetWallet',
        shimDisconnect: true,
        getProvider: () => (typeof window !== 'undefined' ? window?.bitkeep?.ethereum : undefined),
      },
    }),
    // new MetaMaskConnector({
    //   chains,
    //   options: {
    //     shimDisconnect: true,
    //   },
    // }),
    new WalletConnectConnector({
      // https://github.com/wagmi-dev/wagmi/issues/3012#issuecomment-1721744364
      chains: [mainnet, mainnet],
      options: {
        projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

const grazOptions = {
  chains: [MYCEL_CHAIN_INFO],
  defaultWallet: WalletTypeCosmos.KEPLR,
  walletConnect: {
    options: {
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    },
  },
}

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <GrazProvider grazOptions={grazOptions}>
        <RouterProvider router={router} />
        <Toaster />
      </GrazProvider>
    </WagmiConfig>
  )
}
