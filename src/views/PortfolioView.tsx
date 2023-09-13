/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import IgntAssets from "../components/IgntAssets";
import IgntTransactions from "../components/IgntTransactions";
import IgntTransfer from "../components/IgntTransfer";
import MyDomains from "../components/MyDomains";

export default function PortfolioView() {
  return (
    <div>
      <div className="container my-12">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div>
            <IgntAssets className="mb-12" displayLimit={3} />
            <IgntTransactions className="mb-12" />
          </div>
          <div>
            <IgntTransfer />
          </div>
        </div>
        <MyDomains className="py-8 px-2.5" />
      </div>
    </div>
  );
}
