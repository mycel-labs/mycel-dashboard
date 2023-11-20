/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/react-query";
import { useClient } from "../useClient";
import type { Ref } from "vue";

export default function useMycelResolver() {
  const client = useClient();
  const QueryParams = (options: any) => {
    const key = { type: "QueryParams" };
    return useQuery(
      [key],
      () => {
        return client.MycelResolver.query.queryParams().then((res) => res.data);
      },
      options,
    );
  };

  const QueryWalletRecord = (domainName: string, domainParent: string, walletRecordType: string, options: any) => {
    const key = { type: "QueryWalletRecord", domainName, domainParent, walletRecordType };
    return useQuery(
      [key],
      () => {
        const { domainName, domainParent, walletRecordType } = key;
        return client.MycelResolver.query
          .queryWalletRecord(domainName, domainParent, walletRecordType)
          .then((res) => res.data);
      },
      options,
    );
  };

  const QueryDnsRecord = (domainName: string, domainParent: string, dnsRecordType: string, options: any) => {
    const key = { type: "QueryDnsRecord", domainName, domainParent, dnsRecordType };
    return useQuery(
      [key],
      () => {
        const { domainName, domainParent, dnsRecordType } = key;
        return client.MycelResolver.query
          .queryDnsRecord(domainName, domainParent, dnsRecordType)
          .then((res) => res.data);
      },
      options,
    );
  };

  const QueryAllRecords = (domainName: string, domainParent: string, options: any) => {
    const key = { type: "QueryAllRecords", domainName, domainParent };
    return useQuery(
      [key],
      () => {
        const { domainName, domainParent } = key;
        return client.MycelResolver.query.queryAllRecords(domainName, domainParent).then((res) => res.data);
      },
      options,
    );
  };

  return { QueryParams, QueryWalletRecord, QueryDnsRecord, QueryAllRecords };
}
