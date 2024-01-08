import { Dialog } from '@headlessui/react'
import { DeliverTxResponse } from '@cosmjs/stargate'
import Loader from '~/components/Loader'
import { AlertTriangle, PartyPopper } from 'lucide-react'

interface TxDialogProps {
  isShow?: boolean
  isLoading: boolean
  txResponse: DeliverTxResponse | undefined
  className?: string
}

export default function TxContent({ isShow = true, isLoading, txResponse, className }: TxDialogProps) {
  if (!isShow) return null

  return (
    <div className={className}>
      {isLoading ? (
        <Loader size={12} />
      ) : (
        <>
          <Dialog.Title className="text-2xl font-semibold mb-8 text-center flex items-center justify-center">
            {isLoading ? (
              'Loading...'
            ) : txResponse?.code === 0 ? (
              <>
                <PartyPopper className="mr-1.5" />
                Success!
              </>
            ) : (
              <>
                <AlertTriangle className="mr-1.5" />
                Transaction Failed
              </>
            )}
          </Dialog.Title>
          <div className={className}>
            {txResponse?.code === 0 ? (
              <div className="space-y-4">
                <div className="text-sm leading-relaxed">
                  <div>
                    Transaction Hash
                    <p className="w-full text-gray-500 break-all">{txResponse?.transactionHash ?? ''}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-center text-error text-lg leading-relaxed">
                  Transaction failed with code {txResponse?.code}
                </p>
                <p className="mt-2 leading-relaxed text-sm text-gray-500">{txResponse?.rawLog}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
