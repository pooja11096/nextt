import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { AppDispatch, RootState } from '../store/store';
import { addShutter, setShutterDetails, ShutterDetail, updateTotalAfterDiscount } from '../store/formSlice';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import ShutterDetailItem from './ShutterDetailItem'; 
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface ShutterForm {
    shutterDetails: ShutterDetail[];
}

interface ShutterDetailsProps {
    initialValues?: ShutterDetail[];
    totalAreaVal?: number;
}

const ShutterDetails: React.FC<ShutterDetailsProps> = ({ initialValues, totalAreaVal }) => {
    const methods = useForm<ShutterForm>({
        defaultValues: {
            shutterDetails: initialValues || [
                {
                    id: Date.now(),
                    shutterName: '',
                    width: 0,
                    height: 0,
                    area: 0,
                },
            ],
        },
    });

    const { setValue, getValues, control } = methods;
    const dispatch = useDispatch<AppDispatch>();
    const shutters = useSelector((state: RootState) => state.shutters);
    const totalArea = useSelector((state: RootState) => state.totalArea);

    const [isModalOpen, setModalOpen] = useState(false);

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'shutterDetails',
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
            shutterName: shutter.shutterName,
        });
        const updatedShutterDetails = getValues('shutterDetails');
        dispatch(setShutterDetails(updatedShutterDetails));
        dispatch(updateTotalAfterDiscount());
    };

    const handleRemove = (index: number) => {
        remove(index);
        const updatedShutterDetails = [...getValues('shutterDetails')];
        dispatch(setShutterDetails(updatedShutterDetails));
        dispatch(updateTotalAfterDiscount());
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
        dispatch(updateTotalAfterDiscount());
    };

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((item) => item.id === active.id);
            const newIndex = fields.findIndex((item) => item.id === over.id);
            const updatedShutterDetails = arrayMove(getValues('shutterDetails'), oldIndex, newIndex);
            setValue('shutterDetails', updatedShutterDetails);
            dispatch(setShutterDetails(updatedShutterDetails));
            dispatch(updateTotalAfterDiscount());
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <FormProvider {...methods}> 
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={fields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {fields.map((field, index) => (
                        <ShutterDetailItem
                            key={field.id}
                            id={field.id}
                            index={index}
                            shutterDetail={field}
                            handleAddShutter={handleAddShutter}
                            onRemove={handleRemove}
                            onClone={handleCloneShutter}
                            shutters={shutters}
                            handleFieldChange={handleFieldChange}
                        />
                    ))}
                </SortableContext>
            </DndContext>
            <Button type="button" onClick={() => append({ id: Date.now(), shutterName: '', width: 0, height: 0, area: 0 })}>
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
        </FormProvider>
    );
};

export default ShutterDetails;
