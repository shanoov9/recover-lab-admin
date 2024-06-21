import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import './packages.css'
import { Switch } from '@headlessui/react';
import { BanknotesIcon, BarsArrowUpIcon, BoltIcon, CalendarIcon, CheckIcon, ClockIcon, CurrencyRupeeIcon, EyeIcon, PencilIcon, PlusIcon, Squares2X2Icon, SquaresPlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal';
import { DELETE_ENTITY_STATUS, DISABLE_ENTITY_STATUS, ENABLE_ENTITY_STATUS, PLAN_TYPE_PACKAGE, PLAN_TYPE_SINGLE_TIME_PLAN, PLAN_VALIDITY, defaultPackageList, defaultServiceList } from '../../../../../commonServices/commonDataService';
import { frequencyList } from '../../../../../commonServices/commonDataService';
import { connect } from 'react-redux';
import { classApiService, packageTypeApiService, plansPackagesApiService } from '../../../../../commonServices/apiService';
import {
    PACKAGE_CREATED_SUCCESSFULLY,
    PACKAGE_COULDNT_CREATED,
    PACKAGE_DELETED_SUCCESSFULLY,
    PACKAGE_COULDNT_DELETED,
    PACKAGE_STATUS_UPDATED_SUCCESSFULLY,
    PACKAGE_STATUS_COULDNT_UPDATED,
} from '../../../../../commonServices/messageConstants';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../../commonServices/quillModules';
import { Reorder } from 'framer-motion';


function PackageList(props) {
    console.log('package page props', props)
    const location = useLocation();
    let params = useParams();

    const [allTreatmentServicesList, setAllTreatmentServicesList] = useState([])

    // Add Package States
    const [showAddPackage, setShowAddPackage] = useState(false);
    const [addPackageName, setAddPackageName] = useState('');
    const [addPackageShortDescription, setAddPackageShortDescription] = useState('');
    const [addPackageLongDescription, setAddPackageLongDescription] = useState('');
    const [addPackageValidity, setAddPackageValidity] = useState(PLAN_VALIDITY[0].dayCountValue);
    const [addPackageCategoryId, setAddPackageCategoryId] = useState("");
    const [addPackageContentPlan, setAddPackageContentPlan] = useState("");
    const [addPackageContentFrequency, setAddPackageContentFrequency] = useState(1);
    const [addPackageContent, setAddPackageContent] = useState([]);
    const [addPackagePrice, setAddPackagePrice] = useState('0');
    const [addPackageContentPlanType, setAddPackageContentPlanType] = useState('plan');

    // View Package States
    const [showViewPackage, setShowViewPackage] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Edit Package States
    const [showEditPackage, setShowEditPackage] = useState(false);
    const [editPackageId, setEditPackageId] = useState(null);
    const [editPackageName, setEditPackageName] = useState('');
    const [editPackageShortDescription, setEditPackageShortDescription] = useState('');
    const [editPackageLongDescription, setEditPackageLongDescription] = useState('');
    const [editPackageValidity, setEditPackageValidity] = useState(PLAN_VALIDITY[0].dayCountValue);
    const [editPackageCategoryId, setEditPackageCategoryId] = useState("");
    const [editPackageContentPlan, setEditPackageContentPlan] = useState("");
    const [editPackageContentFrequency, setEditPackageContentFrequency] = useState("");
    const [editPackageContent, setEditPackageContent] = useState([]);
    const [editPackagePrice, setEditPackagePrice] = useState('0');
    const [editPackageContentPlanType, setEditPackageContentPlanType] = useState('plan');

    // Delete Package States
    const [showDeletePackage, setShowDeletePackage] = useState(false);
    const [selectedPackageToDelete, setSelectedPackageToDelete] = useState(null);

    // Display states
    const [packages, setPackages] = useState([]);

    // plans
    const [allPlans, setAllPlans] = useState([])

    // Classes
    const [allClasses, setAllClasses] = useState([]);
    const [allClassTypes, setAllClassTypes] = useState([]);

    // Reorder Packages States
    const [reOrdering, setReOrdering] = useState(false);

    // Manage Categories States
    const [showManageCategories, setShowManageCategories] = useState(false);
    const [addCategoryName, setAddCategoryName] = useState('');
    const [allPackageCategories, setAllPackageCategories] = useState([])
    const [editingCategory, setEditingCategory] = useState(null)
    const [editingCategoryName, setEditingCategoryName] = useState('')


    const handlePackageStatusChange = (id, newStatus) => {
        console.log(id, newStatus);
        const body = {
            id: id,
            status: newStatus == true ? ENABLE_ENTITY_STATUS : DISABLE_ENTITY_STATUS
        }
        plansPackagesApiService.changePlanStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                getAllPackages()
                toast.success(PACKAGE_STATUS_UPDATED_SUCCESSFULLY)
            } else {
                toast.error(PACKAGE_STATUS_COULDNT_UPDATED)
            }
        }).catch(err => console.error(err))
    }


    useEffect(() => {
        getAllServices()
    }, [props])

    useEffect(() => {
        getAllPackages();
        getAllPackageTypes();
        getAllplans();
        getAllClassTypes();
        getAllClasses();
    }, [])

    const getAllPackageTypes = () => {
        packageTypeApiService.getAllPackageTypes().then(response => {
            console.log('all package types', response.data.data)
            if (response.data.status == true) {
                setAllPackageCategories(response.data.data)
            }
        }).catch(err => console.error(err))
    }

    const handleAddPackageType = () => {
        const body = {
            name: addCategoryName
        }
        packageTypeApiService.createPackageType(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setAllPackageCategories([...allPackageCategories, response.data.data])
                setAddCategoryName('')
                toast.success('Category added successfully')
            } else {
                toast.error('Couldn\'t add category')
            }
        }).catch(err => console.error(err))
    }

    const getAllplans = () => {
        plansPackagesApiService.getAllplans({ packageType: PLAN_TYPE_SINGLE_TIME_PLAN }).then(response => {
            console.log('all currentPlans', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllPlans(responseData)
            }
        }).catch(err => console.error(err))
    }

    const getAllClasses = () => {
        classApiService.getAllClassesComplete().then(response => {
            console.log('all classes', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllClasses(responseData)
            }
        }).catch(err => console.error(err))
    }

    const getAllClassTypes = () => {
        classApiService.getAllClassNames().then(response => {
            console.log('all class types', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                console.log(responseData);
                setAllClassTypes(responseData)
            }
        }).catch(err => console.error(err))
    }

    const getAllPackages = () => {
        const body = {
            packageType: PLAN_TYPE_PACKAGE
        }
        plansPackagesApiService.getAllplans(body).then(response => {
            console.log('all currentPlans', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setPackages(responseData)
                // setCurrentPlans(responseData)
                // console.log(responseData[0].id)
                // setAddPlanService(responseData[0].id)
                // console.log(addPlanService)
            }
        }).catch(err => console.error(err))
    }

    const getAllServices = () => {
        setAllTreatmentServicesList(props.allServices.allServicesData)
        // console.log(props.allServices.allServicesData)
        // setAddPackageService(props.allServices.allServicesData[0]?.id)
        // setServiceFilterList([...new Set(props.allServices.allServicesData.map(service => service.treatmentServiceName))])
    }

    const PackageCardComponent = ({ pack }) => {
        return (
            <div className='bg-indigo-100 flex flex-col justify-between px-4 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                <div>
                    <div className='text-center my-2'>
                        <h3 className='text-xl font-semibold'>{pack.packageName}</h3>
                    </div>
                    <div className='text-left'>
                        <p className='text-gray-900 flex items-center gap-3'><Squares2X2Icon className='w-5 h-5' /> {pack.packageTypeName}</p>
                        <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {pack.packageAmount}</p>
                        <p className='text-gray-900 flex items-center gap-3'><CalendarIcon className='w-5 h-5' /> {pack.packageDuration} Days.</p>
                        {/* <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {pack.packageTherapyTime} Mins.</p>
                        <p className='text-gray-900 flex items-center gap-3'><BoltIcon className='w-5 h-5' /> {pack.therapyFrequency} X</p> */}
                        <p className='text-sm my-3 text-gray-600'>{pack.shortDescription}</p>
                    </div>
                </div>
                <div className='my-2 flex justify-between items-center'>
                    <Switch
                        checked={pack.status}
                        onChange={(newStatus) => { handlePackageStatusChange(pack.id, newStatus) }}
                        className={`border ${pack.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${pack.status ? 'translate-x-6 bg-green-700/90' : 'translate-x-0 bg-red-700/90'} pointer-events-none text-white inline-block h-5 w-5 transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition-all duration-200 ease-in-out`}
                        >
                            {pack.status
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
                                setSelectedPackage(pack);
                                setShowViewPackage(true);
                            }}
                            className='bg-teal-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none w-full'
                        >
                            <EyeIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setEditPackageId(pack.id);
                                setEditPackageName(pack.packageName);
                                setEditPackageShortDescription(pack.shortDescription);
                                setEditPackageLongDescription(pack.longDescription);
                                setEditPackageValidity(pack.packageDuration);
                                setEditPackageCategoryId(pack.packageTypeId);
                                setEditPackageContent(pack.packageContent);
                                setEditPackagePrice(pack.packageAmount);
                                setShowEditPackage(true);

                            }}
                            className='bg-indigo-200 block items-center gap-1 font-medium text-[15px] p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none w-full'
                        >
                            <PencilIcon className='w-5 h-5 mx-auto' />
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPackageToDelete(pack);
                                setShowDeletePackage(true);
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

    const addPackageModalBody = (
        <div className='mt-4'>
            <div className='mb-2'>
                <label htmlFor='packageName' className='block text-sm font-medium text-gray-700'>Package Name</label>
                <input
                    type='text'
                    name='packageName'
                    id='packageName'
                    required
                    value={addPackageName}
                    onChange={(e) => { setAddPackageName(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='packageShortDescription' className='block text-sm font-medium text-gray-700'>Package Short Description</label>
                <input
                    type='text'
                    name='packageShortDescription'
                    id='packageShortDescription'
                    required
                    value={addPackageShortDescription}
                    onChange={(e) => { setAddPackageShortDescription(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='packageLongDescription' className='block text-sm font-medium text-gray-700'>Package Long Description</label>
                <ReactQuill
                    name='packageLongDescription'
                    id='packageLongDescription'
                    theme="snow"
                    modules={quillModules}
                    value={addPackageLongDescription}
                    onChange={(value) => { setAddPackageLongDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='packageCategoryName' className='block text-sm font-medium text-gray-700'>Package Category</label>
                <select
                    name="packageCategoryName"
                    id="packageCategoryName"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={addPackageCategoryId}
                    onChange={(e) => { setAddPackageCategoryId(parseInt(e.target.value)) }}
                >
                    <option value="">Select Category</option>
                    {allPackageCategories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className='mb-2'>
                <p className='text-sm font-medium text-gray-700'>Package Contents</p>
                <div className='grid grid-cols-1 gap-2'>
                    <div className='grid grid-cols-2 gap-2'>

                        <select
                            name='packageContentPlan'
                            id='packageContentPlan'
                            className='block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                            value={addPackageContentPlanType}
                            onChange={(e) => { setAddPackageContentPlanType(e.target.value) }}
                        >
                            <option value="plan">Plan</option>
                            <option value="class">Class</option>
                        </select>
                        <select
                            name='packageContentPlan'
                            id='packageContentPlan'
                            className='block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                            value={addPackageContentPlan}
                            onChange={(e) => { setAddPackageContentPlan(e.target.value) }}
                        >
                            <option value="">Select Plan</option>
                            {addPackageContentPlanType === 'plan' && allPlans.map((plan) => (
                                <option key={plan.id} value={plan.id}>{plan.packageName}</option>
                            ))}
                            {addPackageContentPlanType === 'class' && allClasses.map((cls) => (
                                <option key={cls.id} value={cls.id}>{cls.className} ({allClassTypes.find(ct => ct.id === cls.classType)?.className})</option>
                            ))}
                        </select>
                        <select
                            name='packageContentFrequency'
                            id='packageContentFrequency'
                            className='block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                            value={addPackageContentFrequency}
                            onChange={(e) => { setAddPackageContentFrequency(e.target.value) }}
                        >
                            <option value="" selected>Select Frequency</option>
                            {frequencyList.map((frequency) => (
                                <option key={frequency.id} value={frequency.frequency}>{frequency.frequency}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                if (addPackageContentPlan !== "" && addPackageContentFrequency !== "") {
                                    setAddPackageContent([...addPackageContent, { plan: parseInt(addPackageContentPlan), type: addPackageContentPlanType, frequency: parseInt(addPackageContentFrequency), usedFrequency: 0 }])
                                    setAddPackageContentPlan('')
                                    setAddPackageContentFrequency("")
                                } else {
                                    toast.error('Please select plan and frequency')
                                }
                            }}
                            className='bg-indigo-200 flex items-center gap-2 justify-center font-medium p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none'
                        >
                            <PlusIcon className='w-5 h-5' /> Add Item
                        </button>
                    </div>

                    {addPackageContent.map((content, index) => (
                        <div key={index} className='bg-indigo-100 flex items-center justify-between px-4 py-2 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                            <span>{allPlans.find(pln => pln.id === content.plan)?.packageName || allClasses.find(pln => pln.id === content.plan)?.className} X {content.frequency}</span>
                            <button
                                onClick={() => {
                                    setAddPackageContent(addPackageContent.filter((_, i) => i !== index))
                                }}
                                className='font-medium rounded-full text-red-900 focus:outline-none'
                            >
                                <TrashIcon className='w-5 h-5' />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {/* package validity in days */}
            <div className='mb-2'>
                <label htmlFor='packageValidity' className='block text-sm font-medium text-gray-700'>Package Validity</label>
                <select
                    name="packageValidity"
                    id="packageValidity"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={addPackageValidity}
                    onChange={(e) => { setAddPackageValidity(e.target.value) }}
                >
                    {PLAN_VALIDITY.map((validity) => (
                        <option key={validity.id} value={validity.dayCountValue}>{validity.name}</option>
                    ))}
                </select>
            </div>
            <div className='mb-2 w-full'>
                <label htmlFor='packagePrice' className='block text-sm font-medium text-gray-700'>Package Price</label>
                <input
                    type='text'
                    name='packagePrice'
                    id='packagePrice'
                    required
                    value={addPackagePrice}
                    onChange={(e) => { setAddPackagePrice(e.target.value.replace(/[^0-9]/, '')) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
        </div>
    )


    const editPackageModalBody = (
        <div className='mt-4'>
            <div className='mb-2'>
                <label htmlFor='packageName' className='block text-sm font-medium text-gray-700'>Package Name</label>
                <input
                    type='text'
                    name='packageName'
                    id='packageName'
                    required
                    value={editPackageName}
                    onChange={(e) => { setEditPackageName(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='packageShortDescription' className='block text-sm font-medium text-gray-700'>Package Short Description</label>
                <input
                    type='text'
                    name='packageShortDescription'
                    id='packageShortDescription'
                    required
                    value={editPackageShortDescription}
                    onChange={(e) => { setEditPackageShortDescription(e.target.value) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='packageLongDescription' className='block text-sm font-medium text-gray-700'>Package Long Description</label>
                <ReactQuill
                    name='packageLongDescription'
                    id='packageLongDescription'
                    theme="snow"
                    modules={quillModules}
                    value={editPackageLongDescription}
                    onChange={(value) => { setEditPackageLongDescription(value) }}
                    className='mt-[2px] block w-full border-2 border-gray-300 shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='packageCategoryName' className='block text-sm font-medium text-gray-700'>Package Category</label>
                <select
                    name="packageCategoryName"
                    id="packageCategoryName"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={editPackageCategoryId}
                    onChange={(e) => { setEditPackageCategoryId(parseInt(e.target.value)) }}
                >
                    <option value="">Select Category</option>
                    {allPackageCategories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>
            <div className='mb-2'>
                <p className='text-sm font-medium text-gray-700'>Package Contents</p>
                <div className='grid grid-cols-1 gap-2'>
                    <div className='grid grid-cols-2 gap-2'>

                        <select
                            name='packageContentPlan'
                            id='packageContentPlan'
                            className='block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                            value={editPackageContentPlanType}
                            onChange={(e) => { setEditPackageContentPlanType(e.target.value) }}
                        >
                            <option value="plan">Plan</option>
                            <option value="class">Class</option>
                        </select>
                        <select
                            name='packageContentPlan'
                            id='packageContentPlan'
                            className='block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                            value={editPackageContentPlan}
                            onChange={(e) => { setEditPackageContentPlan(e.target.value) }}
                        >
                            <option value="">Select Plan</option>
                            {editPackageContentPlanType === 'plan' && allPlans.map((plan) => (
                                <option key={plan.id} value={plan.id}>{plan.packageName}</option>
                            ))}
                            {editPackageContentPlanType === 'class' && allClasses.map((cls) => (
                                <option key={cls.id} value={cls.id}>{cls.className} ({allClassTypes.find(ct => ct.id === cls.classType)?.className})</option>
                            ))}
                        </select>
                        <select
                            name='packageContentFrequency'
                            id='packageContentFrequency'
                            className='block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                            value={editPackageContentFrequency}
                            onChange={(e) => { setEditPackageContentFrequency(e.target.value) }}
                        >
                            <option value="" selected>Select Frequency</option>
                            {frequencyList.map((frequency) => (
                                <option key={frequency.id} value={frequency.frequency}>{frequency.frequency}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => {
                                if (editPackageContentPlan !== "" && editPackageContentFrequency !== "") {
                                    setEditPackageContent([...editPackageContent, { plan: parseInt(editPackageContentPlan), type: editPackageContentPlanType, frequency: parseInt(editPackageContentFrequency), usedFrequency: 0 }])
                                    setEditPackageContentPlan('')
                                    setEditPackageContentFrequency("")
                                } else {
                                    toast.error('Please select plan and frequency')
                                }
                            }}
                            className='bg-indigo-200 flex items-center gap-2 justify-center font-medium p-2 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none'
                        >
                            <PlusIcon className='w-5 h-5' /> Add Item
                        </button>
                    </div>

                    {editPackageContent.map((content, index) => (
                        <div key={index} className='bg-indigo-100 flex items-center justify-between px-4 py-2 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                            <span>{allPlans.find(pln => pln.id === content.plan)?.packageName || allClasses.find(pln => pln.id === content.plan)?.className} X {content.frequency}</span>
                            <button
                                onClick={() => {
                                    setEditPackageContent(editPackageContent.filter((_, i) => i !== index))
                                }}
                                className='font-medium rounded-full text-red-900 focus:outline-none'
                            >
                                <TrashIcon className='w-5 h-5' />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            {/* package validity in days */}
            <div className='mb-2'>
                <label htmlFor='packageValidity' className='block text-sm font-medium text-gray-700'>Package Validity</label>
                <select
                    name="packageValidity"
                    id="packageValidity"
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    value={editPackageValidity}
                    onChange={(e) => { setEditPackageValidity(e.target.value) }}
                >
                    {PLAN_VALIDITY.map((validity) => (
                        <option key={validity.id} value={validity.dayCountValue}>{validity.name}</option>
                    ))}
                </select>
            </div>
            <div className='mb-2 w-full'>
                <label htmlFor='packagePrice' className='block text-sm font-medium text-gray-700'>Package Price</label>
                <input
                    type='text'
                    name='packagePrice'
                    id='packagePrice'
                    required
                    value={editPackagePrice}
                    onChange={(e) => { setEditPackagePrice(e.target.value.replace(/[^0-9]/, '')) }}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
        </div>
    )

    const reOrderPackagesModalBody = (
        <div>
            <Reorder.Group
                as="ul"
                values={packages}
                onReorder={setPackages}
                className="flex flex-col gap-2"
            >
                {packages.map((plan, index) => (
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

    const handleReorderingSave = () => {
        const body = packages.map((plan, index) => {
            return {
                id: plan.id,
            }
        })
        plansPackagesApiService.updateOrder(body).then(response => {
            if (response.data.status == 200) {
                toast.success('Packages reordered successfully')
                getAllPackages()
                setReOrdering(false)
            }
        }).catch(err => {
            console.error(err)
            toast.error('Couldn\'t reorder packages')
        })
    }

    const handleAddPackage = (e) => {
        e.preventDefault();
        if (addPackageName.trim() === '' || addPackageShortDescription.trim() === '' || addPackageLongDescription.trim() === '' || addPackagePrice.trim() === '' || addPackageContent.length === 0 || addPackageCategoryId === "") {
            toast.error('Please fill all the fields')
            return;
        }

        const body = {
            packageType: PLAN_TYPE_PACKAGE,
            treatmentServiceID: null,
            packageName: addPackageName,
            packageAmount: parseFloat(addPackagePrice),
            packageDuration: addPackageValidity,
            shortDescription: addPackageShortDescription,
            longDescription: addPackageLongDescription,
            therapyFrequency: null,
            packageTherapyTime: null,
            treatmentServiceName: null,
            packageContent: addPackageContent,
            packageTypeId: addPackageCategoryId,
            packageTypeName: allPackageCategories.find(category => category.id === addPackageCategoryId).name,
            orderIndex: packages.length,

        }
        console.log(body)
        plansPackagesApiService.createPlanPackage(body).then(response => {
            if (response.data.status == true) {
                console.log(response.data)
                const responseData = response.data.data
                getAllPackages()
                setShowAddPackage(false);
                setAddPackageName('');
                setAddPackageShortDescription('');
                setAddPackageLongDescription('');
                setAddPackagePrice('0');
                setAddPackageCategoryId('');
                setAddPackageContent([]);
                setAddPackageContentPlan('');
                setAddPackageContentFrequency("");
                toast.success(PACKAGE_CREATED_SUCCESSFULLY)

            } else {
                setShowAddPackage(false);
                toast.error(PACKAGE_COULDNT_CREATED)
            }
        }).catch(err => console.error(err))






        // console.log(addPackageName, addPackageShortDescription, addPackageLongDescription, parseFloat(addPackagePrice), addPackageDuration);
        // let maxId = Math.max(...packages.map(pack => pack.id));
        // setPackages([...packages, {
        //     id: maxId + 1,
        //     name: addPackageName,
        //     shortDescription: addPackageShortDescription,
        //     longDescription: addPackageLongDescription,
        //     service: addPackageService,
        //     frequency: parseInt(addPackageFrequency),
        //     status: false,
        //     price: parseInt(addPackagePrice),
        //     duration: parseInt(addPackageDuration)
        // }])
        // setShowAddPackage(false);
        // setAddPackageName('');
        // setAddPackageShortDescription('');
        // setAddPackageLongDescription('');
        // setAddPackageService(defaultServiceList[0].title);
        // setAddPackageFrequency(frequencyList[0].frequency);
        // setAddPackagePrice('0');
        // setAddPackageDuration('0');
    }

    const handleDeletePackage = (id) => {
        const body = {
            id: id,
            status: DELETE_ENTITY_STATUS
        }
        plansPackagesApiService.changePlanStatus(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                getAllPackages()
                setShowDeletePackage(false)
                toast.success(PACKAGE_DELETED_SUCCESSFULLY)
            } else {
                setShowDeletePackage(false)
                toast.error(PACKAGE_COULDNT_DELETED)
            }
        }).catch(err => console.error(err))
    }

    const manageCategoriesModalBodyJSX = (
        <div className='mt-4'>
            <div className="flex items-center justify-evenly w-full">
                <div className='mb-2'>
                    <label htmlFor='categoryName' className='block text-sm font-medium text-gray-700'>Category Name</label>
                    <input
                        type='text'
                        name='categoryName'
                        id='categoryName'
                        required
                        value={addCategoryName}
                        onChange={(e) => { setAddCategoryName(e.target.value) }}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                <button
                    disabled={addCategoryName.trim() === ''}
                    onClick={handleAddPackageType}
                    className='bg-indigo-200 disabled:bg-gray-200 disabled:text-gray-600 font-medium mt-3 px-3 py-1.5 rounded-full hover:bg-indigo-300 text-indigo-900 focus:outline-none'
                >
                    Add Category
                </button>
            </div>

            <div className='mt-5'>
                <h3 className='text-lg font-semibold'>All Categories</h3>
                <div className='grid grid-cols-1 gap-2'>
                    {allPackageCategories.map((category) => (
                        <div key={category.id} className='bg-indigo-100 flex items-center justify-between px-4 py-2 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                            {editingCategory === category.id
                                ?
                                <input
                                    type='text'
                                    value={editingCategoryName}
                                    onChange={(e) => { setEditingCategoryName(e.target.value) }}
                                    className='w-3/4 px-2 py-1 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                                />
                                :
                                <span>{category.name}</span>
                            }

                            <div className='flex gap-1'>
                                {editingCategory === category.id
                                    ?
                                    <button
                                        onClick={() => { handleUpdatePackageType(category.id) }}
                                        className='bg-teal-200 font-medium p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none'
                                    >
                                        <CheckIcon className='w-5 h-5' />
                                    </button>
                                    :
                                    <button
                                        onClick={() => {
                                            setEditingCategory(category.id)
                                            setEditingCategoryName(category.name)
                                        }}
                                        className='bg-teal-200 font-medium p-2 rounded-full hover:bg-teal-300 text-teal-900 focus:outline-none'
                                    >
                                        <PencilIcon className='w-5 h-5' />
                                    </button>}
                                <button
                                    onClick={() => { handleDeletePackageType(category.id) }}
                                    className='bg-red-200 font-medium p-2 rounded-full hover:bg-red-300 text-red-900 focus:outline-none'
                                >
                                    <TrashIcon className='w-5 h-5' />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const handleDeletePackageType = (id) => {
        packageTypeApiService.deletePackageType(id).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setAllPackageCategories(allPackageCategories.filter(category => category.id !== id))
                toast.success('Category deleted successfully')
            } else {
                toast.error('Couldn\'t delete category')
            }
        }).catch(err => console.error(err))
    }

    const handleUpdatePackageType = (id) => {
        if (editingCategoryName.trim() === '') {
            toast.error('Category name can\'t be empty')
            return;
        }
        packageTypeApiService.updatePackageType({ id, name: editingCategoryName }).then(response => {
            console.log(response)
            if (response.data.status == true) {
                getAllPackageTypes()
                setEditingCategory(null)
                setEditingCategoryName('')
                toast.success('Category updated successfully')
            } else {
                toast.error('Couldn\'t update category')
            }
        }).catch(err => console.error(err))
    }

    const handleUpdatePackage = (e) => {
        e.preventDefault();
        if (editPackageName.trim() === '' || editPackageShortDescription.trim() === '' || editPackageLongDescription.trim() === '' || editPackagePrice.trim() === '' || editPackageContent.length === 0 || editPackageCategoryId === "") {
            toast.error('Please fill all the fields')
            return;
        }

        const body = {
            id: editPackageId,
            packageName: editPackageName,
            packageAmount: parseFloat(editPackagePrice),
            packageDuration: editPackageValidity,
            shortDescription: editPackageShortDescription,
            longDescription: editPackageLongDescription,
            packageContent: editPackageContent,
            packageTypeId: editPackageCategoryId,
            packageTypeName: allPackageCategories.find(category => category.id === editPackageCategoryId).name,
        }
        plansPackagesApiService.updatePlan(body).then(response => {
            if (response.data.status == true) {
                console.log(response.data)
                getAllPackages()
                setShowEditPackage(false);
                setEditPackageName('');
                setEditPackageShortDescription('');
                setEditPackageLongDescription('');
                setEditPackagePrice('0');
                setEditPackageCategoryId('');
                setEditPackageContent([]);
                setEditPackageContentPlan('');
                setEditPackageContentFrequency(1);
                toast.success("Package updated successfully")

            } else {
                setShowEditPackage(false);
                toast.error("Couldn't update package")
            }
        }).catch(err => console.error(err))

    }

    return (
        <div className='w-full p-5'>
            {/* Add Package Modal */}
            <HeadlessUIModalComponent
                displayState={showAddPackage}
                setDisplayState={setShowAddPackage}
                headingChildren={<span>Create New Package</span>}
                bodyChildren={addPackageModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleAddPackage}
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddPackage(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* View Package Modal */}
            <HeadlessUIModalComponent
                displayState={showViewPackage}
                setDisplayState={setShowViewPackage}
                headingChildren={<>
                    <BanknotesIcon className='w-8 h-8' />
                    <span>{selectedPackage?.packageName}</span>
                </>}
                bodyChildren={
                    <div className='p-4'>
                        <div className='text-left mb-5'>
                            <p className='text-gray-900 flex items-center gap-3'><Squares2X2Icon className='w-5 h-5' /> {selectedPackage?.packageTypeName}</p>
                            <p className='text-gray-900 flex items-center gap-3'><BanknotesIcon className='w-5 h-5' /> QAR {selectedPackage?.packageAmount}</p>
                            <p className='text-gray-900 flex items-center gap-3'><CalendarIcon className='w-5 h-5' /> {selectedPackage?.packageDuration} Days.</p>
                            {/* <p className='text-gray-900 flex items-center gap-3'><ClockIcon className='w-5 h-5' /> {selectedPackage?.packageTherapyTime} Mins.</p>
                            <p className='text-gray-900 flex items-center gap-3'><BoltIcon className='w-5 h-5' /> {selectedPackage?.therapyFrequency} X</p> */}
                        </div>
                        <div className='text-left my-2'>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Package Contents:</span> </p>
                            <div className='grid grid-cols-1 gap-2'>
                                {selectedPackage?.packageContent.map((content, index) => (
                                    <div key={index} className='bg-indigo-100 flex items-center justify-between px-4 py-2 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                                        <span>{allPlans.find(pln => pln.id === content.plan)?.packageName || allClasses.find(pln => pln.id === content.plan)?.className}</span>
                                        <span>{content.frequency} X {allPlans.find(pln => pln.id === content.plan)?.packageTherapyTime || allClasses.find(pln => pln.id === content.plan)?.classDuration} mins.</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='text-left my-2'>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Short Desc.:</span> <br />{selectedPackage?.shortDescription}</p>
                            <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Long Desc.: </span><br /><span className='no-tailwind' dangerouslySetInnerHTML={{ __html: selectedPackage?.longDescription }} /></p>
                        </div>
                    </div>
                }
                footerChildren={
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        onClick={() => { setShowViewPackage(false) }}
                    >
                        Close
                    </button>
                }
            />

            {/* Edit Package Modal */}
            <HeadlessUIModalComponent
                displayState={showEditPackage}
                setDisplayState={setShowEditPackage}
                headingChildren={<span>Edit Package</span>}
                bodyChildren={editPackageModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleUpdatePackage}
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowEditPackage(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Delete Package Modal */}
            <HeadlessUIModalComponent
                displayState={showDeletePackage}
                setDisplayState={setShowDeletePackage}
                headingChildren={<span>Delete Package</span>}
                bodyChildren={<span>Are you sure you want to delete {selectedPackageToDelete?.name}?</span>}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { handleDeletePackage(selectedPackageToDelete.id) }}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeletePackage(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Reorder Packages Modal */}
            <HeadlessUIModalComponent
                displayState={reOrdering}
                setDisplayState={setReOrdering}
                headingChildren={<span>Reorder Packages</span>}
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

            {/* Manage Categories Modal */}
            <HeadlessUIModalComponent
                displayState={showManageCategories}
                setDisplayState={setShowManageCategories}
                headingChildren={<span>Manage Categories</span>}
                bodyChildren={manageCategoriesModalBodyJSX}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowManageCategories(false) }}
                        >
                            Close
                        </button>
                    </div>
                }
            />

            {/* Packages List */}
            <div className='flex items-center justify-between' >
                <h1 className='text-2xl'>Packages</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setShowManageCategories(true) }}
                        className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                    >
                        <SquaresPlusIcon className='w-5 h-5' /> Manage Categories
                    </button>

                    <button
                        onClick={() => { setReOrdering(true) }}
                        className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                    >
                        <BarsArrowUpIcon className='w-5 h-5' /> Reorder
                    </button>

                    <button
                        onClick={() => { setShowAddPackage(true) }}
                        className='bg-indigo-300 flex items-center gap-1 font-medium text-[15px] py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 focus:outline-none'
                    >
                        <PlusIcon className='h-5 w-5' /> Add New Package
                    </button>
                </div>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <div>
                    {
                        packages.length === 0 ?
                            <p className='mt-10 text-xl text-gray-700'>No packages to display{packages.length ? ' with selected filter' : ''}!</p>
                            :
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {packages.map((pack, index) => (
                                    <PackageCardComponent key={index} pack={pack} />
                                ))}
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    allServices: state.allServices
})

export default connect(mapStateToProps, null)(PackageList);