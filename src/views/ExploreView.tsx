import { useRef, useState, useEffect } from "react";
import { useClient } from "../hooks/useClient";
import { RegistryDomain } from "mycel-client-ts/mycel.registry/rest";
import ResolveButton from "../components/ResolveButton";
import Pagenation from "../components/Pagenation";

import Fuse from "fuse.js";

interface FuseDomainEntry {
  label: string;
  value: RegistryDomain;
}

export default function ExploreView() {
  const client = useClient();
  const [query, setQuery] = useState<string>("");
  const [domains, setDomains] = useState<FuseDomainEntry[]>([]);
  const [result, setResult] = useState<RegistryDomain[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const fuse = useRef<Fuse<FuseDomainEntry> | null>(null);

  const getDomainList = async () => {
    const response = await client.MycelRegistry.query.queryDomainAll({
      "pagination.key": "",
      "pagination.offset": `${(currentPage - 1) * 20}`,
      "pagination.limit": "20",
      "pagination.count_total": true,
    });

    console.log(response.data);
    if (response.data?.pagination?.total) {
      setTotalPages(Math.ceil(parseInt(response.data.pagination.total) / 20));
    }

    setDomains(
      (response.data.domain ?? []).map((e) => ({
        label: e.name + "." + e.owner,
        value: e,
      })),
    );
  };

  const onPageChange = async (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getDomainList();
  }, [currentPage]);

  useEffect(() => {
    fuse.current = new Fuse(domains, {
      keys: ["label"],
      includeScore: true,
    });
    setResult(domains.map((e) => e.value));
  }, [domains]);

  useEffect(() => {
    if (!query) {
      setResult(domains.map((e) => e.value));
      return;
    }
    const results = fuse.current?.search(query);
    setResult(results?.map(({ item }) => item.value) ?? []);
    console.log(result);
  }, [query]);

  return (
    <div className="w-3/4 mx-auto">
      <h2 className="text-3xl text-black font-semibold  mb-2.5">Explore </h2>
      <div className="flex mt-2 p-2 justify-between">
        <input
          className="mr-6 mt-1 py-2 px-4 h-14 bg-gray-100 w-full border-xs text-base leading-tight rounded-xl outline-0"
          placeholder="Search"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
      </div>
      <div>
        {result.map((e) => (
          <div className="w-full flex justify-between my-4" key={e.name + "." + e.parent}>
            <h2 className=" text-2xl m-2 font-semibold">{e.name + "." + e.parent}</h2>
            <ResolveButton name={e.name} parent={e.parent} />
          </div>
        ))}
      </div>
      <div>
        <Pagenation totalPages={totalPages} currentPage={currentPage} paginationLimit={2} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
