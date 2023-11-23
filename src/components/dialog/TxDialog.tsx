import { DeliverTxResponse } from "@cosmjs/stargate";
import { Dialog } from "@headlessui/react";
import BaseDialog from "@/components/dialog/BaseDialog";
import { useStore } from "@/store/index";
import Loader from "@/components/Loader";
import Button from "@/components/Button";

interface TxDialogProps {
  isLoading: boolean;
  txResponse: DeliverTxResponse | undefined;
  onClosed?: () => void;
}

export default function TxDialog({ isLoading, txResponse, onClosed }: TxDialogProps) {
  const dialog = useStore((state) => state.dialog);
  const updateDialog = useStore((state) => state.updateDialog);

  return (
    <BaseDialog open={dialog === "tx"}>
      <Dialog.Title className="text-2xl font-semibold mb-8 text-center">
        {isLoading ? "Loading..." : txResponse?.code === 0 ? "Success!" : "Transaction Failed"}
      </Dialog.Title>
      <div>
        {isLoading ? (
          <Loader size={12} />
        ) : (
          <div>
            {txResponse?.code === 0 ? (
              <div className="text-center space-y-4">
                <p className="text-lg leading-relaxed">Transaction Hash: {txResponse.transactionHash}</p>
              </div>
            ) : (
              <div>
                <p className="text-center text-error text-lg leading-relaxed">
                  Transaction failed with code {txResponse?.code}
                </p>
                <p className="leading-relaxed">{txResponse?.rawLog}</p>
              </div>
            )}
            <Button
              className="btn-primary mt-8 h-12 px-20 mx-auto block"
              onClick={() => {
                if (onClosed) {
                  onClosed();
                }
                updateDialog(undefined);
              }}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </BaseDialog>
  );
}
