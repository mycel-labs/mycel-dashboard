import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import Radio, { Option } from '@/components/Radio'
import BaseDialog from '@/components/dialog/BaseDialog'
import TxContent from '@/components/dialog/TxContent'
import { useClient } from '@/hooks/useClient'
import { useStore } from '@/store/index'
import { Domain } from '@/types/domain'
import { DeliverTxResponse } from '@cosmjs/stargate'
import { Dialog } from '@headlessui/react'
import { FileSignature } from 'lucide-react'
import { DnsRecordType } from 'mycel-client-ts/mycel.registry/types/mycel/registry/dns_record'
import { NetworkName } from 'mycel-client-ts/mycel.registry/types/mycel/registry/network_name'
import { RegistryRecord } from 'mycel-client-ts/mycel.resolver/rest'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface EditRecordDialogProps {
  domain: Domain
  records: Record<string, RegistryRecord> | undefined
  address: string
}

const recordOptions: Option[] = [
  { value: 'wallet', label: 'Wallet Record' },
  { value: 'dns', label: 'DNS Record' },
]

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const RecordTypeToOptions = (recordType: any) => {
  const options: Option[] = []
  for (const value of Object.values(recordType)) {
    if (typeof value === 'string' && value !== 'UNRECOGNIZED') {
      options.push({ value: value, label: value })
    }
  }
  return options
}

export default function EditRecordDialog({ domain, records, address }: EditRecordDialogProps) {
  const navigate = useNavigate()
  const dialog = useStore(state => state.dialog)
  const updateDialog = useStore(state => state.updateDialog)
  const client = useClient()
  const [recordOption, setRecordOption] = useState('wallet')
  const [typeOption, setTypeOption] = useState('')
  const [typeOptions, setTypeOptions] = useState<Option[]>([])
  const [currentRecordValue, setCurrentRecordValue] = useState('')
  const [newRecordValue, setNewRecordValue] = useState('')
  const [isShowTx, setIsShowTx] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>()

  useEffect(() => {
    if (recordOption === 'dns') {
      setTypeOptions(RecordTypeToOptions(DnsRecordType))
      setTypeOption('A')
    } else if (recordOption === 'wallet') {
      setTypeOptions(RecordTypeToOptions(NetworkName))
      setTypeOption('ETHEREUM_TESTNET_GOERLI')
    }
  }, [recordOption])

  useEffect(() => {
    if (records && records[typeOption] !== undefined) {
      switch (recordOption) {
        case 'dns':
          setCurrentRecordValue(records[typeOption].dnsRecord?.value || '')
          break
        case 'wallet':
          setCurrentRecordValue(records[typeOption].walletRecord?.value || '')
          break
      }
    } else {
      setCurrentRecordValue('')
    }
    setNewRecordValue('')
  }, [typeOption, recordOption, records])

  const handleRecordOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecordOption(event.target.value)
  }

  const handleRecordTypeChange = (val: string) => {
    setTypeOption(val)
  }

  // update record value
  const updateRecord = async () => {
    setIsLoading(true)
    setIsShowTx(true)
    // update DNS record
    if (recordOption === 'dns') {
      await client.MycelRegistry.tx
        .sendMsgUpdateDnsRecord({
          value: {
            creator: address,
            name: domain?.name || '',
            parent: domain?.parent || '',
            dnsRecordType: typeOption,
            value: newRecordValue,
          },
        })
        .then(res => {
          setIsLoading(false)
          setTxResponse(res as DeliverTxResponse)
        })
        .catch(() => {
          updateDialog(undefined)
        })

      // update wallet record
    } else if (recordOption === 'wallet') {
      await client.MycelRegistry.tx
        .sendMsgUpdateWalletRecord({
          value: {
            creator: address,
            name: domain?.name || '',
            parent: domain?.parent || '',
            walletRecordType: typeOption,
            value: newRecordValue,
          },
        })
        .then(res => {
          setIsLoading(false)
          setTxResponse(res as DeliverTxResponse)
        })
        .catch(() => {
          updateDialog(undefined)
        })
    }
  }

  return (
    <BaseDialog open={dialog === 'editRecord'}>
      <Dialog.Title className="text-2xl font-semibold mb-8 flex items-center justify-center">
        <FileSignature className="opacity-70 mr-2" />
        Edit Record
      </Dialog.Title>
      <div>
        <div className="relative flex-auto">
          <Radio options={recordOptions} selectedOption={recordOption} onChange={handleRecordOptionChange} />
          <label className="mt-5" htmlFor="targetSelect">
            Record Type
            <Dropdown options={typeOptions} selectedOption={typeOption} onSelect={handleRecordTypeChange} />
          </label>
          <label>
            CurrentRecord
            <input type="text" className="w-full" readOnly value={currentRecordValue ? currentRecordValue : '---'} />
          </label>
          <label>
            New Record
            <input
              type="text"
              className="w-full"
              value={newRecordValue}
              onChange={e => setNewRecordValue(e.target.value)}
            />
          </label>
          <TxContent txResponse={txResponse} isLoading={isLoading} className="mt-6" isShow={isShowTx} />
          {!isShowTx ? (
            <Button
              disabled={!address || newRecordValue === ''}
              onClick={() => updateRecord()}
              className="btn-primary mt-10 h-12 w-full rounded-md"
            >
              Update
            </Button>
          ) : (
            <Button
              className="btn-primary mt-10 h-12 w-full rounded-md"
              onClick={() => {
                updateDialog(undefined)
                navigate(0)
              }}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </BaseDialog>
  )
}
