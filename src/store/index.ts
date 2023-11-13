import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { EvmAddress, MycelAddress } from "@/utils/wallets";

type StoreState = {
  evmAddress: EvmAddress | undefined;
  mycelAddress: MycelAddress | undefined;
  currentWalletType: string | undefined;
  dialog: "wallet" | undefined;
};

type StoreSAction = {
  updateEvmAddress: (address: StoreState["evmAddress"]) => void;
  updateMycelAddress: (address: StoreState["mycelAddress"]) => void;
  updateCurrentWalletType: (address: StoreState["currentWalletType"]) => void;
  updateDialog: (dialog: StoreState["dialog"]) => void;
};

export const useStore = create<StoreState & StoreSAction>()(
  devtools(
    persist(
      (set) => ({
        evmAddress: undefined,
        mycelAddress: undefined,
        currentWalletType: undefined,
        dialog: undefined,
        updateEvmAddress: (payload: EvmAddress | undefined) => set((state) => ({ ...state, evmAddress: payload })),
        updateMycelAddress: (payload: MycelAddress | undefined) =>
          set((state) => ({ ...state, mycelAddress: payload })),
        updateCurrentWalletType: (payload: string | undefined) =>
          set((state) => ({ ...state, currentWalletType: payload })),
        updateDialog: (payload: "wallet" | undefined) => set((state) => ({ ...state, dialog: payload })),
      }),
      {
        name: "mycel",
        partialize: (state) => ({
          evmAddress: state.evmAddress,
          mycelAddress: state.mycelAddress,
          currentWalletType: state.currentWalletType,
        }),
      },
    ),
  ),
);
