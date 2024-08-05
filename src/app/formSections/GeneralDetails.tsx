'use client'

import React, { useEffect, useState } from 'react'
import { addCustomer, GeneralDetail, setGeneralDetails } from '../store/formSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { useForm } from 'react-hook-form'
import Input from '../components/Input'
import DatepickerComponent from '../components/DatepickerComponent'
import Dropdown from '../components/Dropdown'
import Button from '../components/Button'
import Modal from '../components/Modal'

interface GeneralDetailsProps {
  initialValues?: null | GeneralDetail;
}

const GeneralDetails:React.FC<GeneralDetailsProps> = ({ initialValues }) => {
  const {setValue, watch, reset} = useForm<GeneralDetail>({
    defaultValues:initialValues || {
      personName: '',
      date: '',
      selectedCustomer:''
    }
  })
  const dispatch = useDispatch<AppDispatch>();
  const generalData = useSelector((state:RootState)=> state.generalDetails)
  const customers = useSelector((state:RootState)=>state.customers)
  const selectedCustomer = watch('selectedCustomer')
  const watchedPersonName = watch('personName');
  const watchedDate = watch('date');

  const [isModalOpen, setModalOpen] = useState(false);
  const handleAddCustomer = () =>{
    setModalOpen(true)
  }
  const handleModalSubmit = (customerName: string) =>{
    dispatch(addCustomer(customerName))
  }


  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  useEffect(() => {
    dispatch(setGeneralDetails({
      personName: watchedPersonName,
      date: watchedDate,
      selectedCustomer: selectedCustomer
    } ));
  }, [watchedPersonName, watchedDate, selectedCustomer, dispatch]);
  return (
    <>
      <Input 
       name='personName'
       value= {watch('personName')}
       placeholder='Person Name'
       label='Person Name'
       onChange = {(e) => setValue('personName', e.target.value)}
       />

       <DatepickerComponent 
       name = 'date'
       label = 'Date'
       value = {watch('date')}
       onChange={(e)=> setValue('date', e.target.value)}
       />

       <Dropdown
        name='customer'
        label='Select Customer'
        options={customers}
        selectedValue={selectedCustomer}
        onChange={(e)=> setValue('selectedCustomer', e.target.value)}
       />
       <Button onClick={handleAddCustomer}>+</Button>

       <Modal 
        isOpen={isModalOpen}
        closeModal={()=>setModalOpen(false)}
        onSubmit={handleModalSubmit}
        placeholder='Enter Customer Name'
        title='Add Customer'
       />
    </>
  )
}

export default GeneralDetails