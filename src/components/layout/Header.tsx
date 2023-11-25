import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderAccount from "@/components/layout/HeaderAccount";
import Logo from "@/assets/mycel.svg";
import LogoC from "@/assets/mycel_charactor.svg";
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
    <header className="flex md:px-3 border-b-2 border-black fixed w-full h-20 justify-between z-40 bg-cream mb-20 flex-nowrap">
      <div className="w-full flex flex-nowrap items-center justify-between mx-auto p-4">
        <div className="relative">
          <img src={Logo} width="144" alt="mycel" className="mt-0.5 hidden sm:flex" />
          <img src={LogoC} width="44" alt="mycel" className="mt-0.5 flex sm:hidden" />
          {import.meta.env.VITE_TESTNET && (
            <span className="bg-orange rounded-full text-white text-xs font-semibold py-0.5 px-1.5 absolute -top-1 -right-14">
              {import.meta.env.VITE_TESTNET}
            </span>
          )}
        </div>
        <div className="flex md:order-2">
          <HeaderAccount />
          <button
            type="button"
            className="inline-flex items-center justify-center ml-4 md:hidden focus:outline-none"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu size={32} />
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            showMenu ? "block fixed top-14 right-0 left-0 px-6" : "hidden"
          }`}
        >
          <ul className="flex flex-col bg-cream border-2 border-black shadow-solid md:shadow-transparent px-8 py-10 text-2xl h-full md:h-auto md:text-base z-30 w-full md:bg-transparent md:p-0 mt-4 md:flex-row md:mt-0 md:border-0">
            {navItems.map((item) => (
              <li className="py-2 md:py-0 font-bold" key={item.label}>
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
