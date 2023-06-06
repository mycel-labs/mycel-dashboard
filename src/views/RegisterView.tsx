import { useState, useEffect } from "react";
import { useClient } from "../hooks/useClient";
import { RegistryDomain } from "mycel-client-ts/mycel.registry/rest";
import { useAddressContext } from "../def-hooks/addressContext";
import { IgntButton } from "@ignt/react-library";
import { DeliverTxResponse } from "@cosmjs/stargate";
import TxModal from "../components/TxModal";
import ResolveButton from "../components/ResolveButton";

export default function RegisterView() {
  const client = useClient();
  const { address } = useAddressContext();
  const [query, setQuery] = useState<string>("");
  const [isRegistable, setIsRegistable] = useState<boolean>(false);
  const [domain, setDomain] = useState<RegistryDomain>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

  const getDomain = async () => {
    await client.MycelRegistry.query
      .queryDomain(query, "cel")
      .then((res) => setDomain(res.data.domain))
      .catch(() => {
        setDomain(undefined);
      });
  };

  useEffect(() => {
    getDomain();
    // queried domain is not registered
    if (!domain && query !== "") {
      setIsRegistable(true);
    } else {
      setIsRegistable(false);
    }
  }, [query, domain]);

  const registerDomain = async () => {
    setIsLoading(true);
    setIsShow(true);
    await client.MycelRegistry.tx
      .sendMsgRegisterDomain({
        value: {
          creator: address,
          name: query,
          parent: "cel",
          registrationPeriodInYear: 1,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setTxResponse(res as DeliverTxResponse);
      })
      .catch(() => {
        setIsShow(false);
      });
  };

  return (
    <>
      <div className="w-3/4 mx-auto">
        <h2 className="text-3xl text-black font-semibold  mb-2.5">Register</h2>
        <div className="flex mt-2 p-2 justify-between">
          <input
            className="mr-6 mt-1 py-2 px-4 h-14 bg-gray-100 w-full border-xs text-base leading-tight rounded-xl outline-0"
            placeholder=".cel"
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </div>
        {isRegistable ? (
          <div>
            <div className="w-full flex justify-between my-4">
              <h2 className=" text-2xl m-2 font-semibold">{query + ".cel"}</h2>
              <IgntButton disabled={!address} onClick={registerDomain} className="mt-1 h-10 w-48">
                Register
              </IgntButton>
            </div>
            {!address && <h2 className="text-red-600 m-2 font-semibold">Please connect wallet first</h2>}
          </div>
        ) : domain ? (
          <div>
            <div className="w-full flex justify-between my-4">
              <h2 className=" text-2xl m-2 font-semibold">{domain.name + "." + domain.parent}</h2>

              <ResolveButton name={domain.name} parent={domain.parent} />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <TxModal isShow={isShow} setIsShow={setIsShow} txResponse={txResponse} isLoading={isLoading} />
    </>
  );
}
