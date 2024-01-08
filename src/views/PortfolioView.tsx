import MyDomains from '~/components/MyDomains'
import Faucet from '~/components/Faucet'

export default function PortfolioView() {
  return (
    <div>
      <div className="container">
        <MyDomains className="py-8 sm:px-2.5" />
        <Faucet className="py-8 sm:px-2.5" />
      </div>
    </div>
  )
}
