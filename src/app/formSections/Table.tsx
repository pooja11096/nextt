import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { deleteDataFromList, setDataToEdit, resetFormState } from '../store/formSlice';
import Button from '../components/Button';
import MainForm from './MainForm'; 

const Table: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dataList = useSelector((state: RootState) => state.dataList);
  
  const [isFormOpen, setFormOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof typeof dataList[0]['general']>('personName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); 
  };

  const handleSort = (column: keyof typeof dataList[0]['general']) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredDataList = dataList.filter(item =>
    item.general.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.general.selectedCustomer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDataList = [...filteredDataList].sort((a, b) => {
    if (a.general[sortColumn] < b.general[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a.general[sortColumn] > b.general[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedDataList = sortedDataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(filteredDataList.length / rowsPerPage);

  const handleAdd = () => {
    dispatch(resetFormState());
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
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchQuery}
        onChange={handleSearch}
      />
      <Button onClick={handleAdd}>Add Data</Button>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('personName')}>Person Name {sortColumn === 'personName' && (sortDirection === 'asc' ? '🔼' : '🔽')}</th>
            <th onClick={() => handleSort('selectedCustomer')}>Customer {sortColumn === 'selectedCustomer' && (sortDirection === 'asc' ? '🔼' : '🔽')}</th>
            <th>Final Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDataList.map((item, index) => (
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

      <div>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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
