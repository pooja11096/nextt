'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deleteDataFromList, setDataToEdit, resetFormState } from '../store/formSlice';
import Button from '../components/Button';
import { useRouter } from 'next/navigation';

const Table: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataList = useSelector((state: RootState) => state.dataList);
  const router = useRouter();

  const handleAdd = () => {
    dispatch(resetFormState());
    router.push('/form/add');
  };

  const handleEdit = (index: number) => {
    dispatch(setDataToEdit(index));
    console.log("indexxxxxxxxxxx",index)
    router.push(`/form/edit?index=${index}`);
  };

  const handleDelete = (index: number) => {
    dispatch(deleteDataFromList(index));
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
              <td>{item.id}</td>
              <td>{item.general.personName}</td>
              <td>{item.general.selectedCustomer}</td>
              <td>{item.discount.totalAfterDiscount}</td>
              <td>
                <Button onClick={() => handleEdit(item.id as number)}>Edit</Button>
                <Button onClick={() => handleDelete(item.id as number)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
