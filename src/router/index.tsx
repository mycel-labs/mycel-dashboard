import { createBrowserRouter, Outlet } from "react-router-dom";
import PortfolioView from "@/views/PortfolioView";
import ResolveView from "@/views/ResolveView";
import SendView from "@/views/SendView";
import RegisterView from "@/views/RegisterView";
import Layout from "@/components/layout/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: "/", element: <PortfolioView /> },
      { path: "/resolve", element: <ResolveView /> },
      { path: "/send", element: <SendView /> },
      { path: "/register", element: <RegisterView /> },
    ],
  },
]);

export default router;
