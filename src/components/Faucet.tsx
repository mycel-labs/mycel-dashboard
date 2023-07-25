import { useState } from "react";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, DeliverTxResponse } from "@cosmjs/stargate";
import { OfflineDirectSigner } from "@keplr-wallet/types";
import { IgntButton } from "@ignt/react-library";
import { useClient } from "../hooks/useClient";
import { useAddressContext } from "../def-hooks/addressContext";
import TxModal from "../components/TxModal";

export default function Faucet() {
  const { address } = useAddressContext();
  const client = useClient();

  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

  const faucetMnemonic = import.meta.env.VITE_FAUCET_MNEMONIC ?? "";

  const revceiveFaucet = async () => {
    setIsLoading(true);
    setIsShow(true);

    const faucetSigner = (await DirectSecp256k1HdWallet.fromMnemonic(faucetMnemonic, {
      prefix: "mycel",
    })) as OfflineDirectSigner;
    const faucetAddress = (await faucetSigner.getAccounts())[0].address;
    const rpc = import.meta.env.VITE_WS_TENDERMINT ?? "";
    const amount = import.meta.env.VITE_FAUCET_AMOUNT ?? "1000";
    const faucetClient = await SigningStargateClient.connectWithSigner(rpc, faucetSigner);

    await faucetClient
      .sendTokens(faucetAddress, address, [{ denom: "mycel", amount: amount }], {
        amount: [{ denom: "mycel", amount: "500" }],
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
  };

  return (
    <>
      <IgntButton className="w-full" onClick={revceiveFaucet}>
        Receive
      </IgntButton>
      <TxModal isShow={isShow} setIsShow={setIsShow} txResponse={txResponse} isLoading={isLoading} onClosed={} />
    </>
  );
}
