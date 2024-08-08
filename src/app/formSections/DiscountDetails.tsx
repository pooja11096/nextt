'use client'

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { DiscountDetail, setDiscountDetails, updateTotalAfterDiscount } from '../store/formSlice'
import RadioButton from '../components/RadioButton'
import Input from '../components/Input'

interface DiscountDetailsProps {
  initialValues?: DiscountDetail | null;
}

const DiscountDetails: React.FC<DiscountDetailsProps> = ({initialValues}) => {
  const dispatch = useDispatch<AppDispatch>();
  const discountDetails = useSelector((state: RootState) => state.discountDetails);
  const { discountType, discountAmount, totalAfterDiscount } = discountDetails;

  console.log("iniiiiiiiii0",initialValues)
  const { control, handleSubmit, watch, setValue, reset } = useForm<DiscountDetail>({
    defaultValues: initialValues || {
      discountType: discountType || 'Amount',
      discountAmount: discountAmount || 0,
    }
  });

  const watchedDiscountType = watch('discountType');
  const watchedDiscountAmount = watch('discountAmount');
  console.log("ammmmmmmmmm",totalAfterDiscount)

  useEffect(() => {
    dispatch(setDiscountDetails({
      discountType: watchedDiscountType,
      discountAmount: watchedDiscountAmount,
      totalAfterDiscount: totalAfterDiscount
    } ));
    dispatch(updateTotalAfterDiscount());
  }, [watchedDiscountType, watchedDiscountAmount, dispatch]);
  
//   useEffect(() => {
//     if (discountDetails) {
//       setValue('discountType', discountDetails.discountType);
//       setValue('discountAmount', discountDetails.discountAmount);
//     }
//   }, [discountDetails, setValue]);

  useEffect(() => {
    if (!initialValues) {
      reset(initialValues || {
        discountType: 'Amount',
        discountAmount: 0,
        totalAfterDiscount: 0
      });
    }
    dispatch(updateTotalAfterDiscount());
  }, [initialValues, reset, dispatch]);

  return (
    <>
      <Controller
        name="discountType"
        control={control}
        render={({ field }) => (
          <RadioButton
            name="discountType"
            options={[
              { value: 'Amount', label: 'Amount' },
              { value: 'Percentage', label: 'Percentage' }
            ]}
            selectedValue={field.value}
            onChange={(value: any) => field.onChange(value)}
          />
        )}
      />

      <Controller
        name="discountAmount"
        control={control}
        render={({ field }) => (
          <Input
                type="number"
                label="Discount Amount"
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                min={watchedDiscountType === 'Percentage' ? 1 : 0} name="discountAmount"          />
        )}
      />

      <Input
              type="text"
              label="Total"
              value={totalAfterDiscount}
              readOnly name={''}      />
    </>
  )
}

export default DiscountDetails
