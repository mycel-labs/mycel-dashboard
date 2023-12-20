import { useAllRecords, useBalance, useDomainOwnership } from '@/hooks/useMycel'
import useWallet from '@/hooks/useWallet'
import { useStore } from '@/store/index'
import { useEffect } from 'react'

export const useOnboarding = () => {
  const { isConnected, evmAddress, mycelAccount } = useWallet()
  const onboardingStatus = useStore(state => state.onboardingStatus as OnboardingStatus)
  const updateOnboardingStatus = useStore(state => state.updateOnboardingStatus)
  const updateDialog = useStore(state => state.updateDialog)
  const { isLoading: isLoadingOwnDomain, data: dataOwnDomain } = useDomainOwnership(mycelAccount?.address)
  const { isLoading: isLoadingRecords, data: dataRecords } = useAllRecords(dataOwnDomain?.domainOwnership?.domains?.[0])
  const { isLoading: isLoadingBalance, data: dataBalance } = useBalance()

  const ONBOARDING_CONFIG = {
    'no-connection': {},
    'no-mycel-address': {
      index: 1,
      message: "You've connected, create mycel address.",
      action: () => updateDialog('wallet2'),
    },
    faucet: {
      index: 2,
      message: 'Faucet MYCEL token next',
      link: '/',
    },
    'register-domain': {
      index: 3,
      message: 'Get your.cel name!',
      link: '/register',
    },
    'add-record': {
      index: 4,
      message: 'Attach record to your.cel!',
      link: '/',
    },
    finish: {},
    hide: {},
  }

  useEffect(() => {
    if (onboardingStatus === 'hide' || onboardingStatus === 'finish') return

    const hasDomain = () => (!isLoadingOwnDomain ? (dataOwnDomain?.domainOwnership?.domains?.length ?? 0) > 0 : false)
    const hasRecords = () =>
      !isLoadingRecords && dataRecords?.values ? Object.keys(dataRecords?.values).length > 0 : false

    if (isConnected) {
      if (!hasDomain()) {
        updateOnboardingStatus('register-domain')
      }
      if (hasDomain() && !hasRecords()) {
        updateOnboardingStatus('add-record')
      }
      if (hasDomain() && hasRecords()) {
        updateOnboardingStatus('finish')
      }
    }
  }, [
    onboardingStatus,
    isConnected,
    isLoadingOwnDomain,
    dataOwnDomain,
    isLoadingRecords,
    dataRecords,
    updateOnboardingStatus,
  ])

  useEffect(() => {
    if (onboardingStatus === 'hide' || onboardingStatus === 'finish') return
    const hasMycelAddress = () => !!mycelAccount?.address
    const hasNoMycelBalance = () => (!isLoadingBalance ? BigInt(dataBalance?.balance?.amount ?? 0) <= 0 : true)

    if (!isConnected) {
      updateOnboardingStatus('no-connection')
    } else if (evmAddress && !hasMycelAddress()) {
      updateOnboardingStatus('no-mycel-address')
    } else if (hasMycelAddress() && hasNoMycelBalance()) {
      updateOnboardingStatus('faucet')
    }
  }, [isConnected, evmAddress, mycelAccount, isLoadingBalance, dataBalance, updateOnboardingStatus, onboardingStatus])

  return {
    ONBOARDING_CONFIG,
  }
}

export default useOnboarding
