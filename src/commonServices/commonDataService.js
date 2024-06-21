export const frequencyList = [
    {
        id: 1,
        frequency: 1
    },
    {
        id: 2,
        frequency: 2
    },
    {
        id: 3,
        frequency: 3
    },
    {
        id: 4,
        frequency: 4
    },
    {
        id: 5,
        frequency: 5
    },
    {
        id: 6,
        frequency: 6
    },
    {
        id: 7,
        frequency: 7
    },
    {
        id: 8,
        frequency: 8
    },
    {
        id: 9,
        frequency: 9
    },
    {
        id: 10,
        frequency: 10
    },
    {
        id: 11,
        frequency: 12
    },
    {
        id: 12,
        frequency: 15
    },
    {
        id: 13,
        frequency: 18
    },
    {
        id: 14,
        frequency: 20
    },
    {
        id: 15,
        frequency: 25
    },

    {
        id: 16,
        frequency: 30
    },
];

export const defaultServiceList = [
    { id: 1, title: 'Acupuncture', live: true },
    { id: 2, title: 'Cryotherapy', live: true },
    { id: 3, title: 'Floating', live: false },
    { id: 4, title: 'Ice Bath', live: true },
    { id: 5, title: 'Infrared Sauna', live: false },
    { id: 6, title: 'Massages', live: true },
    { id: 7, title: 'Oxygen Hydroxy Therapy', live: true },
];

export const defaultPlanList = [
    { id: 1, name: 'Plan 1', shortDescription: 'Plan 1 Short Description', longDescription: 'Plan 1 Long Description', service: "Cryotherapy", status: true, price: 100, duration: 30 },
    { id: 2, name: 'Plan 2', shortDescription: 'Plan 2 Short Description which is actually not short enough to check placement of buttons', longDescription: 'Plan 2 Long Description', service: "Acupuncture", status: true, price: 200, duration: 60 },
    { id: 3, name: 'Plan 3', shortDescription: 'Plan 3 Short Description', longDescription: 'Plan 3 Long Description', service: "Infrared Sauna", status: false, price: 300, duration: 90 },
    { id: 4, name: 'Plan 4', shortDescription: 'Plan 4 Short Description', longDescription: 'Plan 4 Long Description', service: "Acupuncture", status: false, price: 400, duration: 120 },
    { id: 5, name: 'Plan 5', shortDescription: 'Plan 5 Short Description', longDescription: 'Plan 5 Long Description', service: "Cryotherapy", status: true, price: 500, duration: 150 },
];

export const defaultPackageList = [
    { id: 1, name: 'Package 1', shortDescription: 'Package 1 Short Description', longDescription: 'Package 1 Long Description', service: "Cryotherapy", status: true, frequency: 3, price: 100, duration: 30 },
    { id: 2, name: 'Package 2', shortDescription: 'Package 2 Short Description which is actually not short enough to check placement of buttons', longDescription: 'Package 2 Long Description', service: "Acupuncture", status: true, frequency: 30, price: 200, duration: 60 },
    { id: 3, name: 'Package 3', shortDescription: 'Package 3 Short Description', longDescription: 'Package 3 Long Description', service: "Infrared Sauna", status: false, frequency: 10, price: 300, duration: 90 },
    { id: 4, name: 'Package 4', shortDescription: 'Package 4 Short Description', longDescription: 'Package 4 Long Description', service: "Acupuncture", status: false, frequency: 7, price: 400, duration: 120 },
    { id: 5, name: 'Package 5', shortDescription: 'Package 5 Short Description', longDescription: 'Package 5 Long Description', service: "Cryotherapy", status: true, frequency: 18, price: 500, duration: 150 },
];

export const defaultMembershipList = [
    { id: 1, name: 'Membership 1', shortDescription: 'Membership 1 Short Description', longDescription: 'Membership 1 Long Description', service: "Cryotherapy", status: true, frequency: "Monthly", price: 100, duration: 30 },
    { id: 2, name: 'Membership 2', shortDescription: 'Membership 2 Short Description', longDescription: 'Membership 2 Long Description', service: "Acupuncture", status: true, frequency: "Yearly", price: 200, duration: 60 },
    { id: 3, name: 'Membership 3', shortDescription: 'Membership 3 Short Description', longDescription: 'Membership 3 Long Description', service: "Infrared Sauna", status: false, frequency: "Monthly", price: 300, duration: 90 },
    { id: 4, name: 'Membership 4', shortDescription: 'Membership 4 Short Description', longDescription: 'Membership 4 Long Description', service: "Acupuncture", status: false, frequency: "Yearly", price: 400, duration: 120 },
    { id: 5, name: 'Membership 5', shortDescription: 'Membership 5 Short Description', longDescription: 'Membership 5 Long Description', service: "Cryotherapy", status: true, frequency: "Monthly", price: 500, duration: 150 },
];

export const defaultClassList = [
    { id: 1, title: 'Yoga', },
    { id: 2, title: 'Meditation', },
    { id: 3, title: 'Hot Yoga', },
];

// export const PLAN_VALIDITY =[
//     {id : 1, name : 'Monthly', dayCountValue: 30 },
//     {id : 2, name : 'Quarterly', dayCountValue:90 },
//     {id : 3, name : 'Half Yearly', dayCountValue:180 },
//     {id : 4, name : 'Yearly', dayCountValue:360 },
// ]

export const PLAN_VALIDITY = [
    { id: 1, name: 'Monthly', dayCountValue: 30 },
    { id: 2, name: 'Quarterly', dayCountValue: 90 },
]

export const PLAN_TYPE_PACKAGE = 'PACKAGE'
export const PLAN_TYPE_SINGLE_TIME_PLAN = 'PLAN'
export const PLAN_TYPE_MEMBERSHIP = 'MEMBERSHIP'

export const DELETE_ENTITY_STATUS = 9
export const ENABLE_ENTITY_STATUS = 1
export const DISABLE_ENTITY_STATUS = 0

export const CLASS_TYPE_YOGA = 1
export const CLASS_TYPE_MEDITATION = 2
export const CLASS_TYPE_HOT_YOGA = 3


export const FIXED_PAGES = {
    HOME: "HOME",
    ABOUTUS: "ABOUT US",
    SERVICES: "SERVICES",
    CLASSES: 'CLASSES',
    SETTINGS: 'SETTINGS',
    CONTACTUS: 'CONTACT US',
    CORPOARTE_WELLNESS: 'CORPORATE WELLNESS',
}

// export const IMAGE_BASE_URL = 'http://localhost:8080/images/' // Local
export const IMAGE_BASE_URL = 'https://api.recoverylabqatar.com/images/' // Cloud
