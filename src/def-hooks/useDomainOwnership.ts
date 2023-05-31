import useMycelRegistry from "../hooks/useMycelRegistry";
import { useAddressContext } from "./addressContext";

export const useDomainOwnership = () => {
  const { address } = useAddressContext();
  const { QueryDomainOwnership } = useMycelRegistry();
  const query = QueryDomainOwnership(address, {});
  return { domains: query.data?.domains, isLoading: query.isLoading };
};
