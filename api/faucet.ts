import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, DeliverTxResponse } from "@cosmjs/stargate";
import { OfflineDirectSigner } from "@keplr-wallet/types";
import * as dotenv from "dotenv";
import { object, string } from "yup";

async function claimFaucet(address: string) {
  // Load environment variables
  dotenv.config();
  const amount = process.env.FAUCET_AMOUNT ?? "10000";
  const threashold = process.env.FAUCET_THRESHOLD ?? "1000";
  const faucetMnemonic = process.env.FAUCET_MNEMONIC ?? "";
  const rpc = process.env.VITE_WS_TENDERMINT ?? "";

  // Create faucet signer
  const faucetSigner = (await DirectSecp256k1HdWallet.fromMnemonic(faucetMnemonic, {
    prefix: "mycel",
  })) as OfflineDirectSigner;
  const faucetAddress = (await faucetSigner.getAccounts())[0].address;
  const faucetClient = await SigningStargateClient.connectWithSigner(rpc, faucetSigner);

  // Check if faucet has enough balance
  const balance = await faucetClient.getBalance(address, "mycel");
  if (balance.amount > threashold) {
    return { error: "You have enough balance" };
  }

  // Send tokens
  const response = await faucetClient
    .sendTokens(faucetAddress, address, [{ denom: "mycel", amount: amount }], {
      amount: [{ denom: "mycel", amount: amount }],
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
        res.status(500).json({ error: err.message });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
}
