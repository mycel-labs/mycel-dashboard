import { Dialog } from "@headlessui/react";
import BaseDialog from "@/components/dialog/BaseDialog";
import useWallet from "@/hooks/useWallet";
import { useStore } from "@/store/index";
import Button from "@/components/Button";
import { Unplug, Wallet, KeySquare, ClipboardCopy } from "lucide-react";
import MetamaskIcon from "@/assets/icons/wallets/metamask.svg";
import KeplrIcon from "@/assets/icons/wallets/keplr.svg";
import WalletConnectIcon from "@/assets/icons/wallets/walletconnect.svg";
import OKXIcon from "@/assets/icons/wallets/okx.svg";
import MycelCharactor from "@/assets/mycel_charactor.svg";
import { shortAddress } from "@/utils/wallets";
import { copyClipboard } from "@/utils/lib";
import { useBalances } from "graz";

export default function WalletDialog() {
  const dialog = useStore((state) => state.dialog);
  const updateDialog = useStore((state) => state.updateDialog);
  const { connectWallet, disconnectWallet, isConnected, evmAddress, deriveKeys, mycelAccount, connectorsWagmi } =
    useWallet();

  const DialogContent = () => (
    <div className="space-y-4 font-semibold">
      <Button
        className="btn-secondary w-full h-12 rounded"
        disabled={!connectorsWagmi.find((cn) => cn.id === "metaMask")?.ready}
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
        className="btn-secondary w-full h-12 rounded"
        disabled={!connectorsWagmi.find((cn) => cn.id === "walletConnect")?.ready}
        onClick={async () => {
          connectWallet({ walletType: "WalletConnect" });
        }}
      >
        <span className="flex items-center justify-center px-6 mr-2">
          <img src={WalletConnectIcon} width={24} height={24} alt="WalletConnect" />
          <span className="ml-3">WalletConnect</span>
        </span>
      </Button>
      <Button
        className="btn-secondary w-full h-12 rounded"
        disabled={!connectorsWagmi.find((cn) => cn.name === "OKXWallet")?.ready}
        onClick={async () => {
          connectWallet({ walletType: "OKXWallet" });
        }}
      >
        <span className="flex items-center justify-center px-6 mr-2">
          <img src={OKXIcon} width={24} height={24} alt="OKXWallet" />
          <span className="ml-3"> OKX Wallet</span>
        </span>
      </Button>
      <Button
        className="btn-secondary w-full h-12 rounded"
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
        className="btn-secondary w-full h-12 rounded"
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

  const DialogContentConnected = () => {
    const balances = useBalances();

    console.log(":::::", balances);

    return (
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
          <div className="absolute right-0 bottom-0 h-12 w-12 flex items-center justify-center">
            <button className="text-chocolat" onClick={() => copyClipboard(mycelAccount?.address ?? "")}>
              <ClipboardCopy size={20} />
            </button>
          </div>
        </label>
        <Button
          className="btn-secondary w-full mt-8 h-12 rounded-md"
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
  };

  const DialogContentKeyGen = () => (
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
      <Button
        className="btn-secondary w-full py-2 mt-8"
        onClick={async () => {
          await deriveKeys();
          updateDialog(undefined);
        }}
      >
        <span className="flex items-center justify-center px-6 mr-2">
          <KeySquare />
          <span className="ml-4">Generate Mycel Account</span>
        </span>
      </Button>
    </>
  );

  return (
    <BaseDialog open={dialog === "wallet" || dialog === "wallet2"}>
      <Dialog.Title className="text-2xl font-semibold mb-8 text-center">
        {dialog === "wallet2" ? (
          "Generate Mycel Account from EVM address"
        ) : isConnected ? (
          <img src={MycelCharactor} width={144} height={144} alt="Mycel" className="mx-auto" />
        ) : (
          "Select Wallet"
        )}
      </Dialog.Title>
      {dialog === "wallet2" ? <DialogContentKeyGen /> : isConnected ? <DialogContentConnected /> : <DialogContent />}
    </BaseDialog>
  );
}
