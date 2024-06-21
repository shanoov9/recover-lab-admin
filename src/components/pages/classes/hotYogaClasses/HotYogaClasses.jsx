import React, { useEffect, useState } from 'react'
import HeadlessUIModalComponent from '../../../shared-components/modal/HeadlessUIModal'
import { BanknotesIcon, CheckIcon, ClockIcon, CurrencyRupeeIcon, EyeIcon, FlagIcon, MinusIcon, PencilIcon, PencilSquareIcon, PlusIcon, StarIcon, TrashIcon, UserGroupIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';
import { HOT_YOGA_CLASS_PLAN_COULDNT_CREATED, HOT_YOGA_CLASS_PLAN_COULDNT_DELETED, HOT_YOGA_CLASS_PLAN_COULDNT_UPDATED, HOT_YOGA_CLASS_PLAN_CREATED_SUCCESSFULLY, HOT_YOGA_CLASS_PLAN_DELETED_SUCCESSFULLY, HOT_YOGA_CLASS_PLAN_STATUS_COULDNT_UPDATED, HOT_YOGA_CLASS_PLAN_STATUS_UPDATED_SUCCESSFULLY, HOT_YOGA_CLASS_PLAN_UPDATED_SUCCESSFULLY } from '../../../../commonServices/messageConstants';
import { classApiService, instructorServiceApi } from '../../../../commonServices/apiService';
import { CLASS_TYPE_HOT_YOGA, DELETE_ENTITY_STATUS, ENABLE_ENTITY_STATUS } from '../../../../commonServices/commonDataService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../commonServices/quillModules';

const HotYogaClasses = () => {
    const [hotYogaClassPlans, setHotYogaClassPlans] = useState([]);
    const [instructorList, setInstructorList] = useState([]);

    const [showAddHotYogaClassPlan, setShowAddHotYogaClassPlan] = useState(false);
    const [showViewHotYogaClassPlan, setShowViewHotYogaClassPlan] = useState(false);
    const [showEditHotYogaClassPlan, setShowEditHotYogaClassPlan] = useState(false);
    const [showDeleteHotYogaClassPlan, setShowDeleteHotYogaClassPlan] = useState(false);

    const [selectedViewHotYogaClassPlan, setSelectedViewHotYogaClassPlan] = useState(null);
    const [selectedDeleteHotYogaClassPlan, setSelectedDeleteHotYogaClassPlan] = useState(null);

    // Add Yoga Plan Modal State
    const [addHotYogaPlanName, setAddHotYogaPlanName] = useState('');
    const [addHotYogaPlanDescription, setAddHotYogaPlanDescription] = useState('');
    const [addHotYogaPlanInstructorId, setAddHotYogaPlanInstructorId] = useState('');
    const [addHotYogaPlanInstructorDescription, setAddHotYogaPlanInstructorDescription] = useState('');
    const [addHotYogaPlanPrice, setAddHotYogaPlanPrice] = useState('');
    const [addHotYogaPlanDuration, setAddHotYogaPlanDuration] = useState('');
    const [addHotYogaPlanStartTime, setAddHotYogaPlanStartTime] = useState('00:00');
    const [addHotYogaPlanBatchSize, setAddHotYogaPlanBatchSize] = useState('');
    const [addHotYogaPlanDays, setAddHotYogaPlanDays] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });

    // Edit Hot Yoga Plan States
    const [editHotYogaId, setEditHotYogaId] = useState(0);
    const [editHotYogaName, setEditHotYogaName] = useState('');
    const [editHotYogaPlanBatchSize, setEditHotYogaPlanBatchSize] = useState('');
    const [editHotYogaPlanStartTime, setEditHotYogaPlanStartTime] = useState('00:00');
    const [editHotYogaPlanInstructorId, setEditHotYogaPlanInstructorId] = useState('');
    const [editHotYogaPlanInstructorDescription, setEditHotYogaPlanInstructorDescription] = useState('');

    useEffect(() => {
        getAllClasses();
        (() => {
            instructorServiceApi.getAllInstructors().then(response => {
                console.log(response)
                if (response.data.status == true) {
                    setInstructorList(response.data.data);
                }
            }).catch((err) => {
                console.error(err)
            })
        })();
    }, [])

    const getFormattedTime = (time) => {
        if (typeof time !== 'string') {
            return "None"
        }
        const [hours, minutes] = time.split(':');
        let newHours = parseInt(hours) % 12 || 12;
        let ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${newHours}:${minutes} ${ampm}`;
    }


    const getAllClasses = () => {
        const body = {
            classType: CLASS_TYPE_HOT_YOGA,
        }
        classApiService.getAllClasses(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setHotYogaClassPlans(response.data.data)
            }
        })
    }


    const handleHotYogaPlanStatusChange = (id, newStatus) => {
        const body = {
            id: id,
            status: newStatus
        }
        classApiService.changeClassStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {

                setHotYogaClassPlans(hotYogaClassPlans.map(plan => plan.id === id ? { ...plan, status: newStatus } : plan));
                toast.success(HOT_YOGA_CLASS_PLAN_STATUS_UPDATED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(HOT_YOGA_CLASS_PLAN_STATUS_COULDNT_UPDATED);
        })
    }



    const HotYogaPlanCardComponent = ({ plan }) => {
        return (
            <div className='bg-indigo-100 flex flex-col justify-between px-4 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                <div>
                    <div className='text-center my-2'>
                        <h3 className='text-xl font-semibold'>{plan?.className?.substring(0, 20) + (plan?.className?.length > 20 ? '...' : '')}</h3>
                    </div>
                    <div className='text-left'>
                        <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {plan.classPrice}</p>
                        <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {plan.classDuration} Mins.</p>
                        <p className='text-gray-900 flex items-center gap-3'><UserIcon className='w-5 h-5' /> {plan.instructorName}</p>
                    </div>
                </div>
                <div className='my-2 flex justify-between items-center'>
                    <Switch
                        checked={plan.status}
                        onChange={(newStatus) => { handleHotYogaPlanStatusChange(plan.id, newStatus) }}
                        className={`border ${plan.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${plan.status ? 'translate-x-6 bg-green-700/90' : 'translate-x-0 bg-red-700/90'} pointer-events-none text-white inline-block h-5 w-5 transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition-all duration-200 ease-in-out`}
                        >
                            {plan.status
                                ?
                                <CheckIcon className='w-4 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                :
                                <XMarkIcon className='w-4 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                            }
                        </span>
                    </Switch>
                    <div className='flex gap-2'>
                        <button
                            onClick={() => {
                                setSelectedViewHotYogaClassPlan(plan);
                                setShowViewHotYogaClassPlan(true);
                            }}
                            className='bg-teal-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none w-full'
                        >
                            <EyeIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setEditHotYogaId(plan.id);
                                setEditHotYogaName(plan.className);
                                setEditHotYogaPlanBatchSize(plan.batchSize);
                                setEditHotYogaPlanStartTime(plan.classStartTime);
                                setEditHotYogaPlanInstructorId(plan.instructorId);
                                setEditHotYogaPlanInstructorDescription(plan.instructorDescription);
                                setShowEditHotYogaClassPlan(true);
                            }}
                            className='bg-indigo-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none w-full'
                        >
                            <PencilIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedDeleteHotYogaClassPlan(plan);
                                setShowDeleteHotYogaClassPlan(true);
                            }}
                            className='bg-red-200 font-medium p-2 rounded-full hover:bg-red-300 text-red-900 focus:outline-none w-full'
                        >
                            <TrashIcon className='w-5 h-5 mx-auto' />
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    const addHotYogaClassPlanModalBody = (
        <div className='mt-4'>
            <div className='mb-3'>
                <label htmlFor='planName' className='block text-sm font-medium text-gray-700'>Class Name</label>
                <input
                    type='text'
                    name='planName'
                    id='planName'
                    required
                    value={addHotYogaPlanName}
                    onChange={(e) => { setAddHotYogaPlanName(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className="flex items-center gap-3">
                <div className='mb-3 w-1/2'>
                    <label htmlFor='planPrice' className='block text-sm font-medium text-gray-700'>Class Price</label>
                    <input
                        type='text'
                        name='planPrice'
                        id='planPrice'
                        required
                        value={addHotYogaPlanPrice}
                        onChange={(e) => { setAddHotYogaPlanPrice(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                <div className='mb-3 w-1/2'>
                    <label htmlFor='planDuration' className='block text-sm font-medium text-gray-700'>Class Duration</label>
                    <div className='relative'>
                        <input
                            type='text'
                            name='planDuration'
                            id='planDuration'
                            required
                            value={addHotYogaPlanDuration}
                            onChange={(e) => { setAddHotYogaPlanDuration(e.target.value.replace(/[^0-9]/, '')) }}
                            className='mt-[2px] block w-full px-3 py-1.5 pr-14 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                        />
                        <span className='absolute top-1 right-4 text-gray-700'>
                            Mins.
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className='mb-3 w-1/2'>
                    <label htmlFor='startTime' className='block text-sm font-medium text-gray-700'>Class Start Time</label>
                    <input
                        type='time'
                        name='startTime'
                        id='startTime'
                        required
                        value={addHotYogaPlanStartTime}
                        onChange={(e) => { console.log(e.target.value); setAddHotYogaPlanStartTime(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                <div className='mb-3 w-1/2'>
                    <label htmlFor='batchSize' className='block text-sm font-medium text-gray-700'>Batch Size</label>
                    <input
                        type='text'
                        name='batchSize'
                        id='batchSize'
                        required
                        value={addHotYogaPlanBatchSize}
                        onChange={(e) => { setAddHotYogaPlanBatchSize(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 pr-14 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
            </div>


            <div className='mb-3 w-full'>
                <label htmlFor='planLongDescription' className='block text-sm font-medium text-gray-700'>Class Description</label>
                <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={addHotYogaPlanDescription}
                    onChange={(value) => { setAddHotYogaPlanDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
                {/* <textarea
                        name='planLongDescription'
                        id='planLongDescription'
                        required
                        // rows={3}
                        value={addHotYogaPlanDescription}
                        onChange={(e) => { setAddHotYogaPlanDescription(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    /> */}
            </div>
            <div className='mb-3'>
                <label htmlFor='instructorName' className='block text-sm font-medium text-gray-700'>Instructor Name</label>
                <select
                    name='instructorName'
                    id='instructorName'
                    required
                    value={addHotYogaPlanInstructorId}
                    onChange={(e) => { setAddHotYogaPlanInstructorId(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                >
                    <option value='' disabled>Select Instructor</option>
                    {
                        instructorList.map((instructor, index) => (
                            <option key={index} value={instructor.id}>{instructor.name}</option>
                        ))
                    }
                </select>

            </div>
            <div className='mb-3 w-full'>
                <label htmlFor='instructorDescription' className='block text-sm font-medium text-gray-700'>Instructor Description</label>
                <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={addHotYogaPlanInstructorDescription}
                    onChange={(value) => { setAddHotYogaPlanInstructorDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
                {/* <textarea
                        name='instructorDescription'
                        id='instructorDescription'
                        required
                        // rows={3}
                        value={addHotYogaPlanInstructorDescription}
                        onChange={(e) => { setAddHotYogaPlanInstructorDescription(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    /> */}
            </div>
            <div className="mb-3">
                <label htmlFor='days' className='block text-sm font-medium text-gray-700'>Days</label>
                <div className="flex items-center gap-1 mt-2">
                    {Object.keys(addHotYogaPlanDays).map((day) => (
                        <div key={day} className='select-none'>
                            <label
                                htmlFor={`day_${day}`}
                                className={` flex items-center gap-0.5 cursor-pointer ${addHotYogaPlanDays[day] ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'} px-3 py-1.5 rounded-md shadow-sm focus:outline-none`}
                            >
                                {
                                    addHotYogaPlanDays[day] ?
                                        <MinusIcon className='w-4 h-4 inline-block' />
                                        :
                                        <PlusIcon className='w-4 h-4 inline-block' />
                                }
                                {day.slice(0, 3).toUpperCase()}
                            </label>

                            <input
                                type='checkbox'
                                name={day}
                                id={`day_${day}`}
                                checked={addHotYogaPlanDays[day]}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAddHotYogaPlanDays({ ...addHotYogaPlanDays, [day]: true });
                                    } else {
                                        setAddHotYogaPlanDays({ ...addHotYogaPlanDays, [day]: false });
                                    }
                                }
                                }
                                className='hidden'
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )

    const handleAddHotYogaPlan = () => {
        if (addHotYogaPlanName === '' || addHotYogaPlanDescription === '' || addHotYogaPlanInstructorId === '' || addHotYogaPlanInstructorDescription === '' || addHotYogaPlanPrice === '' || addHotYogaPlanDuration === '') {
            toast.error('Please fill all the fields!');
            return;
        }

        let instructor = instructorList.find(instructor => instructor.id === parseInt(addHotYogaPlanInstructorId));

        const body = {
            classType: CLASS_TYPE_HOT_YOGA,
            className: addHotYogaPlanName,
            classDescription: addHotYogaPlanDescription,
            classPrice: parseInt(addHotYogaPlanPrice),
            classDuration: addHotYogaPlanDuration,
            classDays: addHotYogaPlanDays,
            instructorId: instructor.id,
            instructorName: instructor.name,
            instructorDescription: addHotYogaPlanInstructorDescription,
            classStartTime: addHotYogaPlanStartTime,
            batchSize: parseInt(addHotYogaPlanBatchSize),
            status: ENABLE_ENTITY_STATUS,
        }
        console.log(body)

        classApiService.createClass(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                const responseData = response.data.data
                const newPlan = {
                    classType: responseData.classType,
                    className: responseData.className,
                    classDescription: responseData.classDescription,
                    classPrice: responseData.classPrice,
                    classDuration: responseData.classDuration,
                    classDays: responseData.classDays,
                    instructorName: responseData.instructorName,
                    instructorDescription: responseData.instructorDescription,
                    classStartTime: responseData.classStartTime,
                    batchSize: responseData.BatchSize,
                    status: responseData.status,
                }
                setHotYogaClassPlans([...hotYogaClassPlans, newPlan]);
                setShowAddHotYogaClassPlan(false);
                setAddHotYogaPlanName('');
                setAddHotYogaPlanDescription('');
                setAddHotYogaPlanInstructorId('');
                setAddHotYogaPlanInstructorDescription('');
                setAddHotYogaPlanPrice('');
                setAddHotYogaPlanDuration('');
                toast.success(HOT_YOGA_CLASS_PLAN_CREATED_SUCCESSFULLY);
            }

        })

        // const newPlan = {
        //     id: hotYogaClassPlans.length + 1,
        //     name: addHotYogaPlanName,
        //     price: addHotYogaPlanPrice,
        //     duration: addHotYogaPlanDuration,
        //     status: true,
        //     description: addHotYogaPlanDescription,
        //     instructorName: addHotYogaPlanInstructorName,
        //     instructorDescription: addHotYogaPlanInstructorDescription,
        // }


        /*
        On Error
        toast.error(HOT_YOGA_CLASS_PLAN_COULDNT_CREATED);
        */
    }

    const handleDeleteHotYogaPlan = (planId) => {
        const body = {
            id: planId,
            status: DELETE_ENTITY_STATUS
        }
        classApiService.deleteClassPlan(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setHotYogaClassPlans(hotYogaClassPlans.filter(plan => plan.id !== planId));
                setShowDeleteHotYogaClassPlan(false);
                setSelectedDeleteHotYogaClassPlan(null);
                toast.success(HOT_YOGA_CLASS_PLAN_DELETED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(HOT_YOGA_CLASS_PLAN_COULDNT_DELETED);
        })
    }

    const editHotYogaPlanModalBody = (
        <div className='mt-4'>
            <div className="flex items-center gap-3">
                <div className='mb-3 w-1/2'>
                    <label htmlFor='batchSize' className='block text-sm font-medium text-gray-700'>Batch Size</label>
                    <input
                        type='text'
                        name='batchSize'
                        id='batchSize'
                        required
                        value={editHotYogaPlanBatchSize}
                        onChange={(e) => { setEditHotYogaPlanBatchSize(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 pr-14 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                <div className='mb-3 w-1/2'>
                    <label htmlFor='startTime' className='block text-sm font-medium text-gray-700'>Class Start Time</label>
                    <input
                        type='time'
                        name='startTime'
                        id='startTime'
                        required
                        value={editHotYogaPlanStartTime}
                        onChange={(e) => { console.log(e.target.value); setEditHotYogaPlanStartTime(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
            </div>
            <div className='mb-3'>
                <label htmlFor='instructorName' className='block text-sm font-medium text-gray-700'>Instructor Name</label>
                <select
                    name='instructorName'
                    id='instructorName'
                    required
                    value={editHotYogaPlanInstructorId}
                    onChange={(e) => { setEditHotYogaPlanInstructorId(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                >
                    <option value='' disabled>Select Instructor</option>
                    {
                        instructorList.map((instructor, index) => (
                            <option key={index} value={instructor.id}>{instructor.name}</option>
                        ))
                    }
                </select>
            </div>
            <div className='mb-3 w-full'>
                <label htmlFor='instructorDescription' className='block text-sm font-medium text-gray-700'>Instructor Description</label>
                <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={editHotYogaPlanInstructorDescription}
                    onChange={(value) => { setEditHotYogaPlanInstructorDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
        </div>
    )

    const handleHotYogaPlanUpdate = () => {
        if (editHotYogaPlanBatchSize === '' || editHotYogaPlanStartTime === '' || editHotYogaPlanInstructorId === '' || editHotYogaPlanInstructorDescription === '') {
            toast.error('Please fill all the fields!');
            return;
        }

        let instructor = instructorList.find(instructor => instructor.id === parseInt(editHotYogaPlanInstructorId));
        const body = {
            id: editHotYogaId,
            batchSize: editHotYogaPlanBatchSize,
            classStartTime: editHotYogaPlanStartTime,
            instructorId: instructor.id,
            instructorName: instructor.name,
            instructorDescription: editHotYogaPlanInstructorDescription,
        }
        console.log(body)
        classApiService.updateClass(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setHotYogaClassPlans(hotYogaClassPlans.map(plan => plan.id === editHotYogaId ? { ...plan, batchSize: editHotYogaPlanBatchSize, classStartTime: editHotYogaPlanStartTime, instructorId: instructor.id, instructorName: instructor.name, instructorDescription: editHotYogaPlanInstructorDescription } : plan));
                setShowEditHotYogaClassPlan(false);
                setEditHotYogaId(0);
                setEditHotYogaName('');
                setEditHotYogaPlanBatchSize('');
                setEditHotYogaPlanStartTime('00:00');
                setEditHotYogaPlanInstructorId('');
                setEditHotYogaPlanInstructorDescription('');
                toast.success(HOT_YOGA_CLASS_PLAN_UPDATED_SUCCESSFULLY);
            }
        }
        ).catch((err) => {
            console.error(err)
            toast.error(HOT_YOGA_CLASS_PLAN_COULDNT_UPDATED);
        })
    }

    return (
        <div className='w-full p-5'>
            {/* Add Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showAddHotYogaClassPlan}
                setDisplayState={setShowAddHotYogaClassPlan}
                headingChildren={<span>Create New Hot Yoga Plan</span>}
                bodyChildren={addHotYogaClassPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleAddHotYogaPlan}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddHotYogaClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
                maxWidthClass='max-w-xl'
            />

            {/* View Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showViewHotYogaClassPlan}
                setDisplayState={setShowViewHotYogaClassPlan}
                headingChildren={<>
                    <StarIcon className='w-8 h-8' />
                    <span>{selectedViewHotYogaClassPlan?.className}</span>
                </>}
                bodyChildren={
                    <div className='p-4'>
                        <div className='text-left mb-5'>
                            <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {selectedViewHotYogaClassPlan?.classPrice}</p>
                            <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {selectedViewHotYogaClassPlan?.classDuration} Mins.</p>
                            <p className='text-gray-900 flex items-center gap-3'><FlagIcon className='w-5 h-5' /> {getFormattedTime(selectedViewHotYogaClassPlan?.classStartTime)}</p>
                            <p className='text-gray-900 flex items-center gap-3'><UserGroupIcon className='w-5 h-5' /> {selectedViewHotYogaClassPlan?.batchSize}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Plan Description:</span> <br /><span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedViewHotYogaClassPlan?.classDescription }} /></p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='text-gray-900 flex items-center gap-3'><UserIcon className='w-5 h-5' /> {selectedViewHotYogaClassPlan?.instructorName}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Instructor Description: </span><br /> <span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedViewHotYogaClassPlan?.instructorDescription }} /></p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='mb-2 font-medium'>Class Days: </p>
                            <div className="flex">
                                {
                                    selectedViewHotYogaClassPlan && Object.keys(JSON.parse(selectedViewHotYogaClassPlan?.classDays)).map((day, index) => (
                                        JSON.parse(selectedViewHotYogaClassPlan?.classDays)[day] &&
                                        <p key={index} className=' mx-1 px-2 py-1 bg-indigo-200 text-indigo-900 text-sm rounded-lg'>{day.slice(0, 3).toUpperCase()}</p>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                }
                footerChildren={
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        onClick={() => { setShowViewHotYogaClassPlan(false) }}
                    >
                        Close
                    </button>
                }
            />

            {/* Edit Hot Yoga plam  */}
            <HeadlessUIModalComponent
                displayState={showEditHotYogaClassPlan}
                setDisplayState={setShowEditHotYogaClassPlan}
                headingChildren={<>
                    <PencilSquareIcon className='w-8 h-8' />
                    <span>{editHotYogaName}</span>
                </>}
                bodyChildren={editHotYogaPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleHotYogaPlanUpdate}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowEditHotYogaClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Delete Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteHotYogaClassPlan}
                setDisplayState={setShowDeleteHotYogaClassPlan}
                headingChildren={<span>Delete Hot Yoga Class Plan</span>}
                bodyChildren={<span>Are you sure you want to delete {selectedDeleteHotYogaClassPlan?.name}?</span>}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { handleDeleteHotYogaPlan(selectedDeleteHotYogaClassPlan?.id) }}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeleteHotYogaClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Hot yoga plans List */}
            <div className='flex items-center justify-between' >
                <h1 className='text-2xl'>Hot Yoga Class Plans</h1>
                <button
                    onClick={() => { setShowAddHotYogaClassPlan(true) }}
                    className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                >
                    <PlusIcon className='h-5 w-5' /> Add New Hot Yoga Plan
                </button>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <div>
                    {
                        hotYogaClassPlans.length === 0 ?
                            <p className='mt-10 text-xl text-gray-700'>No Hot Yoga Classes to display{hotYogaClassPlans.length ? ' with selected filter' : ''}!</p>
                            :
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {hotYogaClassPlans.map((plan, index) => (
                                    <HotYogaPlanCardComponent key={index} plan={plan} />
                                ))}
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default HotYogaClasses;