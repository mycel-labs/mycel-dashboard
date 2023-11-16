import { useEffect } from "react";
import { useAddressContext } from "../def-hooks/addressContext";
import ResolveButton from "../components/ResolveButton";
import { useMycelRegistry } from "@/hooks/useMycelRegistry";
import { Network } from "lucide-react";

interface MyDomainsProps {
  className?: string;
}
export default function MyDomains(props: MyDomainsProps) {
  const { className } = props;
  const { address } = useAddressContext();
  const { isLoading, ownedDomains, registryQueryOwnedDomains } = useMycelRegistry();

  useEffect(() => {
    if (address) {
      registryQueryOwnedDomains(address);
    }
  }, [address]);

  return (
    <section className={className ?? ""}>
      <h3 className="text-xl text-black font-semibold px-1 py-2 flex flex-1 items-center border-b-2 border-black">
        <Network className="opacity-70 mr-2" size={24} />
        My Domains
      </h3>
      <table className="table-auto w-full">
        <tbody>
          {ownedDomains?.map((domain) => (
            <tr className="py-2" key={domain.name}>
              <td className="flex items-center py-5 font-semibold">
                <h2 className="text-2xl font-semibold">
                  {domain.name}.{domain.parent}
                </h2>
              </td>
              <td className="text-right">
                <ResolveButton name={domain.name} parent={domain.parent} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {address && isLoading && (
        <div role="status" className="w-100 animate-pulse flex flex-col">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {!ownedDomains && <div className="text-black/70 text-center font-normal py-8">You have no domains</div>}
    </section>
  );
}
