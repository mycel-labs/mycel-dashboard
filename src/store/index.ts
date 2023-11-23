import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { EvmAddress, MycelAddress } from "@/utils/wallets";

export type Dialog = "wallet" | "wallet2" | "tx" | "editRecord" | undefined;

export type EvmDerivedAddresses = {
  version?: string;
  [EvmAddress: EvmAddress]: {
    encryptedSignature?: string;
    mycelAddress?: MycelAddress;
  };
};

type StoreState = {
  evmAddress: EvmAddress | undefined;
  mycelAddress: MycelAddress | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-types
  evmDerivedAddresses: EvmDerivedAddresses | {};
  currentWalletType: string | undefined;
  dialog: Dialog;
};

type StoreSAction = {
  updateEvmAddress: (address: StoreState["evmAddress"]) => void;
  updateMycelAddress: (address: StoreState["mycelAddress"]) => void;
  updateCurrentWalletType: (address: StoreState["currentWalletType"]) => void;
  updateEvmDerivedAddress: ({
    evmAddress,
    mycelAddress,
    encryptedSignature,
  }: {
    evmAddress: EvmAddress;
    mycelAddress?: MycelAddress;
    encryptedSignature?: string;
  }) => void;
  updateDialog: (dialog: StoreState["dialog"]) => void;
};

export const useStore = create<StoreState & StoreSAction>()(
  devtools(
    persist(
      (set) => ({
        evmAddress: undefined,
        mycelAddress: undefined,
        currentWalletType: undefined,
        evmDerivedAddresses: {},
        dialog: undefined,
        updateEvmAddress: (payload: EvmAddress | undefined) => set((state) => ({ ...state, evmAddress: payload })),
        updateMycelAddress: (payload: MycelAddress | undefined) =>
          set((state) => ({ ...state, mycelAddress: payload })),
        updateEvmDerivedAddress: ({ evmAddress, mycelAddress, encryptedSignature }) =>
          set((state) => ({
            ...state,
            evmDerivedAddresses: {
              ...state.evmDerivedAddresses,
              version: "v1",
              [evmAddress]: {
                mycelAddress,
                encryptedSignature,
              },
            },
          })),
        updateCurrentWalletType: (payload: string | undefined) =>
          set((state) => ({ ...state, currentWalletType: payload })),
        updateDialog: (payload: Dialog) => set((state) => ({ ...state, dialog: payload })),
      }),
      {
        name: "mycel",
        partialize: (state) => ({
          evmAddress: state.evmAddress,
          mycelAddress: state.mycelAddress,
          evmDerivedAddresses: state.evmDerivedAddresses,
        }),
      },
    ),
  ),
);
