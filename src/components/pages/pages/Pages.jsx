import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Switch, Transition } from '@headlessui/react'
import { Link } from 'react-router-dom';
import { CheckIcon, ChevronDownIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { serviceList } from '../../../commonServices/commonDataService';
import { TreatmentServiceApis, classApiService } from '../../../commonServices/apiService'
import HeadlessUIModalComponent from '../../shared-components/modal/HeadlessUIModal'
import { connect } from 'react-redux';
import { addNewService_Action, allServices_Action, deleteService_Action } from '../../../commonServices/Actions/actions'
import { toast } from 'react-toastify';
import {
    SERVICE_CREATED_SUCCESSFULLY,
    SERVICE_COULDNT_CREATED,
    SERVICE_DELETED_SUCCESSFULLY,
    SERVICE_COULDNT_DELETED,
    SERVICE_STATUS_UPDATED_SUCCESSFULLY,
    SERVICE_STATUS_COULDNT_UPDATED,
    CLASS_STATUS_UPDATED,
} from '../../../commonServices/messageConstants';



const Pages = (props) => {
    // console.log('pages page props' ,props)
    const AllServicesFromProp = props.allServices.allServices.allServicesData
    useEffect(() => {
        getAllServices()
        getAllclassNames()
    }, [AllServicesFromProp])

    // Confirm Delete Modal states
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [serviceToDelete, setServiceToDelete] = useState(null)

    // Display states
    const [isServicesExpanded, setIsServicesExpanded] = useState(true);
    const [showAddService, setShowAddService] = useState(false);
    const [isClassesExpanded, setIsClassesExpanded] = useState(true);

    // Add Service Modal States
    const [addServiceName, setAddServiceName] = useState('');
    const [addServiceType, setAddServiceType] = useState(1)
    const [allServices, setAllServices] = useState([]);

    // edit service name 
    const [showEditModal, setShowEditModal] = useState(false);
    const [editServiceId, setEditServiceId] = useState(null);
    const [editServiceName, setEditServiceName] = useState("")
    const [isEditNameAvailable, setIsEditNameAvailable] = useState(null)

    const [allPages, setAllPages] = useState([
        { id: 1, title: 'Home', editRoute: '/pages/edit/home' },
        { id: 2, title: 'About Us', editRoute: '/pages/edit/about-us' },
        { id: 3, title: 'Contact Us', editRoute: '/pages/edit/contact-us' },
        { id: 4, title: 'Corporate Wellness', editRoute: '/pages/edit/corporate-wellness' },
        { id: 5, title: "Services" },
        { id: 6, title: 'Classes' }
    ]);

    const [addClassName, setAddClassName] = useState('')
    const [showAddClass, setShowAddClass] = useState(false)

    const [editClassId, setEditClassId] = useState(null)
    const [editClassName, setEditClassName] = useState('')
    const [showEditClass, setShowEditClass] = useState(false)
    const [isEditClassNameAvailable, setIsEditClassNameAvailable] = useState(null)
    //delete class model
    const [classToDelete, setClassToDelete] = useState(null)
    const [showDeleteClass, setShowDeleteClass] = useState(false)

    const [allClasses, setAllClasses] = useState([])

    // const allClasses = [
    //     { id: 1, title: 'Yoga', status: true },
    //     { id: 2, title: 'Meditation', status: false },
    //     { id: 3, title: 'Hot Yoga', status: true },
    // ];

    const getAllServices = () => {
        // console.log(props.allServices.allServices.allServicesData)
        let servicesFromProps = props.allServices.allServices.allServicesData
        setAllServices(servicesFromProps)
        //  if(!allServices.length){
        //       setTimeout(() => {
        //     console.log(props)
        //     servicesFromProps = props.allServices.allServices.allServicesData
        //     setAllServices(servicesFromProps)
        //   }, 3000)
        //  }

        // setTimeout(() => {
        //     console.log("Hello, World!");
        //     console.log(props)

        //   }, 2000)

        // console.log('getAllServices')
        // TreatmentServiceApis.getAllServices().then(response => {
        //     const allServicesResponseData = response.data.data
        //     console.log(allServicesResponseData)
        //     setAllServices(allServicesResponseData)
        // allServicePagesHandler(allServicesResponseData)

        // console.log(allServices)
        // })
    }

    const getAllclassNames = () => {
        classApiService.getAllClassNames().then(res => {
            console.log(res)
            if (res.data.status === true) {
                setAllClasses(res.data.data)
            }
        }).catch(err => console.error(err))
    }

    const handelServiceStatusChange = (index, id, newStatus, serviceType) => {
        const reqBody = {
            type: serviceType,
            id: id,
            status: newStatus
        }
        TreatmentServiceApis.updateTreatmentLiveStatus(reqBody).
            then((responese) => {
                if (responese.data.status == true) {
                    if (serviceType === "SERVICE") {
                        const updatedServices = [...allServices];
                        updatedServices[index].status = newStatus;
                        setAllServices(updatedServices);
                        toast.success(SERVICE_STATUS_UPDATED_SUCCESSFULLY)
                    } else {
                        const updatedServices = [...allClasses];
                        updatedServices[index].status = newStatus;
                        setAllClasses(updatedServices);
                        toast.success(CLASS_STATUS_UPDATED)
                    }
                }
            }).catch(err => {
                console.error(err);
                toast.error(SERVICE_STATUS_COULDNT_UPDATED)
            })
    }

    const handleAddService = (e) => {
        e.preventDefault();
        if (addServiceName.trim() !== '') {
            let prev = allServices.filter(serv => {
                // console.log(serv)
                return serv.treatmentServiceName.toLowerCase() === addServiceName.toLowerCase()
            });
            if (prev.length > 0) {
                alert('Service with this name already exists');
                return;
            }
        }
        if (addServiceName.length) {
            TreatmentServiceApis.createTreatmentServicePage({ treatmentServiceName: addServiceName, serviceType: parseInt(addServiceType) })
                .then(response => {
                    console.log(response)
                    const responseData = response.data.data
                    setAllServices([...allServices, responseData]);
                    setShowAddService(false);
                    setAddServiceName('');
                    props.addServiceHandler(responseData)
                    console.log(allServices)
                    toast.success(SERVICE_CREATED_SUCCESSFULLY)
                    // console.log(response.data.data)
                }).catch(err => {
                    console.log(err)
                    toast.error(SERVICE_COULDNT_CREATED)
                })
        } else {
            toast.warning('service name cannot be empty')
        }


        // const newService = {
        //     id: allServices.length + 1,
        //     title: addServiceName,
        //     live: true
        // }
        // setShowAddService(false);
        // setAddServiceName('');
    }

    const editServiceModalBodyJSX = (
        <div className="mt-6">
            <div className="grid grid-cols-1 gap-6">
                <div className='flex items-center gap-2'>
                    <p className='font-medium' >Old Name: </p>
                    <p>{allServices.find(serv => serv.id === editServiceId)?.treatmentServiceName}</p>
                </div>

                <div>
                    <label htmlFor='editServiceName' className="block text-sm mb-1 font-medium">
                        New Name
                    </label>
                    <input
                        type="text"
                        id='editServiceName'
                        name='editServiceName'
                        placeholder='Enter New Name'
                        value={editServiceName}
                        onChange={(e) => {
                            let val = e.target.value;
                            setEditServiceName(val);

                            if (val.trim() === '') {
                                setIsEditNameAvailable(null)
                            } else {
                                let filteredServices = allServices
                                    .filter(serv => serv.id !== editServiceId)
                                    .filter(serv => serv.treatmentServiceName.trim().toLowerCase() === val.trim().toLowerCase())
                                if (filteredServices.length > 0) {
                                    setIsEditNameAvailable({ available: false })
                                } else {
                                    setIsEditNameAvailable({ available: true })
                                }
                            }

                        }}
                        className="block w-full px-3 py-2 border-2 border-gray-300 focus:outline-none rounded-md shadow-sm placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {isEditNameAvailable &&
                        (isEditNameAvailable.available
                            ?
                            <span className='text-sm flex items-center gap-1 text-green-700'>
                                <CheckIcon className='w-4 h-4' /> Available
                            </span>
                            :
                            <span className='text-sm flex items-center gap-1 text-red-600'>
                                <XMarkIcon className='w-4 h-4' /> Unavailable
                            </span>
                        )
                    }
                </div>
            </div>
        </div>
    )


    const pagesList = allPages.map(page => (
        page.title === "Services"
            ?
            <li key={`page${page.id}`} className={`${isServicesExpanded ? '' : 'h-14'} rounded-lg px-3 pb-3 mt-2 overflow-hidden transition-all bg-gray-200`}>
                <div className="flex my-2 mb-5 items-center justify-between">
                    <div className="ml-4">
                        <div className="text-left font-medium text-gray-900">{page.title}</div>
                    </div>
                    <div className='flex items-center'>
                        <Link to={`/pages/edit/services`} title='Edit Page' className="rounded-full bg-indigo-300 mx-[3px] px-2 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            Edit / View
                        </Link>
                        <button onClick={() => { setIsServicesExpanded(prev => !prev) }} title='Expand' className="rounded-full bg-indigo-300 mx-[3px] px-2 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                            <ChevronDownIcon className={`w-5 ${isServicesExpanded && '-rotate-180'} transition-all`} />
                        </button>
                    </div>
                </div>
                <div>
                    <ul className='w-[95%] ml-auto'>
                        <li className='bg-gray-900 text-white select-none flex rounded-lg pl-3 pr-7'>
                            <div className="flex my-2 items-center justify-between w-full">
                                <div className="ml-4 ">
                                    <div className="text-left">Service Name</div>
                                </div>
                                <div className='flex items-center gap-5'>
                                    <p>Live Status</p>
                                    <p>Actions</p>
                                </div>
                            </div>
                        </li>
                        {allServices && allServices.map((service, index) => (
                            <li key={`service${service.id}`} className='h-14 bg-gray-300 flex rounded-lg px-3 mt-2'>
                                <div className="flex my-2 items-center justify-between w-full">
                                    <div className="ml-4 flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setEditServiceId(service.id);
                                                setShowEditModal(true)
                                            }}
                                            className='text-blue-900 bg-blue-300 hover:bg-blue-400 p-2 rounded-full'
                                        >
                                            <PencilIcon className='w-5 h-5' />
                                        </button>
                                        <div className="text-left font-medium text-gray-900">{service.treatmentServiceName}</div>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Switch
                                            checked={service.status}
                                            onChange={(newStatus) => { handelServiceStatusChange(index, service.id, newStatus, 'SERVICE') }}
                                            className={`border ${service.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-[34px] w-[70px] shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`${service.status ? 'translate-x-9 bg-green-700/90' : 'translate-x-0 bg-red-700/90'}
                                                  pointer-events-none text-white inline-block h-[30px] w-[30px] transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                                            >
                                                {service.status
                                                    ?
                                                    <CheckIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                                    :
                                                    <XMarkIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                                }
                                            </span>
                                        </Switch>
                                        <Link
                                            to={`/pages/service/${service.id}?title=${service.treatmentServiceName}`}
                                            className="rounded-full bg-indigo-300 mx-[3px] px-4 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => (service)}
                                            title='Delete Service'
                                            className="rounded-full bg-red-300 mx-[3px] px-2 py-2 text-sm font-semibold text-red-900 shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            <TrashIcon className='w-5 h-5' />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li className='flex justify-end'>
                            <button
                                onClick={() => { setShowAddService(true) }}
                                className='flex items-center gap-1 bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-medium text-[15px] py-2 px-4 rounded-lg my-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900/70 focus-visible:outline-none focus-visible:outline-offset-2 focus-visible:outline-white'
                            >
                                <PlusIcon className='w-5 h-5' /> Add New Service
                            </button>
                        </li>
                    </ul>
                </div>
            </li>
            :
            page.title === "Classes"
                ?
                <li key={`page${page.id}`} className={`${isClassesExpanded ? '' : 'h-14'} rounded-lg px-3 pb-3 mt-2 overflow-hidden transition-all bg-gray-200`}>
                    <div className="flex my-2 mb-5 items-center justify-between">
                        <div className="ml-4">
                            <div className="text-left font-medium text-gray-900">{page.title}</div>
                        </div>
                        <div className='flex items-center'>
                            <Link to={`/pages/edit/classes`} title='Edit Page' className="rounded-full bg-indigo-300 mx-[3px] px-2 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                Edit / View
                            </Link>
                            <button onClick={() => { setIsClassesExpanded(prev => !prev) }} title='Expand' className="rounded-full bg-indigo-300 mx-[3px] px-2 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                <ChevronDownIcon className={`w-5 ${isClassesExpanded && '-rotate-180'} transition-all`} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <ul className='w-[95%] ml-auto'>
                            <li className='bg-gray-900 text-white select-none flex rounded-lg pl-3 pr-7'>
                                <div className="flex my-2 items-center justify-between w-full">
                                    <div className="ml-4 ">
                                        <div className="text-left">Class Name</div>
                                    </div>
                                    <div className='flex items-center gap-5'>
                                        {/* <p>Live Status</p> */}
                                        <p>Actions</p>
                                    </div>
                                </div>
                            </li>
                            {allClasses && allClasses.map((clsName, index) => (
                                <li key={`service${clsName.id}`} className='h-14 bg-gray-300 flex rounded-lg px-3 mt-2'>
                                    <div className="flex my-2 items-center justify-between w-full">
                                        <div className="ml-4 ">
                                            <div className="text-left flex items-center gap-1 font-medium text-gray-900">
                                                <button
                                                    onClick={() => {
                                                        setEditClassId(clsName.id);
                                                        setShowEditClass(true)
                                                    }}
                                                    className='text-blue-900 bg-blue-300 hover:bg-blue-400 p-2 rounded-full'
                                                >
                                                    <PencilIcon className='w-5 h-5' />
                                                </button>
                                                {clsName.className}</div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Switch
                                                checked={clsName.status}
                                                onChange={(newStatus) => { handelServiceStatusChange(index, clsName.id, newStatus, 'CLASS') }}
                                                className={`border ${clsName.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-[34px] w-[70px] shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`${clsName.status ? 'translate-x-9 bg-green-700/90' : 'translate-x-0 bg-red-700/90'}
                                                  pointer-events-none text-white inline-block h-[30px] w-[30px] transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                                                >
                                                    {clsName.status
                                                        ?
                                                        <CheckIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                                        :
                                                        <XMarkIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                                    }
                                                </span>
                                            </Switch>
                                            <Link
                                                to={`/pages/class/${clsName.id}?title=${clsName.className}`}
                                                className="rounded-full bg-indigo-300 mx-[3px] px-4 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setClassToDelete(clsName)
                                                    setShowDeleteClass(true)
                                                }}
                                                title='Delete Service'
                                                className="rounded-full bg-red-300 mx-[3px] px-2 py-2 text-sm font-semibold text-red-900 shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                            >
                                                <TrashIcon className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            <li className='flex justify-end'>
                                <button
                                    onClick={() => { setShowAddClass(true) }}
                                    className='flex items-center gap-1 bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-medium text-[15px] py-2 px-4 rounded-lg my-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900/70 focus-visible:outline-none focus-visible:outline-offset-2 focus-visible:outline-white'
                                >
                                    <PlusIcon className='w-5 h-5' /> Add New Class
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>
                :
                <li key={`page${page.id}`} className='h-14 bg-gray-200 rounded-lg px-3 mt-2 flex'>
                    <div className="flex items-center justify-between w-full">
                        <div className="ml-4">
                            <div className="text-left font-medium text-gray-900">{page.title}</div>
                        </div>
                        <div>
                            <Link to={page.editRoute} title='Edit Page' className="rounded-full bg-indigo-300 mx-[3px] px-2 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                Edit / View
                            </Link>
                        </div>
                    </div>
                </li>
    ));

    const addServiceModalBody = (
        <div className="mt-6">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor='addServiceName' className="block text-sm mb-1 font-medium">
                        Service Name
                    </label>
                    <input
                        type="text"
                        id='addServiceName'
                        name='addServiceName'
                        placeholder='Enter Service Name'
                        value={addServiceName}
                        onChange={(e) => { setAddServiceName(e.target.value) }}
                        className="block w-full px-3 py-2 border-2 border-gray-300 focus:outline-none rounded-md shadow-sm placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor='addServiceType' className="block text-sm mb-1 font-medium">
                        Service Type
                    </label>
                    <select
                        name="addServiceType"
                        id="addServiceType"
                        value={addServiceType}
                        onChange={(e) => setAddServiceType(e.target.value)}
                        className='block w-full px-3 py-2 border-2 border-gray-300 focus:outline-none rounded-md shadow-sm placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    >
                        <option value={1}>Treatment</option>
                        <option value={2}>Tech Treatment</option>
                    </select>
                </div>

            </div>
        </div>
    );


    const addClassModalBody = (
        <div className="mt-6">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor='addClassName' className="block text-sm mb-1 font-medium">
                        Class Name
                    </label>
                    <input
                        type="text"
                        id='addClassName'
                        name='addClassName'
                        placeholder='Enter Class Name'
                        value={addClassName}
                        onChange={(e) => { setAddClassName(e.target.value) }}
                        className="block w-full px-3 py-2 border-2 border-gray-300 focus:outline-none rounded-md shadow-sm placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
    const EditClassModalBody = (
        <div className="mt-6">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <div className='flex items-center gap-2'>
                        <p className='font-medium' >Old Name: </p>
                        <p>{allClasses.find(serv => serv.id === editClassId)?.className}</p>
                    </div>
                    <label htmlFor='addClassName' className="block text-sm mb-1 font-medium">
                        New Class Name
                    </label>
                    <input
                        type="text"
                        id='addClassName'
                        name='addClassName'
                        placeholder='Enter Class Name'
                        value={editClassName}
                        onChange={(e) => {
                            let val = e.target.value;
                            setEditClassName(val);

                            if (val.trim() === '') {
                                setIsEditClassNameAvailable(null)
                            } else {
                                let filteredServices = allClasses
                                    .filter(cls => cls.id !== editClassId)
                                    .filter(cls => cls.className.trim().toLowerCase() === val.trim().toLowerCase())
                                console.log(filteredServices);
                                if (filteredServices.length > 0) {
                                    setIsEditClassNameAvailable({ available: false })
                                } else {
                                    setIsEditClassNameAvailable({ available: true })
                                }
                            }

                        }}
                        className="block w-full px-3 py-2 border-2 border-gray-300 focus:outline-none rounded-md shadow-sm placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
        </div>
    );
    const handleAddClass = (e) => {
        e.preventDefault();
        if (addClassName.trim() !== '') {
            let prev = allClasses.filter(cls => {
                return cls.className.toLowerCase() === addClassName.toLowerCase()
            });
            if (prev.length > 0) {
                alert('Class with this name already exists');
                return;
            }
        }
        if (addClassName.length) {
            classApiService.createClassType({ className: addClassName, status: false })
                .then(response => {
                    if (response.data.status === true) {
                        setAllClasses([...allClasses, response.data.data]);
                        setShowAddClass(false);
                        setAddClassName('');
                        toast.success("Class Created Successfully.")
                    }
                }).catch(err => {
                    console.error(err);
                    toast.error("Could not create class.")
                })
        } else {
            toast.error('Class name cannot be empty')
        }
    }
    //edit class name 
    const handleEditClass = (e) => {
        e.preventDefault();
        let selectedClasses = allClasses.find(serv => serv.id === editClassId);
        classApiService.updateClassType({
            id: editClassId,
            className: editClassName,
            oldClassName: selectedClasses.className
        })
            .then(response => {
                if (response.data.status === true) {
                    toast.success("Class Renamed Successfully.");
                    let updatedClasses = allClasses.map(cls => {
                        if (cls.id === editClassId) {
                            return { ...cls, className: editClassName }
                        }
                        return cls;
                    })
                    setAllClasses(updatedClasses)
                    setShowEditClass(false);
                    setEditClassName('');
                    setEditClassId('');
                }
            }).catch(err => {
                console.error(err);
                toast.error("Could not create class.");
            })
    }

    const openConfirmDeleteModal = (service) => {
        setServiceToDelete(service)
        setShowConfirmDeleteModal(true)
    }
    const openConfirmDeleteModalClass = (service) => {
        setClassToDelete(service)
        setShowDeleteClass(true)
    }

    const confirmDeleteBody = (
        <div>
            <span> Do you really want to Delete <b>{serviceToDelete?.treatmentServiceName}</b> Treatment Service page .. ? </span>
        </div>
    )
    const deleteTreatmentServicePage = () => {
        const body = {
            id: classToDelete.id,
            removeService: true
        }
        TreatmentServiceApis.deleteTreatmentPage(body).then(response => {
            if (response.data.status == true) {
                setAllServices(allServices.filter(serv => serv.id !== body.id))
                console.log(allServices)
                props.deleteServiceHAndler(body)
                setShowConfirmDeleteModal(false)
                toast.success(SERVICE_DELETED_SUCCESSFULLY)
            }
        }).catch(err => {
            toast.error(SERVICE_COULDNT_DELETED)
        })
    }

    const deleteClassServicePage = () => {
        const body = {
            id: classToDelete.id,
            removeService: true
        }
        classApiService.deleteClassType(body).then(response => {
            if (response.data.status == true) {
                setAllClasses(allClasses.filter(serv => serv.id !== body.id))
                setShowDeleteClass(false)
                toast.success(SERVICE_DELETED_SUCCESSFULLY)
            }
        }).catch(err => {
            toast.error(SERVICE_COULDNT_DELETED)
        })
    }

    const updateTreatmentServiceName = () => {
        let selectedService = allServices.find(serv => serv.id === editServiceId);
        let body = {
            newServiceName: editServiceName,
            oldServiceName: selectedService.treatmentServiceName,
        }
        TreatmentServiceApis.renameTreatmentService(body)
            .then(res => {
                if (res.data.status === true) {
                    toast.success("Service Renamed Successfully.")
                    let updatedServices = allServices.map(serv => {
                        if (serv.id === editServiceId) {
                            return { ...serv, treatmentServiceName: editServiceName }
                        }
                        return serv;
                    })
                    setAllServices(updatedServices)
                    setShowEditModal(false);
                }
            }).catch(err => {
                toast.error("Could not rename service.")
                console.error(err)
                setShowEditModal(false);
            })
    }

    const confirmDeleteClassModalBody = (
        <div>
            <span> Do you really want to Delete <b>{classToDelete?.className}</b> Class? </span>
        </div>
    )


    return (
        <div className='w-full p-5'>

            {/* Delete Service */}
            <HeadlessUIModalComponent
                displayState={showConfirmDeleteModal}
                setDisplayState={setShowConfirmDeleteModal}
                headingChildren={<span>Confirm Remove Page</span>}
                bodyChildren={confirmDeleteBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => deleteTreatmentServicePage()}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowConfirmDeleteModal(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />
            {/* delete class */}
            <HeadlessUIModalComponent
                displayState={showDeleteClass}
                setDisplayState={setShowDeleteClass}
                headingChildren={<span>Confirm Remove Page</span>}
                bodyChildren={confirmDeleteBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => deleteClassServicePage()}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeleteClass(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />
            {/* Edit Service Name */}
            <HeadlessUIModalComponent
                displayState={showEditModal}
                setDisplayState={setShowEditModal}
                headingChildren={<span>Edit Service Name</span>}
                bodyChildren={editServiceModalBodyJSX}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            disabled={!(isEditNameAvailable !== null && isEditNameAvailable.available)}
                            className="inline-flex disabled:bg-gray-400 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { updateTreatmentServiceName() }}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowEditModal(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Add Service */}
            <Transition appear show={showAddService} as={Fragment}>
                <Dialog as='div' className='fixed inset-0 z-10 overflow-y-auto' onClose={() => { setShowAddService(false) }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Create New Service
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        {addServiceModalBody}
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={handleAddService}
                                        >
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                            onClick={() => { setShowAddService(false) }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Add Class */}
            <HeadlessUIModalComponent
                displayState={showAddClass}
                setDisplayState={setShowAddClass}
                headingChildren={<span>Add New Class</span>}
                bodyChildren={addClassModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            onClick={handleAddClass}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddClass(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* edit Class */}
            <HeadlessUIModalComponent
                displayState={showEditClass}
                setDisplayState={setShowEditClass}
                headingChildren={<span>Edit Class</span>}
                bodyChildren={EditClassModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            disabled={!(isEditClassNameAvailable !== null && isEditClassNameAvailable.available)}
                            onClick={handleEditClass}
                            className="inline-flex justify-center disabled:bg-gray-400 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowEditClass(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />
            <div className='mt-5 w-10/12 mx-auto'>
                <ul>
                    {pagesList}
                </ul>
            </div>
        </div>
    )


}
const mapStateToProps = (state) => {
    return {
        allServices: state
    }
}
const mapDispatchToProps = (dispatch) => ({

    // allServicePagesHandler : data=> dispatch(allServices_Action(data)),
    addServiceHandler: data => dispatch(addNewService_Action(data)),
    deleteServiceHAndler: data => dispatch(deleteService_Action(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Pages)