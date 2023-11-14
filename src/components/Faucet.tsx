import { useState, useEffect } from "react";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { useClient } from "../hooks/useClient";
import { useAddressContext } from "../def-hooks/addressContext";
import TxModal from "../components/TxModal";
import Button from "../components/Button";

export default function Faucet() {
  const { address } = useAddressContext();
  const client = useClient();
  const threshold = import.meta.env.VITE_FAUCET_CLAIMABLE_THRESHOLD;

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

  const queryBalance = async () => {
    const balance = await client.CosmosBankV1Beta1.query.queryBalance(address, { denom: "mycel" }).then((res) => {
      if (res.data.balance?.amount) {
        return res.data.balance.amount;
      }
    });
    setBalance(balance ?? "0");
    return balance;
  };

  useEffect(() => {
    queryBalance();
  }, [address]);

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

    if (isClaimable) {
      await fetch(`api/faucet?address=${address}`)
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
    <div>
      <Button className="btn-primary w-full py-2" disabled={!isClaimable} onClick={claimFaucet}>
        Claim
      </Button>
      <TxModal isShow={isShow} setIsShow={setIsShow} txResponse={txResponse} isLoading={isLoading} />
    </div>
  );
}
