import { Link } from 'react-router-dom'
import { Network, TextSelect } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import ResolveButton from '@/components/ResolveButton'
import { useMycelRegistry } from '@/hooks/useMycelRegistry'

interface MyDomainsProps {
  className?: string
}
export default function MyDomains(props: MyDomainsProps) {
  const { className } = props
  const { mycelAccount, isConnected } = useWallet()
  const { isLoading, ownedDomains } = useMycelRegistry()

  return (
    <section className={className ?? ''}>
      <h3 className="font-cursive text-2xl text-black font-semibold px-1 py-2 flex flex-1 items-center border-b-2 border-black">
        <Network className="opacity-70 mr-2" size={26} />
        My Domains
      </h3>
      <div className="table-auto w-full px-1">
        {ownedDomains?.map(domain => (
          <div className="py-2 flex w-full justify-between items-center" key={domain.name}>
            <div className="flex items-center py-5 font-semibold">
              <h2 className="text-2xl font-semibold">
                {domain.name}.{domain.parent}
              </h2>
            </div>
            <div className="">
              <ResolveButton name={domain.name} parent={domain.parent} />
            </div>
          </div>
        ))}
      </div>
      {mycelAccount?.address && isLoading && (
        <div role="status" className="w-100 animate-pulse flex flex-col">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {ownedDomains.length === 0 && (
        <div className="py-8 flex items-center flex-col justify-center">
          <div className="text-gray-500 text-lg font-semibold inline-flex">
            {isConnected ? (
              <>
                <TextSelect className="mr-1.5" />
                You have no domains
              </>
            ) : (
              'Connect first'
            )}
          </div>
          {isConnected && (
            <Link className="text-chocolat ml-5 mt-1 hover:underline" to="/register">
              &#9758; Register Domain
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
