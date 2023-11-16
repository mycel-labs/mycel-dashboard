import useWallet from "@/hooks/useWallet";
import Button from "@/components/Button";
import WalletDialog from "@/components/dialog/WalletDialog";
import { useStore } from "@/store/index";
import { shortAddress } from "@/utils/wallets";

export default function Account() {
  const { isConnected, mycelAccount } = useWallet();
  const updateDialog = useStore((state) => state.updateDialog);

  return (
    <>
      <Button
        aria-label="Connect wallet"
        className="btn-primary py-2 px-4 font-semibold inline-flex"
        onClick={() => updateDialog("wallet")}
      >
        {isConnected ? (
          <span>{shortAddress(mycelAccount?.address)}</span>
        ) : (
          <>
            Connect<span className="hidden md:inline-flex md:ml-1">Wallet</span>
          </>
        )}
      </Button>
      <WalletDialog />
    </>
  );
}
