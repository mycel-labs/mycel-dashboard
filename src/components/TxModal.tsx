import { DeliverTxResponse } from "@cosmjs/stargate";
import { IgntModal } from "@ignt/react-library";
import Loader from "./Loader";

interface TxModalProps {
  isLoading: boolean;
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
  txResponse: DeliverTxResponse | undefined;
}

export default function TxModal(props: TxModalProps) {
  return (
    <>
      {props.isShow && (
        <IgntModal
          visible={props.isShow}
          closeIcon={false}
          cancelButton={false}
          submitButton={false}
          header={
            <div className="flex items-center flex-col my-3">
              {props.isLoading ? (
                <Loader />
              ) : props.txResponse?.code === 0 ? (
                <h3 className="text-3xl font-semibold">Success!</h3>
              ) : (
                <h3 className="text-3xl font-semibold">Failed</h3>
              )}
            </div>
          }
          body={
            <>
              {!props.isLoading ? (
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="relative flex-auto">
                    {props.txResponse?.code === 0 ? (
                      <div>
                        <p className="my-4 text-lg leading-relaxed">Tx Hash: {props.txResponse.transactionHash}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="my-4 text-slate-500 text-lg leading-relaxed">
                          Tx failed with code {props.txResponse?.code}
                        </p>

                        <p className="my-4 text-lg leading-relaxed">{props.txResponse?.rawLog}</p>
                      </div>
                    )}
                  </div>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => props.setIsShow(false)}
                  >
                    Close
                  </button>
                </div>
              ) : null}
            </>
          }
        ></IgntModal>
      )}
    </>
  );
}
