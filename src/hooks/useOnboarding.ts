import { useEffect } from "react";
import useWallet from "@/hooks/useWallet";
import useBalance from "@/hooks/useBalance";
import { useStore } from "@/store/index";
import { useQueryAllRecords, useQueryDomainOwnership } from "@/hooks/useMycel";

export const useOnboarding = () => {
  const { isConnected, evmAddress, mycelAccount } = useWallet();
  const onboardingStatus = useStore((state) => state.onboardingStatus);
  const updateOnboardingStatus = useStore((state) => state.updateOnboardingStatus);
  const updateDialog = useStore((state) => state.updateDialog);
  const { balance } = useBalance();
  const { isLoading: isLoadingOwnDomain, data: dataOwnDomain } = useQueryDomainOwnership(mycelAccount?.address);
  const { isLoading: isLoadingRecords, data: dataRecords } = useQueryAllRecords(dataOwnDomain?.domainOwnership?.domains?.[0]);

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
    "register-domain": {
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
    if (onboardingStatus === "hide" || onboardingStatus === "finish") return;
    if (!isConnected) {
      updateOnboardingStatus("no-connection");
    } else if (evmAddress && !mycelAccount) {
      updateOnboardingStatus("no-mycel-address");
    } else if (mycelAccount && BigInt(balance ?? 0) <= 0) {
      updateOnboardingStatus("faucet");
    } else if (!isLoadingOwnDomain && (dataOwnDomain?.domainOwnership?.domains?.length ?? 0) <= 0) {
      updateOnboardingStatus("register-domain");
    } else if (!isLoadingRecords && (Object.keys(dataRecords?.values).length ?? 0) <= 0) {
      updateOnboardingStatus("add-record");
    } else if (dataRecords?.values?.length > 0) {
      updateOnboardingStatus("finish");
    }
  }, [onboardingStatus, isConnected, evmAddress, mycelAccount, balance, dataOwnDomain, dataRecords]);

  const onboardingStatusList = typeof ONBOARDING_CONFIG;

  return {
    ONBOARDING_CONFIG,
    onboardingStatusList
  }
};

export default useOnboarding;
