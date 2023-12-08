import { useEffect } from "react";
import useWallet from "@/hooks/useWallet";
import useBalance from "@/hooks/useBalance";
import { useStore } from "@/store/index";
import { useMycelRegistry } from "@/hooks/useMycelRegistry";

export const useOnboarding = () => {
  const { isConnected, evmAddress, mycelAccount } = useWallet();
  const onboardingStatus = useStore((state) => state.onboardingStatus);
  const updateOnboardingStatus = useStore((state) => state.updateOnboardingStatus);
  const updateDialog = useStore((state) => state.updateDialog);
  const { balance } = useBalance();
  const { isLoading: isLoadingOwnDomain, ownedDomains } = useMycelRegistry();

  const ONBOARDING_CONFIG = {
    "no-connection": {
      message: undefined,
    },
    "no-mycel-address": {
      index: 1,
      message: "You've connected, create mycel address.",
      action: () => updateDialog("wallet2"),
    },
    faucet: {
      index: 2,
      message: "Faucet MYCEL token next",
      link: "/",
    },
    "registor-domain": {
      index: 3,
      message: "Get your.cel name!",
      link: "/register",
    },
    "add-record": {
      index: 4,
      message: "Attach record to your.cel!",
      link: "/",
    },
    finish: {},
    hide: {},
  };

  useEffect(() => {
    if (onboardingStatus === "hide") return;
    if (!isConnected) {
      updateOnboardingStatus("no-connection");
    } else if (evmAddress && !mycelAccount) {
      updateOnboardingStatus("no-mycel-address");
    } else if (mycelAccount && BigInt(balance) <= 0) {
      updateOnboardingStatus("faucet");
    } else if (!isLoadingOwnDomain && ownedDomains.length === 0) {
      updateOnboardingStatus("registor-domain");
    } else if (false) {
      updateOnboardingStatus("add-record");
    } else {
      updateOnboardingStatus("finish");
    }
  }, [onboardingStatus, isConnected, evmAddress, mycelAccount, balance]);

  const onboardingStatusList = typeof ONBOARDING_CONFIG;
  return { onboardingStatusList }
};


export default useOnboarding;
