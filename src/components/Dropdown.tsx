import { ChangeEvent } from 'react'
import type { Option } from '@/components/Radio'

interface DropdownProps {
  options: Option[]
  selectedOption: string
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function Dropdown({ options, onSelect }: DropdownProps) {
  return (
    <select className="w-full" defaultValue="" onChange={e => onSelect(e.target.value)}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
