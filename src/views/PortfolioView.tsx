/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import IgntAssets from "../components/IgntAssets";
import IgntTransactions from "../components/IgntTransactions";
import IgntTransfer from "../components/IgntTransfer";
import MyDomains from "../components/MyDomains";

export default function PortfolioView() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex grid-cols-2 justify-between">
          <div className="w-1/2">
            <IgntAssets className="px-2.5 mb-10" displayLimit={3} />
            <IgntTransactions className="px-2.5" />
          </div>
          <IgntTransfer className="px-2.5 pl-10 w-1/2 mx-auto" />
        </div>
        <MyDomains className="py-8 px-2.5" />
      </div>
    </div>
  );
}
