import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { object, string } from "valibot";
import { useClient } from "@/hooks/useClient";
import useWallet from "@/hooks/useWallet";
import { useMycelRegistry } from "@/hooks/useMycelRegistry";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { PencilRuler, PiggyBank, SearchSlash } from "lucide-react";
import TxDialog from "@/components/dialog/TxDialog";
import ResolveButton from "@/components/ResolveButton";
import { convertToDomain } from "@/utils/domainName";
import { Domain } from "@/types/domain";
import { MYCEL_COIN_DECIMALS, MYCEL_HUMAN_COIN_UNIT, convertToDecimalString } from "@/utils/coin";
import { useStore } from "@/store/index";

export default function RegisterView() {
  const { isConnected, mycelAccount } = useWallet();
  const client = useClient();
  const navigate = useNavigate();
  const { secondLevelDomain, fee, registryQueryDomain, registryQueryRegistrationFee } = useMycelRegistry();
  const [query, setQuery] = useState<string>("");
  const [domain, setDomain] = useState<Domain>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();
  const [error, setError] = useState<string>("");
  const updateDialog = useStore((state) => state.updateDialog);

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
    updateDialog("tx");

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
            updateDialog(undefined);
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
            updateDialog(undefined);
          });
      }
    }
  };

  const RegisterInputSchema = object({
    text: string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
  } = useForm({
    mode: "onBlur",
    resolver: valibotResolver(RegisterInputSchema),
  });

  const onSubmit = (data: any) => {
    setQuery(data.text);
  };

  return (
    <>
      <div className="container my-12">
        <h2 className="font-cursive text-3xl text-black font-semibold mb-6 flex items-center">
          <PencilRuler className="opacity-70 mr-2" size={28} />
          Register
        </h2>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mt-2 mb-10 relative">
            <input
              type="search"
              className="w-full leading-tight h-12"
              placeholder="Enter Top Level or Second Level Domain Name"
              {...register("text", { onBlur: () => onSubmit(getValues()) })}
            />
            <button className="absolute right-0 h-12 px-4" type="submit">
              <SearchSlash className="text-chocolat" />
            </button>
          </div>
        </form>
        {fee && fee.isRegistrable ? (
          <div className="border-t border-b border-dashed border-black py-8 px-4">
            <div className="w-full flex justify-between items-center">
              <div className="m-2">
                <h2 className="text-2xl font-semibold flex items-center">
                  {query}
                  <span className="ml-4 text-xs text-chocolat border-2 border-chocolat py-0.5 px-2 rounded-lg">
                    <span className="hidden md:inline-flex">
                      {domain?.parent ? "Second Level Domain" : "Top Level Domain"}
                    </span>
                    <span className="inline-flex md:hidden">{domain?.parent ? "SLD" : "TLD"}</span>
                  </span>
                </h2>
                {fee.fee && fee.fee[0].amount && (
                  <h2 className="text-xl font-mon flex items-center mt-2">
                    <PiggyBank size={20} className="mr-1.5 text-gray-500" />
                    {convertToDecimalString(fee.fee[0].amount, MYCEL_COIN_DECIMALS)}
                    <span className="ml-0.5 text-gray-600 text-base mt-0.5">{MYCEL_HUMAN_COIN_UNIT}/Year</span>
                  </h2>
                )}
              </div>
              <button
                disabled={!isConnected}
                onClick={registerDomain}
                className="btn-primary px-6 h-12 py-1 rounded-md"
              >
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
              <h2 className="text-error text-2xl m-2 font-semibold">{query} is not available</h2>
            </div>
          </div>
        ) : (
          <></>
        )}
        {error !== "" && <h2 className="  m-2 text-error font-semibold">{error}</h2>}
      </div>

      <TxDialog
        txResponse={txResponse}
        isLoading={isLoading}
        onClosed={() => {
          navigate(`/resolve?name=${domain?.name}&parent=${domain?.parent}`);
        }}
      />
    </>
  );
}
