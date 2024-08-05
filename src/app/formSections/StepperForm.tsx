import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { setGeneralDetails, setShutterDetails, setDiscountDetails, setCurrentStep } from '../store/formSlice';
import GeneralDetails from './GeneralDetails';
import ShutterDetails from './ShutterDetails';
import DiscountDetails from './DiscountDetails';
import Button from '../components/Button';

const StepperForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useSelector((state: RootState) => state.currentStep);
  const generalDetails = useSelector((state: RootState) => state.generalDetails);
  const shutterDetails = useSelector((state: RootState) => state.shutterDetails);
  const discountDetails = useSelector((state: RootState) => state.discountDetails);

  const handleNext = () => {
    switch (currentStep) {
      case 0:
        dispatch(setGeneralDetails(generalDetails)); 
        break;
      case 1:
        dispatch(setShutterDetails(shutterDetails)); 
        break;
      case 2:
        dispatch(setDiscountDetails(discountDetails)); 
        break;
    }
    dispatch(setCurrentStep(currentStep + 1));
  };

  const handlePrevious = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <GeneralDetails />;
      case 1:
        return <ShutterDetails />;
      case 2:
        return <DiscountDetails />;
      default:
        return <GeneralDetails />;
    }
  };

  return (
    <form>
      {renderStep()}
      <div>
        {currentStep > 0 && (
          <Button type="button" onClick={handlePrevious}>Previous</Button>
        )}
        {currentStep < 2 && (
          <Button type="button" onClick={handleNext}>Next</Button>
        )}
        {currentStep === 2 && (
          <Button type="submit">Submit</Button>
        )}
      </div>
    </form>
  );
};

export default StepperForm;
