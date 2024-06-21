import { ADD_NEW_SERVICE, ALL_SERVICES, DELETE_SERVICE } from "../ReduxConstants"


export const allServices_Action = (data) => {
    // console.warn(data)
    return {
        type : ALL_SERVICES,
        data : data
    }
}
export const addNewService_Action = (data) => {
    // console.warn(data)
    return {
        type : ADD_NEW_SERVICE,
        data : data
    }
}

export const deleteService_Action = (data) => {
    // console.warn(data)
    return {
        type : DELETE_SERVICE,
        data : data
    }
}