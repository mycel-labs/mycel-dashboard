import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, DeliverTxResponse } from "@cosmjs/stargate";
import { OfflineDirectSigner } from "@keplr-wallet/types";
import * as dotenv from "dotenv";
import { object, string } from "yup";

function getErrorMessage(err: any) {
  return {
    code: -1,
    rawLog: err,
  };
}

async function claimFaucet(address: string) {
  // Load environment variables
  dotenv.config();
  const amount = process.env.FAUCET_AMOUNT ?? "1000000";
  const threashold = process.env.VITE_FAUCET_CLAIMABLE_THRESHOLD ?? "300000";
  const faucetMnemonic = process.env.FAUCET_MNEMONIC ?? "";
  const rpc = process.env.VITE_WS_TENDERMINT ?? "";

  // Create faucet signer
  const faucetSigner = (await DirectSecp256k1HdWallet.fromMnemonic(faucetMnemonic, {
    prefix: "mycel",
  })) as OfflineDirectSigner;
  const faucetAddress = (await faucetSigner.getAccounts())[0].address;
  const faucetClient = await SigningStargateClient.connectWithSigner(rpc, faucetSigner);

  // Check if faucet has enough balance
  const balance = await faucetClient.getBalance(address, "umycel");
  if (balance.amount > threashold) {
    return getErrorMessage("Faucet has insufficient balance");
  }

  // Send tokens
  const response = await faucetClient
    .sendTokens(faucetAddress, address, [{ denom: "umycel", amount: amount }], {
      amount: [{ denom: "umycel", amount: amount }],
      gas: "200000",
    })
    .then((res: DeliverTxResponse) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  return response;
}

const faucetSchema = object({
  address: string().required(),
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  faucetSchema
    .validate(req.query)
    .then(async (validatedData) => {
      try {
        const response = await claimFaucet(validatedData.address);
        res.status(200).json({ response });
      } catch (err) {
        res.status(500).json(getErrorMessage(err.message));
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
}
