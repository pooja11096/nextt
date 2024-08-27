'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import {store, persistor} from '../store/store'
import { PersistGate } from 'redux-persist/integration/react'
// import { makeStore, AppStore } from '../lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
//   const storeRef = useRef<persistor>()
//   if (!storeRef.current) {
//     // Create the store instance the first time this renders
//     storeRef.current = store()
//   }

  return (
  <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
        {children}
    </PersistGate>
    </Provider>
    )
}