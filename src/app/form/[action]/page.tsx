'use client'
import { useRouter } from 'next/navigation';
import MainForm from '../../formSections/MainForm';

interface FormPageProps {
  params: {
    action: string;
  };
  searchParams: {
    index?: string;
  };
}

const FormPage = ({ params, searchParams }: FormPageProps) => {
  const router = useRouter();
  const { action } = params;
  const isEditing = action === 'edit';
  const editIndex = searchParams.index ? parseInt(searchParams.index, 10) : null;

  return (
    <div>
      <h1>{isEditing ? 'Edit Data' : 'Add Data'}</h1>
      <MainForm isEditing={isEditing} editIndex={editIndex} />
    </div>
  );
};

export default FormPage;
