import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {updateDataList,deleteDataFromList, setDataToEdit, resetFormState } from '../store/formSlice';
import Button from '../components/Button';
import MainForm from './MainForm'; // Import your form component

const Table: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataList = useSelector((state: RootState) => state.dataList);
  
  const [isFormOpen, setFormOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    dispatch(resetFormState())
    setEditing(false);
    setFormOpen(true);
  };

  const handleEdit = (index: number) => {
    dispatch(setDataToEdit(index));
    setEditing(true);
    setFormOpen(true);
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    dispatch(deleteDataFromList(index));
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    <>
      <Button onClick={handleAdd}>Add Data</Button>
      <table>
        <thead>
          <tr>
            <th>Person Name</th>
            <th>Customer</th>
            <th>Total Amount After Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item, index) => (
            <tr key={index}>
              <td>{item.general.personName}</td>
              <td>{item.general.selectedCustomer}</td>
              <td>{item.discount.totalAfterDiscount}</td>
              <td>
                <Button onClick={() => handleEdit(index)}>Edit</Button>
                <Button onClick={() => handleDelete(index)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && (
        <MainForm 
          isEditing={isEditing}
          editIndex={editIndex}
          onClose={handleCloseForm}
        />
      )}
    </>
  );
};

export default Table;
