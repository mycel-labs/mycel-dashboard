import { DeliverTxResponse } from "@cosmjs/stargate";
import BaseDialog from "@/components/dialog/BaseDialog";
import { useStore } from "@/store/index";
import TxContent from "@/components/dialog/TxContent";
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
      <TxContent isLoading={isLoading} txResponse={txResponse} className="mt-6" />
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
    </BaseDialog>
  );
}
