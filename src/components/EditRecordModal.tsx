import { useState, useEffect } from "react";
import { IgntModal } from "@ignt/react-library";
import { DnsRecordType, WalletRecordType } from "mycel-client-ts/mycel.registry/types/mycel/registry/domain";
import { RegistryDomain } from "mycel-client-ts/mycel.registry/rest";
import Radio, { Option } from "./Radio";
import Dropdown from "./Dropdown";
import AddressProvider from "../def-hooks/addressContext";

interface EditRecordModalProps {
  registryDomain: RegistryDomain | null;
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
}

const recordOptions: Option[] = [
  { value: "dns", label: "DNS Record" },
  { value: "wallet", label: "Wallet Record" },
];

const RecordTypeToOptions = (recordType) => {
  const options: Option[] = [];
  Object.values(recordType).forEach((value) => {
    if (typeof value === "string" && value !== "UNRECOGNIZED") {
      options.push({ value: value, label: value });
    }
  });
  return options;
};

export default function EditRecordModal(props: EditRecordModalProps) {
  const [recordOption, setRecordOption] = useState("dns");
  const [typeOption, setTypeOption] = useState("");
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    if (recordOption === "dns") {
      setTypeOptions(RecordTypeToOptions(DnsRecordType));
      setTypeOption("A");
    } else if (recordOption === "wallet") {
      setTypeOptions(RecordTypeToOptions(WalletRecordType));
      setTypeOption("ETHEREUM_MAINNET");
    }
  }, [recordOption]);

  useEffect(() => {
    let values;
    if (recordOption === "dns" && props.registryDomain?.dnsRecords) {
      values = props.registryDomain?.dnsRecords;
    } else if (recordOption === "wallet" && props.registryDomain?.walletRecords) {
      values = props.registryDomain?.walletRecords;
    }
    if (values && values[typeOption] !== undefined) {
      setCurrentValue(values[typeOption].value);
    } else {
      setCurrentValue("");
    }
  }, [typeOption]);

  const handleRecordOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecordOption(event.target.value);
  };

  const handleRecordTypeChange = (option: any) => {
    setTypeOption(option.value);
  };

  return (
    <>
      <IgntModal
        visible={props.isShow}
        closeIcon={true}
        cancelButton={false}
        submitButton={false}
        close={() => props.setIsShow(false)}
        header={
          <div className="flex items-center flex-col my-3">
            <h3 className="text-3xl font-semibold">Edit Record</h3>
          </div>
        }
        body={
          <>
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="relative flex-auto">
                <Radio options={recordOptions} selectedOption={recordOption} onChange={handleRecordOptionChange} />
                <div className="text-xs text-gray-600">Record Type</div>
                <Dropdown options={typeOptions} selectedOption={typeOption} onSelect={handleRecordTypeChange} />
                <div className="text-xs text-gray-600">Current Record</div>
                <h2>{currentValue ? currentValue : "---"}</h2>
                <div className="text-xs text-gray-600">New Record</div>
                <input className="mt-1 py-2 px-4 h-12 bg-gray-100 border-xs text-base leading-tight w-full rounded-xl outline-0" />
              </div>
            </div>
          </>
        }
      ></IgntModal>
    </>
  );
}
