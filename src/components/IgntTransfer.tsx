import { useAddressContext } from "../def-hooks/addressContext";
import { IgntClipboard, IgntQRCode, IgntTabs } from "@ignt/react-library";
import IgntSend from "./IgntSend";
import Faucet from "./Faucet";
import { HandMetal } from "lucide-react";

interface IgntTransferProps {
  className?: string;
}

export default function IgntTransfer(props: IgntTransferProps) {
  const { address } = useAddressContext();
  return (
    <>
      <h3 className="text-xl text-black font-semibold py-2 flex items-center border-b-2 border-black">
        <HandMetal className="opacity-70 mr-2" size={24} />
        Actions
      </h3>
      <div className="p-1">
        <IgntTabs
          tabHeaderClasses={["text-base", "font-semibold", "border-b", "border-black/60", "py-2"]}
          tabLinkClasses={["p-2"]}
          inactiveLinkClasses={["text-black/70"]}
          activeLinkClasses={["text-black border-b-2 border-black"]}
          className={props.className ?? ""}
        >
          <div className="px-2" title="Send">
            {address && <IgntSend />}
          </div>
          <div className="px-2" title="Receive">
            {address && (
              <div className="px-2 py-10">
                <div className="flex items-center justify-center mb-8">
                  <IgntQRCode value={address} color="#E6A894" width={112} />
                </div>
                <div className="flex justify-between items-center pl-5 h-12 border border-black flex-nowrap">
                  <p className="flex-1 pl-5 text-ellipsis overflow-hidden">{address}</p>
                  <IgntClipboard text={address} />
                </div>
              </div>
            )}
          </div>
          <div className="px-2" title="Faucet">
            {address && (
              <div className="px-2 py-10">
                <Faucet />
              </div>
            )}
          </div>
        </IgntTabs>
      </div>
    </>
  );
}
