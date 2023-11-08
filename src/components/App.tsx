import { RouterProvider } from "react-router-dom";
import { GrazProvider } from "graz";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import router from "@/router";
import "@ignt/react-library/dist/style.css";
import AddressProvider from "../def-hooks/addressContext";
import DenomProvider from "../def-hooks/denomContext";
import WalletProvider from "../def-hooks/walletContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
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
        <GrazProvider>
          <AddressProvider>
            <WalletProvider>
              <DenomProvider>
                <RouterProvider router={router} />
              </DenomProvider>
            </WalletProvider>
          </AddressProvider>
        </GrazProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
