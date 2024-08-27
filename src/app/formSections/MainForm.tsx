'use client'

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { updateDataList, setDataList, resetFormState, GeneralDetail, ShutterDetail, DiscountDetail, setShutterDetails, setGeneralDetails, setDiscountDetails } from '../store/formSlice';
import GeneralDetails from './GeneralDetails';
import ShutterDetails from './ShutterDetails';
import DiscountDetails from './DiscountDetails';
import Button from '../components/Button';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {toast} from 'react-toastify';

interface FormProps {
    isEditing: boolean;
    editIndex: number | null;
}

interface DataListProps {
    id: string;
    general: GeneralDetail; 
    shutter: ShutterDetail[];
    discount: DiscountDetail;
    totalArea: number;
}

const MainForm: React.FC<FormProps> = ({ isEditing, editIndex }) => {
    const { reset, setValue, watch } = useForm<DataListProps>();
    const dispatch = useDispatch<AppDispatch>(); // Ensure this is within the Provider
    const dataList = useSelector((state: RootState) => state.dataList);
    const router = useRouter();
    const editData = isEditing && editIndex !== null ? dataList.find((d) => d.id === editIndex) : null;
    const generalData = editData?.general;
    const shutterData = editData?.shutter;
    const totalArea = editData?.totalArea;
    const discountData = editData?.discount;

    const generalDetail = useSelector((state: RootState) => state.generalDetails);
    const shutterDetail = useSelector((state: RootState) => state.shutterDetails);
    const discountDetail = useSelector((state: RootState) => state.discountDetails);
    const totalAreaValue = useSelector((state: RootState) => state.totalArea);

    useEffect(() => {
        if (isEditing && editIndex !== null) {
            const data = dataList.find((d) => d.id === editIndex);
            if (data) {
                dispatch(setShutterDetails(data.shutter));
                dispatch(setGeneralDetails(data.general));
                dispatch(setDiscountDetails(data.discount));
                reset({
                    general: data.general,
                    shutter: data.shutter,
                    discount: data.discount,
                    totalArea: data.totalArea,
                });
            }
        } else {
            reset();
        }
    }, [isEditing, editIndex, dataList, dispatch, reset]);

    const handleSave = () => {
        const newData = {
            id: isEditing && editIndex !== null ? editIndex : Date.now(),
            general: generalDetail,
            shutter: shutterDetail,
            discount: discountDetail,
            totalArea: totalAreaValue,
        };
        if (isEditing && editIndex !== null) {
            dispatch(updateDataList({ index: editIndex, updatedData: newData }));
            toast.success('Data updated successfully!');
        } else {
            dispatch(setDataList(newData as any));
            toast.success('Data saved successfully!');
        }
        router.push('/');
    };

    const handleReset = () => {
        dispatch(resetFormState());
    };

    return (
        <form>
            <GeneralDetails initialValues={generalData} />
            <ShutterDetails initialValues={shutterData} totalAreaVal={totalArea} />
            <DiscountDetails initialValues={discountData} />
            <Button type="button" onClick={handleSave}>{isEditing ? 'Update' : 'Save'}</Button>
            <Button type="button" onClick={handleReset}>Reset</Button>
        </form>
    );
};

export default MainForm;
