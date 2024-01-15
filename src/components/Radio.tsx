import type { ChangeEvent } from 'react'

export interface Option {
  value: string
  label: string
}

interface RadioProps {
  options: Option[]
  selectedOption: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}
export default function Radio(props: RadioProps) {
  return (
    <div>
      {props.options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          <input
            type="radio"
            value={option.value}
            checked={option.value === props.selectedOption}
            onChange={props.onChange}
            className="text-chocolat focus:ring-chocolat mr-2 -mt-0.5"
          />
          <span className="text-lg">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
