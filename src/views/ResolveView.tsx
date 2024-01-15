import { useEffect, useState } from 'react'
import Button from '~/components/Button'
import { convertToDomainString } from '~/utils/domainName'
import { useSearchParams } from 'react-router-dom'
import { useWallet } from '~/hooks/useWallet'
import EditRecordDialog from '~/components/dialog/EditRecordDialog'
import { BadgeInfo, FileStack, Network } from 'lucide-react'
import { Domain } from '~/types/domain'
import { useMycelResolver } from '~/hooks/useMycelResolver'
import { useMycelRegistry } from '~/hooks/useMycelRegistry'
import { useStore } from '~/store/index'

export default function ResolveView() {
  const { mycelAccount } = useWallet()
  const { mycelRecords, updateMycelRecords } = useMycelResolver()
  const { topLevelDomain, registryQueryDomain, registryQueryRole } = useMycelRegistry()
  const [domain, setDomain] = useState<Domain>()
  const [query, setQuery] = useSearchParams({})
  const [isEditable, setIsEditable] = useState<boolean>(false)
  const updateDialog = useStore((state) => state.updateDialog)

  const updateRegistryHandler = async (name: string, parent: string) => {
    try {
      await updateMycelRecords({ name, parent })
      await registryQueryDomain({ name, parent })

      if (mycelAccount) {
        const role = await registryQueryRole({ name, parent }, mycelAccount.address)
        if (role === 'OWNER' || role === 'EDITOR') {
          setIsEditable(true)
        } else {
          setIsEditable(false)
        }
      }
      // Update query
      query.set('name', name)
      query.set('parent', parent)
      setQuery(query)
    } catch (e) {
      console.log(e)
      // Clear query
      query.delete('name')
      query.delete('parent')
      setQuery(query)
    }
  }

  useEffect(() => {
    const name = query.get('name') || ''
    const parent = query.get('parent') || ''
    setDomain({ name, parent })
    updateRegistryHandler(name, parent)
      .then()
      .catch((e) => {
        console.log(e)
      })
  }, [mycelAccount])

  return (
    <>
      <div className="container my-12">
        <div className="my-8">
          <h2 className="font-cursive text-3xl text-black font-semibold mb-4 flex items-center">
            <BadgeInfo className="opacity-70 mr-2 inline" size={28} />
            Resolve Information
          </h2>
          <h3 className="text-xl text-black font-semibold py-2 px-1 flex items-center border-b-2 border-black mb-4">
            <Network className="opacity-70 mr-2" size={24} />
            Domain
          </h3>
          <div className="overflow-x-auto">
            <div className="table w-full border-collapse">
              <div className="table-header-group border-b font-medium">
                <div className=" table-cell w-3/12 py-2 pr-2">Domain Name</div>
                <div className=" table-cell w-4/12 py-2 pr-2">Expiration Date</div>
              </div>
              <div className=" table-row">
                <div className="table-cell py-2 pr-2">{convertToDomainString(domain?.name, domain?.parent)}</div>
                <div className=" table-cell w-4/12 py-2 pr-2">{topLevelDomain?.info?.expirationDate}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Second Level Domain */}
        {domain?.parent !== '' && (
          <div className="my-8">
            <h3 className="text-xl text-black font-semibold py-2 px-1 flex items-center border-b-2 border-black mb-4">
              <FileStack className="opacity-70 mr-2" size={24} />
              Records
            </h3>
            <div className="overflow-x-auto">
              <div className="table w-full border-collapse">
                <div className="table-header-group border-b font-medium">
                  <div className=" table-cell w-3/12 py-2 pr-2">Record Type</div>
                  <div className=" table-cell w-9/12 py-2 pr-2">Value</div>
                </div>
                {mycelRecords &&
                  Object.values(mycelRecords).map((record, i) => {
                    return (
                      <>
                        {record.walletRecord && (
                          <div key={`wallet-${i}`} className="table-row text-justify">
                            <div className="table-cell py-2 pr-2">{record.walletRecord.walletRecordType}</div>
                            <div className="table-cell py-2 pr-2">{record.walletRecord.value}</div>
                          </div>
                        )}
                        {record.dnsRecord && (
                          <div key={`dns-${i}`} className="table-row text-justify">
                            <div className="table-cell py-2 pr-2">{record.dnsRecord.dnsRecordType}</div>
                            <div className="table-cell py-2 pr-2">{record.dnsRecord.value}</div>
                          </div>
                        )}
                        {record.metadata && (
                          <div key={`dns-${i}`} className="table-row text-justify">
                            <div className="table-cell py-2 pr-2">{record.metadata.key}</div>
                            <div className="table-cell py-2 pr-2">{record.metadata.value}</div>
                          </div>
                        )}
                      </>
                    )
                  })}
              </div>
            </div>
            {domain && isEditable && (
              <Button
                disabled={!mycelAccount?.address}
                onClick={() => {
                  updateDialog('editRecord')
                }}
                className="btn-primary mt-5 h-10 w-48 rounded-md"
              >
                Edit Record
              </Button>
            )}
          </div>
        )}
      </div>
      {domain && mycelAccount && (
        <EditRecordDialog domain={domain} records={mycelRecords} address={mycelAccount?.address} />
      )}
    </>
  )
}
