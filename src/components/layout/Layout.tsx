import useWallet from "@/hooks/useWallet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const items = [
  {
    label: "Portfolio",
    to: "/",
  },
  {
    label: "Register",
    to: "/register",
  },
  {
    label: "Explore",
    to: "/explore",
  },
  {
    label: "Send Token",
    to: "/send",
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  useWallet();

  return (
    <div className="flex flex-col h-screen justify-between">
      <Header navItems={items} />
      <main className="mb-auto pt-20">{children}</main>
      <Footer />
    </div>
  );
}
