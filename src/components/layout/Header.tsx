import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderAccount from "@/components/layout/HeaderAccount";
import Logo from "@/assets/mycel.svg";
import { Menu } from "lucide-react";

type MenuItem = {
  label: string;
  to?: string;
  href?: string;
};
interface HeaderProps {
  navItems: Array<MenuItem>;
}

export default function Header(props: HeaderProps) {
  const { navItems } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const navigateTo = (path: string) => {
    setShowMenu(false);
    navigate(path);
  };

  return (
    <header className="flex px-3 border-b-2 border-black fixed w-full h-20 justify-between z-40 bg-cream mb-20 flex-nowrap">
      <div className="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        <img src={Logo} width="125" alt="mycel" className="mt-0.5" />
        <div className="flex lg:order-2">
          <HeaderAccount />
          <button
            type="button"
            className="inline-flex items-center justify-center ml-6 lg:hidden focus:outline-none"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu size={32} />
          </button>
        </div>
        <div
          className={`items-center justify-between w-full lg:flex lg:w-auto lg:order-1 ${
            showMenu ? "block fixed top-14 right-0 left-0 px-6" : "hidden"
          }`}
        >
          <ul className="flex flex-col bg-cream border-2 border-black shadow-solid lg:shadow-transparent px-8 py-10 text-2xl h-full lg:h-auto lg:text-base z-30 w-full lg:bg-transparent lg:p-0 mt-4 lg:flex-row lg:mt-0 lg:border-0">
            {navItems.map((item) => (
              <li className="py-2 lg:py-0 font-bold" key={item.label}>
                <button
                  type="button"
                  onClick={() => navigateTo(item.to ?? item.href ?? "")}
                  className={`py-2 px-4 ${
                    item.to == location.pathname
                      ? "underline underline-offset-8 decoration-3 decoration-wavy decoration-chocolat"
                      : "opacity-70"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
