import React, { useEffect, useState } from "react";
import { useNetwork, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";
import { useDebounce } from "use-debounce";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { IgntButton } from "@ignt/react-library";
import { RegistryDomain, RegistryNetworkName } from "mycel-client-ts/mycel.registry/rest";
import { useRegistryDomain } from "../def-hooks/useRegistryDomain";
import { getConnectedNetworkName } from "../utils/chains";

const getWalletAddr = (domain: RegistryDomain, recordType: RegistryNetworkName) => {
  if (!domain || !domain.walletRecords || !domain.walletRecords[recordType]) {
    return "";
  }
  return domain.walletRecords[recordType].value;
};

export default function SendView() {
  const { chain } = useNetwork();
  const { registryDomain, isLoading: isLoadingRegistryDomain, updateRegistryDomain } = useRegistryDomain();
  const [domainName, setDomainName] = useState("");
  const [targetNetworkName, setTargetNetworkName] = useState(RegistryNetworkName.ETHEREUM_MAINNET_MAINNET);
  const [debouncedDomainName] = useDebounce(domainName, 500);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isValidAmount, setIsValidAmount] = useState(false);
  const [debouncedAmount] = useDebounce(isValidAmount ? amount : "", 500);

  const { config } = usePrepareSendTransaction({
    request: {
      to: to,
      value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
  });
  const { data, sendTransactionAsync } = useSendTransaction(config);

  const { isLoading: isLoadingTx, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    try {
      const chainId = chain?.id;
      if (!chainId) {
        return;
      }
      const networkName = getConnectedNetworkName(chainId);
      setTargetNetworkName(networkName);
    } catch (e) {
      // TODO If walletRecordType is invalid, show an error message
      console.log(e);
    }
  }, [chain]);

  useEffect(() => {
    if (registryDomain) {
      const walletAddr = registryDomain ? getWalletAddr(registryDomain, targetNetworkName) : "";
      setTo(walletAddr || "");
    } else {
      setTo("");
    }
  }, [registryDomain]);

  useEffect(() => {
    const pattern = /^[0-9]+(\.[0-9]+)?$/;
    if (pattern.test(amount) === false) {
      setIsValidAmount(false);
    } else {
      setIsValidAmount(true);
    }
  }, [amount]);

  useEffect(() => {
    updateRegistryDomain(domainName)
      .then()
      .catch((e) => {
        console.error(e);
      });
  }, [debouncedDomainName, chain]);

  return (
    <div className="w-3/4 mx-auto">
      <div className="relative flex flex-row">
        <div className="px-3">
          <Web3NetworkSwitch />
        </div>
        <Web3Button />
      </div>
      <div className="flex-row m-4">
        <input
          className="mr-6 mt-2 py-2 px-4 h-14 bg-gray-100 w-full border-xs text-base leading-tight rounded-xl outline-0"
          aria-label="Recipient"
          onChange={async (e) => {
            setDomainName(e.target.value);
          }}
          placeholder="Recipient Domain Name (e.g. your-name.cel)"
          value={domainName}
        />
        {to ? (
          <p className="m-2 text-sm text-gray-700">
            <span className="italic">{domainName}</span> on {targetNetworkName} is <span className="italic">{to}</span>.
          </p>
        ) : (
          <p className="m-2 text-sm text-red-500">
            <span className="italic">{domainName}</span> doesn&apos;t exists in registry on {targetNetworkName}.
          </p>
        )}
        <input
          className="mr-6 my-2 py-2 px-4 h-14 bg-gray-100 w-full border-xs text-base leading-tight rounded-xl outline-0"
          aria-label="Amount (ether)"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Token Amount (e.g. 0.05)"
          value={amount}
        />
        {!isValidAmount && (
          <p className="m-2 text-sm text-red-500">
            <span className="italic">{domainName}</span> Invalid Amount.
          </p>
        )}

        <IgntButton
          className="mt-1 h-14 w-full"
          onClick={async () => {
            const res = await sendTransactionAsync?.();
            console.log("%o", res);
          }}
          busy={isLoadingTx || isLoadingRegistryDomain}
          disabled={isLoadingTx || isLoadingRegistryDomain || !sendTransactionAsync || !to || !amount}
        >
          {isLoadingTx ? "Sending..." : "Send"}
        </IgntButton>
        {isSuccess && (
          <div className="m-4">
            <p>
              Successfully sent {amount} ether to {to}
            </p>
            <p>TxHash: {data?.hash}</p>
          </div>
        )}
      </div>
    </div>
  );
}
