import { Dialog } from "@headlessui/react";
import { useStore } from "@/store/index";

export default function TxDialog() {
  const dialog = useStore((state) => state.dialog);
  const updateDialog = useStore((state) => state.updateDialog);

  return (
    <Dialog open={dialog === "tx"} onClose={() => updateDialog(undefined)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
          <Dialog.Panel className="mx-auto w-full sm:max-w-sm bg-cream py-12 px-10 rounded-t-lg sm:rounded-lg">
            <Dialog.Title className="text-2xl font-semibold mb-8 text-center">Tx</Dialog.Title>
            <div>Content</div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
