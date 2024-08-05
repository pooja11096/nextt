'use client'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store";
import Table from "./formSections/Table";

export default function Home() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Table/>
        
         {/* <StepperForm/> */}
      </PersistGate>
    </Provider>
  );
}
