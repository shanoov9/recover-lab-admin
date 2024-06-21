import React, { useEffect, useState } from 'react'
import HeadlessUIModalComponent from '../../../shared-components/modal/HeadlessUIModal'
import { BanknotesIcon, CheckIcon, ClockIcon, CurrencyRupeeIcon, EyeIcon, FlagIcon, MinusIcon, PencilIcon, PencilSquareIcon, PlusIcon, StarIcon, TrashIcon, UserGroupIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Switch } from '@headlessui/react';
import { toast } from 'react-toastify';
import { MEDITATION_CLASS_PLAN_COULDNT_CREATED, MEDITATION_CLASS_PLAN_COULDNT_DELETED, MEDITATION_CLASS_PLAN_COULDNT_UPDATED, MEDITATION_CLASS_PLAN_CREATED_SUCCESSFULLY, MEDITATION_CLASS_PLAN_DELETED_SUCCESSFULLY, MEDITATION_CLASS_PLAN_STATUS_COULDNT_UPDATED, MEDITATION_CLASS_PLAN_STATUS_UPDATED_SUCCESSFULLY, MEDITATION_CLASS_PLAN_UPDATED_SUCCESSFULLY } from '../../../../commonServices/messageConstants';
import { classApiService, instructorServiceApi } from '../../../../commonServices/apiService';
import { CLASS_TYPE_MEDITATION, DELETE_ENTITY_STATUS, ENABLE_ENTITY_STATUS } from '../../../../commonServices/commonDataService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../commonServices/quillModules';

