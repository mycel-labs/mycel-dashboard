import { Dialog } from "@headlessui/react";
import BaseDialog from "@/components/dialog/BaseDialog";
import { useStore } from "@/store/index";

export default function TxDialog() {
  const dialog = useStore((state) => state.dialog);
  const updateDialog = useStore((state) => state.updateDialog);

  return (
    <BaseDialog open={dialog === "tx"}>
      <Dialog.Title className="text-2xl font-semibold mb-8 text-center">Tx</Dialog.Title>
      <div>Content</div>
    </BaseDialog>
  );
}
