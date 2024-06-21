import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import './plans.css'
import { Switch } from '@headlessui/react';
import { BanknotesIcon, BarsArrowUpIcon, BoltIcon, CheckIcon, ClockIcon, CurrencyRupeeIcon, EyeIcon, PencilIcon, PlusIcon, Squares2X2Icon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal';
import { DELETE_ENTITY_STATUS, PLAN_TYPE_SINGLE_TIME_PLAN, defaultPlanList, defaultServiceList } from '../../../../../commonServices/commonDataService';
import { connect } from 'react-redux';
import { plansPackagesApiService } from '../../../../../commonServices/apiService';
import {
    PLAN_CREATED_SUCCESSFULLY,
    PLAN_COULDNT_CREATED,
    PLAN_DELETED_SUCCESSFULLY,
    PLAN_COULDNT_DELETED,
    PLAN_STATUS_UPDATED_SUCCESSFULLY,
    PLAN_STATUS_COULDNT_UPDATED,
} from '../../../../../commonServices/messageConstants';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../../commonServices/quillModules';
import { Reorder } from 'framer-motion'


function PlanList(props) {
    console.log('single currentPlans props', props)
    const location = useLocation();
    let params = useParams();

    const [allTreatmentServicesList, setAllTreatmentServicesList] = useState([])

    // Add Plan States
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [addPlanName, setAddPlanName] = useState('');
    const [addPlanShortDescription, setAddPlanShortDescription] = useState('');
    const [addPlanLongDescription, setAddPlanLongDescription] = useState('');
    const [addPlanService, setAddPlanService] = useState(0);
    const [addPlanPrice, setAddPlanPrice] = useState('0');
    const [addPlanDuration, setAddPlanDuration] = useState('0');

    // View Plan States
    const [showViewPlan, setShowViewPlan] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Delete Plan States
    const [showDeletePlan, setShowDeletePlan] = useState(false);
    const [selectedPlanToDelete, setSelectedPlanToDelete] = useState(null);

    // Display states
    const [allPlans, setAllPlans] = useState([]);
    const [currentPlans, setCurrentPlans] = useState([]);
    const [serviceFilterList, setServiceFilterList] = useState([...new Set(props.allServices.allServicesData.map(plan => plan.treatmentServiceName))]);

    // Filter states
    const [filterService, setFilterService] = useState('All Services');
    const [filterStatus, setFilterStatus] = useState('Any Status');

    // Reordering states
    const [reOrdering, setReOrdering] = useState(false);

    // editing plan states
    const [showEditPlan, setShowEditPlan] = useState(false);
    const [editPlanId, setEditPlanId] = useState(null);
    const [editPlanName, setEditPlanName] = useState('');
    const [editPlanShortDescription, setEditPlanShortDescription] = useState('');
    const [editPlanLongDescription, setEditPlanLongDescription] = useState('');
    const [editPlanService, setEditPlanService] = useState(0);
    const [editPlanPrice, setEditPlanPrice] = useState('0');
    const [editPlanDuration, setEditPlanDuration] = useState('0');



    const handlePlanStatusChange = (id, newStatus) => {
        // console.log(id, newStatus);
        const body = {
            id: id,
            status: newStatus == true ? 1 : 0
        }
        plansPackagesApiService.changePlanStatus(body).then(response => {
            if (response.data.status == true) {
                getAllPlans();
                toast.success(PLAN_STATUS_UPDATED_SUCCESSFULLY)
            }
        }).catch(err => {
            console.error(err)
            toast.error(PLAN_STATUS_COULDNT_UPDATED)
        })

    }



    useEffect(() => {
        getAllServices()
    }, [props])

    useEffect(() => {
        getAllPlans()
    }, [])


    const getAllServices = () => {
        setAllTreatmentServicesList(props.allServices.allServicesData)
        // console.log(props.allServices.allServicesData)
        setAddPlanService(props.allServices.allServicesData[0]?.id)
        setServiceFilterList([...new Set(props.allServices.allServicesData.map(service => service.treatmentServiceName))])
    }

    const getAllPlans = () => {
        const body = {
            packageType: PLAN_TYPE_SINGLE_TIME_PLAN
        }
        plansPackagesApiService.getAllplans(body).then(response => {
            console.log('all currentPlans', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllPlans(responseData)
                setCurrentPlans(responseData)
                // console.log(responseData[0].id)
                // setAddPlanService(responseData[0].id)
                // console.log(addPlanService)
            }
        }).catch(err => console.error(err))
    }

    const PlanCardComponent = ({ plan }) => {
        return (
            <div className='bg-indigo-100 flex flex-col justify-between px-4 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                <div>
                    <div className='text-center my-2'>
                        <h3 className='text-xl font-semibold'>{plan.packageName}</h3>
                    </div>
                    <div className='text-left'>
                        <p className='text-gray-900 flex items-center gap-3'><Squares2X2Icon className='w-5 h-5' /> {plan.treatmentServiceName} Service</p>
                        <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {plan.packageAmount}</p>
                        <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {plan.packageTherapyTime} Mins.</p>
                        <p className='text-gray-900 flex items-center gap-3'><BoltIcon className='w-5 h-5' /> Plan Valid For : {plan.therapyFrequency} Day</p>
                        <p className='text-sm my-3 text-gray-600'>{plan.shortDescription}</p>
                    </div>
                </div>
                <div className='my-2 flex justify-between items-center'>
                    <Switch
                        checked={plan.status}
                        onChange={(newStatus) => { handlePlanStatusChange(plan.id, newStatus) }}
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
                                setSelectedPlan(plan);
                                setShowViewPlan(true);
                            }}
                            className='bg-teal-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none w-full'
                        >
                            <EyeIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setEditPlanId(plan.id)
                                setEditPlanName(plan.packageName)
                                setEditPlanShortDescription(plan.shortDescription)
                                setEditPlanLongDescription(plan.longDescription)
                                setEditPlanService(plan.treatmentServiceID)
                                setEditPlanPrice(plan.packageAmount)
                                setEditPlanDuration(plan.packageTherapyTime)
                                setShowEditPlan(true);
                            }}
                            className='bg-indigo-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none w-full'
                        >
                            <PencilIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPlanToDelete(plan);
                                setShowDeletePlan(true);
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

    const addPlanModalBody = (
        <div className='mt-4'>
            <div className='mb-3'>
                <label htmlFor='planName' className='block text-sm font-medium text-gray-700'>Plan Name</label>
                <input
                    type='text'
                    name='planName'
                    id='planName'
                    required
                    value={addPlanName}
                    onChange={(e) => { setAddPlanName(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planShortDescription' className='block text-sm font-medium text-gray-700'>Plan Short Description</label>
                <input
                    type='text'
                    name='planShortDescription'
                    id='planShortDescription'
                    required
                    value={addPlanShortDescription}
                    onChange={(e) => { setAddPlanShortDescription(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planLongDescription' className='block text-sm font-medium text-gray-700'>Plan Long Description</label>
                <ReactQuill
                    name='planLongDescription'
                    id='planLongDescription'
                    theme="snow"
                    modules={quillModules}
                    value={addPlanLongDescription}
                    onChange={(value) => setAddPlanLongDescription(value)}
                    className='mt-[2px] block w-full border-2 border-gray-300 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planServiceName' className='block text-sm font-medium text-gray-700'>Plan Service</label>
                <select
                    name="planServiceName"
                    id="planServiceName"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={addPlanService}
                    onChange={(e) => setAddPlanService(parseInt(e.target.value))}
                >
                    {allTreatmentServicesList.map((service) => (
                        <option key={service.id} value={service.id}>{service.treatmentServiceName}</option>
                    ))}
                </select>
            </div>
            <div className='mb-3'>
                <label htmlFor='planPrice' className='block text-sm font-medium text-gray-700'>Plan Price</label>
                <input
                    type='text'
                    name='planPrice'
                    id='planPrice'
                    required
                    value={addPlanPrice}
                    onChange={(e) => { setAddPlanPrice(e.target.value.replace(/[^0-9]/, '')) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planDuration' className='block text-sm font-medium text-gray-700'>Plan Duration</label>
                <div className='relative'>
                    <input
                        type='text'
                        name='planDuration'
                        id='planDuration'
                        required
                        value={addPlanDuration}
                        onChange={(e) => { setAddPlanDuration(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 pr-14 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                    <span className='absolute top-1 right-4 text-gray-700'>
                        Mins.
                    </span>
                </div>

            </div>
        </div>
    )


    const editPlanModalBody = (
        <div className='mt-4'>
            <div className='mb-3'>
                <label htmlFor='planName' className='block text-sm font-medium text-gray-700'>Plan Name</label>
                <input
                    type='text'
                    name='planName'
                    id='planName'
                    required
                    value={editPlanName}
                    onChange={(e) => { setEditPlanName(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planShortDescription' className='block text-sm font-medium text-gray-700'>Plan Short Description</label>
                <input
                    type='text'
                    name='planShortDescription'
                    id='planShortDescription'
                    required
                    value={editPlanShortDescription}
                    onChange={(e) => { setEditPlanShortDescription(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planLongDescription' className='block text-sm font-medium text-gray-700'>Plan Long Description</label>
                <ReactQuill
                    name='planLongDescription'
                    id='planLongDescription'
                    theme="snow"
                    modules={quillModules}
                    value={editPlanLongDescription}
                    onChange={(value) => setEditPlanLongDescription(value)}
                    className='mt-[2px] block w-full border-2 border-gray-300 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planServiceName' className='block text-sm font-medium text-gray-700'>Plan Service</label>
                <select
                    name="planServiceName"
                    id="planServiceName"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={editPlanService}
                    onChange={(e) => setEditPlanService(parseInt(e.target.value))}
                >
                    {allTreatmentServicesList.map((service) => (
                        <option key={service.id} value={service.id}>{service.treatmentServiceName}</option>
                    ))}
                </select>
            </div>
            <div className='mb-3'>
                <label htmlFor='planPrice' className='block text-sm font-medium text-gray-700'>Plan Price</label>
                <input
                    type='text'
                    name='planPrice'
                    id='planPrice'
                    required
                    value={editPlanPrice}
                    onChange={(e) => { setEditPlanPrice(e.target.value.replace(/[^0-9]/, '')) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-3'>
                <label htmlFor='planDuration' className='block text-sm font-medium text-gray-700'>Plan Duration</label>
                <div className='relative'>
                    <input
                        type='text'
                        name='planDuration'
                        id='planDuration'
                        required
                        value={editPlanDuration}
                        onChange={(e) => { setEditPlanDuration(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 pr-14 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                    <span className='absolute top-1 right-4 text-gray-700'>
                        Mins.
                    </span>
                </div>

            </div>
        </div>
    )

    const reOrderPlansModalBody = (
        <div>
            <Reorder.Group
                as="ul"
                values={currentPlans}
                onReorder={setCurrentPlans}
                className="flex flex-col gap-2"
            >
                {currentPlans.map((plan, index) => (
                    <Reorder.Item
                        key={plan.id}
                        value={plan}
                        as="li"
                        className="flex items-center justify-between bg-indigo-100 px-4 py-2 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300"
                    >
                        <div className='flex flex-col items-start'>
                            <span className='font-semibold'>{plan.packageName}</span>
                            <span className='text-sm text-gray-700'>{plan.treatmentServiceName}</span>
                        </div>

                        <div className='flex flex-col items-start'>
                            <span className='text-gray-900'>QAR. {plan.packageAmount}</span>
                            <span className='text-sm text-gray-700'>{plan.packageTherapyTime} mins.</span>
                        </div>

                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    )

    const handleAddPlan = (e) => {
        e.preventDefault();
        if (addPlanName.trim() === '' || addPlanShortDescription.trim() === '' || addPlanLongDescription.trim() === '' || addPlanPrice.trim() === '' || addPlanDuration.trim() === '') {
            alert('Please fill all the fields')
            return;
        }
        const serviceName = allTreatmentServicesList.find(x => x.id == addPlanService)
        const body = {
            packageType: PLAN_TYPE_SINGLE_TIME_PLAN,
            treatmentServiceID: parseInt(addPlanService),
            packageName: addPlanName,
            packageAmount: parseFloat(addPlanPrice),
            packageDuration: 1,
            shortDescription: addPlanShortDescription,
            longDescription: addPlanLongDescription,
            therapyFrequency: 1,
            packageTherapyTime: parseInt(addPlanDuration),
            treatmentServiceName: serviceName.treatmentServiceName,
            orderIndex: allPlans.length

        }
        plansPackagesApiService.createPlanPackage(body).then(response => {
            console.log('new plan', response)
            if (response.data.status == true) {
                getAllPlans();
                setShowAddPlan(false);
                setAddPlanName('');
                setAddPlanShortDescription('');
                setAddPlanLongDescription('');
                setAddPlanService(props.allServices.allServicesData[0]?.id)
                setAddPlanPrice('0');
                setAddPlanDuration('0');
                toast.success(PLAN_CREATED_SUCCESSFULLY)
            }
        }).catch(err => {
            console.error(err)
            toast.error(PLAN_COULDNT_CREATED)
        })

        // let maxId = Math.max(...currentPlans.map(plan => plan.id));
        // setCurrentPlans([...currentPlans, {
        //     id: maxId + 1,
        //     name: addPlanName,
        //     shortDescription: addPlanShortDescription,
        //     longDescription: addPlanLongDescription,
        //     service: addPlanService,
        //     status: false,
        //     price: parseInt(addPlanPrice),
        //     duration: parseInt(addPlanDuration)
        // }])


    }

    const handleUpdatePlan = (e) => {
        e.preventDefault();
        if (editPlanName.trim() === '' || editPlanShortDescription.trim() === '' || editPlanLongDescription.trim() === '') {
            toast.error('Please fill all the fields')
            return;
        }
        const serviceName = allTreatmentServicesList.find(x => x.id == editPlanService)
        const body = {
            id: editPlanId,
            treatmentServiceID: parseInt(editPlanService),
            packageName: editPlanName,
            packageAmount: parseFloat(editPlanPrice),
            shortDescription: editPlanShortDescription,
            longDescription: editPlanLongDescription,
            packageTherapyTime: parseInt(editPlanDuration),
            treatmentServiceName: serviceName.treatmentServiceName,
        }
        plansPackagesApiService.updatePlan(body).then(response => {
            console.log('updated plan', response)
            if (response.data.status == true) {
                getAllPlans();
                setShowEditPlan(false);
                toast.success('Plan updated successfully')
            } else {
                toast.error('Couldn\'t update plan')
            }
        }).catch(err => {
            console.error(err)
            toast.error('Couldn\'t update plan')
        })
    }

    const handleDeletePlan = (id) => {
        // console.log(id)
        const body = {
            id: id,
            status: DELETE_ENTITY_STATUS
        }
        plansPackagesApiService.changePlanStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                getAllPlans();
                toast.success(PLAN_DELETED_SUCCESSFULLY)
                setShowDeletePlan(false)
            } else {
                toast.error(PLAN_COULDNT_DELETED)
                setShowDeletePlan(false)
            }

        }).catch(err => console.error(err))

    }

    const handleReorderingSave = () => {
        const body = currentPlans.map((plan, index) => {
            return {
                id: plan.id,
            }
        })
        plansPackagesApiService.updateOrder(body).then(response => {
            if (response.data.status == 200) {
                toast.success('Plans reordered successfully')
                getAllPlans()
                setReOrdering(false)
            }
        }).catch(err => {
            console.error(err)
            toast.error('Couldn\'t reorder plans')
        })
    }

    // Filtering useEffects
    useEffect(() => {
        if (filterService !== 'All Services' && filterStatus !== 'Any Status') {
            setCurrentPlans(allPlans.filter(plan => plan.treatmentServiceName === filterService && plan.status === (filterStatus === 'active')))
        } else if (filterService !== 'All Services') {
            setCurrentPlans(allPlans.filter(plan => plan.treatmentServiceName === filterService))
        } else if (filterStatus !== 'Any Status') {
            setCurrentPlans(allPlans.filter(plan => plan.status === (filterStatus === 'active')))
        } else {
            setCurrentPlans(allPlans)
        }
    }, [filterService, filterStatus])

    return (
        <div className='w-full p-5'>
            {/* Add Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showAddPlan}
                setDisplayState={setShowAddPlan}
                headingChildren={<span>Create New Plan</span>}
                bodyChildren={addPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleAddPlan}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* View Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showViewPlan}
                setDisplayState={setShowViewPlan}
                headingChildren={<>
                    <BanknotesIcon className='w-8 h-8' />
                    <span>{selectedPlan?.packageName}</span>
                </>}
                bodyChildren={
                    <div className='p-4'>
                        <div className='text-left mb-5'>
                            <p className='text-gray-900 flex items-center gap-3'><Squares2X2Icon className='w-5 h-5' /> {selectedPlan?.treatmentServiceName}</p>
                            <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {selectedPlan?.packageAmount}</p>
                            <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {selectedPlan?.packageTherapyTime} Mins.</p>
                            <p className='text-gray-900 flex items-center gap-3'><BoltIcon className='w-5 h-5' />Plan Valid For : {selectedPlan?.therapyFrequency} Day</p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Short Desc.:</span> <br />{selectedPlan?.shortDescription}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Long Desc.: </span><br /><span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedPlan?.longDescription }} /></p>
                        </div>
                    </div>
                }
                footerChildren={
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        onClick={() => { setShowViewPlan(false) }}
                    >
                        Close
                    </button>
                }
            />

            {/* Reorder */}
            <HeadlessUIModalComponent
                displayState={reOrdering}
                setDisplayState={setReOrdering}
                headingChildren={<span>Reorder Plans</span>}
                bodyChildren={reOrderPlansModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            onClick={handleReorderingSave}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => {
                                setCurrentPlans(allPlans)
                                setReOrdering(false)
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Edit Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showEditPlan}
                setDisplayState={setShowEditPlan}
                headingChildren={<span>Edit Plan</span>}
                bodyChildren={editPlanModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleUpdatePlan}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowEditPlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Delete Plan Modal */}
            <HeadlessUIModalComponent
                displayState={showDeletePlan}
                setDisplayState={setShowDeletePlan}
                headingChildren={<span>Delete Plan</span>}
                bodyChildren={<span>Are you sure you want to delete <b>{selectedPlanToDelete?.packageName}</b>?</span>}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { handleDeletePlan(selectedPlanToDelete.id) }}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeletePlan(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Plans List */}
            <div className='flex items-center justify-between' >
                <h1 className='text-2xl'>Plans</h1>

                <div className='flex items-center gap-2'>
                    {/* Filter */}
                    <div className='flex items-center gap-2'>
                        <select
                            name="filterService"
                            disabled={reOrdering}
                            className='bg-indigo-300 px-4 py-2 rounded-lg text-indigo-900 focus:outline-none'
                            value={filterService}
                            onChange={(e) => { setFilterService(e.target.value); }}
                        >
                            <option value="All Services">All Services</option>
                            {serviceFilterList.map((service, index) => (
                                <option key={index} value={service}>{service}</option>
                            ))}
                        </select>

                        <select
                            name="filterStatus"
                            disabled={reOrdering}
                            value={filterStatus}
                            className='bg-indigo-300 px-4 py-2 rounded-lg text-indigo-900 focus:outline-none'
                            onChange={(e) => { setFilterStatus(e.target.value) }}
                        >
                            <option value="Any Status">Any Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>


                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => {
                                setReOrdering(true)
                            }}
                            className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                        >
                            <BarsArrowUpIcon className='h-5 w-5' /> Reorder
                        </button>

                    </div>
                    {/* Add Plan */}
                    <button
                        onClick={() => { setShowAddPlan(true) }}
                        disabled={reOrdering}
                        className='bg-indigo-300 disabled:opacity-60 disabled:hover:bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                    >
                        <PlusIcon className='h-5 w-5' /> Add New Plan
                    </button>
                </div>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <div>
                    {currentPlans.length === 0
                        ?
                        <p className='mt-10 text-xl text-gray-700'>No plans to display{allPlans.length ? ' with selected filter' : ''}!</p>
                        :
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>

                            {currentPlans.map((plan, index) => (
                                <PlanCardComponent key={index} plan={plan} />
                            ))}
                        </div>}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    allServices: state.allServices
})
export default connect(mapStateToProps, null)(PlanList)