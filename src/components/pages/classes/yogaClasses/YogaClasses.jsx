import React, { useEffect, useState } from 'react'
import HeadlessUIModalComponent from '../../../shared-components/modal/HeadlessUIModal'
import { BanknotesIcon, CheckIcon, ClockIcon, CurrencyRupeeIcon, EyeIcon, FlagIcon, MinusIcon, PencilIcon, PencilSquareIcon, PlusIcon, StarIcon, TrashIcon, UserGroupIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';
import { YOGA_CLASS_PLAN_COULDNT_CREATED, YOGA_CLASS_PLAN_COULDNT_DELETED, YOGA_CLASS_PLAN_COULDNT_UPDATED, YOGA_CLASS_PLAN_CREATED_SUCCESSFULLY, YOGA_CLASS_PLAN_DELETED_SUCCESSFULLY, YOGA_CLASS_PLAN_STATUS_COULDNT_UPDATED, YOGA_CLASS_PLAN_STATUS_UPDATED_SUCCESSFULLY, YOGA_CLASS_PLAN_UPDATED_SUCCESSFULLY } from '../../../../commonServices/messageConstants';
import { classApiService, instructorServiceApi } from '../../../../commonServices/apiService';
import { CLASS_TYPE_YOGA, DELETE_ENTITY_STATUS, ENABLE_ENTITY_STATUS } from '../../../../commonServices/commonDataService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../commonServices/quillModules';

const YogaClasses = () => {
    const [yogaClassPlans, setYogaClassPlans] = useState([]);

    const [instructorList, setInstructorList] = useState([]);

    const [showAddYogaClassPlan, setShowAddYogaClassPlan] = useState(false);
    const [showViewYogaClassPlan, setShowViewYogaClassPlan] = useState(false);
    const [showEditYogaClassPlan, setShowEditYogaClassPlan] = useState(false);
    const [showDeleteYogaClassPlan, setShowDeleteYogaClassPlan] = useState(false);

    const [selectedViewYogaClassPlan, setSelectedViewYogaClassPlan] = useState(null);
    const [selectedDeleteYogaClassPlan, setSelectedDeleteYogaClassPlan] = useState(null);

    // Add Yoga Plan Modal State
    const [addYogaPlanName, setAddYogaPlanName] = useState('');
    const [addYogaPlanDescription, setAddYogaPlanDescription] = useState('');
    const [addYogaInstructorId, setAddYogaInstructorId] = useState('');
    const [addYogaPlanInstructorDescription, setAddYogaPlanInstructorDescription] = useState('');
    const [addYogaPlanPrice, setAddYogaPlanPrice] = useState('');
    const [addYogaPlanDuration, setAddYogaPlanDuration] = useState('');
    const [addYogaPlanStartTime, setAddYogaPlanStartTime] = useState('00:00');
    const [addYogaPlanBatchSize, setAddYogaPlanBatchSize] = useState('');
    const [addYogaPlanDays, setAddYogaPlanDays] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });

    // Edit Yoga Plan States
    const [editYogaId, setEditYogaId] = useState(null);
    const [editYogaName, setEditYogaName] = useState('');
    const [editYogaPlanBatchSize, setEditYogaPlanBatchSize] = useState('');
    const [editYogaPlanStartTime, setEditYogaPlanStartTime] = useState('00:00');
    const [editYogaPlanInstructorId, setEditYogaPlanInstructorId] = useState('');
    const [editYogaPlanInstructorDescription, setEditYogaPlanInstructorDescription] = useState('');

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
            classType: CLASS_TYPE_YOGA,
        }
        classApiService.getAllClasses(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setYogaClassPlans(response.data.data)
            }
        })
    }


    const handleYogaPlanStatusChange = (id, newStatus) => {
        const body = {
            id: id,
            status: newStatus
        }
        classApiService.changeClassStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {

                setYogaClassPlans(yogaClassPlans.map(plan => plan.id === id ? { ...plan, status: newStatus } : plan));
                toast.success(YOGA_CLASS_PLAN_STATUS_UPDATED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(YOGA_CLASS_PLAN_STATUS_COULDNT_UPDATED);
        })
    }

    const handleYogaPlanUpdate = () => {
        if (editYogaPlanBatchSize === '' || editYogaPlanInstructorId === '' || editYogaPlanInstructorDescription === '') {
            toast.error('Please fill all the fields!');
            return;
        }

        let instructor = instructorList.find(instructor => instructor.id === parseInt(editYogaPlanInstructorId));
        const body = {
            id: editYogaId,
            instructorId: instructor.id,
            instructorName: instructor.name,
            instructorDescription: editYogaPlanInstructorDescription,
            classStartTime: editYogaPlanStartTime,
            batchSize: editYogaPlanBatchSize,
        }
        classApiService.updateClass(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setYogaClassPlans(yogaClassPlans.map(plan => plan.id === editYogaId ? { ...plan, instructorId: instructor.id, instructorName: instructor.name, instructorDescription: editYogaPlanInstructorDescription, classStartTime: editYogaPlanStartTime, batchSize: editYogaPlanBatchSize } : plan));
                setShowEditYogaClassPlan(false);
                setEditYogaId(0);
                setEditYogaName('');
                setEditYogaPlanBatchSize('');
                setEditYogaPlanStartTime('00:00');
                setEditYogaPlanInstructorId('');
                setEditYogaPlanInstructorDescription('');
                toast.success(YOGA_CLASS_PLAN_UPDATED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(YOGA_CLASS_PLAN_COULDNT_UPDATED);
        })
    }

    const YogaPlanCardComponent = ({ plan }) => {
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
                        onChange={(newStatus) => { handleYogaPlanStatusChange(plan.id, newStatus) }}
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
                                console.log(plan.instructorDescription);
                                setSelectedViewYogaClassPlan(plan);
                                setShowViewYogaClassPlan(true);
                            }}
                            className='bg-teal-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none w-full'
                        >
                            <EyeIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                console.log(plan.instructorDescription);
                                setEditYogaId(plan.id);
                                setEditYogaName(plan.className);
                                setEditYogaPlanBatchSize(plan.batchSize);
                                setEditYogaPlanStartTime(plan.classStartTime);
                                setEditYogaPlanInstructorId(plan.instructorId);
                                setEditYogaPlanInstructorDescription(plan.instructorDescription);
                                setShowEditYogaClassPlan(true);
                            }}
                            className='bg-indigo-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none w-full'
                        >
                            <PencilIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedDeleteYogaClassPlan(plan);
                                setShowDeleteYogaClassPlan(true);
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


    const addYogaClassPlanModalBody = (
        <div className='mt-4'>
            <div className='mb-3'>
                <label htmlFor='planName' className='block text-sm font-medium text-gray-700'>Class Name</label>
                <input
                    type='text'
                    name='planName'
                    id='planName'
                    required
                    value={addYogaPlanName}
                    onChange={(e) => { setAddYogaPlanName(e.target.value) }}
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
                        value={addYogaPlanPrice}
                        onChange={(e) => { setAddYogaPlanPrice(e.target.value.replace(/[^0-9]/, '')) }}
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
                            value={addYogaPlanDuration}
                            onChange={(e) => { setAddYogaPlanDuration(e.target.value.replace(/[^0-9]/, '')) }}
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
                        value={addYogaPlanStartTime}
                        onChange={(e) => { console.log(e.target.value); setAddYogaPlanStartTime(e.target.value) }}
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
                        value={addYogaPlanBatchSize}
                        onChange={(e) => { setAddYogaPlanBatchSize(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 pr-14 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
            </div>


            <div className='mb-3 w-full'>
                <label htmlFor='planLongDescription' className='block text-sm font-medium text-gray-700'>Class Description</label>
                <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={addYogaPlanDescription}
                    onChange={(value) => { setAddYogaPlanDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
                {/* <textarea
                        name='planLongDescription'
                        id='planLongDescription'
                        required
                        // rows={3}
                        value={addYogaPlanDescription}
                        onChange={(e) => { setAddYogaPlanDescription(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    /> */}
            </div>
            <div className='mb-3'>
                <label htmlFor='instructor' className='block text-sm font-medium text-gray-700'>Instructor Name</label>
                <select
                    name='instructor'
                    id='instructor'
                    required
                    value={addYogaInstructorId}
                    onChange={(e) => { setAddYogaInstructorId(e.target.value) }}
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
                    value={addYogaPlanInstructorDescription}
                    onChange={(value) => { setAddYogaPlanInstructorDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
                {/* <textarea
                        name='instructorDescription'
                        id='instructorDescription'
                        required
                        // rows={3}
                        value={addYogaPlanInstructorDescription}
                        onChange={(e) => { setAddYogaPlanInstructorDescription(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    /> */}
            </div>
            <div className="mb-3">
                <label htmlFor='days' className='block text-sm font-medium text-gray-700'>Days</label>
                <div className="flex items-center gap-1 mt-2">
                    {Object.keys(addYogaPlanDays).map((day) => (
                        <div key={day} className='select-none'>
                            <label
                                htmlFor={`day_${day}`}
                                className={` flex items-center gap-0.5 cursor-pointer ${addYogaPlanDays[day] ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'} px-3 py-1.5 rounded-md shadow-sm focus:outline-none`}
                            >
                                {
                                    addYogaPlanDays[day] ?
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
                                checked={addYogaPlanDays[day]}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAddYogaPlanDays({ ...addYogaPlanDays, [day]: true });
                                    } else {
                                        setAddYogaPlanDays({ ...addYogaPlanDays, [day]: false });
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

    const handleAddYogaPlan = () => {
        if (addYogaPlanName === '' || addYogaPlanDescription === '' || addYogaInstructorId === '' || addYogaPlanInstructorDescription === '' || addYogaPlanPrice === '' || addYogaPlanDuration === '') {
            toast.error('Please fill all the fields!');
            return;
        }

        let instructor = instructorList.find(instructor => instructor.id === parseInt(addYogaInstructorId));

        const body = {
            classType: CLASS_TYPE_YOGA,
            className: addYogaPlanName,
            classDescription: addYogaPlanDescription,
            classPrice: parseInt(addYogaPlanPrice),
            classDuration: addYogaPlanDuration,
            classDays: addYogaPlanDays,
            instructorId: instructor.id,
            instructorName: instructor.name,
            instructorDescription: addYogaPlanInstructorDescription,
            classStartTime: addYogaPlanStartTime,
            batchSize: parseInt(addYogaPlanBatchSize),
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
                setYogaClassPlans([...yogaClassPlans, newPlan]);
                setShowAddYogaClassPlan(false);
                setAddYogaPlanName('');
                setAddYogaPlanDescription('');
                setAddYogaInstructorId('');
                setAddYogaPlanInstructorDescription('');
                setAddYogaPlanPrice('');
                setAddYogaPlanDuration('');
                toast.success(YOGA_CLASS_PLAN_CREATED_SUCCESSFULLY);
            }

        })

        // const newPlan = {
        //     id: yogaClassPlans.length + 1,
        //     name: addYogaPlanName,
        //     price: addYogaPlanPrice,
        //     duration: addYogaPlanDuration,
        //     status: true,
        //     description: addYogaPlanDescription,
        //     instructorName: addYogaPlanInstructorName,
        //     instructorDescription: addYogaPlanInstructorDescription,
        // }


        /*
        On Error
        toast.error(YOGA_CLASS_PLAN_COULDNT_CREATED);
        */
    }

    const handleDeleteYogaPlan = (planId) => {
        const body = {
            id: planId,
            status: DELETE_ENTITY_STATUS
        }
        classApiService.deleteClassPlan(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setYogaClassPlans(yogaClassPlans.filter(plan => plan.id !== planId));
                setShowDeleteYogaClassPlan(false);
                setSelectedDeleteYogaClassPlan(null);
                toast.success(YOGA_CLASS_PLAN_DELETED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(YOGA_CLASS_PLAN_COULDNT_DELETED);
        })
    }

    const editYogaPlanModalBody = (
        <div className='mt-4'>
            <div className="flex items-center gap-3">
                <div className='mb-3 w-1/2'>
                    <label htmlFor='batchSize' className='block text-sm font-medium text-gray-700'>Batch Size</label>
                    <input
                        type='text'
                        name='batchSize'
                        id='batchSize'
                        required
                        value={editYogaPlanBatchSize}
                        onChange={(e) => { setEditYogaPlanBatchSize(e.target.value.replace(/[^0-9]/, '')) }}
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
                        value={editYogaPlanStartTime}
                        onChange={(e) => { console.log(e.target.value); setEditYogaPlanStartTime(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
            </div>
            <div className='mb-3'>
                <label htmlFor='instructor' className='block text-sm font-medium text-gray-700'>Instructor Name</label>
                <select 
                    name='instructor'
                    id='instructor'
                    required
                    value={editYogaPlanInstructorId}
                    onChange={(e) => { setEditYogaPlanInstructorId(e.target.value) }}
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
                    value={editYogaPlanInstructorDescription}
                    onChange={(value) => { setEditYogaPlanInstructorDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
        </div>
    )

    return (
        <div className='w-full p-5'>
            {/* Add Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showAddYogaClassPlan}
                setDisplayState={setShowAddYogaClassPlan}
                headingChildren={<span>Create New Yoga Plan</span>}
                bodyChildren={addYogaClassPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleAddYogaPlan}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddYogaClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
                maxWidthClass='max-w-xl'
            />

            {/* View Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showViewYogaClassPlan}
                setDisplayState={setShowViewYogaClassPlan}
                headingChildren={<>
                    <StarIcon className='w-8 h-8' />
                    <span>{selectedViewYogaClassPlan?.className}</span>
                </>}
                bodyChildren={
                    <div className='p-4'>
                        <div className='text-left mb-5'>
                            <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {selectedViewYogaClassPlan?.classPrice}</p>
                            <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {selectedViewYogaClassPlan?.classDuration} Mins.</p>
                            <p className='text-gray-900 flex items-center gap-3'><FlagIcon className='w-5 h-5' /> {getFormattedTime(selectedViewYogaClassPlan?.classStartTime)}</p>
                            <p className='text-gray-900 flex items-center gap-3'><UserGroupIcon className='w-5 h-5' /> {selectedViewYogaClassPlan?.batchSize}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Plan Description:</span> <br /><span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedViewYogaClassPlan?.classDescription }} /></p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='text-gray-900 flex items-center gap-3'><UserIcon className='w-5 h-5' /> {selectedViewYogaClassPlan?.instructorName}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Instructor Description: </span><br /> <span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedViewYogaClassPlan?.instructorDescription }} /></p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='mb-2 font-medium'>Class Days: </p>
                            <div className="flex">
                                {
                                    selectedViewYogaClassPlan && Object.keys(JSON.parse(selectedViewYogaClassPlan?.classDays)).map((day, index) => (
                                        JSON.parse(selectedViewYogaClassPlan?.classDays)[day] &&
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
                        onClick={() => { setShowViewYogaClassPlan(false) }}
                    >
                        Close
                    </button>
                }
            />

            {/* Edit Yoga plam  */}
            <HeadlessUIModalComponent
                displayState={showEditYogaClassPlan}
                setDisplayState={setShowEditYogaClassPlan}
                headingChildren={<>
                    <PencilSquareIcon className='w-8 h-8' />
                    <span>{editYogaName}</span>
                </>}
                bodyChildren={editYogaPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleYogaPlanUpdate}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { console.log(editYogaPlanInstructorDescription); setShowEditYogaClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Delete Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteYogaClassPlan}
                setDisplayState={setShowDeleteYogaClassPlan}
                headingChildren={<span>Delete Yoga Class Plan</span>}
                bodyChildren={<span>Are you sure you want to delete {selectedDeleteYogaClassPlan?.name}?</span>}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { handleDeleteYogaPlan(selectedDeleteYogaClassPlan?.id) }}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeleteYogaClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Yoga plans List */}
            <div className='flex items-center justify-between' >
                <h1 className='text-2xl'>Yoga Class Plans</h1>
                <button
                    onClick={() => { setShowAddYogaClassPlan(true) }}
                    className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                >
                    <PlusIcon className='h-5 w-5' /> Add New Yoga Plan
                </button>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <div>
                    {
                        yogaClassPlans.length === 0 ?
                            <p className='mt-10 text-xl text-gray-700'>No Yoga Classes to display{yogaClassPlans.length ? ' with selected filter' : ''}!</p>
                            :
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {yogaClassPlans.map((plan, index) => (
                                    <YogaPlanCardComponent key={index} plan={plan} />
                                ))}
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default YogaClasses;