import { useState, useEffect } from "react";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, DeliverTxResponse } from "@cosmjs/stargate";
import { OfflineDirectSigner } from "@keplr-wallet/types";
import { useClient } from "../hooks/useClient";
import { useAddressContext } from "../def-hooks/addressContext";
import TxModal from "../components/TxModal";
import Button from "../components/Button";

export default function Faucet() {
  const { address } = useAddressContext();
  const client = useClient();

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isClaimable, setIsClaimable] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

  const faucetMnemonic = import.meta.env.VITE_FAUCET_MNEMONIC ?? "";

  const queryBalance = async () => {
    const balance = await client.CosmosBankV1Beta1.query.queryBalance(address, { denom: "umycel" }).then((res) => {
      if (res.data.balance?.amount) {
        return res.data.balance.amount;
      }
    });
    setBalance(balance ?? "0");
  };

  useEffect(() => {
    queryBalance();
  }, [address]);

  useEffect(() => {
    if (parseInt(balance) < 1000) {
      setIsClaimable(true);
    } else {
      setIsClaimable(false);
    }
  }, [balance]);

  const claimFaucet = async () => {
    setIsLoading(true);
    setIsShow(true);

    if (isClaimable) {
      const faucetSigner = (await DirectSecp256k1HdWallet.fromMnemonic(faucetMnemonic, {
        prefix: "mycel",
      })) as OfflineDirectSigner;
      const faucetAddress = (await faucetSigner.getAccounts())[0].address;
      const rpc = import.meta.env.VITE_WS_TENDERMINT ?? "";
      const amount = import.meta.env.VITE_FAUCET_AMOUNT ?? "1000";
      const faucetClient = await SigningStargateClient.connectWithSigner(rpc, faucetSigner);

      await faucetClient
        .sendTokens(faucetAddress, address, [{ denom: "umycel", amount: amount }], {
          amount: [{ denom: "umycel", amount: "500" }],
          gas: "200000",
        })
        .then((res) => {
          setIsLoading(false);
          setTxResponse(res as DeliverTxResponse);
        })
        .catch((err) => {
          setIsShow(false);
          console.log(err);
        });
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
