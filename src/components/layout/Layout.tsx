import Header from '~/components/layout/Header'
import Footer from '~/components/layout/Footer'
import MessageBar from '~/components/MessageBar'
import useWallet from '~/hooks/useWallet'
import useOnboarding from '~/hooks/useOnboarding'

const items = [
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Register Domain',
    to: '/register',
  },
  {
    label: 'Send',
    to: '/send',
  },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  useWallet()
  useOnboarding()

  return (
    <div className="flex flex-col h-screen justify-between">
      <Header navItems={items} />
      <main className="mb-auto pt-20">
        <MessageBar />
        {children}
      </main>
      <Footer />
    </div>
  )
}
