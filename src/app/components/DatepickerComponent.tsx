// components/DatePicker.tsx
import React from 'react';

interface DatePickerProps {
  name: string;
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({ name,label, value, onChange }) => {
  return (
    <>
    <label>{label}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className="datepicker"
    />
    </>

  );
};

export default DatePickerComponent;
