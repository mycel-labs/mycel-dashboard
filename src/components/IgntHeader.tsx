import { IgntLink } from "@ignt/react-library";
import IgntAcc from "./IgntAcc";
import Logo from "../assets/mycel.svg";

type MenuItem = {
  label: string;
  to?: string;
  href?: string;
};
interface IgntHeaderProps {
  navItems: Array<MenuItem>;
}
export default function IgntHeader(props: IgntHeaderProps) {
  const { navItems } = props;

  return (
    <header className="flex p-5">
      <img src={Logo} width="100" alt="mycel-logo" className="mx-3.5 mt-1" />
      <nav className="flex flex-1 justify-between">
        <ul className="flex items-center">
          {navItems.map((item) => (
            <li className="text-3 px-4 font-normal" key={item.label}>
              <IgntLink item={item}></IgntLink>
            </li>
          ))}
        </ul>

        <div>
          <IgntAcc />
        </div>
      </nav>
    </header>
  );
}
