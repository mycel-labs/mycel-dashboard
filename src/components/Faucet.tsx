import { useState, useEffect } from "react";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { useClient } from "@/hooks/useClient";
import { useWallet } from "@/hooks/useWallet";
import TxDialog from "@/components/dialog/TxDialog";
import Button from "@/components/Button";
import { HandMetal } from "lucide-react";
import { useStore } from "@/store/index";
import useBalance from "@/hooks/useBalance";

interface faucetProps {
  className?: string;
}
export default function Faucet(props: faucetProps) {
  const client = useClient();
  const { mycelAccount, isConnected } = useWallet();
  const threshold = import.meta.env.VITE_FAUCET_CLAIMABLE_THRESHOLD;
  const { className } = props;
  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();
  const updateDialog = useStore((state) => state.updateDialog);
  const { balances } = useBalance();

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
    updateDialog("tx");

    if (isClaimable && mycelAccount?.address) {
      await fetch(`api/faucet?address=${mycelAccount?.address}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          setTxResponse(data.response as DeliverTxResponse);
          queryBalance();
        })
        .catch((err) => {
          updateDialog(undefined);
          console.log(err);
        });
    } else {
      setTxResponse({ code: -1, rawLog: "You have enough balance" } as DeliverTxResponse);
      setIsLoading(false);
    }
  };

  return (
    <section className={className ?? ""}>
      <h3 className="font-cursive text-2xl text-black font-semibold px-1 py-2 flex flex-1 items-center border-b-2 border-black">
        <HandMetal className="opacity-70 mr-2" size={26} />
        Faucet
      </h3>
      <div className="flex w-full pt-4">
        <div className="py-2 flex w-full justify-between items-center">
          <div className="px-1">
            {isConnected ? (
              <>
                <div className="font-semibold mb-1">My Balance</div>
                <ul>
                  {balances?.map((coin) => (
                    <li key={coin.denom} className="font-mono text-xl px-0.5">
                      {new Intl.NumberFormat().format(coin.amount)}
                      <span className="text-gray-600 ml-1 text-lg">{coin.denom}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-gray-500 text-lg font-semibold">Connect first</div>
            )}
          </div>
          <div className="">
            <Button className="btn-primary w-32 py-2 h-10 rounded-md" disabled={!isClaimable} onClick={claimFaucet}>
              Claim
            </Button>
          </div>
        </div>
      </div>
      <TxDialog txResponse={txResponse} isLoading={isLoading} />
    </section>
  );
}
