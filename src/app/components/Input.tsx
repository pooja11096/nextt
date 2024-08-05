// components/Input.tsx
import React from 'react';

interface InputProps {
  type?: string;
  name: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  readOnly?: boolean;
  min?: number;

}

const Input: React.FC<InputProps> = ({ type = 'text', label, name, value, onChange, placeholder, readOnly, min }) => {
  return (
    <>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      min={min} 
      className="input"
    />
    </>
  );
};

export default Input;
