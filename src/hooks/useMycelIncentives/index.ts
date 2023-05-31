/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/react-query";
import { useClient } from "../useClient";
import type { Ref } from "vue";

export default function useMycelIncentives() {
  const client = useClient();
  const QueryParams = (options: any) => {
    const key = { type: "QueryParams" };
    return useQuery(
      [key],
      () => {
        return client.MycelIncentives.query.queryParams().then((res) => res.data);
      },
      options,
    );
  };

  const QueryEpochIncentive = (epoch: string, options: any) => {
    const key = { type: "QueryEpochIncentive", epoch };
    return useQuery(
      [key],
      () => {
        const { epoch } = key;
        return client.MycelIncentives.query.queryEpochIncentive(epoch).then((res) => res.data);
      },
      options,
    );
  };

  const QueryEpochIncentiveAll = (query: any, options: any, perPage: number) => {
    const key = { type: "QueryEpochIncentiveAll", query };
    return useInfiniteQuery(
      [key],
      ({ pageParam = 1 }: { pageParam?: number }) => {
        const { query } = key;

        query["pagination.limit"] = perPage;
        query["pagination.offset"] = (pageParam - 1) * perPage;
        query["pagination.count_total"] = true;
        return client.MycelIncentives.query
          .queryEpochIncentiveAll(query ?? undefined)
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

  const QueryValidatorIncentive = (address: string, options: any) => {
    const key = { type: "QueryValidatorIncentive", address };
    return useQuery(
      [key],
      () => {
        const { address } = key;
        return client.MycelIncentives.query.queryValidatorIncentive(address).then((res) => res.data);
      },
      options,
    );
  };

  const QueryValidatorIncentiveAll = (query: any, options: any, perPage: number) => {
    const key = { type: "QueryValidatorIncentiveAll", query };
    return useInfiniteQuery(
      [key],
      ({ pageParam = 1 }: { pageParam?: number }) => {
        const { query } = key;

        query["pagination.limit"] = perPage;
        query["pagination.offset"] = (pageParam - 1) * perPage;
        query["pagination.count_total"] = true;
        return client.MycelIncentives.query
          .queryValidatorIncentiveAll(query ?? undefined)
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

  const QueryDelegetorIncentive = (address: string, options: any) => {
    const key = { type: "QueryDelegetorIncentive", address };
    return useQuery(
      [key],
      () => {
        const { address } = key;
        return client.MycelIncentives.query.queryDelegetorIncentive(address).then((res) => res.data);
      },
      options,
    );
  };

  const QueryDelegetorIncentiveAll = (query: any, options: any, perPage: number) => {
    const key = { type: "QueryDelegetorIncentiveAll", query };
    return useInfiniteQuery(
      [key],
      ({ pageParam = 1 }: { pageParam?: number }) => {
        const { query } = key;

        query["pagination.limit"] = perPage;
        query["pagination.offset"] = (pageParam - 1) * perPage;
        query["pagination.count_total"] = true;
        return client.MycelIncentives.query
          .queryDelegetorIncentiveAll(query ?? undefined)
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

  return {
    QueryParams,
    QueryEpochIncentive,
    QueryEpochIncentiveAll,
    QueryValidatorIncentive,
    QueryValidatorIncentiveAll,
    QueryDelegetorIncentive,
    QueryDelegetorIncentiveAll,
  };
}
