import { useState } from "react";
import { useClient } from "../hooks/useClient";
import { RegistryRecord, RegistryNetworkName } from "mycel-client-ts/mycel.resolver/rest";
import { convertToNameAndParent } from "../utils/domainName";

export const useMycelResolver = () => {
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [mycelRecords, setMycelRecord] = useState<Record<string, RegistryRecord> | null>(
    null
  );

  const updateMycelRecords = async (domainName: string) => {
    const { name, parent } = convertToNameAndParent(domainName);
    setIsLoading(true);
    try {
      const record = await client.MycelResolver.query.queryAllRecords(name, parent);
      setMycelRecord(record.data.values || null);
    } catch (e) {
      console.error(e);
      setMycelRecord(null);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const getWalletAddr = (recordType: RegistryNetworkName) => {
    if (!mycelRecords || !mycelRecords[recordType] || !mycelRecords[recordType].walletRecord) {
      return "";
    } else {
      return mycelRecords[recordType].walletRecord?.value;
    }
  };
  return { mycelRecords, isLoading, updateMycelRecords, getWalletAddr };
};
