import { ArrowPathIcon, CheckIcon, MinusCircleIcon, PlusCircleIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import './services.css'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal';
import { toast } from 'react-toastify';
import { IMAGE_UPDATED_SUCCESSFULLY, PAGE_UPDATED_SUCCESSFULLY, SERVICE_COULDNT_DELETED, SERVICE_DELETED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants';
import { TreatmentServiceApis, imageFileServiceApi, pageDetailApiService, plansPackagesApiService } from '../../../../../commonServices/apiService';
import { connect } from 'react-redux';
import { addNewService_Action, deleteService_Action } from '../../../../../commonServices/Actions/actions';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../../commonServices/quillModules';
import { IMAGE_BASE_URL, PLAN_TYPE_MEMBERSHIP, PLAN_TYPE_PACKAGE, PLAN_TYPE_SINGLE_TIME_PLAN } from '../../../../../commonServices/commonDataService';

const EditService = (props) => {

    const navigate = useNavigate();

    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // Service related states
    const [serviceId, setServiceId] = useState(params.id);
    const [serviceTitle, setServiceTitle] = useState(searchParams.get('title'));
    // Pilot Block States
    const [pilotBlockImage, setPilotBlockImage] = useState(null);
    const [pilotBlockTitle, setPilotBlockTitle] = useState('');
    const [pilotBlockDescription, setPilotBlockDescription] = useState('');

    // Content Block States
    const [contentBlocks, setContentBlocks] = useState([{ title: '', description: '', image: null }]);

    // Delete service states
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

    const [currentPlan, setCurrentPlan] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentPackage, setCurrentPackage] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [currentMembership, setCurrentMembership] = useState('');
    const [selectedMembership, setSelectedMembership] = useState(null);

    const [allPlans, setAllPlans] = useState([])
    const [allPackages, setAllPackages] = useState([])
    const [allMemberships, setAllMemberships] = useState([])

    // Pricing block states
    // const allPlans = [
    //     { id: 1, title: 'Plan 1', service_id: 1, description: 'Plan 1 Description' },
    //     { id: 2, title: 'Plan 2', service_id: 1, description: 'Plan 2 Description' },
    //     { id: 3, title: 'Plan 3', service_id: 16, description: 'Plan 3 Description' },
    //     { id: 4, title: 'Plan 4', service_id: 1, description: 'Plan 4 Description' },
    //     { id: 5, title: 'Plan 5', service_id: 16, description: 'Plan 5 Description' },
    //     { id: 6, title: 'Plan 6', service_id: 1, description: 'Plan 6 Description' },
    //     { id: 7, title: 'Plan 7', service_id: 16, description: 'Plan 7 Description' },
    // ];
    // const allPackages = [
    //     { id: 1, title: 'Package 1', service_id: 1, description: 'Package 1 Description' },
    //     { id: 2, title: 'Package 2', service_id: 1, description: 'Package 2 Description' },
    //     { id: 3, title: 'Package 3', service_id: 16, description: 'Package 3 Description' },
    //     { id: 4, title: 'Package 4', service_id: 1, description: 'Package 4 Description' },
    //     { id: 5, title: 'Package 5', service_id: 16, description: 'Package 5 Description' },
    //     { id: 6, title: 'Package 6', service_id: 1, description: 'Package 6 Description' },
    //     { id: 7, title: 'Package 7', service_id: 16, description: 'Package 7 Description' },
    // ];
    // const allMemberships = [
    //     { id: 1, title: 'Membership 1', service_id: 1, description: 'Membership 1 Description' },
    //     { id: 2, title: 'Membership 2', service_id: 1, description: 'Membership 2 Description' },
    //     { id: 3, title: 'Membership 3', service_id: 16, description: 'Membership 3 Description' },
    //     { id: 4, title: 'Membership 4', service_id: 1, description: 'Membership 4 Description' },
    //     { id: 5, title: 'Membership 5', service_id: 16, description: 'Membership 5 Description' },
    //     { id: 6, title: 'Membership 6', service_id: 1, description: 'Membership 6 Description' },
    //     { id: 7, title: 'Membership 7', service_id: 16, description: 'Membership 7 Description' },
    // ];

    useEffect(() => {
        // load prefilled page details
        getPageDetail()


        getAllPlans()
        getAllPackages()
        getAllMemberships()
    }, [])

    const getAllPlans = () => {
        const body = {
            packageType: PLAN_TYPE_SINGLE_TIME_PLAN
        }
        plansPackagesApiService.getAllplans(body).then(response => {
            console.log('all current Plans', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllPlans(responseData)
            }
        }).catch(err => console.error(err))
    }

    const getAllPackages = () => {
        const body = {
            packageType: PLAN_TYPE_PACKAGE
        }
        plansPackagesApiService.getAllplans(body).then(response => {
            console.log('all current Packages', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllPackages(responseData)
                // setPackages(responseData)
                // setCurrentPlans(responseData)
                // console.log(responseData[0].id)
                // setAddPlanService(responseData[0].id)
                // console.log(addPlanService)
            }
        }).catch(err => console.error(err))
    }

    const getAllMemberships = () => {
        const body = {
            packageType: PLAN_TYPE_MEMBERSHIP
        }
        plansPackagesApiService.getAllplans(body).then(response => {
            console.log('all memberships', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllMemberships(responseData)
                // setMemberships(responseData)
                // setCurrentPlans(responseData)
                // console.log(responseData[0].id)
                // setAddPlanService(responseData[0].id)
                // console.log(addPlanService)
            }
        }).catch(err => console.error(err))
    }

    const getPageDetail = () => {
        const body = {
            pageTitle: serviceTitle.toUpperCase()
        }
        pageDetailApiService.getPageDetails(body).then((response) => {
            if (response.data.status == true) {
                const responseData = response.data.data
                const responsePageData = responseData.pageData
                console.log(responsePageData)
                // setUpdateData(responsePageData)
                setUpdateData(responsePageData)

            }
        }).catch(err => console.error(err))
    }

    const setUpdateData = (pageData) => {

        setPilotBlockTitle(pageData?.pilotBlockData?.pilotBlolckHeading)
        setPilotBlockDescription(pageData?.pilotBlockData?.pilotBlockDescription)
        setPilotBlockImage(pageData?.pilotBlockData?.pilotBlockImage)
        setContentBlocks(pageData?.contentBlockData?.content)

        setSelectedPlan(pageData?.pricingBlockData?.plan)
        setSelectedPackage(pageData?.pricingBlockData?.package)
        setSelectedMembership(pageData?.pricingBlockData.membership)
    }



    const addContentBlock = () => {
        setContentBlocks([...contentBlocks, { title: '', description: '', image: null }]);
    }

    const removeContentBlock = (index) => {
        setContentBlocks(contentBlocks.filter((_, i) => i !== index));
    }

    const handleContentBlockChange = (index, key, value) => {
        const updatedContentBlocks = [...contentBlocks];
        updatedContentBlocks[index][key] = value;
        setContentBlocks(updatedContentBlocks);
    }

    const handleSaveService = (e) => {

        let data = {
            pilotBlockData: {
                pilotBlockImage: pilotBlockImage,
                pilotBlolckHeading: pilotBlockTitle,
                pilotBlockDescription: pilotBlockDescription
            },
            contentBlockData: {
                content: contentBlocks,
                isenabled: true
            },
            pricingBlockData: {
                plan: selectedPlan,
                package: selectedPackage,
                membership: selectedMembership,
                isenabled: true
            }
        }
        console.log(data)
        console.log(serviceTitle, serviceId)

        const body = {
            treatmentServiceId : serviceId,
            pageTitle: serviceTitle.toUpperCase(),
            pageData: data,
            pageType: "SERVICE",
            status: 1
        }

        e.preventDefault();
        pageDetailApiService.savePageDetails(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                toast.success(PAGE_UPDATED_SUCCESSFULLY)
                navigate('/pages')
            }
        }).catch(err => console.error(err))



    }
    // After image upload
    const saveServiceData = () => {

        let data = {
            pilotBlockData: {
                pilotBlockImage: pilotBlockImage,
                pilotBlolckHeading: pilotBlockTitle,
                pilotBlockDescription: pilotBlockDescription
            },
            contentBlockData: {
                content: contentBlocks,
                isenabled: true
            },
            pricingBlockData: {
                plan: selectedPlan,
                package: selectedPackage,
                membership: selectedMembership,
                isenabled: true
            }
        }
        console.log(data)
        console.log(serviceTitle, serviceId)

        const body = {
            pageTitle: serviceTitle.toUpperCase(),
            pageData: data,
            pageType: "SERVICE",
            status: 1
        }

        pageDetailApiService.savePageDetails(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                toast.success(IMAGE_UPDATED_SUCCESSFULLY)
            }
        }).catch(err => console.error(err))



    }

    const deleteTreatmentServicePage = () => {
        const body = {
            id: serviceId,
            removeService: true
        }
        TreatmentServiceApis.deleteTreatmentPage(body).then(response => {
            if (response.data.status == true) {
                props.deleteServiceHAndler(body)
                setShowConfirmDeleteModal(false)
                toast.success(SERVICE_DELETED_SUCCESSFULLY)
                navigate('/pages')
            }
        }).catch(err => {
            console.error(err);
            toast.error(SERVICE_COULDNT_DELETED)
        })
    }



    const uploadDynamicContentPics = (block, prevImage, imageFile, classId, key) => {
        let prev = null
        if (prevImage != null) {
            prev = prevImage.split("/").pop()
        }

        console.log('prevImage', prev)
        console.log('imagefile :', imageFile)
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("prevImageName", prev)
        console.log(formData.value)
        imageFileServiceApi.uploadImage(formData).then(responseData => {

            console.log(responseData)
            if (responseData) {
                if (block == 'CONTENTBLOCK') {
                    handleContentBlockChange(classId, key, IMAGE_BASE_URL + responseData.data.data.filename)
                    saveServiceData()
                }
            }


        }).catch(err => console.error(err))

    }


    const uploadPic = (block, prevImage, imageFile) => {
        let prev = null
        if (prevImage != null) {
            prev = prevImage.split("/").pop()
        }

        console.log('prevImage', prev)
        console.log('imagefile :', imageFile)
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("prevImageName", prev)
        imageFileServiceApi.uploadImage(formData).then(responseData => {

            console.log(responseData)
            if (responseData) {
                if (block == 'PILOTBLOCK') {
                    setPilotBlockImage(IMAGE_BASE_URL + responseData.data.data.filename)
                    saveServiceData()
                }
            }
        }).catch(err => console.error(err))

    }


    return (
        <div className='p-5'>
            <HeadlessUIModalComponent
                displayState={showConfirmDeleteModal}
                setDisplayState={setShowConfirmDeleteModal}
                headingChildren={<span>Confirm Remove Page</span>}
                bodyChildren={<div>
                    <span> Do you really want to Delete <b>{serviceTitle}</b> Treatment Service page .. ? </span>
                </div>}
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
            <h1 className='text-2xl mb-5 font-semibold'>{serviceTitle}</h1>
            {/* Pilot Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Pilot Block</p>
                    <p className='text-gray-600'>This content will be on top of the landing page.</p>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mx-auto mb-3'>
                        <label htmlFor="pilotPageImageUpload" className='w-96 group block mx-auto cursor-pointer relative'>
                            {pilotBlockImage === null ? (
                                <div className='w-96 h-52 text-gray-600 flex flex-col items-center justify-center gap-5 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer'>
                                    <PlusCircleIcon className='w-8 h-8 text-gray-500' /> Select Image
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={pilotBlockImage}
                                        alt=''
                                        className='w-96 h-52 object-cover rounded-lg cursor-pointer'
                                    />
                                    <div className='absolute top-0 left-0 bg-black/50 w-full h-full rounded-lg hidden group-hover:flex justify-center items-center'>
                                        <button
                                            className='border flex items-center gap-1 border-white py-1 px-3 rounded-lg mr-2 text-white hover:bg-white hover:text-black hover:shadow-lg'
                                            onClick={(e) => {
                                                e.target.parentNode.click();
                                            }}
                                        >
                                            <ArrowPathIcon className='w-6' /> Change
                                        </button>
                                    </div>
                                </>
                            )}
                            < input
                                type="file"
                                accept='image/*'
                                className='hidden'
                                id='pilotPageImageUpload'
                                onChange={(e) => {
                                    uploadPic('PILOTBLOCK', pilotBlockImage, e.target.files[0])
                                    // if (e.target.files.length > 0) setPilotBlockImage(e.target.files[0]);
                                }}
                            />

                        </label>
                    </div>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="pilotPageTitle"
                            className='block'
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id='pilotPageTitle'
                            placeholder='Pilot Block Title...'
                            value={pilotBlockTitle}
                            onChange={(e) => setPilotBlockTitle(e.target.value)}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="pilotPageDescription"
                            className='block'
                        >
                            Description
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={pilotBlockDescription}
                            onChange={setPilotBlockDescription}
                            modules={quillModules}
                            className='w-full border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                        />
                    </div>

                </div>
            </div>
            {/* Content Block(s) */}
            <div className="flex flex-col border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex gap-5 w-full mb-5 items-center'>
                    <p className='text-xl text-black'>Content Block(s)</p>
                    <p className='text-gray-600'>This content will be below pilot block</p>
                </div>
                <div className='w-full select-none p-3'>

                    {contentBlocks.map((contentBlock, index) => (

                        <div key={index} className='w-full flex select-none border border-gray-500 p-3 my-3 rounded-md'>

                            <div className='flex flex-col justify-evenly w-1/4'>
                                <div className='flex flex-col gap-3'>
                                    <p className='text-xl text-black'>Content Block #{index + 1}</p>
                                    <p className='text-gray-600'>This content will be on top of the landing page.</p>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    {contentBlocks.length < 5
                                        ?
                                        <button
                                            className='border flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700'
                                            onClick={addContentBlock}
                                        >
                                            <PlusCircleIcon className='w-6' /> Add Content Block
                                        </button>
                                        :
                                        <p className='text-sm text-gray-600'>
                                            Only upto 5 content blocks are allowed
                                        </p>
                                    }
                                    {contentBlocks.length > 1
                                        ?
                                        <button
                                            className='flex items-center justify-center gap-2 bg-indigo-300 text-indigo-900 px-3 py-1 rounded-lg hover:bg-indigo-400'
                                            onClick={() => { removeContentBlock(index) }}
                                        >
                                            <MinusCircleIcon className='w-6' /> Remove Content Block
                                        </button>
                                        :
                                        <p className='text-sm text-gray-600'>
                                            At least one content block is required
                                        </p>
                                    }

                                </div>
                            </div>
                            <div className='w-3/4'>
                                <div className='mx-auto mb-3'>
                                    <label htmlFor={`contentPageImageUpload_${index}`} className='w-96 group block mx-auto cursor-pointer relative'>
                                        {contentBlock.image === null ? (
                                            <div className='w-96 h-52 text-gray-600 flex flex-col items-center justify-center gap-5 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer'>
                                                <PlusCircleIcon className='w-8 h-8 text-gray-500' /> Select Image
                                            </div>
                                        ) : (
                                            <>
                                                <img
                                                    src={contentBlock.image}
                                                    alt=''
                                                    className='w-96 h-52 object-cover rounded-lg cursor-pointer'
                                                />
                                                <div className='absolute top-0 left-0 bg-black/50 w-full h-full rounded-lg hidden group-hover:flex justify-center items-center'>
                                                    <button
                                                        className='border flex items-center gap-1 border-white py-1 px-3 rounded-lg mr-2 text-white hover:bg-white hover:text-black hover:shadow-lg'
                                                        onClick={(e) => {
                                                            e.target.parentNode.click();
                                                        }}
                                                    >
                                                        <ArrowPathIcon className='w-6' /> Change
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                        < input
                                            type="file"
                                            accept='image/*'
                                            className='hidden'
                                            id={`contentPageImageUpload_${index}`}
                                            onChange={(e) => {
                                                uploadDynamicContentPics('CONTENTBLOCK', contentBlock.image, e.target.files[0], index, 'image')
                                                // if (e.target.files.length > 0) handleContentBlockChange(index, 'image', e.target.files[0]);
                                            }}
                                        />

                                    </label>
                                </div>
                                <div className='mb-3 w-1/2 mx-auto text-left'>
                                    <label
                                        htmlFor={`contentTitle_${index}`}
                                        className='block'
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id={`contentTitle_${index}`}
                                        placeholder={`Content Block ${index + 1} Title...`}
                                        value={contentBlock.title}
                                        onChange={(e) => handleContentBlockChange(index, 'title', e.target.value)}
                                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                    />
                                </div>
                                <div className='mb-3 w-1/2 mx-auto text-left'>
                                    <label
                                        htmlFor={`contentDescription_${index}`}
                                        className='block'
                                    >
                                        Description
                                    </label>
                                    <ReactQuill
                                        id={`contentDescription_${index}`}
                                        theme="snow"
                                        value={contentBlock.description}
                                        onChange={(value) => handleContentBlockChange(index, 'description', value)}
                                        modules={quillModules}
                                        className='w-full border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                                    />
                                </div>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
            {/* Pricing Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Pricing Block</p>
                    <p className='text-gray-600'>Select 3 packages of {serviceTitle} service to display on service page.</p>
                </div>
                <div className='w-3/4 select-none'>
                    {/* Plan */}
                    <div>
                        <div className='mb-3 w-3/4 mx-auto flex items-center gap-3 text-left'>
                            <label
                                htmlFor="currentPlan"
                                className='block'
                            >
                                Select Plan
                            </label>
                            <select
                                id='currentPlan'
                                value={currentPlan}
                                onChange={(e) => setCurrentPlan(e.target.value)}
                                className='border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            >
                                <option value='' disabled>Select Plan</option>
                                {allPlans.filter(elem => elem.treatmentServiceID === parseInt(serviceId)).map((packageItem) => (
                                    <option key={packageItem.id} value={packageItem.id}>{packageItem.packageName} - price {packageItem.packageAmount}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    if (currentPlan !== '') {
                                        setSelectedPlan(allPlans.find(plan => plan.id === parseInt(currentPlan)))
                                    }
                                }}
                                disabled={selectedPlan !== null || currentPlan === ''}
                                className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 disabled:bg-gray-300 disabled:text-gray-700 px-4 py-2 rounded-lg '
                            >
                                <PlusIcon className='w-5 h-5' /> Add Plan
                            </button>
                        </div>
                        <div className='mb-3 w-3/4 mx-auto text-left'>
                            <label
                                htmlFor="selectedPackages"
                                className='block mb-4 text-lg font-medium'
                            >
                                Selected Plan
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {selectedPlan !== null && <div className='flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg'>
                                    {selectedPlan?.packageName}
                                    <button
                                        onClick={() => setSelectedPlan(null)}
                                        className='text-white hover:bg-white hover:text-black hover:shadow-lg p-0.5 rounded-full'
                                    >
                                        <XMarkIcon className='w-5 h-5' />
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <hr class="h-px my-8 border-0 bg-gray-400" />
                    {/* Package */}
                    <div>
                        <div className='mb-3 w-3/4 mx-auto flex items-center gap-3 text-left'>
                            <label
                                htmlFor="currentPackage"
                                className='block'
                            >
                                Select Package
                            </label>
                            <select
                                id='currentPackage'
                                value={currentPackage}
                                onChange={(e) => setCurrentPackage(e.target.value)}
                                className='border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            >
                                <option value='' disabled>Select Package</option>
                                {allPackages.filter(elem => elem.treatmentServiceID === parseInt(serviceId)).map((packageItem) => (
                                    <option key={packageItem.id} value={packageItem.id}>{packageItem.packageName} - price {packageItem.packageAmount}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    if (currentPackage !== '') {
                                        // setSelectedPackage(currentPackage);
                                        setSelectedPackage(allPackages.find(plan => plan.id === parseInt(currentPackage)))

                                    }
                                }}
                                disabled={selectedPackage !== null || currentPackage === ''}
                                className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 disabled:bg-gray-300 disabled:text-gray-700 px-4 py-2 rounded-lg '
                            >
                                <PlusIcon className='w-5 h-5' /> Add Package
                            </button>
                        </div>
                        <div className='mb-3 w-3/4 mx-auto text-left'>
                            <label
                                htmlFor="selectedPackages"
                                className='block mb-4 text-lg font-medium'
                            >
                                Selected Package
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {selectedPackage !== null && <div className='flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg'>
                                    {selectedPackage?.packageName}
                                    <button
                                        onClick={() => setSelectedPackage(null)}
                                        className='text-white hover:bg-white hover:text-black hover:shadow-lg p-0.5 rounded-full'
                                    >
                                        <XMarkIcon className='w-5 h-5' />
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <hr class="h-px my-8 border-0 bg-gray-400" />
                    {/* membership */}
                    <div>
                        <div className='mb-3 w-3/4 mx-auto flex items-center gap-3 text-left'>
                            <label
                                htmlFor="currentMembership"
                                className='block'
                            >
                                Select Membership
                            </label>
                            <select
                                id='currentMembership'
                                value={currentMembership}
                                onChange={(e) => setCurrentMembership(e.target.value)}
                                className='border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            >
                                <option value='' disabled >Select Membership</option>
                                {allMemberships.map((packageItem) => (
                                    <option key={packageItem.id} value={packageItem.id}>{packageItem.packageName} - price {packageItem.packageAmount}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    if (currentMembership !== '') {
                                        // setSelectedMembership(currentMembership);
                                        setSelectedMembership(allMemberships.find(plan => plan.id === parseInt(currentMembership)))

                                    }
                                }}
                                disabled={selectedMembership !== null || currentMembership === ''}
                                className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 disabled:bg-gray-300 disabled:text-gray-700 px-4 py-2 rounded-lg '
                            >
                                <PlusIcon className='w-5 h-5' /> Add Membership
                            </button>
                        </div>
                        <div className='mb-3 w-3/4 mx-auto text-left'>
                            <label
                                htmlFor="selectedPackages"
                                className='block mb-4 text-lg font-medium'
                            >
                                Selected Package
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {selectedMembership !== null && <div className='flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg'>
                                    {selectedMembership?.packageName}
                                    <button
                                        onClick={() => setSelectedMembership(null)}
                                        className='text-white hover:bg-white hover:text-black hover:shadow-lg p-0.5 rounded-full'
                                    >
                                        <XMarkIcon className='w-5 h-5' />
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-3 justify-end my-5'>
                <button
                    onClick={() => { setShowConfirmDeleteModal(true) }}
                    className='flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg'
                >
                    <TrashIcon className='w-5 h-5' /> Delete Service
                </button>
                <Link
                    to='/pages'
                    className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-4 py-2 rounded-lg '
                >
                    <XMarkIcon className='w-5 h-5' /> Cancel
                </Link>
                <button
                    className='flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg '
                    onClick={handleSaveService}>
                    <CheckIcon className='w-5 h-5' /> Save Service
                </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditService)