import { useEffect, useState } from "react";
import { IgntButton } from "@ignt/react-library";
import { convertToDomainName, convertToNameAndParent } from "../utils/domainName";
import { useSearchParams } from "react-router-dom";
import { useAddressContext } from "../def-hooks/addressContext";
import { useRegistryDomain } from "../def-hooks/useRegistryDomain";
import EditRecordModal from "../components/EditRecordModal";

export default function ResolveView() {
  const { address } = useAddressContext();
  const { registryDomain, updateRegistryDomain } = useRegistryDomain();
  const [query, setQuery] = useSearchParams({});
  const [inputtedDomainName, setInputtedDomainName] = useState("");
  const [isShow, setIsShow] = useState<boolean>(false);

  const updateRegistryHandler = async (domainName: string) => {
    try {
      await updateRegistryDomain(domainName);
      // Update query
      const { name, parent } = convertToNameAndParent(domainName);
      query.set("name", name);
      query.set("parent", parent);
      setQuery(query);
    } catch (e) {
      console.log(e);
      // Clear query
      query.delete("name");
      query.delete("parent");
      setQuery(query);
    }
  };

  useEffect(() => {
    const name = query.get("name") || "";
    const parent = query.get("parent") || "";
    if (inputtedDomainName || !name || !parent) {
      return;
    }
    const domainName = convertToDomainName(name, parent);
    setInputtedDomainName(domainName);
    updateRegistryHandler(domainName)
      .then()
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <div className="w-3/4 mx-auto">
        <div className="m-2">
          <div className="my-8">
            <h2 className="text-3xl text-black font-semibold  mb-2.5">Information</h2>
            <div className="table w-full border-collapse">
              <div className="table-header-group border-b font-medium">
                <div className=" table-cell w-3/12 py-2 pr-2">Domain Name</div>
                <div className=" table-cell w-5/12 py-2 pr-2">Owner Address</div>
                <div className=" table-cell w-4/12 py-2 pr-2">Expiration Date</div>
              </div>
              <div className=" table-row">
                <div className="table-cell py-2 pr-2">
                  {convertToDomainName(registryDomain?.name, registryDomain?.parent)}
                </div>
                <div className="table-cell py-2 pr-2">{registryDomain?.owner}</div>
                <div className="table-cell py-2 pr-2">
                  {registryDomain?.expirationDate
                    ? new Date(Math.round(parseInt(registryDomain?.expirationDate) / 1000000)).toUTCString()
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="my-8">
            <div className="container">
              <div className="grid grid-cols-2">
                <h2 className="text-3xl text-black font-semibold  mb-2.5">Records</h2>
              </div>
            </div>
            <div className="table w-full border-collapse">
              <div className="table-header-group border-b font-medium">
                <div className=" table-cell w-3/12 py-2 pr-2">Record Type</div>
                <div className=" table-cell w-9/12 py-2 pr-2">Value</div>
              </div>
              {Object.values(registryDomain?.walletRecords || []).map((v, i) => {
                return (
                  <div key={i} className=" table-row text-justify">
                    <div className="table-cell py-2 pr-2">{v.walletRecordType}</div>
                    <div className="table-cell py-2 pr-2">{v.value}</div>
                  </div>
                );
              })}
              {Object.values(registryDomain?.dnsRecords || []).map((v, i) => {
                return (
                  <div key={i} className="table-row text-justify">
                    <div className="table-cell py-2 pr-2">{v.dnsRecordType}</div>
                    <div className="table-cell py-2 pr-2">{v.value}</div>
                  </div>
                );
              })}
            </div>
            {address === registryDomain?.owner && (
              <IgntButton
                disabled={!address}
                onClick={() => {
                  setIsShow(true);
                }}
                className="mt-5 h-10 w-48"
              >
                Edit Record
              </IgntButton>
            )}
          </div>
        </div>
      </div>
      <EditRecordModal registryDomain={registryDomain} isShow={isShow} setIsShow={setIsShow} />
    </>
  );
}
