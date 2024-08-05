// components/Dropdown.tsx
import React from 'react';

interface DropdownProps {
  name: string;
  options: string[];
  selectedValue: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ name,label, options, selectedValue, onChange }) => {
  return (
    <>
    <label>{label}</label>
    <select name={name} value={selectedValue} onChange={onChange} className="dropdown">
      <option value="">Select</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
    </>

  );
};

export default Dropdown;
