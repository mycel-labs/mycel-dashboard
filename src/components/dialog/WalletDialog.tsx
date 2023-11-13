import { Dialog } from "@headlessui/react";
import useWallet from "@/hooks/useWallet";
import { useStore } from "@/store/index";
import Button from "@/components/Button";
import { Unplug, Wallet } from "lucide-react";
import MetamaskIcon from "@/assets/icons/wallets/metamask.svg";
import KeplrIcon from "@/assets/icons/wallets/keplr.svg";

export default function Account() {
  const dialog = useStore((state) => state.dialog);
  const updateDialog = useStore((state) => state.updateDialog);
  const { connectWallet, disconnectWallet, isConnected } = useWallet();

  return (
    <Dialog open={dialog === "wallet"} onClose={() => updateDialog(undefined)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
          <Dialog.Panel className="mx-auto w-full sm:max-w-sm bg-cream py-12 px-10 rounded-t-md sm:rounded-md">
            <Dialog.Title className="text-2xl font-semibold mb-8 text-center">
              {isConnected ? "Connected" : "Select Wallet"}
            </Dialog.Title>
            {isConnected ? (
              <Button
                className="btn-secondary w-full py-2"
                onClick={async () => {
                  await disconnectWallet();
                  updateDialog(undefined);
                }}
              >
                <span className="flex items-center justify-center px-6 mr-2">
                  <Unplug />
                  <span className="ml-4">Disconnect</span>
                </span>
              </Button>
            ) : (
              <div className="space-y-4 font-semibold">
                <Button
                  className="btn-secondary w-full h-12"
                  onClick={async () => {
                    connectWallet({ walletType: "MetaMask" });
                    updateDialog(undefined);
                  }}
                >
                  <span className="flex items-center justify-center px-6 mr-2">
                    <img src={MetamaskIcon} width={24} height={24} alt="MetaMask" />
                    <span className="ml-3">MetaMask</span>
                  </span>
                </Button>
                <Button
                  className="btn-secondary w-full h-12"
                  onClick={async () => {
                    connectWallet({ walletType: "Injected" });
                    updateDialog(undefined);
                  }}
                >
                  <span className="flex items-center justify-center px-6 mr-2">
                    <Wallet className="text-chocolat" />
                    <span className="ml-3"> Browser Wallet</span>
                  </span>
                </Button>
                <Button
                  className="btn-secondary w-full h-12"
                  onClick={async () => {
                    await connectWallet({ walletType: "Keplr" });
                    updateDialog(undefined);
                  }}
                >
                  <span className="flex items-center justify-center px-6 mr-2">
                    <img src={KeplrIcon} width={24} height={24} alt="Keplr" />
                    <span className="ml-3">Keplr</span>
                  </span>
                </Button>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
