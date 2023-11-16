import { Dialog } from "@headlessui/react";
import useWallet from "@/hooks/useWallet";
import { useStore } from "@/store/index";
import Button from "@/components/Button";
import { Unplug, Wallet, KeySquare, ClipboardCopy } from "lucide-react";
import MetamaskIcon from "@/assets/icons/wallets/metamask.svg";
import KeplrIcon from "@/assets/icons/wallets/keplr.svg";
import MycelCharactor from "@/assets/mycel_charactor.svg";
import { shortAddress } from "@/utils/wallets";
import { copyClipboard } from "@/utils/lib";

export default function WalletDialog() {
  const dialog = useStore((state) => state.dialog);
  const updateDialog = useStore((state) => state.updateDialog);
  const { connectWallet, disconnectWallet, isConnected, evmAddress, deriveKeys, mycelAccount } = useWallet();

  const DialogContent = () => (
    <div className="space-y-4 font-semibold">
      <Button
        className="btn-secondary w-full h-12"
        onClick={async () => {
          connectWallet({ walletType: "MetaMask" });
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
  );

  const DialogContentConnected = () => (
    <>
      {evmAddress && (
        <label className="relative">
          EVM Address
          <input type="text" readOnly value={shortAddress(evmAddress)} className="w-full" />
          <div className="absolute right-0 bottom-0 h-12 w-12  flex items-center justify-center">
            <button className="text-chocolat" onClick={() => copyClipboard(evmAddress)}>
              <ClipboardCopy size={20} />
            </button>
          </div>
        </label>
      )}
      <label className="relative">
        Mycel Address
        <input type="text" readOnly value={shortAddress(mycelAccount?.address)} className="w-full" />
        <div className="absolute right-0 bottom-0 h-12 w-12  flex items-center justify-center">
          <button className="text-chocolat" onClick={() => copyClipboard(mycelAccount?.address ?? "")}>
            <ClipboardCopy size={20} />
          </button>
        </div>
      </label>
      <Button
        className="btn-secondary w-full mt-8 py-2"
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
    </>
  );

  const DialogContentKeyGen = () => (
    <>
      <input type="text" readOnly value={shortAddress(evmAddress)} className="w-full mb-4" />
      <Button
        className="btn-secondary w-full py-2"
        onClick={async () => {
          await deriveKeys();
          updateDialog(undefined);
        }}
      >
        <span className="flex items-center justify-center px-6 mr-2">
          <KeySquare />
          <span className="ml-4">Keygen</span>
        </span>
      </Button>
    </>
  );

  return (
    <Dialog
      open={dialog === "wallet" || dialog === "wallet2"}
      onClose={() => updateDialog(undefined)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
          <Dialog.Panel className="mx-auto w-full sm:max-w-sm bg-cream py-12 px-10 rounded-t-lg sm:rounded-lg">
            <Dialog.Title className="text-2xl font-semibold mb-8 text-center">
              {dialog === "wallet2" ? (
                "Generate Mycel Account"
              ) : isConnected ? (
                <img src={MycelCharactor} width={144} height={144} alt="Mycel" className="mx-auto" />
              ) : (
                "Select Wallet"
              )}
            </Dialog.Title>
            {dialog === "wallet2" ? (
              <DialogContentKeyGen />
            ) : isConnected ? (
              <DialogContentConnected />
            ) : (
              <DialogContent />
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
