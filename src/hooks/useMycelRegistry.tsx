import { useState} from "react";
import { useClient } from "@/hooks/useClient";
import { RegistryTopLevelDomain, RegistrySecondLevelDomainResponse } from "mycel-client-ts/mycel.registry/rest";
import { Domain } from "@/types/domain";

interface TopLevelDomain extends RegistryTopLevelDomain {
  isRegistered: boolean;
}

interface SecondLevelDomain extends RegistrySecondLevelDomainResponse {
  isRegistered: boolean;
}


export const useMycelRegistry = () => {
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [topLevelDomain, setTopLevelDomain] = useState<TopLevelDomain | undefined>(undefined);
  const [secondLevelDomain, setSecondLevelDomain] = useState<SecondLevelDomain | undefined>(undefined);

  const registryQueryDomain = async (domain: Domain) => {
    setIsLoading(true);

    const queryDomain = async (queryFunc: () => Promise<any>, setter: (value: any) => void) => {
      try {
        const res = await queryFunc();
        if (res.data) {
          setter({ ...res.data, isRegistered: true });
        } else {
          setter(undefined);
        }
      } catch (error) {
        setter(undefined);
      }
    };

    // Query top level domain
    await queryDomain(
      () => client.MycelRegistry.query.queryTopLevelDomain(domain.parent),
      setTopLevelDomain
    );

    // Query second level domain
    if (domain.parent !== "") {
      await queryDomain(
        () => client.MycelRegistry.query.querySecondLevelDomain(domain.name, domain.parent),
        setSecondLevelDomain
      );
    }

    setIsLoading(false);
  };

  return {
    isLoading,
    topLevelDomain,
    secondLevelDomain,
    registryQueryDomain,
  };
};
