import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updateDataList, deleteDataFromList, setDataList, resetFormState, GeneralDetail, ShutterDetail, DiscountDetail, setShutterDetails, setGeneralDetails, setDiscountDetails } from '../store/formSlice';
import GeneralDetails from './GeneralDetails';
import ShutterDetails from './ShutterDetails';
import DiscountDetails from './DiscountDetails';
import Button from '../components/Button';
import { useForm } from 'react-hook-form';
interface FormProps {
    isEditing: boolean;
    editIndex: number | null;
    onClose: () => void;
}

interface DataListProps {
    id: string,
    general: GeneralDetail,
    shutter: ShutterDetail[],
    discount: DiscountDetail,
    totalArea: number
}

const MainForm: React.FC<FormProps> = ({ isEditing, editIndex, onClose }) => {
const { reset, setValue, watch } = useForm<DataListProps>()
const dispatch = useDispatch<AppDispatch>();
const dataList = useSelector((state: RootState) => state.dataList);
const editData = isEditing && editIndex !== null ? dataList.find((d)=>d.id === editIndex):null;
const generalData = editData?.general;
const shutterData = editData?.shutter;
const totalArea = editData?.totalArea;
const discountData = editData?.discount;

const generalDetail = useSelector((state:RootState)=>state.generalDetails);
const shutterDetail = useSelector((state:RootState)=>state.shutterDetails);
const discountDetail = useSelector((state:RootState)=>state.discountDetails);
const totalAreaValue = useSelector((state:RootState)=>state.totalArea);


useEffect(() => {
    if (isEditing && editIndex !== null) {
      const data = dataList.find((d)=>d.id === editIndex);
      // const dataToEdit = dataList[editIndex];
      if(data){
        dispatch(setShutterDetails(data.shutter));
        dispatch(setGeneralDetails(data.general));
        dispatch(setDiscountDetails(data.discount));
        // setValue('generalDetails', data.general);
        // setValue('discountDetails', data.discount);
        reset({
         general : data.general,
         shutter: data.shutter,
         discount: data.discount,
         totalArea: data.totalArea
        });
      }
    }else{
      console.log("elseeeeeeeeeeeeeeeee")
      reset();
    }
  }, [isEditing, editIndex, dataList, reset]);
  const handleSave = () => {
    // dispatch(setDataList()); 
    const newData = {
        general: generalDetail,
        shutter: shutterDetail,
        discount: discountDetail,
        totalArea:totalAreaValue
    }
    if (isEditing && editIndex !== null) {
      console.log("editinggggggggggg",editIndex,"ooooo",isEditing)
        dispatch(updateDataList({ index: editIndex, updatedData: newData }));
      } else {
        dispatch(setDataList(newData as any));
      }
      onClose();
  };

  const handleReset = () =>{
    dispatch(resetFormState())
  }
  
  return (
    <form>
      <GeneralDetails initialValues={generalData} />
      <ShutterDetails initialValues={shutterData} totalAreaVal={totalArea}/>
      <DiscountDetails initialValues={discountData}/>
      <Button type="button" onClick={handleSave}>{isEditing ? 'Update' : 'Save'}</Button>
      <Button type="button" onClick={handleReset}>Reset</Button>

      
    </form>
  );
};

export default MainForm;
