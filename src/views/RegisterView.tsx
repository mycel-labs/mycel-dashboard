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
  const { isConnected, mycelAccount, mycelOfflineSigner } = useWallet();
  const client = useClient(mycelOfflineSigner);
  const navigate = useNavigate();
  const { secondLevelDomain, fee, registryQueryDomain, registryQueryRegistrationFee } = useMycelRegistry();
  const [query, setQuery] = useState<string>("");
  const [domain, setDomain] = useState<Domain>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setDomain(convertToDomain(query));
  }, [query]);

  useEffect(() => {
    if (domain) {
      registryQueryRegistrationFee(domain);
      registryQueryDomain(domain);
    }
    setError("");
  }, [domain]);

  const registerDomain = async () => {
    setIsLoading(true);
    setIsShow(true);

    if (domain) {
      if (domain.parent === "") {
        // Register top level domain
        await client.MycelRegistry.tx
          .sendMsgRegisterTopLevelDomain({
            value: {
              creator: mycelAccount?.address ?? "",
              name: domain?.name ?? "",
              registrationPeriodInYear: 1,
            },
          })
          .then((res) => {
            setIsLoading(false);
            setTxResponse(res as DeliverTxResponse);
          })
          .catch((error) => {
            setError(error.message);
            setIsShow(false);
          });
      } else {
        // Register second level domain
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
          .catch((error) => {
            setError(error.message);
            setIsShow(false);
          });
      }
    }
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

        {fee && fee.isRegistrable ? (
          <div className="border-t border-b border-dashed border-black py-8 px-4">
            <div className="w-full flex justify-between">
              <h2 className=" text-2xl m-2 font-semibold">{query}</h2>
              {fee.fee && fee.fee[0] && (
                <h2 className=" text-2xl pl-5 m-2">
                  {fee.fee[0].amount} {fee.fee[0].denom}/ Year{" "}
                </h2>
              )}
              <button disabled={!isConnected} onClick={registerDomain} className="btn-primary w-40 py-1 rounded-md">
                Register
              </button>
            </div>
            {!isConnected && <p className="text-error m-2 font-semibold">Please connect wallet first</p>}
          </div>
        ) : secondLevelDomain?.info ? (
          <div className="border-t border-b border-dashed border-black py-8 px-4">
            <div className="w-full flex justify-between">
              <h2 className=" text-2xl m-2 font-semibold">{query}</h2>
              <h2 className=" text-2xl m-2">{fee?.errorMessage}</h2>
              <ResolveButton name={domain?.name} parent={domain?.parent} text={"Registered"} />
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
        {error !== "" && <h2 className="  m-2 text-error font-semibold">{error}</h2>}
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
