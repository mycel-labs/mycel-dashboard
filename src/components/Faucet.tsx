import Button from '@/components/Button'
import TxDialog from '@/components/dialog/TxDialog'
import { useBalance } from '@/hooks/useMycel'
import { useWallet } from '@/hooks/useWallet'
import { useStore } from '@/store/index'
import { MYCEL_COIN_DECIMALS, MYCEL_HUMAN_COIN_UNIT, convertToDecimalString } from '@/utils/coin'
import { DeliverTxResponse } from '@cosmjs/stargate'
import { HandMetal } from 'lucide-react'
import { useEffect, useState } from 'react'

interface faucetProps {
  className?: string
}
export default function Faucet(props: faucetProps) {
  const { mycelAccount, isConnected } = useWallet()
  const threshold = import.meta.env.VITE_FAUCET_CLAIMABLE_THRESHOLD
  const { className } = props
  const [isClaimable, setIsClaimable] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>()
  const updateDialog = useStore(state => state.updateDialog)
  const { isLoading: isLoadingBalance, data: dataBalance } = useBalance()

  useEffect(() => {
    if (BigInt(dataBalance?.balance?.amount ?? 0) < BigInt(threshold)) {
      setIsClaimable(true)
    } else {
      setIsClaimable(false)
    }
  }, [dataBalance])

  const claimFaucet = async () => {
    setIsLoading(true)
    updateDialog('tx')

    if (isClaimable && mycelAccount?.address) {
      await fetch(`api/faucet?address=${mycelAccount?.address}`)
        .then(res => res.json())
        .then(data => {
          setIsLoading(false)
          setTxResponse(data.response as DeliverTxResponse)
        })
        .catch(err => {
          updateDialog(undefined)
          console.log(err)
        })
    } else {
      setTxResponse({ code: -1, rawLog: 'You have enough balance' } as DeliverTxResponse)
      setIsLoading(false)
    }
  }

  return (
    <section className={className ?? ''}>
      <h3 className="font-cursive text-2xl text-black font-semibold px-1 py-2 flex flex-1 items-center border-b-2 border-black">
        <HandMetal className="opacity-70 mr-2" size={26} />
        Faucet
      </h3>
      <div className="flex w-full pt-4">
        <div className="py-2 flex w-full justify-between items-center">
          <div className="px-1">
            {isConnected ? (
              <>
                <div className="font-semibold mb-1">My Balance</div>
                {!dataBalance?.balance?.amount ? (
                  <div className="text-gray-500">---</div>
                ) : (
                  <p className="font-mono text-xl px-0.5">
                    {convertToDecimalString(dataBalance.balance.amount, MYCEL_COIN_DECIMALS)}
                    <span className="text-gray-600 ml-1 text-lg">{MYCEL_HUMAN_COIN_UNIT}</span>
                  </p>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-lg font-semibold">Connect first</div>
            )}
          </div>
          <div className="">
            <Button className="btn-primary w-32 py-2 h-10 rounded-md" disabled={!isClaimable} onClick={claimFaucet}>
              Claim
            </Button>
          </div>
        </div>
      </div>
      <TxDialog txResponse={txResponse} isLoading={isLoading} />
    </section>
  )
}
