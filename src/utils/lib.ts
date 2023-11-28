import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import MobileDetet from "mobile-detect";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const wait = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));

export const copyClipboard = async (str: string | undefined) => {
  if (!str) return;
  navigator.clipboard.writeText(str);
};

export const isMobile = () => {
  const md = new MobileDetet(window.navigator.userAgent);
  return !!md.mobile();
};
