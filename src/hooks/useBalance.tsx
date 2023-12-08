import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useClient } from "@/hooks/useClient";

export default function useBalance(denom = "umycel") {
  const { mycelAccount } = useWallet();
  const client = useClient();
  const [balance, setBalance] = useState<any | undefined>(undefined);

  useEffect(() => {
    const fetchBalance = async (address: string) => {
      if (!address) return;
      const res = await client.CosmosBankV1Beta1.query.queryBalance(address, { denom });
      if (res.status === 200 && res.data.balance) setBalance(res.data.balance);
    };

    if (mycelAccount?.address) {
      fetchBalance(mycelAccount.address);
    }
  }, [mycelAccount?.address]);

  return { balance };
}
