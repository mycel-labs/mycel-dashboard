import { useSignTypedData } from "wagmi";
import useWallet from "@/hooks/useWallet";
import { getSignTypedData } from "@/utils/wallets";
import { AES } from "crypto-js";

const staticEncryptionKey = import.meta.env.VITE_PK_ENCRYPTION_KEY;

export default async function GenerateKeys() {
  const { setWalletFromEvmSignature, saveEvmSignature } = useWallet();
  console.log("1");
  const signTypedData = getSignTypedData();
  console.log("2", signTypedData);
  const { signTypedDataAsync } = useSignTypedData({
    ...signTypedData,
    domain: {
      ...signTypedData.domain,
      chainId: 1,
    },
  });
  console.log("3");
  const signature = await signTypedDataAsync();
  console.log("4");
  await setWalletFromEvmSignature(signature);
  console.log("5");
  const encryptedSignature = AES.encrypt(signature, staticEncryptionKey).toString();
  console.log("6");
  saveEvmSignature(encryptedSignature);
}
