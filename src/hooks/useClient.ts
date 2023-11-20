import { Client } from "mycel-client-ts";
import { OfflineSigner } from "@cosmjs/proto-signing";
import { env } from "@/env";

const useClientInstance = (signer?: OfflineSigner) => {
  return new Client(env, signer);
};
let clientInstance: ReturnType<typeof useClientInstance>;

export const useClient = (signer?: OfflineSigner) => {
  clientInstance = useClientInstance(signer);
  return clientInstance;
};
