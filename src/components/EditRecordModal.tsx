import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IgntModal } from "@ignt/react-library";
import { DnsRecordType } from "mycel-client-ts/mycel.registry/types/mycel/registry/dns_record";
import { NetworkName } from "mycel-client-ts/mycel.registry/types/mycel/registry/network_name";
import { RegistryRecord } from "mycel-client-ts/mycel.resolver/rest";
import { DeliverTxResponse } from "@cosmjs/stargate";
import Dropdown from "./Dropdown";
import Button from "./Button";
import Radio, { Option } from "./Radio";
import TxModal from "@/components/TxModal";
import { useClient } from "@/hooks/useClient";
import { Domain } from "@/types/domain";

interface EditRecordModalProps {
  domain: Domain;
  records: Record<string, RegistryRecord> | undefined;
  address: string;
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
}

const recordOptions: Option[] = [
  { value: "wallet", label: "Wallet Record" },
  { value: "dns", label: "DNS Record" },
];

const RecordTypeToOptions = (recordType: any) => {
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
  const [recordOption, setRecordOption] = useState("wallet");
  const [typeOption, setTypeOption] = useState("");
  const [typeOptions, setTypeOptions] = useState<Option[]>([]);
  const [currentRecordValue, setCurrentRecordValue] = useState("");
  const [newRecordValue, setNewRecordValue] = useState("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResponse, setTxResponse] = useState<DeliverTxResponse>();

  useEffect(() => {
    if (recordOption === "dns") {
      setTypeOptions(RecordTypeToOptions(DnsRecordType));
      setTypeOption("A");
    } else if (recordOption === "wallet") {
      setTypeOptions(RecordTypeToOptions(NetworkName));
      setTypeOption("ETHEREUM_TESTNET_GOERLI");
    }
  }, [recordOption]);

  useEffect(() => {
    if (props.records && props.records[typeOption] !== undefined) {
      switch (recordOption) {
        case "dns":
          setCurrentRecordValue(props.records[typeOption].dnsRecord?.value || "");
          break;
        case "wallet":
          setCurrentRecordValue(props.records[typeOption].walletRecord?.value || "");
          break;
      }
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
            creator: props.address,
            name: props.domain?.name || "",
            parent: props.domain?.parent || "",
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
            creator: props.address,
            name: props.domain?.name || "",
            parent: props.domain?.parent || "",
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

  const onClosed = async () => {
    navigate(0);
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
        className="rounded-none"
        header={
          <div className="flex items-center flex-col my-3">
            <h3 className="text-3xl font-semibold">Edit Record</h3>
          </div>
        }
        body={
          <div className="bg-white">
            <div className="relative flex-auto">
              <Radio options={recordOptions} selectedOption={recordOption} onChange={handleRecordOptionChange} />
              <div className="text-xs text-gray-600 pt-2">Record Type</div>
              <Dropdown options={typeOptions} selectedOption={typeOption} onSelect={handleRecordTypeChange} />
              <div className="text-xs text-gray-600 pt-2">CurrentRecord Record</div>
              <h2 className="text-l font-semibold py-2">{currentRecordValue ? currentRecordValue : "---"}</h2>
              <div className="text-xs text-gray-600 pt-2">New Record</div>
              <input
                className="mt-1 py-2 px-4 h-12 bg-white border border-black text-base leading-tight w-full outline-0"
                value={newRecordValue}
                onChange={(e) => setNewRecordValue(e.target.value)}
              />
              <Button
                disabled={!props.address || newRecordValue === ""}
                onClick={updateRecord}
                className="btn-primary mt-10 h-10 w-48"
              >
                Update
              </Button>
            </div>
          </div>
        }
      />
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
