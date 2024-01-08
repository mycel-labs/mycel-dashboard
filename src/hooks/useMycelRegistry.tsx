import { useState, useEffect } from 'react'
import { useClient } from '~/hooks/useClient'
import {
  RegistryTopLevelDomain,
  RegistrySecondLevelDomainResponse,
  RegistryOwnedDomain,
  RegistryQueryDomainRegistrationFeeResponse,
} from 'mycel-client-ts/mycel.registry/rest'
import { useWallet } from '~/hooks/useWallet'
import { Domain } from '~/types/domain'
import { convertToDomainString } from '~/utils/domainName'

type TopLevelDomain = {
  info: RegistryTopLevelDomain | undefined
  isRegistered: boolean
}

type SecondLevelDomain = {
  info: RegistrySecondLevelDomainResponse | undefined
  parent: TopLevelDomain | undefined
  isRegistered: boolean
}

export const useMycelRegistry = () => {
  const client = useClient()
  const { mycelAccount } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [topLevelDomain, setTopLevelDomain] = useState<TopLevelDomain | undefined>(undefined)
  const [secondLevelDomain, setSecondLevelDomain] = useState<SecondLevelDomain | undefined>(undefined)
  const [fee, setFee] = useState<RegistryQueryDomainRegistrationFeeResponse | undefined>(undefined)
  const [ownedDomains, setOwnedDomains] = useState<RegistryOwnedDomain[]>([])

  useEffect(() => {
    if (mycelAccount?.address) {
      registryQueryOwnedDomains(mycelAccount.address)
    }
  }, [mycelAccount])

  // Query domain
  const registryQueryDomain = async (domain: Domain) => {
    setIsLoading(true)

    const queryDomain = async (queryFunc: () => Promise<any>, isTopLevel: boolean) => {
      try {
        const res = await queryFunc()
        if (res.data) {
          const domainData = isTopLevel ? res.data.topLevelDomain : res.data.secondLevelDomain
          return isTopLevel
            ? { info: domainData, isRegistered: !!domainData }
            : { info: domainData, isRegistered: !!domainData, parent: topLevelDomainResult }
        }
        return isTopLevel
          ? { info: undefined, isRegistered: false }
          : { info: undefined, isRegistered: false, parent: topLevelDomainResult }
      } catch (error) {
        return isTopLevel
          ? { info: undefined, isRegistered: false }
          : { info: undefined, isRegistered: false, parent: topLevelDomainResult }
      }
    }

    const topLevelDomainResult = await queryDomain(async () => {
      // If parent is empty, query top level domain
      if (domain.parent === '') {
        return await client.MycelRegistry.query.queryTopLevelDomain(domain.name)
      } else {
        return await client.MycelRegistry.query.queryTopLevelDomain(domain.parent)
      }
    }, true)

    setTopLevelDomain(topLevelDomainResult)
    const secondLevelDomainResult =
      domain.parent !== ''
        ? await queryDomain(() => client.MycelRegistry.query.querySecondLevelDomain(domain.name, domain.parent), false)
        : { info: undefined, isRegistered: false, parent: topLevelDomainResult }

    setSecondLevelDomain(secondLevelDomainResult)

    setIsLoading(false)
  }

  // Query registration fee
  const registryQueryRegistrationFee = async (domain: Domain) => {
    setIsLoading(true)
    try {
      const res = await client.MycelRegistry.query.queryDomainRegistrationFee(domain.name, domain.parent, {
        registrationPeriodInYear: '1',
      })
      if (res.data) {
        setFee(res.data)
      }
    } catch (error) {
      setFee(undefined)
    }
    setIsLoading(false)
  }

  // Query owned domains
  const registryQueryOwnedDomains = async (address: string) => {
    setIsLoading(true)
    try {
      const res = await client.MycelRegistry.query.queryDomainOwnership(address)
      if (res.data.domainOwnership?.domains) {
        setOwnedDomains(res.data.domainOwnership.domains)
      }
    } catch (error) {
      setOwnedDomains([])
    }
    setIsLoading(false)
  }

  // Query role
  const registryQueryRole = async (domain: Domain, address: string) => {
    setIsLoading(true)
    try {
      const res = await client.MycelRegistry.query.queryRole(convertToDomainString(domain.name, domain.parent), address)
      if (res.data) {
        return res.data.role
      }
    } catch (error) {
      return undefined
    }
    setIsLoading(false)
  }

  return {
    isLoading,
    topLevelDomain,
    secondLevelDomain,
    fee,
    ownedDomains,
    registryQueryDomain,
    registryQueryRegistrationFee,
    registryQueryOwnedDomains,
    registryQueryRole,
  }
}
