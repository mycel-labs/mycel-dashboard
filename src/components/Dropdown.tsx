import { ChangeEvent, useState } from "react";
import { Option } from "./Radio";

interface DropdownProps {
  options: Option[];
  selectedOption: string;
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function Dropdown(props: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleOptionSelect = (option) => {
    props.onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleDropdownToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      >
        <span>{props.selectedOption ? props.selectedOption : "Select an option"}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 transform ${isOpen ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 14l6-6H4l6 6z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md">
          {props.options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                handleOptionSelect(option);
              }}
              className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
