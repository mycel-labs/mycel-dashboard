import { Domain } from "@/types/domain";

export const convertToDomain = (domain: string) => {
  const s = domain.split(".");
  if (s.length === 1) {
    return { name: s[0], parent: "" } as Domain;
  }
  return { name: s[0], parent: s.slice(1).join(".") } as Domain;
};

export const convertToDomainString = (name: string | undefined, parent: string | undefined) => {
  return name && parent ? name + "." + parent : "";
};
