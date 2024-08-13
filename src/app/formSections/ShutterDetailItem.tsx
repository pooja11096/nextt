import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ShutterDetail } from '../store/formSlice';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import Input from '../components/Input';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator } from 'react-icons/md';

interface ShutterDetailItemProps {
    id: string;
    index: number;
    shutterDetail: ShutterDetail;
    handleAddShutter: () => void;
    onRemove: (index: number) => void;
    onClone: (index: number) => void;
    shutters: string[];
    handleFieldChange: (index: number, key: keyof ShutterDetail, value: number | string) => void;
}

const ShutterDetailItem: React.FC<ShutterDetailItemProps> = ({
        id,
        index,
        shutterDetail,
        handleAddShutter,
        onRemove,
        onClone,
        shutters,
        handleFieldChange
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff',
        position: 'relative',
        zIndex: 1,
        touchAction: 'none',
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div {...attributes} {...listeners} style={{ cursor: 'move', marginBottom: '10px' }}>
                <MdDragIndicator size={20} />
            </div>
            <div onMouseDown={(e) => e.stopPropagation()}>
                <Dropdown
                    name={`shutterDetails.${index}.shutterName`}
                    options={shutters}
                    onChange={(e) => {
                        handleFieldChange(index, 'shutterName', e.target.value);
                    }}
                    selectedValue={shutterDetail.shutterName}
                    label='Shutter Name:'
                />
                <Button onClick={handleAddShutter}>+</Button>
                <Input
                    type="number"
                    name={`shutterDetails.${index}.width`}
                    label="Width:"
                    value={shutterDetail.width}
                    onChange={(e) => handleFieldChange(index, 'width', parseFloat(e.target.value))}
                />
                <Input
                    type="number"
                    name={`shutterDetails.${index}.height`}
                    label="Height:"
                    value={shutterDetail.height}
                    onChange={(e) => handleFieldChange(index, 'height', parseFloat(e.target.value))}
                />
                <Input
                    type="text"
                    label='Area:'
                    name={`shutterDetails.${index}.area`}
                    value={shutterDetail.area}
                    readOnly
                />
                {index !== 0 && (
                    <Button onClick={() => onRemove(index)}>Remove</Button>
                )}
                <Button onClick={() => onClone(index)}>Clone</Button>
            </div>
        </div>
    );
};

export default ShutterDetailItem;
