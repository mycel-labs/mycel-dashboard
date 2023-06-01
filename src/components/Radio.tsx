import { ChangeEvent } from "react";

export interface Option {
  value: string;
  label: string;
}

interface RadioProps {
  options: Option[];
  selectedOption: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export default function Radio(props: RadioProps) {
  return (
    <div>
      {props.options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            value={option.value}
            checked={option.value === props.selectedOption}
            onChange={props.onChange}
            className="form-radio text-blue-500"
          />
          <span className="">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
