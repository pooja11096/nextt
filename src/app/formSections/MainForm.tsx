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
    general: GeneralDetail,
    shutter: ShutterDetail[],
    discount: DiscountDetail,
    totalArea: number
}

const MainForm: React.FC<FormProps> = ({ isEditing, editIndex, onClose }) => {
const { reset, setValue, watch } = useForm<DataListProps>()
const dispatch = useDispatch<AppDispatch>();
const dataList = useSelector((state: RootState) => state.dataList);
const generalData = isEditing && editIndex !== null ? dataList[editIndex].general : null;
const shutterData = isEditing && editIndex !== null ? dataList[editIndex].shutter : [];
const totalArea = isEditing && editIndex !== null ? dataList[editIndex].totalArea : 0;
const discountData = isEditing && editIndex !== null ? dataList[editIndex].discount : null;

const generalDetail = useSelector((state:RootState)=>state.generalDetails);
const shutterDetail = useSelector((state:RootState)=>state.shutterDetails);
const discountDetail = useSelector((state:RootState)=>state.discountDetails);
const totalAreaValue = useSelector((state:RootState)=>state.totalArea);


useEffect(() => {
    if (isEditing && editIndex !== null) {
      const data = dataList[editIndex];
      // const dataToEdit = dataList[editIndex];
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
