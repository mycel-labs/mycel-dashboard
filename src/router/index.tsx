import { createBrowserRouter, Outlet } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioView from "@/views/PortfolioView";
import ResolveView from "@/views/ResolveView";
import SendView from "@/views/SendView";
import ExploreView from "@/views/ExploreView";
import RegisterView from "@/views/RegisterView";

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
const Layout = () => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Header navItems={items} />
      <main className="mb-auto pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <PortfolioView /> },
      { path: "/resolve", element: <ResolveView /> },
      { path: "/send", element: <SendView /> },
      { path: "/explore", element: <ExploreView /> },
      { path: "/register", element: <RegisterView /> },
    ],
  },
]);

export default router;
