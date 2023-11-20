/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions } from "@tanstack/react-query";
import { useClient } from "../useClient";
import type { Ref } from "vue";

export default function useMycelFurnace() {
  const client = useClient();
  const QueryParams = (options: any) => {
    const key = { type: "QueryParams" };
    return useQuery(
      [key],
      () => {
        return client.MycelFurnace.query.queryParams().then((res) => res.data);
      },
      options,
    );
  };

  const QueryEpochBurnConfig = (options: any) => {
    const key = { type: "QueryEpochBurnConfig" };
    return useQuery(
      [key],
      () => {
        return client.MycelFurnace.query.queryEpochBurnConfig().then((res) => res.data);
      },
      options,
    );
  };

  const QueryBurnAmount = (index: string, options: any) => {
    const key = { type: "QueryBurnAmount", index };
    return useQuery(
      [key],
      () => {
        const { index } = key;
        return client.MycelFurnace.query.queryBurnAmount(index).then((res) => res.data);
      },
      options,
    );
  };

  const QueryBurnAmountAll = (query: any, options: any, perPage: number) => {
    const key = { type: "QueryBurnAmountAll", query };
    return useInfiniteQuery(
      [key],
      ({ pageParam = 1 }: { pageParam?: number }) => {
        const { query } = key;

        query["pagination.limit"] = perPage;
        query["pagination.offset"] = (pageParam - 1) * perPage;
        query["pagination.count_total"] = true;
        return client.MycelFurnace.query
          .queryBurnAmountAll(query ?? undefined)
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

  return { QueryParams, QueryEpochBurnConfig, QueryBurnAmount, QueryBurnAmountAll };
}
