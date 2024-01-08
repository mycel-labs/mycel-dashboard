import { useEffect } from 'react'
import useWallet from '~/hooks/useWallet'
import { useStore } from '~/store/index'
import { useAllRecords, useDomainOwnership, useBalance, useAllBalances } from '~/hooks/useMycel'

export const useOnboarding = () => {
  const { isConnected, evmAddress, mycelAccount } = useWallet()
  const onboardingStatus = useStore((state) => state.onboardingStatus)
  const updateOnboardingStatus = useStore((state) => state.updateOnboardingStatus)
  const updateDialog = useStore((state) => state.updateDialog)
  const { isLoading: isLoadingOwnDomain, data: dataOwnDomain } = useDomainOwnership(mycelAccount?.address)
  const { isLoading: isLoadingRecords, data: dataRecords } = useAllRecords(dataOwnDomain?.domainOwnership?.domains?.[0])
  const { isLoading: isLoadingBalance, data: dataBalance } = useBalance(mycelAccount?.address)

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
        console.log('4')
        updateOnboardingStatus('register-domain')
      }
      if (hasDomain() && !hasRecords()) {
        console.log('5')
        updateOnboardingStatus('add-record')
      }
      if (hasDomain() && hasRecords()) {
        console.log('6')
        updateOnboardingStatus('finish')
      }
    }
  }, [isConnected, isLoadingOwnDomain, dataOwnDomain, isLoadingRecords, dataRecords])

  useEffect(() => {
    if (onboardingStatus === 'hide' || onboardingStatus === 'finish') return
    const hasMycelAddress = () => !!mycelAccount?.address
    const hasNoMycelBalance = () => (!isLoadingBalance ? BigInt(dataBalance?.balance?.amount ?? 0) <= 0 : false)

    if (!isConnected) {
      updateOnboardingStatus('no-connection')
    } else if (evmAddress && !hasMycelAddress()) {
      updateOnboardingStatus('no-mycel-address')
    } else if (hasMycelAddress() && hasNoMycelBalance()) {
      updateOnboardingStatus('faucet')
    }
  }, [isConnected, evmAddress, mycelAccount, isLoadingBalance, dataBalance])

  const onboardingStatusList = typeof ONBOARDING_CONFIG

  return {
    ONBOARDING_CONFIG,
    onboardingStatusList,
  }
}

export default useOnboarding
