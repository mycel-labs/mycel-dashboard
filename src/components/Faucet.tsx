import { useState, useEffect } from "react";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { useClient } from "../hooks/useClient";
import { useWallet } from "@/hooks/useWallet";
import TxModal from "@/components/TxModal";
import Button from "@/components/Button";
import { HandMetal } from "lucide-react";

interface faucetProps {
  className?: string;
}
export default function Faucet(props: faucetProps) {
  const client = useClient();
  const { mycelAccount } = useWallet();
  const threshold = import.meta.env.VITE_FAUCET_CLAIMABLE_THRESHOLD;

  const { className } = props;
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

  const queryBalance = async () => {
    if (!mycelAccount?.address) {
      return;
    }
    const balance = await client.CosmosBankV1Beta1.query
      .queryBalance(mycelAccount?.address, { denom: "umycel" })
      .then((res) => {
        if (res.data.balance?.amount) {
          return res.data.balance.amount;
        }
      });
    setBalance(balance ?? "0");
    return balance;
  };

  useEffect(() => {
    queryBalance();
  }, [mycelAccount]);

  useEffect(() => {
    if (parseInt(balance) < parseInt(threshold)) {
      setIsClaimable(true);
    } else {
      setIsClaimable(false);
    }
  }, [balance]);

  const claimFaucet = async () => {
    setIsLoading(true);
    setIsShow(true);

    if (isClaimable && mycelAccount?.address) {
      await fetch(`api/faucet?address=${mycelAccount?.address}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          setTxResponse(data.response as DeliverTxResponse);
          queryBalance();
        })
        .catch((err) => {
          setIsShow(false);
          console.log(err);
        });
    } else {
      setTxResponse({ code: -1, rawLog: "You have enough balance" } as DeliverTxResponse);
      setIsLoading(false);
    }
  };

  return (
    <section className={className ?? ""}>
      <h3 className="text-xl text-black font-semibold px-1 py-2 flex flex-1 items-center border-b-2 border-black">
        <HandMetal className="opacity-70 mr-2" size={24} />
        Faucet
      </h3>
      <div>
        <Button className="btn-primary w-full py-2 mt-6" disabled={!isClaimable} onClick={claimFaucet}>
          Claim
        </Button>
        <TxModal isShow={isShow} setIsShow={setIsShow} txResponse={txResponse} isLoading={isLoading} />
      </div>
    </section>
  );
}
