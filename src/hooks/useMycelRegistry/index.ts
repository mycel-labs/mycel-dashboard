/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/react-query";
import { useClient } from "../useClient";
import type { Ref } from "vue";

export default function useMycelRegistry() {
  const client = useClient();
  const QueryParams = (options: any) => {
    const key = { type: "QueryParams" };
    return useQuery(
      [key],
      () => {
        return client.MycelRegistry.query.queryParams().then((res) => res.data);
      },
      options,
    );
  };

  const QueryTopLevelDomain = (name: string, options: any) => {
    const key = { type: "QueryTopLevelDomain", name };
    return useQuery(
      [key],
      () => {
        const { name } = key;
        return client.MycelRegistry.query.queryTopLevelDomain(name).then((res) => res.data);
      },
      options,
    );
  };

  const QueryTopLevelDomainAll = (query: any, options: any, perPage: number) => {
    const key = { type: "QueryTopLevelDomainAll", query };
    return useInfiniteQuery(
      [key],
      ({ pageParam = 1 }: { pageParam?: number }) => {
        const { query } = key;

        query["pagination.limit"] = perPage;
        query["pagination.offset"] = (pageParam - 1) * perPage;
        query["pagination.count_total"] = true;
        return client.MycelRegistry.query
          .queryTopLevelDomainAll(query ?? undefined)
          .then((res) => ({ ...res.data, pageParam }));
      },
      {
        ...options,
        getNextPageParam: (lastPage, allPages) => {
          if ((lastPage.pagination?.total ?? 0) > (lastPage.pageParam ?? 0) * perPage) {
            return lastPage.pageParam + 1;
          } else {
            return undefined;
          }
        },
        getPreviousPageParam: (firstPage, allPages) => {
          if (firstPage.pageParam == 1) {
            return undefined;
          } else {
            return firstPage.pageParam - 1;
          }
        },
      },
    );
  };

  const QuerySecondLevelDomain = (name: string, parent: string, options: any) => {
    const key = { type: "QuerySecondLevelDomain", name, parent };
    return useQuery(
      [key],
      () => {
        const { name, parent } = key;
        return client.MycelRegistry.query.querySecondLevelDomain(name, parent).then((res) => res.data);
      },
      options,
    );
  };

  const QuerySecondLevelDomainAll = (query: any, options: any, perPage: number) => {
    const key = { type: "QuerySecondLevelDomainAll", query };
    return useInfiniteQuery(
      [key],
      ({ pageParam = 1 }: { pageParam?: number }) => {
        const { query } = key;

        query["pagination.limit"] = perPage;
        query["pagination.offset"] = (pageParam - 1) * perPage;
        query["pagination.count_total"] = true;
        return client.MycelRegistry.query
          .querySecondLevelDomainAll(query ?? undefined)
          .then((res) => ({ ...res.data, pageParam }));
      },
      {
        ...options,
        getNextPageParam: (lastPage, allPages) => {
          if ((lastPage.pagination?.total ?? 0) > (lastPage.pageParam ?? 0) * perPage) {
            return lastPage.pageParam + 1;
          } else {
            return undefined;
          }
        },
        getPreviousPageParam: (firstPage, allPages) => {
          if (firstPage.pageParam == 1) {
            return undefined;
          } else {
            return firstPage.pageParam - 1;
          }
        },
      },
    );
  };

  const QueryDomainOwnership = (owner: string, options: any) => {
    const key = { type: "QueryDomainOwnership", owner };
    return useQuery(
      [key],
      () => {
        const { owner } = key;
        return client.MycelRegistry.query.queryDomainOwnership(owner).then((res) => res.data);
      },
      options,
    );
  };

  const QueryDomainOwnershipAll = (query: any, options: any, perPage: number) => {
    const key = { type: "QueryDomainOwnershipAll", query };
    return useInfiniteQuery(
      [key],
      ({ pageParam = 1 }: { pageParam?: number }) => {
        const { query } = key;

        query["pagination.limit"] = perPage;
        query["pagination.offset"] = (pageParam - 1) * perPage;
        query["pagination.count_total"] = true;
        return client.MycelRegistry.query
          .queryDomainOwnershipAll(query ?? undefined)
          .then((res) => ({ ...res.data, pageParam }));
      },
      {
        ...options,
        getNextPageParam: (lastPage, allPages) => {
          if ((lastPage.pagination?.total ?? 0) > (lastPage.pageParam ?? 0) * perPage) {
            return lastPage.pageParam + 1;
          } else {
            return undefined;
          }
        },
        getPreviousPageParam: (firstPage, allPages) => {
          if (firstPage.pageParam == 1) {
            return undefined;
          } else {
            return firstPage.pageParam - 1;
          }
        },
      },
    );
  };

  const QueryDomainRegistrationFee = (name: string, parent: string, query: any, options: any) => {
    const key = { type: "QueryDomainRegistrationFee", name, parent, query };
    return useQuery(
      [key],
      () => {
        const { name, parent, query } = key;
        return client.MycelRegistry.query
          .queryDomainRegistrationFee(name, parent, query ?? undefined)
          .then((res) => res.data);
      },
      options,
    );
  };

  const QueryRole = (domainName: string, address: string, options: any) => {
    const key = { type: "QueryRole", domainName, address };
    return useQuery(
      [key],
      () => {
        const { domainName, address } = key;
        return client.MycelRegistry.query.queryRole(domainName, address).then((res) => res.data);
      },
      options,
    );
  };

  return {
    QueryParams,
    QueryTopLevelDomain,
    QueryTopLevelDomainAll,
    QuerySecondLevelDomain,
    QuerySecondLevelDomainAll,
    QueryDomainOwnership,
    QueryDomainOwnershipAll,
    QueryDomainRegistrationFee,
    QueryRole,
  };
}
