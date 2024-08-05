import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { AppDispatch, RootState } from '../store/store';
import { addShutter, setShutterDetails, ShutterDetail } from '../store/formSlice';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';

interface ShutterForm {
    shutterDetails: ShutterDetail[];
}
interface ShutterDetailsProps {
    initialValues?: ShutterDetail[];
    totalAreaVal?: number;
}

const ShutterDetails: React.FC<ShutterDetailsProps> = ({initialValues, totalAreaVal}) => {
    const {setValue, getValues, control, reset } = useForm<ShutterForm>({
        defaultValues: {
            shutterDetails: initialValues || [
                {
                    shutterName: '',
                    width: 0,
                    height: 0,
                    area: 0
                }
            ]
        }
    });
    const dispatch = useDispatch<AppDispatch>();
    const shutters = useSelector((state: RootState) => state.shutters);
    const totalArea = useSelector((state: RootState) => state.totalArea);
    const shutterData = useSelector((state: RootState) => state.shutterDetails);

    const [isModalOpen, setModalOpen] = useState(false);

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'shutterDetails'
    });

    const handleAddShutter = () => {
        setModalOpen(true);
    };

    const handleModalSubmit = (shutterName: string) => {
        dispatch(addShutter(shutterName));
    };

    const handleCloneShutter = (index: number) => {
        const shutter = getValues('shutterDetails')[index];
        append({
            ...shutter,
            shutterName: shutter.shutterName
        });
        const updatedShutterDetails = getValues('shutterDetails');
        dispatch(setShutterDetails(updatedShutterDetails));
    };

    const handleRemove = (index: number) => {
        const updatedShutterDetails = getValues('shutterDetails');
        dispatch(setShutterDetails(updatedShutterDetails));
        remove(index);
    };

    const handleFieldChange = (index: number, key: keyof ShutterDetail, value: number | string) => {
        const updatedShutterDetails = [...getValues('shutterDetails')];
        updatedShutterDetails[index] = {
            ...updatedShutterDetails[index],
            [key]: value,
        };

        if (key === 'width' || key === 'height') {
            const width = updatedShutterDetails[index].width;
            const height = updatedShutterDetails[index].height;
            updatedShutterDetails[index] = {
                ...updatedShutterDetails[index],
                area: width * height,
            };
        }

        setValue('shutterDetails', updatedShutterDetails);
        dispatch(setShutterDetails(updatedShutterDetails));
    }

    // useEffect(() => {
    //     if (initialValues) {
    //         reset({ shutterDetails: initialValues });
    //     }
    // }, [initialValues, reset]);

    return (
        <>
            {fields.map((field, index) => (
                <div key={field.id} style={{ marginBottom: '1rem' }}>
                    <Dropdown
                        name={`shutterDetails.${index}.shutterName`}
                        options={shutters}
                        onChange={(e) => {
                            const updatedShutterDetails = getValues('shutterDetails').map((shutter, i) => 
                                i === index ? { ...shutter, shutterName: e.target.value } : shutter
                            );
                            setValue('shutterDetails', updatedShutterDetails);
                            dispatch(setShutterDetails(updatedShutterDetails)); 
                        }}
                        selectedValue={field.shutterName}
                        label='Shutter Name:'
                    />
                    <Button onClick={handleAddShutter}>+</Button>

                    <Input
                        type="number"
                        name={`shutterDetails.${index}.width`}
                        label="Width:"
                        value={field.width}
                        onChange={(e) => handleFieldChange(index, 'width', parseFloat(e.target.value))}
                    />

                    <Input
                        type="number"
                        name={`shutterDetails.${index}.height`}
                        label="Height:"
                        value={field.height}
                        onChange={(e) => handleFieldChange(index, 'height', parseFloat(e.target.value))}
                    />

                    <Input
                        type="text"
                        label='Area:'
                        name={`shutterDetails.${index}.area`}
                        value={field.area}
                        readOnly
                    />

                    {index != 0 && (
                        <Button onClick={() => handleRemove(index)}>Remove</Button>
                    )}
                    <Button onClick={() => handleCloneShutter(index)}>Clone</Button>
                </div>
            ))}
            <Button type="button" onClick={() => append({ shutterName: '', width: 0, height: 0, area: 0 })}>
                Add Shutter
            </Button>
            <div>Total Area: {totalAreaVal ||totalArea}</div>

            <Modal
                isOpen={isModalOpen}
                closeModal={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                placeholder='Enter Shutter Name'
                title='Add Shutter'
            />
        </>
    );
};

export default ShutterDetails;
