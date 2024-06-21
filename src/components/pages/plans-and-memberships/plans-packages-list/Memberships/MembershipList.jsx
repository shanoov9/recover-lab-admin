import React, { memo, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import './memberships.css'
import { Switch } from '@headlessui/react';
import { BanknotesIcon, BarsArrowUpIcon, BoltIcon, CalendarDaysIcon, CheckIcon, ClockIcon, CurrencyRupeeIcon, EyeIcon, PencilIcon, PlusIcon, Squares2X2Icon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal';
import { DELETE_ENTITY_STATUS, DISABLE_ENTITY_STATUS, ENABLE_ENTITY_STATUS, PLAN_TYPE_MEMBERSHIP, PLAN_VALIDITY, defaultMembershipList } from '../../../../../commonServices/commonDataService';
import { frequencyList } from '../../../../../commonServices/commonDataService';
import { plansPackagesApiService } from '../../../../../commonServices/apiService';
import {
    MEMBERSHIP_CREATED_SUCCESSFULLY,
    MEMBERSHIP_COULDNT_CREATED,
    MEMBERSHIP_DELETED_SUCCESSFULLY,
    MEMBERSHIP_COULDNT_DELETED,
    MEMBERSHIP_STATUS_UPDATED_SUCCESSFULLY,
    MEMBERSHIP_STATUS_COULDNT_UPDATED,
} from '../../../../../commonServices/messageConstants';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../../commonServices/quillModules';
import { Reorder } from 'framer-motion';

function MembershipList(props) {
    // const location = useLocation();
    // let params = useParams();


    // Add Membership States
    const [showAddMembership, setShowAddMembership] = useState(false);
    const [addMembershipName, setAddMembershipName] = useState('');
    const [addMembershipShortDescription, setAddMembershipShortDescription] = useState('');
    const [addMembershipLongDescription, setAddMembershipLongDescription] = useState('');
    // const [addMembershipService, setAddMembershipService] = useState(defaultServiceList[0].title);
    // const [addMembershipFrequency, setAddMembershipFrequency] = useState();
    const [addMembershipValidity, setAddMembershipValidity] = useState(PLAN_VALIDITY[0].dayCountValue);
    const [addMembershipPrice, setAddMembershipPrice] = useState('0');
    // const [addMembershipDuration, setAddMembershipDuration] = useState('0');

    // View Membership States
    const [showViewMembership, setShowViewMembership] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState(null);

    // Delete Membership States
    const [showDeleteMembership, setShowDeleteMembership] = useState(false);
    const [selectedMembershipToDelete, setSelectedMembershipToDelete] = useState(null);

    // Display states
    const [memberships, setMemberships] = useState([]);

    // Reorder states
    const [reOrdering, setReOrdering] = useState(false);

    // Edit Membership States
    const [showEditMembership, setShowEditMembership] = useState(false);
    const [editMembershipId, setEditMembershipId] = useState(null);
    const [editMembershipName, setEditMembershipName] = useState('');
    const [editMembershipShortDescription, setEditMembershipShortDescription] = useState('');
    const [editMembershipLongDescription, setEditMembershipLongDescription] = useState('');
    const [editMembershipValidity, setEditMembershipValidity] = useState(PLAN_VALIDITY[0].dayCountValue);
    const [editMembershipPrice, setEditMembershipPrice] = useState('0');

    useEffect(() => {
        getAllMemberships()
    }, [])

    const getAllMemberships = () => {
        const body = {
            packageType: PLAN_TYPE_MEMBERSHIP
        }
        plansPackagesApiService.getAllplans(body).then(response => {
            console.log('all currentPlans', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setMemberships(responseData)
                // setCurrentPlans(responseData)
                // console.log(responseData[0].id)
                // setAddPlanService(responseData[0].id)
                // console.log(addPlanService)
            }
        }).catch(err => console.error(err))
    }


    const handleMembershipStatusChange = (id, newStatus) => {
        console.log(id, newStatus);
        const body = {
            id: id,
            status: newStatus == true ? ENABLE_ENTITY_STATUS : DISABLE_ENTITY_STATUS
        }
        plansPackagesApiService.changePlanStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                getAllMemberships()
                toast.success(MEMBERSHIP_STATUS_UPDATED_SUCCESSFULLY)
            } else {
                toast.error(MEMBERSHIP_STATUS_COULDNT_UPDATED)
            }
        }).catch(err => console.error(err))
    }




    const MembershipCardComponent = ({ membership }) => {
        return (
            <div className='bg-indigo-100 flex flex-col justify-between px-4 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                <div>
                    <div className='text-center my-2'>
                        <h3 className='text-xl font-semibold'>{membership.packageName}</h3>
                    </div>
                    <div className='text-left'>
                        {/* <p className='text-gray-900 flex items-center gap-3'><Squares2X2Icon className='w-5 h-5' /> {membership.service}</p> */}
                        <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {membership.packageAmount}</p>
                        {/* <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {membership.duration} Mins.</p> */}
                        <p className='text-gray-900 flex items-center gap-3'><CalendarDaysIcon className='w-5 h-5' /> {membership.packageDuration} days.</p>
                        <p className='text-sm my-3 text-gray-600'>{membership.shortDescription}</p>
                    </div>
                </div>
                <div className='my-2 flex justify-between items-center'>
                    <Switch
                        checked={membership.status}
                        onChange={(newStatus) => { handleMembershipStatusChange(membership.id, newStatus) }}
                        className={`border ${membership.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${membership.status ? 'translate-x-6 bg-green-700/90' : 'translate-x-0 bg-red-700/90'} pointer-events-none text-white inline-block h-5 w-5 transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition-all duration-200 ease-in-out`}
                        >
                            {membership.status
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
                                setSelectedMembership(membership);
                                setShowViewMembership(true);
                            }}
                            className='bg-teal-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none w-full'
                        >
                            <EyeIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setEditMembershipId(membership.id)
                                setEditMembershipName(membership.packageName)
                                setEditMembershipShortDescription(membership.shortDescription)
                                setEditMembershipLongDescription(membership.longDescription)
                                setEditMembershipValidity(membership.packageDuration)
                                setEditMembershipPrice(membership.packageAmount)
                                setShowEditMembership(true);
                            }}
                            className='bg-indigo-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none w-full'
                        >
                            <PencilIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedMembershipToDelete(membership);
                                setShowDeleteMembership(true);
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

    const addMembershipModalBody = (
        <div className='mt-4'>
            <div className='mb-2'>
                <label htmlFor='membershipName' className='block text-sm font-medium text-gray-700'>Membership Name</label>
                <input
                    type='text'
                    name='membershipName'
                    id='membershipName'
                    required
                    value={addMembershipName}
                    onChange={(e) => { setAddMembershipName(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='membershipShortDescription' className='block text-sm font-medium text-gray-700'>Membership Short Description</label>
                <input
                    type='text'
                    name='membershipShortDescription'
                    id='membershipShortDescription'
                    required
                    value={addMembershipShortDescription}
                    onChange={(e) => { setAddMembershipShortDescription(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='membershipLongDescription' className='block text-sm font-medium text-gray-700'>Membership Long Description</label>
                <ReactQuill
                    name='membershipLongDescription'
                    id='membershipLongDescription'
                    theme="snow"
                    modules={quillModules}
                    value={addMembershipLongDescription}
                    onChange={(value) => { setAddMembershipLongDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            {/* <div className='mb-2'>
                <label htmlFor='membershipServiceName' className='block text-sm font-medium text-gray-700'>Membership Service</label>
                <select
                    name="membershipServiceName"
                    id="membershipServiceName"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={addMembershipService}
                    onChange={(e) => { setAddMembershipService(e.target.value) }}
                >
                    {defaultServiceList.map((service) => (
                        <option key={service.id} value={service.title}>{service.title}</option>
                    ))}
                </select>
            </div> */}
            <div className='mb-2'>
                <label htmlFor='membershipFrequency' className='block text-sm font-medium text-gray-700'>Membership Validity</label>
                <select
                    name="membershipFrequency"
                    id="membershipFrequency"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={addMembershipValidity}
                    onChange={(e) => { setAddMembershipValidity(e.target.value) }}
                >
                    {PLAN_VALIDITY.map((validity) => (
                        <option key={validity.id} value={validity.dayCountValue}>{validity.name}</option>

                    ))
                    }
                    {/* <option value="Yearly">Yearly</option>
                    <option value="Monthly">Monthly</option> */}
                </select>
            </div>
            <div className='flex gap-2'>
                <div className='mb-2 w-full'>
                    <label htmlFor='membershipPrice' className='block text-sm font-medium text-gray-700'>Membership Price</label>
                    <input
                        type='text'
                        name='membershipPrice'
                        id='membershipPrice'
                        required
                        value={addMembershipPrice}
                        onChange={(e) => { setAddMembershipPrice(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                {/* <div className='mb-2 w-1/2'>
                    <label htmlFor='membershipDuration' className='block text-sm font-medium text-gray-700'>Session Duration</label>
                    <input
                        type='text'
                        name='membershipDuration'
                        id='membershipDuration'
                        required
                        value={addMembershipDuration}
                        onChange={(e) => { setAddMembershipDuration(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div> */}
            </div>
        </div>
    )

    const editMembershipModalBody = (
        <div className='mt-4'>
            <div className='mb-2'>
                <label htmlFor='membershipName' className='block text-sm font-medium text-gray-700'>Membership Name</label>
                <input
                    type='text'
                    name='membershipName'
                    id='membershipName'
                    required
                    value={editMembershipName}
                    onChange={(e) => { setEditMembershipName(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='membershipShortDescription' className='block text-sm font-medium text-gray-700'>Membership Short Description</label>
                <input
                    type='text'
                    name='membershipShortDescription'
                    id='membershipShortDescription'
                    required
                    value={editMembershipShortDescription}
                    onChange={(e) => { setEditMembershipShortDescription(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='membershipLongDescription' className='block text-sm font-medium text-gray-700'>Membership Long Description</label>
                <ReactQuill
                    name='membershipLongDescription'
                    id='membershipLongDescription'
                    theme="snow"
                    modules={quillModules}
                    value={editMembershipLongDescription}
                    onChange={(value) => { setEditMembershipLongDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            {/* <div className='mb-2'>
                <label htmlFor='membershipServiceName' className='block text-sm font-medium text-gray-700'>Membership Service</label>
                <select
                    name="membershipServiceName"
                    id="membershipServiceName"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={addMembershipService}
                    onChange={(e) => { setAddMembershipService(e.target.value) }}
                >
                    {defaultServiceList.map((service) => (
                        <option key={service.id} value={service.title}>{service.title}</option>
                    ))}
                </select>
            </div> */}
            <div className='mb-2'>
                <label htmlFor='membershipFrequency' className='block text-sm font-medium text-gray-700'>Membership Validity</label>
                <select
                    name="membershipFrequency"
                    id="membershipFrequency"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={editMembershipValidity}
                    onChange={(e) => { setEditMembershipValidity(e.target.value) }}
                >
                    {PLAN_VALIDITY.map((validity) => (
                        <option key={validity.id} value={validity.dayCountValue}>{validity.name}</option>

                    ))
                    }
                    {/* <option value="Yearly">Yearly</option>
                    <option value="Monthly">Monthly</option> */}
                </select>
            </div>
            <div className='flex gap-2'>
                <div className='mb-2 w-full'>
                    <label htmlFor='membershipPrice' className='block text-sm font-medium text-gray-700'>Membership Price</label>
                    <input
                        type='text'
                        name='membershipPrice'
                        id='membershipPrice'
                        required
                        value={editMembershipPrice}
                        onChange={(e) => { setEditMembershipPrice(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                {/* <div className='mb-2 w-1/2'>
                    <label htmlFor='membershipDuration' className='block text-sm font-medium text-gray-700'>Session Duration</label>
                    <input
                        type='text'
                        name='membershipDuration'
                        id='membershipDuration'
                        required
                        value={addMembershipDuration}
                        onChange={(e) => { setAddMembershipDuration(e.target.value.replace(/[^0-9]/, '')) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div> */}
            </div>
        </div>
    )

    const handleAddMembership = (e) => {
        e.preventDefault();
        if (addMembershipName.trim() === '' || addMembershipShortDescription.trim() === '' || addMembershipLongDescription.trim() === '' || addMembershipPrice.trim() === '') {
            alert('Please fill all the fields')
            return;
        }
        const body = {
            packageType: PLAN_TYPE_MEMBERSHIP,
            treatmentServiceID: null,
            packageName: addMembershipName,
            packageAmount: parseFloat(addMembershipPrice),
            packageDuration: addMembershipValidity,
            shortDescription: addMembershipShortDescription,
            longDescription: addMembershipLongDescription,
            therapyFrequency: null,
            packageTherapyTime: null,
            treatmentServiceName: null
        }

        console.log(body)

        plansPackagesApiService.createPlanPackage(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                getAllMemberships()
                setShowAddMembership(false);
                setAddMembershipName('');
                setAddMembershipShortDescription('');
                setAddMembershipLongDescription('');
                // setAddMembershipService(defaultServiceList[0].title);
                setAddMembershipValidity(PLAN_VALIDITY[0].dayCountValue)
                setAddMembershipPrice('0');
                // setAddMembershipDuration('0');
                toast.success(MEMBERSHIP_CREATED_SUCCESSFULLY)
            } else {
                setShowAddMembership(false);
                toast.error(MEMBERSHIP_COULDNT_CREATED)
            }
        }).catch(err => console.error(err))

        // console.log(addMembershipName, addMembershipShortDescription, addMembershipLongDescription, parseFloat(addMembershipPrice));
        // let maxId = Math.max(...memberships.map(membership => membership.id));
        // setMemberships([...memberships, {
        //     id: maxId + 1,
        //     name: addMembershipName,
        //     shortDescription: addMembershipShortDescription,
        //     longDescription: addMembershipLongDescription,
        //     // service: addMembershipService,
        //     frequency: addMembershipValidity,
        //     status: false,
        //     price: parseInt(addMembershipPrice),
        //     // duration: parseInt(addMembershipDuration)
        // }])
        // setShowAddMembership(false);
        // setAddMembershipName('');
        // setAddMembershipShortDescription('');
        // setAddMembershipLongDescription('');
        // // setAddMembershipService(defaultServiceList[0].title);
        // setAddMembershipValidity(PLAN_VALIDITY[0].dayCountValue)
        // setAddMembershipPrice('0');
        // // setAddMembershipDuration('0');
    }

    const handleUpdateMembership = (e) => {
        e.preventDefault();
        if (editMembershipName.trim() === '' || editMembershipShortDescription.trim() === '' || editMembershipLongDescription.trim() === '') {
            toast.error('Please fill all the fields')
            return;
        }
        const body = {
            id: editMembershipId,
            packageName: editMembershipName,
            packageAmount: parseFloat(editMembershipPrice),
            packageDuration: editMembershipValidity,
            shortDescription: editMembershipShortDescription,
            longDescription: editMembershipLongDescription,
        }

        plansPackagesApiService.updatePlan(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                getAllMemberships()
                setShowEditMembership(false)
                toast.success('Membership updated successfully')
            } else {
                setShowEditMembership(false)
                toast.error('Membership couldn\'t updated')
            }
        }).catch(err => console.error(err))
    }

    const handleDeleteMembership = (id) => {
        const body = {
            id: id,
            status: DELETE_ENTITY_STATUS
        }
        plansPackagesApiService.changePlanStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {

                getAllMemberships()
                setShowDeleteMembership(false)
                toast.success(MEMBERSHIP_DELETED_SUCCESSFULLY)
            } else {
                setShowDeleteMembership(false)
                toast.error(MEMBERSHIP_COULDNT_DELETED)
            }
        }).catch(err => console.error(err))
    }


    const reOrderPackagesModalBody = (
        <div>
            <Reorder.Group
                as="ul"
                values={memberships}
                onReorder={setMemberships}
                className="flex flex-col gap-2"
            >
                {memberships.map((plan, index) => (
                    <Reorder.Item
                        key={plan.id}
                        value={plan}
                        as="li"
                        className="flex items-center justify-between bg-indigo-100 px-4 py-2 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300"
                    >
                        <div className='flex flex-col items-start'>
                            <span className='font-semibold'>{plan.packageName}</span>
                        </div>

                        <div className='flex flex-col items-start'>
                            <span className='text-gray-900'>QAR. {plan.packageAmount}</span>
                        </div>

                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    )

    const handleReorderingSave = () => {
        const body = memberships.map((plan, index) => {
            return {
                id: plan.id,
            }
        })
        plansPackagesApiService.updateOrder(body).then(response => {
            if (response.data.status == 200) {
                toast.success('Memberships reordered successfully')
                getAllMemberships()
                setReOrdering(false)
            }
        }).catch(err => {
            console.error(err)
            toast.error('Couldn\'t reorder memberships')
        })
    }

    return (
        <div className='w-full p-5'>
            {/* Add Membership Modal */}
            <HeadlessUIModalComponent
                displayState={showAddMembership}
                setDisplayState={setShowAddMembership}
                headingChildren={<span>Create New Membership</span>}
                bodyChildren={addMembershipModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleAddMembership}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddMembership(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* View Membership Modal */}
            <HeadlessUIModalComponent
                displayState={showViewMembership}
                setDisplayState={setShowViewMembership}
                headingChildren={<>
                    <BanknotesIcon className='w-8 h-8' />
                    <span>{selectedMembership?.packageName}</span>
                </>}
                bodyChildren={
                    <div className='p-4'>
                        <div className='text-left mb-5'>
                            {/* <p className='text-gray-900 flex items-center gap-3'><Squares2X2Icon className='w-5 h-5' /> {selectedMembership?.service}</p> */}
                            <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {selectedMembership?.packageAmount}</p>
                            {/* <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {selectedMembership?.duration} Mins.</p> */}
                            <p className='text-gray-900 flex items-center gap-3'><CalendarDaysIcon className='w-5 h-5' /> {selectedMembership?.packageDuration} days.</p>
                        </div>
                        <div className='text-left my-2'>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Short Desc.:</span> <br />{selectedMembership?.shortDescription}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Long Desc.: </span><br /> <span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedMembership?.longDescription }} /> </p>
                        </div>
                    </div>
                }
                footerChildren={
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        onClick={() => { setShowViewMembership(false) }}
                    >
                        Close
                    </button>
                }
            />

            {/* Edit Membership Modal */}
            <HeadlessUIModalComponent
                displayState={showEditMembership}
                setDisplayState={setShowEditMembership}
                headingChildren={<span>Edit Membership</span>}
                bodyChildren={editMembershipModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleUpdateMembership}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowEditMembership(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />


            {/* Delete Membership Modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteMembership}
                setDisplayState={setShowDeleteMembership}
                headingChildren={<span>Delete Membership</span>}
                bodyChildren={<span>Are you sure you want to delete {selectedMembershipToDelete?.name}?</span>}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { handleDeleteMembership(selectedMembershipToDelete.id) }}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeleteMembership(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Reorder Memberships Modal */}
            <HeadlessUIModalComponent
                displayState={reOrdering}
                setDisplayState={setReOrdering}
                headingChildren={<span>Reorder Memberships</span>}
                bodyChildren={reOrderPackagesModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleReorderingSave}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setReOrdering(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Memberships List */}
            <div className='flex items-center justify-between' >
                <h1 className='text-2xl'>Memberships</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setReOrdering(true) }}
                        className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                    >
                        <BarsArrowUpIcon className='h-5 w-5' /> Reorder
                    </button>
                    <button
                        onClick={() => { setShowAddMembership(true) }}
                        className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                    >
                        <PlusIcon className='h-5 w-5' /> Add New Membership
                    </button>
                </div>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <div>
                    {
                        memberships.length === 0 ?
                            <p className='mt-10 text-xl text-gray-700'>No Memberships to display{memberships.length ? ' with selected filter' : ''}!</p>
                            :
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {memberships.map((membership, index) => (
                                    <MembershipCardComponent key={index} membership={membership} />
                                ))}
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default MembershipList;