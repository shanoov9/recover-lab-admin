import { ADD_NEW_SERVICE, ALL_SERVICES, DELETE_SERVICE } from "../ReduxConstants"

const initialState = {
    allServicesData: []
}
export const allServices_Reducer = (state = initialState, action) => {
    console.log(action)
    console.log('state', state)
    switch (action.type) {
        case ALL_SERVICES:
            return {
                ...state,
                allServicesData: action.data
            }
        case ADD_NEW_SERVICE: {
            return {
                ...state,
                allServicesData: [...state.allServicesData, action.data]
            }
        }
        case DELETE_SERVICE: {
            return {
                ...state.allServicesData,
                allServicesData: state.allServicesData.filter(serv => serv.id !== action.data.id)
            }
        }
        default:
            return state

    }

}