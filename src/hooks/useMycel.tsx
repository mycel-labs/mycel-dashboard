import useSWR from "swr";
import { useClient } from "@/hooks/useClient";
import { Domain } from "@/types/domain";

export const useQueryAllRecords = (domain: Domain | undefined) => {
  const client = useClient();
  const fetcher = (domain: Domain) =>
    client.MycelResolver.query.queryAllRecords(domain.name, domain.parent).then((res) => res.data);
  const { data, error, isLoading } = useSWR(domain, fetcher);

  return {
    data,
    error,
    isLoading,
  };
};

export const useQueryDomainOwnership = (address: string | undefined) => {
  const client = useClient();
  const fetcher = (address: string) => client.MycelRegistry.query.queryDomainOwnership(address).then((res) => res.data);
  const { data, error, isLoading } = useSWR(address, fetcher);

  return {
    data,
    error,
    isLoading,
  };
};
