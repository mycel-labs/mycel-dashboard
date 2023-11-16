import { useState, useEffect } from "react";
import { useClient } from "@/hooks/useClient";
import { useNavigate } from "react-router-dom";
import useWallet from "@/hooks/useWallet";
import { useMycelRegistry } from "@/hooks/useMycelRegistry";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { PencilRuler } from "lucide-react";
import TxModal from "@/components/TxModal";
import ResolveButton from "@/components/ResolveButton";
import { convertToDomain } from "@/utils/domainName";
import { Domain } from "@/types/domain";

export default function RegisterView() {
  const client = useClient();
  const navigate = useNavigate();
  const { secondLevelDomain, registryQueryDomain } = useMycelRegistry();
  const { isConnected, mycelAccount } = useWallet();
  const [query, setQuery] = useState<string>("");
  const [isRegistrable, setIsRegistable] = useState<boolean>(false);
  const [domain, setDomain] = useState<Domain>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

  useEffect(() => {
    setDomain(convertToDomain(query));
  }, [query]);

  useEffect(() => {
    if (domain) {
      registryQueryDomain(domain);
    }
  }, [domain]);

  useEffect(() => {
    console.log(isRegistrable);
    if (secondLevelDomain?.parent?.isRegistered) {
      setIsRegistable(!secondLevelDomain?.isRegistered);
    } else {
      setIsRegistable(false);
    }
  }, [secondLevelDomain]);

  const registerDomain = async () => {
    setIsLoading(true);
    setIsShow(true);
    await client.MycelRegistry.tx
      .sendMsgRegisterSecondLevelDomain({
        value: {
          creator: mycelAccount?.address ?? "",
          name: domain?.name ?? "",
          parent: domain?.parent ?? "",
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
      <div className="container my-12">
        <h2 className="font-cursive text-3xl text-black font-semibold mb-6 flex items-center">
          <PencilRuler className="opacity-70 mr-2" size={28} />
          Register
        </h2>
        <div className="flex mt-2 mb-10">
          <input
            type="search"
            className="w-full leading-tight"
            placeholder=".cel"
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </div>
        {isRegistrable ? (
          <div className="border-t border-b border-dashed border-black py-8 px-4">
            <div className="w-full flex justify-between">
              <h2 className=" text-2xl m-2 font-semibold">{query}</h2>
              <button disabled={!isConnected} onClick={registerDomain} className="btn-primary w-40 py-1 rounded-md">
                Available
              </button>
            </div>
            {!isConnected && <p className="text-error m-2 font-semibold">Please connect wallet first</p>}
          </div>
        ) : secondLevelDomain?.info ? (
          <div className="border-t border-b border-dashed border-black py-8 px-4">
            <div className="w-full flex justify-between">
              <h2 className=" text-2xl m-2 font-semibold">{query}</h2>
              <ResolveButton name={domain?.name} parent={domain?.parent} />
            </div>
          </div>
        ) : query !== "" ? (
          <div className="border-t border-b border-dashed border-black py-8 px-4">
            <div className="w-full flex justify-between">
              <h2 className=" text-2xl m-2 font-semibold">{query} is not available</h2>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <TxModal
        isShow={isShow}
        setIsShow={setIsShow}
        txResponse={txResponse}
        isLoading={isLoading}
        onClosed={() => {
          navigate(`/resolve?name=${domain?.name}&parent=${domain?.parent}`);
        }}
      />
    </>
  );
}
