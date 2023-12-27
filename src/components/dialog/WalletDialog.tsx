import MycelCharactor from '@/assets/mycel_charactor.svg'
import Button from '@/components/Button'
import { toast } from '@/components/Toaster'
import BaseDialog from '@/components/dialog/BaseDialog'
import { useBalance } from '@/hooks/useMycel'
import useWallet from '@/hooks/useWallet'
import { useStore } from '@/store/index'
import { MYCEL_COIN_DECIMALS, MYCEL_HUMAN_COIN_UNIT, convertToDecimalString } from '@/utils/coin'
import { cn, copyClipboard, isBitGetApp, isMobile, isOKXApp, isPC } from '@/utils/lib'
import { WALLET_CONFIG, type WalletType, shortAddress } from '@/utils/wallets'
import { Dialog } from '@headlessui/react'
import { ClipboardCopy, KeySquare, Unplug } from 'lucide-react'

export default function WalletDialog() {
  const dialog = useStore(state => state.dialog)
  const updateDialog = useStore(state => state.updateDialog)
  const { connectWallet, disconnectWallet, isConnected, evmAddress, deriveKeys, mycelAccount, connectorsWagmi } =
    useWallet()

  const DialogContent = () => (
    <div className="space-y-4 font-semibold">
      {Object.entries(WALLET_CONFIG).map(([key, val]) => (
        <Button
          key={val.id}
          className={cn(
            'btn-secondary w-full h-12 rounded',
            ((isMobile() && !val.showMobile) || (isPC() && val.hidePC)) && 'hidden',
          )}
          disabled={val?.disabled}
          onClick={async () => {
            if (val.name === 'OKXWallet') {
              if (isOKXApp()) {
                connectWallet({ walletType: key as WalletType })
              } else if (isMobile()) {
                window.open(`https://okex.com/web3/connect-dapp?uri=${encodeURIComponent(window.location.href)}`)
              } else if (isPC()) {
                window.open('https://www.okx.com/web3')
              }
            } else if (val.name === 'BitGetWallet') {
              if (isBitGetApp()) {
                connectWallet({ walletType: key as WalletType })
              } else if (isMobile()) {
                window.open(`https://bkcode.vip/?action=dapp&url=${encodeURIComponent(window.location.href)}`)
              } else {
                window.open('https://web3.bitget.com')
              }
            } else {
              // TODO: refactor this
              if (
                (val.chainType === 'evm' && connectorsWagmi.find(cn => cn.name === val.name)?.ready) ||
                (val.chainType === 'cosmos' && window.keplr)
              ) {
                connectWallet({ walletType: key as WalletType })
              } else {
                window.open(val.getUrl)
              }
            }
          }}
        >
          <span className="flex items-center justify-center px-6 mr-2">
            {Array.isArray(val.icon) ? (
              val.icon.map((item, index) => (
                <img
                  key={`wallet-${index}`}
                  src={item}
                  width={24}
                  height={24}
                  alt={val.name}
                  className={cn(index > 0 && '-ml-2')}
                  style={{ zIndex: 2 - index }}
                />
              ))
            ) : (
              <img src={val.icon} width={24} height={24} alt={val.name} />
            )}
            <span className="ml-3">{val.display}</span>
          </span>
        </Button>
      ))}
    </div>
  )

  const DialogContentConnected = () => {
    return (
      <>
        {evmAddress && (
          <label className="relative">
            EVM Address
            <input type="text" readOnly value={shortAddress(evmAddress)} className="w-full" />
            <div className="absolute right-0 bottom-0 h-12 w-12  flex items-center justify-center">
              <button
                type="button"
                className="text-chocolat"
                onClick={() => {
                  copyClipboard(evmAddress)
                  toast.success('Address copied to clipboard')
                }}
              >
                <ClipboardCopy size={20} />
              </button>
            </div>
          </label>
        )}
        <label className="relative">
          Mycel Address
          <input type="text" readOnly value={shortAddress(mycelAccount?.address)} className="w-full" />
          <div className="absolute right-0 bottom-0 h-12 w-12 flex items-center justify-center">
            <button
              type="button"
              className="text-chocolat"
              onClick={() => {
                copyClipboard(mycelAccount?.address ?? '')
                toast.success('Address copied to clipboard')
              }}
            >
              <ClipboardCopy size={20} />
            </button>
          </div>
        </label>
        <label htmlFor="balance">My Balance</label>
        {!dataBalance?.balance?.amount ? (
          <div className="text-gray-500">---</div>
        ) : (
          <p className="font-mono text-xl px-0.5">
            {convertToDecimalString(dataBalance.balance.amount, MYCEL_COIN_DECIMALS)}
            <span className="text-gray-600 ml-1 text-lg uppercase">{MYCEL_HUMAN_COIN_UNIT}</span>
          </p>
        )}
        <Button
          className="btn-secondary w-full mt-8 h-12 rounded-md"
          onClick={async () => {
            await disconnectWallet()
            updateDialog(undefined)
          }}
        >
          <span className="flex items-center justify-center px-6 mr-2">
            <Unplug />
            <span className="ml-4">Disconnect</span>
          </span>
        </Button>
      </>
    )
  }

  const DialogContentKeyGen = () => (
    <>
      {evmAddress && (
        <label className="relative">
          EVM Address
          <input type="text" readOnly value={shortAddress(evmAddress)} className="w-full" />
          <div className="absolute right-0 bottom-0 h-12 w-12 flex items-center justify-center">
            <button
              type="button"
              className="text-chocolat"
              onClick={() => {
                copyClipboard(evmAddress)
                toast.success('Address copied to clipboard')
              }}
            >
              <ClipboardCopy size={20} />
            </button>
          </div>
        </label>
      )}
      <Button
        className="btn-secondary w-full py-2 mt-8"
        onClick={async () => {
          await deriveKeys()
          updateDialog(undefined)
        }}
      >
        <span className="flex items-center justify-center px-6 mr-2">
          <KeySquare />
          <span className="ml-4">Generate Mycel Account</span>
        </span>
      </Button>
    </>
  )

  const { isLoading: isLoadingBalance, data: dataBalance } = useBalance()

  return (
    <BaseDialog open={dialog === 'wallet' || dialog === 'wallet2'}>
      <Dialog.Title className="text-2xl font-semibold mb-8 text-center">
        {dialog === 'wallet2' ? (
          'Generate Mycel Account from EVM address'
        ) : isConnected ? (
          <img src={MycelCharactor} width={144} height={144} alt="Mycel" className="mx-auto" />
        ) : (
          'Select Wallet'
        )}
      </Dialog.Title>
      {dialog === 'wallet2' ? <DialogContentKeyGen /> : isConnected ? <DialogContentConnected /> : <DialogContent />}
    </BaseDialog>
  )
}
