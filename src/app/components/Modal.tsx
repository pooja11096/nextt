import React, { useState } from 'react'
import Input from './Input';
import Button from './Button';

interface ModalProps {
    isOpen: Boolean;
    closeModal: () => void;
    onSubmit: (value: string) =>void;
    title: string;
    placeholder: string
}
const Modal:React.FC<ModalProps> = ({isOpen,closeModal,onSubmit,title,placeholder}) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue('');
    closeModal();
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <Input 
         value={inputValue}
         onChange={(e) => setInputValue(e.target.value)}
         placeholder={placeholder} 
         label={placeholder}
         name='title'
         />
         <Button onClick={handleSubmit}>Submit</Button>
         <Button onClick={closeModal}>Cancel</Button>

      </div>
    </div>
  )
}

export default Modal