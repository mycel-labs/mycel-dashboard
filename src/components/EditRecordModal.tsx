import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClient } from "../hooks/useClient";
import { IgntModal, IgntButton } from "@ignt/react-library";
import { DnsRecordType, WalletRecordType } from "mycel-client-ts/mycel.registry/types/mycel/registry/domain";
import { RegistryDomain } from "mycel-client-ts/mycel.registry/rest";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { useAddressContext } from "../def-hooks/addressContext";
import Radio, { Option } from "./Radio";
import Dropdown from "./Dropdown";
import TxModal from "../components/TxModal";

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
  const client = useClient();
  const navigate = useNavigate();
  const { address } = useAddressContext();
  const [recordOption, setRecordOption] = useState("dns");
  const [typeOption, setTypeOption] = useState("");
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);
  const [currentRecordValue, setCurrentRecordValue] = useState("");
  const [newRecordValue, setNewRecordValue] = useState("");
  const [isUpdatable, setIsUpdatable] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

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
      setCurrentRecordValue(values[typeOption].value);
    } else {
      setCurrentRecordValue("");
    }
    setNewRecordValue("");
  }, [typeOption]);

  const handleRecordOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecordOption(event.target.value);
  };

  const handleRecordTypeChange = (option: any) => {
    setTypeOption(option.value);
  };

  // update record value
  const updateRecord = async () => {
    setIsLoading(true);
    setIsShow(true);
    // update DNS record
    if (recordOption === "dns") {
      await client.MycelRegistry.tx
        .sendMsgUpdateDnsRecord({
          value: {
            creator: address,
            name: props.registryDomain?.name || "",
            parent: props.registryDomain?.parent || "",
            dnsRecordType: typeOption,
            value: newRecordValue,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setTxResponse(res as DeliverTxResponse);
        })
        .catch(() => {
          setIsShow(false);
        });

      // update wallet record
    } else if (recordOption === "wallet") {
      await client.MycelRegistry.tx
        .sendMsgUpdateWalletRecord({
          value: {
            creator: address,
            name: props.registryDomain?.name || "",
            parent: props.registryDomain?.parent || "",
            walletRecordType: typeOption,
            value: newRecordValue,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setTxResponse(res as DeliverTxResponse);
        })
        .catch(() => {
          setIsShow(false);
        });
    }
  };

  const onClosed = () => {
    navigate(`/resolve?name=${props.registryDomain?.name}&parent=${props.registryDomain?.parent}`);
    props.setIsShow(false);
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
                <div className="text-xs text-gray-600">CurrentRecord Record</div>
                <h2>{currentRecordValue ? currentRecordValue : "---"}</h2>
                <div className="text-xs text-gray-600">New Record</div>
                <input
                  className="mt-1 py-2 px-4 h-12 bg-gray-100 border-xs text-base leading-tight w-full rounded-xl outline-0"
                  value={newRecordValue}
                  onChange={(e) => setNewRecordValue(e.target.value)}
                />
                <IgntButton disabled={!address} onClick={updateRecord} className="mt-1 h-10 w-48">
                  Update
                </IgntButton>
              </div>
            </div>
          </>
        }
      ></IgntModal>
      <TxModal
        isShow={isShow}
        setIsShow={setIsShow}
        txResponse={txResponse}
        isLoading={isLoading}
        onClosed={onClosed}
      />
    </>
  );
}