const MeditationClasses = () => {
    const [meditationClassPlans, setMeditationClassPlans] = useState([]);
    const [instructorList, setInstructorList] = useState([]);

    const [showAddMeditationClassPlan, setShowAddMeditationClassPlan] = useState(false);
    const [showViewMeditationClassPlan, setShowViewMeditationClassPlan] = useState(false);
    const [showEditMeditationClassPlan, setShowEditMeditationClassPlan] = useState(false);
    const [showDeleteMeditationClassPlan, setShowDeleteMeditationClassPlan] = useState(false);

    const [selectedViewMeditationClassPlan, setSelectedViewMeditationClassPlan] = useState(null);
    const [selectedDeleteMeditationClassPlan, setSelectedDeleteMeditationClassPlan] = useState(null);

    // Add Yoga Plan Modal State
    const [addMeditationPlanName, setAddMeditationPlanName] = useState('');
    const [addMeditationPlanDescription, setAddMeditationPlanDescription] = useState('');
    const [addMeditationPlanInstructorId, setAddMeditationPlanInstructorId] = useState('');
    const [addMeditationPlanInstructorDescription, setAddMeditationPlanInstructorDescription] = useState('');
    const [addMeditationPlanPrice, setAddMeditationPlanPrice] = useState('');
    const [addMeditationPlanDuration, setAddMeditationPlanDuration] = useState('');
    const [addMeditationPlanStartTime, setAddMeditationPlanStartTime] = useState('00:00');
    const [addMeditationPlanBatchSize, setAddMeditationPlanBatchSize] = useState('');
    const [addMeditationPlanDays, setAddMeditationPlanDays] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });

    // Edit Meditation Plan States
    const [editMeditationId, setEditMeditationId] = useState(0);
    const [editMeditationName, setEditMeditationName] = useState('');
    const [editMeditationPlanBatchSize, setEditMeditationPlanBatchSize] = useState('');
    const [editMeditationPlanStartTime, setEditMeditationPlanStartTime] = useState('00:00');
    const [editMeditationPlanInstructorId, setEditMeditationPlanInstructorId] = useState('');
    const [editMeditationPlanInstructorDescription, setEditMeditationPlanInstructorDescription] = useState('');

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
            classType: CLASS_TYPE_MEDITATION,
        }
        classApiService.getAllClasses(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setMeditationClassPlans(response.data.data)
            }
        })
    }


    const handleMeditationPlanStatusChange = (id, newStatus) => {
        const body = {
            id: id,
            status: newStatus
        }
        classApiService.changeClassStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {

                setMeditationClassPlans(meditationClassPlans.map(plan => plan.id === id ? { ...plan, status: newStatus } : plan));
                toast.success(MEDITATION_CLASS_PLAN_STATUS_UPDATED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(MEDITATION_CLASS_PLAN_STATUS_COULDNT_UPDATED);
        })
    }




    const MeditationPlanCardComponent = ({ plan }) => {
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
                        onChange={(newStatus) => { handleMeditationPlanStatusChange(plan.id, newStatus) }}
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
                                setSelectedViewMeditationClassPlan(plan);
                                setShowViewMeditationClassPlan(true);
                            }}
                            className='bg-teal-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none w-full'
                        >
                            <EyeIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setEditMeditationId(plan.id);
                                setEditMeditationName(plan.className);
                                setEditMeditationPlanBatchSize(plan.batchSize);
                                setEditMeditationPlanStartTime(plan.classStartTime);
                                setEditMeditationPlanInstructorId(plan.instructorId);
                                setEditMeditationPlanInstructorDescription(plan.instructorDescription);
                                setShowEditMeditationClassPlan(true);
                            }}
                            className='bg-indigo-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none w-full'
                        >
                            <PencilIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedDeleteMeditationClassPlan(plan);
                                setShowDeleteMeditationClassPlan(true);
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


    const addMeditationClassPlanModalBody = (
        <div className='mt-4'>
            <div className='mb-3'>
                <label htmlFor='planName' className='block text-sm font-medium text-gray-700'>Class Name</label>
                <input
                    type='text'
                    name='planName'
                    id='planName'
                    required
                    value={addMeditationPlanName}
                    onChange={(e) => { setAddMeditationPlanName(e.target.value) }}
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
                        value={addMeditationPlanPrice}
                        onChange={(e) => { setAddMeditationPlanPrice(e.target.value.replace(/[^0-9]/, '')) }}
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
                            value={addMeditationPlanDuration}
                            onChange={(e) => { setAddMeditationPlanDuration(e.target.value.replace(/[^0-9]/, '')) }}
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
                        value={addMeditationPlanStartTime}
                        onChange={(e) => { console.log(e.target.value); setAddMeditationPlanStartTime(e.target.value) }}
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
                        value={addMeditationPlanBatchSize}
                        onChange={(e) => { setAddMeditationPlanBatchSize(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 pr-14 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
            </div>


            <div className='mb-3 w-full'>
                <label htmlFor='planLongDescription' className='block text-sm font-medium text-gray-700'>Class Description</label>
                <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    value={addMeditationPlanDescription}
                    onChange={(value) => { setAddMeditationPlanDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
                {/* <textarea
                        name='planLongDescription'
                        id='planLongDescription'
                        required
                        // rows={3}
                        value={addMeditationPlanDescription}
                        onChange={(e) => { setAddMeditationPlanDescription(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    /> */}
            </div>
            <div className='mb-3'>
                <label htmlFor='instructorName' className='block text-sm font-medium text-gray-700'>Instructor Name</label>
                <select 
                    name='instructorName' 
                    id='instructorName' 
                    required
                    value={addMeditationPlanInstructorId}
                    onChange={(e) => { setAddMeditationPlanInstructorId(e.target.value) }}
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
                    value={addMeditationPlanInstructorDescription}
                    onChange={(value) => { setAddMeditationPlanInstructorDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
                {/* <textarea
                        name='instructorDescription'
                        id='instructorDescription'
                        required
                        // rows={3}
                        value={addMeditationPlanInstructorDescription}
                        onChange={(e) => { setAddMeditationPlanInstructorDescription(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    /> */}
            </div>
            <div className="mb-3">
                <label htmlFor='days' className='block text-sm font-medium text-gray-700'>Days</label>
                <div className="flex items-center gap-1 mt-2">
                    {Object.keys(addMeditationPlanDays).map((day) => (
                        <div key={day} className='select-none'>
                            <label
                                htmlFor={`day_${day}`}
                                className={` flex items-center gap-0.5 cursor-pointer ${addMeditationPlanDays[day] ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'} px-3 py-1.5 rounded-md shadow-sm focus:outline-none`}
                            >
                                {
                                    addMeditationPlanDays[day] ?
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
                                checked={addMeditationPlanDays[day]}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAddMeditationPlanDays({ ...addMeditationPlanDays, [day]: true });
                                    } else {
                                        setAddMeditationPlanDays({ ...addMeditationPlanDays, [day]: false });
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

    const handleAddMeditationPlan = () => {
        if (addMeditationPlanName === '' || addMeditationPlanDescription === '' || addMeditationPlanInstructorId === '' || addMeditationPlanInstructorDescription === '' || addMeditationPlanPrice === '' || addMeditationPlanDuration === '') {
            toast.error('Please fill all the fields!');
            return;
        }

        let instructor = instructorList.find(instructor => instructor.id === parseInt(addMeditationPlanInstructorId));

        const body = {
            classType: CLASS_TYPE_MEDITATION,
            className: addMeditationPlanName,
            classDescription: addMeditationPlanDescription,
            classPrice: parseInt(addMeditationPlanPrice),
            classDuration: addMeditationPlanDuration,
            classDays: addMeditationPlanDays,
            instructorId: instructor.id,
            instructorName: instructor.name,
            instructorDescription: addMeditationPlanInstructorDescription,
            classStartTime: addMeditationPlanStartTime,
            batchSize: parseInt(addMeditationPlanBatchSize),
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
                setMeditationClassPlans([...meditationClassPlans, newPlan]);
                setShowAddMeditationClassPlan(false);
                setAddMeditationPlanName('');
                setAddMeditationPlanDescription('');
                setAddMeditationPlanInstructorId('');
                setAddMeditationPlanInstructorDescription('');
                setAddMeditationPlanPrice('');
                setAddMeditationPlanDuration('');
                toast.success(MEDITATION_CLASS_PLAN_CREATED_SUCCESSFULLY);
            }

        })

        // const newPlan = {
        //     id: meditationClassPlans.length + 1,
        //     name: addMeditationPlanName,
        //     price: addMeditationPlanPrice,
        //     duration: addMeditationPlanDuration,
        //     status: true,
        //     description: addMeditationPlanDescription,
        //     instructorName: addMeditationPlanInstructorName,
        //     instructorDescription: addMeditationPlanInstructorDescription,
        // }


        /*
        On Error
        toast.error(MEDITATION_CLASS_PLAN_COULDNT_CREATED);
        */
    }

    const handleDeleteMeditationPlan = (planId) => {
        const body = {
            id: planId,
            status: DELETE_ENTITY_STATUS
        }
        classApiService.deleteClassPlan(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setMeditationClassPlans(meditationClassPlans.filter(plan => plan.id !== planId));
                setShowDeleteMeditationClassPlan(false);
                setSelectedDeleteMeditationClassPlan(null);
                toast.success(MEDITATION_CLASS_PLAN_DELETED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(MEDITATION_CLASS_PLAN_COULDNT_DELETED);
        })
    }

    const editMeditationPlanModalBody = (
        <div className='mt-4'>
            <div className="flex items-center gap-3">
                <div className='mb-3 w-1/2'>
                    <label htmlFor='batchSize' className='block text-sm font-medium text-gray-700'>Batch Size</label>
                    <input
                        type='text'
                        name='batchSize'
                        id='batchSize'
                        required
                        value={editMeditationPlanBatchSize}
                        onChange={(e) => { setEditMeditationPlanBatchSize(e.target.value.replace(/[^0-9]/, '')) }}
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
                        value={editMeditationPlanStartTime}
                        onChange={(e) => { console.log(e.target.value); setEditMeditationPlanStartTime(e.target.value) }}
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
                    value={editMeditationPlanInstructorId}
                    onChange={(e) => { setEditMeditationPlanInstructorId(e.target.value) }}
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
                    value={editMeditationPlanInstructorDescription}
                    onChange={(value) => { setEditMeditationPlanInstructorDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
        </div>
    )

    const handleMeditationClassPlanUpdate = () => {

        if (editMeditationPlanBatchSize === '' || editMeditationPlanStartTime === '' || editMeditationPlanInstructorId === '' || editMeditationPlanInstructorDescription === '') {
            toast.error('Please fill all the fields!');
            return;
        }

        let instructor = instructorList.find(instructor => instructor.id === parseInt(editMeditationPlanInstructorId));
        const body = {
            id: editMeditationId,
            batchSize: editMeditationPlanBatchSize,
            classStartTime: editMeditationPlanStartTime,
            instructorId: instructor.id,
            instructorName: instructor.name,
            instructorDescription: editMeditationPlanInstructorDescription,
        }
        console.log(body)
        classApiService.updateClass(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setMeditationClassPlans(meditationClassPlans.map(plan => plan.id === editMeditationId ? { ...plan, batchSize: editMeditationPlanBatchSize, classStartTime: editMeditationPlanStartTime, instructorId: instructor.id, instructorName: instructor.name, instructorDescription: editMeditationPlanInstructorDescription } : plan));
                setShowEditMeditationClassPlan(false);
                setEditMeditationId(0);
                setEditMeditationName('');
                setEditMeditationPlanBatchSize('');
                setEditMeditationPlanStartTime('00:00');
                setEditMeditationPlanInstructorId('');
                setEditMeditationPlanInstructorDescription('');
                toast.success(MEDITATION_CLASS_PLAN_UPDATED_SUCCESSFULLY);
            }
        }).catch((err) => {
            console.error(err)
            toast.error(MEDITATION_CLASS_PLAN_COULDNT_UPDATED);
        })
    }


    return (
        <div className='w-full p-5'>
            {/* Add Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showAddMeditationClassPlan}
                setDisplayState={setShowAddMeditationClassPlan}
                headingChildren={<span>Create New Meditation Plan</span>}
                bodyChildren={addMeditationClassPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleAddMeditationPlan}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddMeditationClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
                maxWidthClass='max-w-xl'
            />

            {/* View Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showViewMeditationClassPlan}
                setDisplayState={setShowViewMeditationClassPlan}
                headingChildren={<>
                    <StarIcon className='w-8 h-8' />
                    <span>{selectedViewMeditationClassPlan?.className}</span>
                </>}
                bodyChildren={
                    <div className='p-4'>
                        <div className='text-left mb-5'>
                            <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {selectedViewMeditationClassPlan?.classPrice}</p>
                            <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {selectedViewMeditationClassPlan?.classDuration} Mins.</p>
                            <p className='text-gray-900 flex items-center gap-3'><FlagIcon className='w-5 h-5' /> {getFormattedTime(selectedViewMeditationClassPlan?.classStartTime)}</p>
                            <p className='text-gray-900 flex items-center gap-3'><UserGroupIcon className='w-5 h-5' /> {selectedViewMeditationClassPlan?.batchSize}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Plan Description:</span> <br /><span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedViewMeditationClassPlan?.classDescription }} /></p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='text-gray-900 flex items-center gap-3'><UserIcon className='w-5 h-5' /> {selectedViewMeditationClassPlan?.instructorName}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Instructor Description: </span><br /> <span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedViewMeditationClassPlan?.instructorDescription }} /></p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='mb-2 font-medium'>Class Days: </p>
                            <div className="flex">
                                {
                                    selectedViewMeditationClassPlan && Object.keys(JSON.parse(selectedViewMeditationClassPlan?.classDays)).map((day, index) => (
                                        JSON.parse(selectedViewMeditationClassPlan?.classDays)[day] &&
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
                        onClick={() => { setShowViewMeditationClassPlan(false) }}
                    >
                        Close
                    </button>
                }
            />

            {/* Edit Meditation plam  */}
            <HeadlessUIModalComponent
                displayState={showEditMeditationClassPlan}
                setDisplayState={setShowEditMeditationClassPlan}
                headingChildren={<>
                    <PencilSquareIcon className='w-8 h-8' />
                    <span>{editMeditationName}</span>
                </>}
                bodyChildren={editMeditationPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleMeditationClassPlanUpdate}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowEditMeditationClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Delete Yoga Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteMeditationClassPlan}
                setDisplayState={setShowDeleteMeditationClassPlan}
                headingChildren={<span>Delete Meditation Class Plan</span>}
                bodyChildren={<span>Are you sure you want to delete {selectedDeleteMeditationClassPlan?.name}?</span>}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { handleDeleteMeditationPlan(selectedDeleteMeditationClassPlan?.id) }}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeleteMeditationClassPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Meditation plans List */}
            <div className='flex items-center justify-between' >
                <h1 className='text-2xl'>Meditation Class Plans</h1>
                <button
                    onClick={() => { setShowAddMeditationClassPlan(true) }}
                    className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                >
                    <PlusIcon className='h-5 w-5' /> Add New Meditation Plan
                </button>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <div>
                    {
                        meditationClassPlans.length === 0 ?
                            <p className='mt-10 text-xl text-gray-700'>No Meditation Classes to display{meditationClassPlans.length ? ' with selected filter' : ''}!</p>
                            :
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {meditationClassPlans.map((plan, index) => (
                                    <MeditationPlanCardComponent key={index} plan={plan} />
                                ))}
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default MeditationClasses;