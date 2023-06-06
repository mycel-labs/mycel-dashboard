import { useAddressContext } from "../def-hooks/addressContext";
import ResolveButton from "../components/ResolveButton";
import { useDomainOwnership } from "../def-hooks/useDomainOwnership";

interface MyDomainsProps {
  className?: string;
}
export default function MyDomains(props: MyDomainsProps) {
  const { className } = props;
  const { address } = useAddressContext();
  const { domains, isLoading } = useDomainOwnership();

  return (
    <section className={className ?? ""}>
      <header className="flex items-center justify-between">
        <h2 className="text-3xl text-black font-semibold p-0 m-0 mb-2.5 flex-1">Domains</h2>
      </header>
      <table className="table-auto w-full">
        <tbody>
          {domains?.map((domain) => (
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
      {!domains && <div className="text-left text-black opacity-75 text-md font-normal py-8">You have no domains</div>}
    </section>
  );
}
