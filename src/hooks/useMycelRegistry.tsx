import { useState } from "react";
import { useClient } from "@/hooks/useClient";
import { RegistryTopLevelDomain, RegistrySecondLevelDomainResponse } from "mycel-client-ts/mycel.registry/rest";
import { Domain } from "@/types/domain";

type TopLevelDomain = {
  info: RegistryTopLevelDomain | undefined;
  isRegistered: boolean;
}

type SecondLevelDomain = {
  info: RegistrySecondLevelDomainResponse | undefined;
  parent: TopLevelDomain | undefined;
  isRegistered: boolean;
}


export const useMycelRegistry = () => {
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [topLevelDomain, setTopLevelDomain] = useState<TopLevelDomain | undefined>(undefined);
  const [secondLevelDomain, setSecondLevelDomain] = useState<SecondLevelDomain | undefined>(undefined);


  const registryQueryDomain = async (domain: Domain) => {
    setIsLoading(true);

    const queryDomain = async (queryFunc: () => Promise<any>, isTopLevel: boolean) => {
      try {
        const res = await queryFunc();
        if (res.data) {
          const domainData = isTopLevel ? res.data.topLevelDomain : res.data.secondLevelDomain;
          return isTopLevel ? { info: domainData, isRegistered: !!domainData } : { info: domainData, isRegistered: !!domainData, parent: topLevelDomainResult };
        }
        return isTopLevel ? { info: undefined, isRegistered: false } : { info: undefined, isRegistered: false, parent: topLevelDomainResult };
      } catch (error) {
        return isTopLevel ? { info: undefined, isRegistered: false } : { info: undefined, isRegistered: false, parent: topLevelDomainResult };
      }
    };

    const topLevelDomainResult = await queryDomain(
      () => client.MycelRegistry.query.queryTopLevelDomain(domain.parent),
      true
    );

    setTopLevelDomain(topLevelDomainResult);

    const secondLevelDomainResult = domain.parent !== "" ? await queryDomain(
      () => client.MycelRegistry.query.querySecondLevelDomain(domain.name, domain.parent),
      false
    ) : { info: undefined, isRegistered: false, parent: topLevelDomainResult };

    setSecondLevelDomain(secondLevelDomainResult);

    setIsLoading(false);
  };

  return {
    isLoading,
    topLevelDomain,
    secondLevelDomain,
    registryQueryDomain,
  };
};

