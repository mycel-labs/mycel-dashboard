import { useEffect, useState } from "react";
import { useNetwork, usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";
import { useDebounce } from "use-debounce";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { Send } from "lucide-react";
import { RegistryNetworkName } from "mycel-client-ts/mycel.resolver/rest";
import { useMycelResolver } from "@/hooks/useMycelResolver";
import { getConnectedNetworkName } from "../utils/chains";

export default function SendView() {
  const { chain } = useNetwork();
  const { mycelRecords, isLoading, updateMycelRecords, getWalletAddr } = useMycelResolver();
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
    if (domainName) {
      if (mycelRecords && targetNetworkName) {
        const walletAddr = getWalletAddr(targetNetworkName);
        if (walletAddr) {
          setTo(walletAddr);
        }
      } else {
        setTo("");
      }
    }
  }, [mycelRecords, targetNetworkName, domainName]);

  useEffect(() => {
    const pattern = /^[0-9]+(\.[0-9]+)?$/;
    if (pattern.test(amount) === false) {
      setIsValidAmount(false);
    } else {
      setIsValidAmount(true);
    }
  }, [amount]);

  useEffect(() => {
    updateMycelRecords(domainName)
      .then()
      .catch((e) => {
        console.error(e);
      });
  }, [debouncedDomainName, chain]);

  return (
    <div className="container my-12">
      <h2 className="font-cursive text-3xl text-black font-semibold mb-6 flex items-center">
        <Send className="opacity-70 mr-2" size={28} />
        Send Token
      </h2>
      <div className="relative flex flex-row">
        <div className="px-2">
          <Web3NetworkSwitch />
        </div>
        <Web3Button />
      </div>
      <div className="flex-row my-8">
        <input
          className="mt-2 py-2 px-4 h-14 bg-white border border-black w-full border-xs text-base leading-tight outline-0"
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
          <p className="m-2 text-sm text-error">
            <span className="italic">{domainName}</span> doesn&apos;t exists in registry on {targetNetworkName}.
          </p>
        )}
        <input
          className="mt-2 py-2 px-4 h-14 bg-white border border-black w-full border-xs text-base leading-tight outline-0"
          aria-label="Amount (ether)"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Token Amount (e.g. 0.05)"
          value={amount}
        />
        {!isValidAmount && (
          <p className="m-2 text-sm text-error">
            <span className="italic">{domainName}</span> Invalid Amount.
          </p>
        )}

        <button
          className="btn-primary h-14 w-full mt-6"
          onClick={async () => {
            const res = await sendTransactionAsync?.();
            console.log("%o", res);
          }}
          // busy={isLoadingTx || isLoadingRegistryDomain}
          disabled={isLoadingTx || isLoading || !sendTransactionAsync || !to || !amount}
        >
          {isLoadingTx ? "Sending..." : "Send"}
        </button>
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
