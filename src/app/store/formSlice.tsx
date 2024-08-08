import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GeneralDetail{
    personName: string;
    date: string;
    selectedCustomer: string;
}

export interface ShutterDetail{
    shutterName: string;
    width: number;
    height: number;
    area: number;
}

export interface DiscountDetail{
    discountType: 'Amount' | 'Percentage';
    discountAmount: number;
    totalAfterDiscount: number
}

interface FormState{
    generalDetails: GeneralDetail;
    shutterDetails: ShutterDetail[];
    discountDetails: DiscountDetail;
    customers: string[];
    shutters:string[];
    dataList:{
        general: GeneralDetail,
        shutter: ShutterDetail[],
        discount: DiscountDetail,
        totalArea: number
    }[];    
    dataToEdit: number| null;
    totalArea: number;
    currentStep: number
}

const initialState: FormState = {
    generalDetails: {
        personName: '',
        date: '',
        selectedCustomer: ''
    },
    shutterDetails: [],
    discountDetails:{
        discountType:'Amount',
        discountAmount: 0,
        totalAfterDiscount:0
    },
    customers:[],
    shutters:[],
    dataList:[],
    dataToEdit:null,
    totalArea: 0,
    currentStep: 0,
} 

const formSlice = createSlice({
    name:'form',
    initialState,
    reducers:{
        setGeneralDetails: (state, action: PayloadAction<GeneralDetail>) =>{
            state.generalDetails = action.payload
        },
        setShutterDetails: (state, action: PayloadAction<ShutterDetail[]>) =>{
            console.log("{{{{{{{{first}}}}}}}}", state.shutterDetails)
            state.shutterDetails = action.payload;
            state.totalArea = state.shutterDetails.reduce((acc,shutter)=> acc + shutter.area, 0 )
        },
        setDiscountDetails: (state, action: PayloadAction<DiscountDetail>) =>{
            state.discountDetails = action.payload
        },
        addCustomer: (state, action: PayloadAction<string>) =>{
            state.customers.push(action.payload)
        },
        addShutter: (state, action: PayloadAction<string>) =>{
            state.shutters.push(action.payload)
        },
        updateTotalAfterDiscount(state) {
            console.log("ooooooooooo---",state.shutterDetails)
            const totalArea = state.shutterDetails.reduce((acc, shutter) => 
                acc + shutter.area, 0
           );
            console.log("uuuuuuuuuuuu", totalArea)
            const total = state.discountDetails.discountType === 'Percentage'
              ? totalArea - (totalArea * (state.discountDetails.discountAmount as number)) / 100
              : totalArea - (state.discountDetails.discountAmount as number);
      
            state.discountDetails.totalAfterDiscount = total;
        },
        setDataList: (state) =>{
            const newData = {
                general : state.generalDetails,
                shutter: state.shutterDetails,
                discount: state.discountDetails,
                totalArea: state.totalArea
            }
            console.log("sttt",state.totalArea);

            state.dataList.push(newData);

            state.generalDetails = initialState.generalDetails;
            state.shutterDetails = initialState.shutterDetails;
            state.discountDetails = initialState.discountDetails;
            state.totalArea = initialState.totalArea;

        },
        updateDataList: (state, action: PayloadAction<{ index: number; updatedData: any }>) => {
            console.log("updateee", action.payload)
            const { index, updatedData } = action.payload;
            state.dataList[index] = updatedData;

            state.generalDetails = initialState.generalDetails;
            state.shutterDetails = initialState.shutterDetails;
            state.discountDetails = initialState.discountDetails;
            state.totalArea = initialState.totalArea;
        },
        deleteDataFromList: (state, action: PayloadAction<number>) => {
            state.dataList = state.dataList.filter((_, index) => index !== action.payload);
        },
        setDataToEdit: (state, action: PayloadAction<number>) => {
            state.dataToEdit = action.payload;
        },
        setCurrentStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        resetFormState: (state) => {
            state.generalDetails = initialState.generalDetails;
            state.shutterDetails = initialState.shutterDetails;
            state.discountDetails = initialState.discountDetails;
            state.totalArea = initialState.totalArea
        }
    }
})

export const {setGeneralDetails, setShutterDetails, setDiscountDetails, addCustomer, addShutter,updateTotalAfterDiscount, setDataList, 
    setCurrentStep,
    resetFormState,
    updateDataList,
    deleteDataFromList,
    setDataToEdit
} = formSlice.actions;
export default formSlice.reducer;