import { DeliverTxResponse } from "@cosmjs/stargate";

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
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="relative w-auto my-6 mx-auto max-w-3xl ">
              {/*content*/}
              {!props.isLoading ? (
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                    {props.txResponse?.code === 0 ? (
                      <div>
                        <h3 className="text-3xl font-semibold">Success!</h3>
                        <p className="my-4 text-lg leading-relaxed">Tx Hash: {props.txResponse.transactionHash}</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-3xl font-semibold">Failed</h3>
                        <p className="my-4 text-slate-500 text-lg leading-relaxed">
                          Tx failed with code {props.txResponse?.code}
                        </p>

                        <p className="my-4 text-lg leading-relaxed">{props.txResponse?.rawLog}</p>
                      </div>
                    )}
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => props.setIsShow(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}
