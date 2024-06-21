import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";

// import {rootReducer} from '../src/commonServices/Reducers/indexReducer'
import { allServices_Reducer } from '../Reducers/servicesReducers'


const rootReducer = combineReducers({
    allServices : allServices_Reducer,
})

export const store = configureStore({
    reducer : rootReducer
  })