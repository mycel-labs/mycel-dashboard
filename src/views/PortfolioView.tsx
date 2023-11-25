import MyDomains from "@/components/MyDomains";
import SendToken from "@/components/SendToken";
import Faucet from "@/components/Faucet";

export default function PortfolioView() {
  return (
    <div>
      <div className="container">
        <MyDomains className="py-8 px-2.5" />

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Faucet className="py-8 px-2.5" />
          <SendToken className="py-8 px-2.5" />
        </div>
      </div>
    </div>
  );
}
