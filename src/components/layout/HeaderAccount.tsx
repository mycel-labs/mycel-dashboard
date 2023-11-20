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
        className="btn-primary py-2 px-4 font-semibold inline-flex rounded-md"
        onClick={() => updateDialog("wallet")}
      >
        {isConnected ? (
          <span className="text-sm font-normal">{shortAddress(mycelAccount?.address)}</span>
        ) : (
          <>
            Login<span className="hidden md:inline-flex md:ml-1">to Mycel</span>
          </>
        )}
      </Button>
      <WalletDialog />
    </>
  );
}
