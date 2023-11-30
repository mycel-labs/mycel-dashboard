import { GrazProvider } from "graz";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MYCEL_CHAIN_INFO } from "@/utils/wallets";

const queryClient = new QueryClient();

const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet], [publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "OKXWallet",
        shimDisconnect: true,
        getProvider: () => (typeof window !== "undefined" ? window.okxwallet : undefined),
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
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <GrazProvider grazOptions={{ chains: [MYCEL_CHAIN_INFO] }}>
          <RouterProvider router={router} />
        </GrazProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
