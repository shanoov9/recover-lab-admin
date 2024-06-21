import { CheckIcon, ArrowUpCircleIcon, CheckBadgeIcon, MinusCircleIcon, NoSymbolIcon, PlusCircleIcon, PlusIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import './editHome.css'
import { FIXED_PAGES, IMAGE_BASE_URL, PLAN_TYPE_MEMBERSHIP, PLAN_TYPE_PACKAGE, PLAN_TYPE_SINGLE_TIME_PLAN, defaultMembershipList, defaultPackageList, defaultPlanList, defaultServiceList } from '../../../../../commonServices/commonDataService'
import { Link, useNavigate } from 'react-router-dom'
import { Switch } from '@headlessui/react';
import { imageFileServiceApi, pageDetailApiService, plansPackagesApiService } from '../../../../../commonServices/apiService';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { IMAGE_UPDATED_SUCCESSFULLY, PAGE_UPDATED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../../commonServices/quillModules';

const EditHomePage = (props) => {
    const navigate = useNavigate()

    console.log('home page Props ', props)

    // const allservices1 = props.allServices.allServices.allServicesData
    // console.log(allservices1)
    // const allAcotive = allservices1.filter(x => x.status == true)
    // console.log(allAcotive)

    // Pilot Block States
    const [pilotBlockTitle, setPilotBlockTitle] = useState('');
    const [pilotBlockDescription, setPilotBlockDescription] = useState('');

    // treatments Block States
    const [treatmentsBlockDescription, setTreatmentsBlockDescription] = useState('');
    const [treatmentPlanService, setTreatmentPlanService] = useState('');
    const [selectedTreatmentPlan, setSelectedTreatmentPlan] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedServicesData, setSelectedServicesData] = useState({});

    // Package Block States
    const [packageService, setPackageService] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedPackages, setSelectedPackages] = useState([]);

    // Monthly Membership Block States
    const [monthlyMembership, setMonthlyMembership] = useState('');
    const [selectedMonthlyMemberships, setSelectedMonthlyMemberships] = useState([]);

    // Quarterly Membership Block States
    const [quarterlyMembership, setQuarterlyMembership] = useState('');
    const [selectedQuarterlyMemberships, setSelectedQuarterlyMemberships] = useState([]);

    // Yearly Membership Block States
    const [yearlyMembership, setYearlyMembership] = useState('');
    const [selectedYearlyMemberships, setSelectedYearlyMemberships] = useState([]);

    // Studio Block States
    const [studioBlockDescription, setStudioBlockDescription] = useState('');

    // Our story Block States
    const [ourStoryBlockDescription, setOurStoryBlockDescription] = useState('');

    // testimonails Block States
    const [testimonials, setTestimonials] = useState([]);
    const [addTestimonialContent, setAddTestimonialContent] = useState('');
    const [addTestimonialClient, setAddTestimonialClient] = useState('');

    const [allServices, setAllServices] = useState([])
    const [allPlans, setAllPlans] = useState([])
    const [allPackages, setAllPackages] = useState([])
    const [allMemberships, setAllMemberships] = useState([])

    const [pagesLiveStatus, setPagesLiveStatus] = useState({
        treatments: false,
        packages: false,
        monthlyMemberships: true,
        quarterlyMemberships: false,
        studio: false,
        ourStory: true,
        testimonials: false,
    });

    useEffect(() => {
        getPageDetail()
        getAllPlans()
        getAllPackages()
        getAllMemberships()
    }, [])

    useEffect(() => {
        if (props.allServices.allServices.allServicesData) {

            let allServicesFromProps = props.allServices.allServices.allServicesData
            const allActiveServices = allServicesFromProps.filter(x => x.status == true)
            let newServicesList = allActiveServices.map((item) => {
                console.log(item);
                return {
                    id: item.id,
                    treatmentServiceName: item.treatmentServiceName,
                    isSelected: true
                }
            });
            console.log(newServicesList)
            setAllServices(newServicesList)
        }

    }, [props])

    const getAllPlans = () => {
        const body = {
            packageType: PLAN_TYPE_SINGLE_TIME_PLAN
        }
        plansPackagesApiService.getAllplans(body).then(response => {
            console.log('all currentPlans', response.data.data)
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
            pageTitle: FIXED_PAGES.HOME
        }
        pageDetailApiService.getPageDetails(body).then((response) => {
            if (response.data.status == true) {
                const responseData = response.data.data
                const responsePageData = responseData.pageData
                console.log(responsePageData)
                // setUpdateData(responsePageData)
                setUpdateData(responsePageData)

            }
        })
    }

    const setUpdateData = (pageData) => {
        // PILOT BLOCK
        setPilotBlockTitle(pageData?.pilotBlockData?.title)
        setPilotBlockDescription(pageData?.pilotBlockData?.description)

        // TREATMENT BLOCK
        setTreatmentsBlockDescription(pageData?.treatmentsBlockData?.treatmentsBlockDescription)
        setSelectedServicesData(pageData?.treatmentsBlockData?.selectedServicesData)
        setPagesLiveStatus({ ...pagesLiveStatus, treatments: pageData?.treatmentsBlockData?.enabledStatus })
        setTreatmentPriorities(pageData?.treatmentsBlockData?.selectedServices)

        // MEMBERSHIPS BLOCK
        // PACKAGES BLOCK
        setSelectedPackages(pageData?.packagesBlockData?.selectedPackages)
        setPagesLiveStatus({ ...pagesLiveStatus, packages: pageData?.packagesBlockData?.enabledStatus })


        // MEMBERSHIPS BLOCK
        setSelectedMonthlyMemberships(pageData?.membershipsBlockData?.selectedMonthlyMemberships)
        setSelectedQuarterlyMemberships(pageData?.membershipsBlockData?.selectedQuarterlyMemberships)
        setPagesLiveStatus({ ...pagesLiveStatus, monthlyMemberships: pageData?.membershipsBlockData?.enabledStatus?.monthlyMemberships })
        setPagesLiveStatus({ ...pagesLiveStatus, quarterlyMemberships: pageData?.membershipsBlockData?.enabledStatus?.quarterlyMemberships })



        // STUDIO BLOCK
        setStudioBlockDescription(pageData?.studioBlockData?.studioBlockDescription);
        setPagesLiveStatus({ ...pagesLiveStatus, studio: pageData?.studioBlockData?.enabledStatus })

        // OUR STORY BLOCK
        setOurStoryBlockDescription(pageData?.ourStoryBlockData?.ourStoryBlockDescription)
        setPagesLiveStatus({ ...pagesLiveStatus, ourStory: pageData?.ourStoryBlockData?.enabledStatus })

        // TESTIMONIALS BLOCK
        setTestimonials(pageData?.testimonialsBlockData.testimonials)
        setPagesLiveStatus({ ...pagesLiveStatus, testimonials: pageData?.testimonialsBlockData?.enabledStatus })

    }

    const setTreatmentPriorities = (treatmentList) => {
        console.log(treatmentList)
        let idArray = []
        if (treatmentList.length > 0) {
            treatmentList.forEach(element => {
                idArray.push(element)
            });
            setSelectedServices(idArray)
        }
    }

    // Content Block States
    // const [contentBlocks, setContentBlocks] = useState([{ title: '', description: '', image: null }]);

    // Home page save handler
    const handleSaveHomePage = (e) => {
        let data = {
            pilotBlockData: {
                title: pilotBlockTitle,
                description: pilotBlockDescription,
            },
            treatmentsBlockData: {
                treatmentsBlockDescription,
                selectedServices: selectedServices,
                selectedServicesData,
                enabledStatus: pagesLiveStatus.treatments
            },
            packagesBlockData: {
                selectedPackages,
                enabledStatus: pagesLiveStatus.packages
            },
            membershipsBlockData: {
                selectedMonthlyMemberships,
                selectedQuarterlyMemberships,
                enabledStatus: {
                    monthlyMemberships: pagesLiveStatus.monthlyMemberships,
                    quarterlyMemberships: pagesLiveStatus.quarterlyMemberships
                }
            },
            studioBlockData: {
                studioBlockDescription,
                enabledStatus: pagesLiveStatus.studio
            },
            ourStoryBlockData: {
                ourStoryBlockDescription,
                enabledStatus: pagesLiveStatus.ourStory
            },
            testimonialsBlockData: {
                testimonials,
                enabledStatus: pagesLiveStatus.testimonials
            }
        };
        e.preventDefault();
        console.log(data);

        const body = {
            pageTitle: FIXED_PAGES.HOME,
            pageData: data,
            pageType: "MAIN",
            status: 1
        }
        pageDetailApiService.savePageDetails(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                toast.success(PAGE_UPDATED_SUCCESSFULLY)
                navigate('/pages')
            }
        }).catch(err => console.error(err))

    }

    const SaveHomePageData = () => {
        let data = {
            pilotBlockData: {
                title: pilotBlockTitle,
                description: pilotBlockDescription,
            },
            treatmentsBlockData: {
                treatmentsBlockDescription,
                selectedServices: selectedServices,
                selectedServicesData,
                enabledStatus: pagesLiveStatus.treatments
            },
            packagesBlockData: {
                selectedPackages,
                enabledStatus: pagesLiveStatus.packages
            },
            membershipsBlockData: {
                selectedMonthlyMemberships,
                selectedQuarterlyMemberships,
                enabledStatus: {
                    monthlyMemberships: pagesLiveStatus.monthlyMemberships,
                    quarterlyMemberships: pagesLiveStatus.quarterlyMemberships
                }
            },
            studioBlockData: {
                studioBlockDescription,
                enabledStatus: pagesLiveStatus.studio
            },
            ourStoryBlockData: {
                ourStoryBlockDescription,
                enabledStatus: pagesLiveStatus.ourStory
            },
            testimonialsBlockData: {
                testimonials,
                enabledStatus: pagesLiveStatus.testimonials
            }
        };
        console.log(data);

        const body = {
            pageTitle: FIXED_PAGES.HOME,
            pageData: data,
            pageType: "MAIN",
            status: 1
        }
        pageDetailApiService.savePageDetails(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                toast.success(IMAGE_UPDATED_SUCCESSFULLY)
            }
        }).catch(err => console.error(err))

    }

    const handleAddTestimonial = () => {
        if (addTestimonialContent !== '' && addTestimonialClient !== '') {
            setTestimonials([...testimonials, { id: testimonials.length + 1, content: addTestimonialContent, client: addTestimonialClient }]);
            setAddTestimonialContent('');
            setAddTestimonialClient('');
        } else {
            alert('Please fill all fields');
        }
    }

    const uploadDynamicContentPics = (block, prevImage, imageFile, planItem) => {
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
                if (block == 'TREATMENTLISTDATA') {
                    console.log("doing");
                    setSelectedServicesData(prev => ({
                        ...selectedServicesData,
                        [planItem.id]: {
                            ...selectedServicesData[planItem.id],
                            image: IMAGE_BASE_URL + responseData.data.data.filename
                        }
                    }))
                    setTimeout(() => {
                        SaveHomePageData()
                    }, 1500);
                }
            }


        }).catch(err => console.error(err))

    }

    return (
        <div className='p-5'>
            <h1 className='text-2xl mb-5'>Edit Home Page</h1>
            {/* Pilot Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col justify-evenly w-1/4'>
                    <div className='flex flex-col gap-5'>
                        <p className='text-xl text-black'>Pilot Block</p>
                        <p className='text-gray-600'>This content will be on top of the landing page.</p>
                    </div>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mb-3 w-4/5 mx-auto text-left'>
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
                    <div className='mb-3 w-4/5 mx-auto text-left'>
                        <label
                            htmlFor="pilotPageDescription"
                            className='block'
                        >
                            Description
                        </label>
                        <ReactQuill
                            id='pilotPageDescription'
                            placeholder='Pilot Block Description...'
                            modules={quillModules}
                            value={pilotBlockDescription}
                            onChange={setPilotBlockDescription}
                            className='w-full border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                        />
                    </div>
                </div>
            </div>

            {/* Treatments Block */}
            <div className="flex relative border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                {/* <div className='absolute top-2 right-2'>
                    <Switch
                        checked={pagesLiveStatus.treatments}
                        onChange={() => setPagesLiveStatus({ ...pagesLiveStatus, treatments: !pagesLiveStatus.treatments })}
                        className={`${pagesLiveStatus.treatments ? 'bg-green-300' : 'bg-red-300'
                            } relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none`}
                    >
                        <span className='sr-only'>Enable Treatments Block</span>
                        <span
                            className={`${pagesLiveStatus.treatments ? 'translate-x-7 bg-green-600' : 'translate-x-1 bg-red-600'
                                } flex items-center justify-center text-white w-6 h-6 transform rounded-full transition-transform`}
                        >
                            {pagesLiveStatus.treatments
                                ?
                                <CheckIcon className='w-5 h-5' />
                                :
                                <XMarkIcon className='w-5 h-5' />
                            }
                        </span>
                    </Switch>
                </div> */}
                <div className='flex flex-col justify-center w-1/4'>
                    <div className='flex flex-col gap-2 jy'>
                        <p className='text-xl text-black'>Treatments Block</p>
                        <p className='text-gray-600'>Select treatment plans to display on homepage</p>
                    </div>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mb-3 w-4/5 mx-auto text-left'>
                        <label
                            htmlFor="treatmentsBlockDescription"
                            className='block'
                        >
                            Description
                        </label>
                        <ReactQuill
                            id='treatmentsBlockDescription'
                            placeholder='Treatments Block Description...'
                            modules={quillModules}
                            value={treatmentsBlockDescription}
                            onChange={setTreatmentsBlockDescription}
                            className='w-full border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                        />
                    </div>
                    <div className="w-4/5 mx-auto grid grid-cols-2">
                        <div className='flex gap-3 w-max items-center'>
                            <select
                                id="tratmentPlanService"
                                value={treatmentPlanService}
                                onChange={(e) => setTreatmentPlanService(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            >
                                <option value="" disabled selected>Select Service</option>
                                {allServices.map((serviceItem) => (
                                    <option key={serviceItem.id} value={serviceItem.treatmentServiceName}>{serviceItem.treatmentServiceName}</option>
                                ))}
                            </select>
                            <select
                                id="selectedTreatmentPlan"
                                value={selectedTreatmentPlan}
                                onChange={(e) => setSelectedTreatmentPlan(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            >
                                <option value='' disabled selected>Select Treatment Plan</option>

                                {allPlans.filter((item) => item.treatmentServiceName === treatmentPlanService).map((planItem) => (
                                    <option key={planItem.id} value={planItem.id}>{planItem.packageName}  - price : {planItem.packageAmount} </option>
                                ))
                                }
                            </select>

                            <button
                                className='bg-indigo-200 disabled:bg-gray-400 disabled:text-black flex items-center gap-1 hover:bg-indigo-300 text-indigo-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                disabled={selectedServices.length >= 3}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!selectedServices.find((item) => item.id === parseInt(selectedTreatmentPlan))) {
                                        if (treatmentPlanService != '' && selectedTreatmentPlan != '') {
                                            setSelectedServices([...selectedServices, allPlans.find((item) => item.id === parseInt(selectedTreatmentPlan))]);
                                            setTreatmentPlanService('');
                                            setSelectedTreatmentPlan('');
                                        }
                                    } else {
                                        alert('Plan already added');
                                    }
                                }}
                            >
                                <PlusIcon className='w-5 h-5' /> Add
                            </button>
                        </div>
                    </div>
                    <div className='block my-3 w-4/5 mx-auto'>
                        {selectedServices.length !== 0 && <div className='text-lg text-nowrap grid grid-cols-3 bg-indigo-600 text-white py-1 rounded-lg'>
                            <p>Service</p>
                            <p>Plan</p>
                            <p>Remove</p>
                        </div>}
                        {console.log(selectedServices)}
                        {selectedServices.map((planItem) => (
                            <>
                                <div key={planItem?.id} className='grid grid-cols-3 bg-indigo-100 py-1 px-3 my-2 rounded-lg'>
                                    <p className='text-lg text-nowrap'>{planItem?.treatmentServiceName}</p>
                                    <p className='text-lg text-nowrap'>{planItem?.packageName}</p>
                                    <button
                                        className='bg-red-200 hover:bg-red-300 text-red-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                        onClick={() => setSelectedServices(selectedServices.filter((item) => item !== planItem))}
                                    >
                                        <XMarkIcon className='w-5 h-5' />
                                    </button>
                                </div>
                                <div className='flex items-center gap-5'>
                                    <div>
                                        <label htmlFor={`planImage${planItem.id}`} className='text-lg text-nowrap'>
                                            <span className='block w-44 h-44 border-2 border-gray-400 border-dashed rounded-md'>
                                                {selectedServicesData[planItem.id]?.image
                                                    ?
                                                    <img
                                                        src={selectedServicesData[planItem.id]?.image}
                                                        alt={planItem?.packageName}
                                                        className='w-full h-full object-cover'
                                                    />
                                                    :
                                                    <div className='flex text-gray-600 cursor-pointer flex-col gap-3 items-center justify-center w-full h-full'>
                                                        <PhotoIcon className='w-6 h-6' /> Select Image
                                                    </div>
                                                }

                                            </span>
                                            <input
                                                type="file"
                                                id={`planImage${planItem.id}`}
                                                className='hidden'
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    uploadDynamicContentPics('TREATMENTLISTDATA', selectedServicesData[planItem.id]?.image, file, planItem)
                                                }
                                                }
                                            />
                                        </label>
                                    </div>
                                    <div className='w-3/5'>
                                        <div className='flex text-left flex-col'>
                                            <label htmlFor={`planTitle${planItem.id}`} className='text-nowrap'>
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                id={`planTitle${planItem.id}`}
                                                placeholder='Plan Title...'
                                                value={selectedServicesData[planItem.id]?.title}
                                                onChange={(e) => setSelectedServicesData({
                                                    ...selectedServicesData,
                                                    [planItem.id]: {
                                                        ...selectedServicesData[planItem.id],
                                                        title: e.target.value
                                                    }
                                                })}
                                                className='border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg px-3 py-1.5'
                                            />
                                        </div>
                                        <div className='text-left'>
                                            <label htmlFor={`planDescription${planItem.id}`} className='text-nowrap'>
                                                Description
                                            </label>
                                            <ReactQuill
                                                id={`planDescription${planItem.id}`}
                                                placeholder='Plan Description...'
                                                modules={quillModules}
                                                value={selectedServicesData[planItem.id]?.description}
                                                onChange={(e) => setSelectedServicesData({
                                                    ...selectedServicesData,
                                                    [planItem.id]: {
                                                        ...selectedServicesData[planItem.id],
                                                        description: e
                                                    }
                                                })}
                                                className='border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>

            {/* Plans Block - may be needed */}
            {/* <div className="flex border-2 p-3 rounded-lg border-gray-400 my-2">
                <div className='flex flex-col justify-evenly w-1/4'>
                    <div className='flex flex-col gap-5'>
                        <p className='text-xl text-black'>Plans Block</p>
                        <p className='text-gray-600'>Select plans to display on homepage</p>
                    </div>
                    <button
                        onClick={handlePlansBlockSave}
                        className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-medium px-4 py-2 mx-auto rounded-lg '
                    >
                        <ArrowUpCircleIcon className='w-6 h-6' /> Save Plans Block
                    </button>
                </div>
                <div className='w-3/4 select-none grid grid-cols-2 pl-10'>
                    {defaultPlanList.map((plan) => (
                        <div key={plan.id} className='flex items-center gap-3'>
                            <input
                                type="checkbox"
                                className='hidden'
                                id={`planCheckBox${plan.id}`}
                                name={plan.name}
                                value={plan.name}
                                checked={selectedPlans.includes(plan.id)}
                                onChange={(e) => {
                                    console.log(e.target.checked);
                                    if (e.target.checked) {
                                        console.log('Checked');
                                        setSelectedPlans([...selectedPlans, plan.id])
                                    } else {
                                        console.log('Unchecked');
                                        setSelectedPlans(selectedPlans.filter((pln) => pln !== plan.id))
                                    }
                                }}
                            />
                            <label
                                htmlFor={`planCheckBox${plan.id}`}
                                className={`text-lg ${selectedPlans.includes(plan.id) ? 'bg-indigo-600 text-white' : 'bg-gray-300'}
                                px-3 py-1 flex items-center gap-1 rounded-lg cursor-pointer hover:bg-indigo-300 hover:text-indigo-900 my-1 transition-all duration-100 ease-in-out`}
                            >
                                {selectedPlans.includes(plan.id) ? <MinusCircleIcon className='w-5 h-5' /> : <PlusCircleIcon className='w-5 h-5' />}
                                {plan.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Packages Block */}
            <div className="flex relative border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                {/* <div className='absolute top-2 right-2'>
                    <Switch
                        checked={pagesLiveStatus.packages}
                        onChange={() => setPagesLiveStatus({ ...pagesLiveStatus, packages: !pagesLiveStatus.packages })}
                        className={`${pagesLiveStatus.packages ? 'bg-green-300' : 'bg-red-300'
                            } relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none`}
                    >
                        <span
                            className={`${pagesLiveStatus.packages ? 'translate-x-7 bg-green-600' : 'translate-x-1 bg-red-600'
                                } flex items-center justify-center text-white w-6 h-6 transform rounded-full transition-transform`}
                        >
                            {pagesLiveStatus.packages
                                ?
                                <CheckIcon className='w-5 h-5' />
                                :
                                <XMarkIcon className='w-5 h-5' />
                            }
                        </span>
                    </Switch>
                </div> */}
                <div className='flex flex-col justify-evenly w-1/4'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-xl text-black'>Packages Block</p>
                        <p className='text-gray-600'>Select packages to display on homepage</p>
                    </div>
                </div>
                <div className='w-3/4 mx-auto select-none grid'>
                    <div className='w-4/5 mx-auto'>
                        <div className='flex gap-3 mx-auto items-center'>
                            <select
                                id="packageService"
                                value={packageService}
                                onChange={(e) => setPackageService(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            >
                                <option value="" disabled selected>Select Service</option>
                                {allServices.map((serviceItem) => (
                                    <option key={serviceItem.id} value={serviceItem.treatmentServiceName}>{serviceItem.treatmentServiceName}</option>
                                ))}
                            </select>
                            <select
                                id="selectedPackage"
                                value={selectedPackage}
                                onChange={(e) => setSelectedPackage(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            >
                                <option value='' disabled selected>Select Package</option>

                                {allPackages.filter((item) => item.treatmentServiceName === packageService).map((packageItem) => (
                                    <option key={packageItem.id} value={packageItem.id}>{packageItem.packageName}  - price : {packageItem.packageAmount} </option>
                                ))
                                }
                            </select>

                            <button
                                className='bg-indigo-200 disabled:bg-gray-400 disabled:text-black flex items-center gap-1 hover:bg-indigo-300 text-indigo-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                disabled={selectedPackages.length >= 3}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!selectedPackages.find((item) => item.id === parseInt(selectedPackage))) {
                                        if (packageService != '' && selectedPackage != '') {
                                            setSelectedPackages([...selectedPackages, allPackages.find((item) => item.id === parseInt(selectedPackage))]);
                                            setPackageService('');
                                            setSelectedPackage('');
                                        }
                                    } else {
                                        alert('Package already added');
                                    }
                                }}
                            >
                                <PlusIcon className='w-5 h-5' /> Add
                            </button>
                        </div>
                        <div className='block w-full my-3'>
                            {selectedPackages.length !== 0 && <div className='text-lg text-nowrap grid grid-cols-3 bg-indigo-600 text-white py-1 rounded-lg'>
                                <p>Service</p>
                                <p>Package</p>
                                <p>Remove</p>
                            </div>}
                            {console.log(selectedPackages)}
                            {selectedPackages.map((packageItem) => (
                                <div key={packageItem.id} className='grid grid-cols-3 bg-indigo-100 py-1 px-3 my-2 rounded-lg'>
                                    <p className='text-lg text-nowrap'>{packageItem.treatmentServiceName}</p>
                                    <p className='text-lg text-nowrap'>{packageItem.packageName}</p>
                                    <button
                                        className='bg-red-200 hover:bg-red-300 text-red-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                        onClick={() => setSelectedPackages(selectedPackages.filter((item) => item.id !== packageItem.id))}
                                    >
                                        <XMarkIcon className='w-5 h-5' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Memberships Block */}
            <div className='border-2 border-gray-400 hover:border-indigo-400 rounded-lg my-2'>
                {/* Monthly Memberships Block */}
                <div className="flex relative p-3 my-2">
                    {/* <div className='absolute top-2 right-2'>
                        <Switch
                            checked={pagesLiveStatus.monthlyMemberships}
                            onChange={() => setPagesLiveStatus({ ...pagesLiveStatus, monthlyMemberships: !pagesLiveStatus.monthlyMemberships })}
                            className={`${pagesLiveStatus.monthlyMemberships ? 'bg-green-300' : 'bg-red-300'
                                } relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none`}
                        >
                            <span
                                className={`${pagesLiveStatus.monthlyMemberships ? 'translate-x-7 bg-green-600' : 'translate-x-1 bg-red-600'
                                    } flex items-center justify-center text-white w-6 h-6 transform rounded-full transition-transform`}
                            >
                                {pagesLiveStatus.monthlyMemberships
                                    ?
                                    <CheckIcon className='w-5 h-5' />
                                    :
                                    <XMarkIcon className='w-5 h-5' />
                                }
                            </span>
                        </Switch>
                    </div> */}
                    <div className='flex flex-col justify-evenly w-1/4'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-xl text-black'>Monthly Memberships Block</p>
                            <p className='text-gray-600'>Select monthly memberships to display on homepage</p>
                        </div>
                    </div>
                    <div className='w-3/4 select-none grid'>
                        <div className='w-4/5 mx-auto'>
                            <div className='flex gap-3 w-max items-center'>
                                <select
                                    id="monthlyMembership"
                                    value={monthlyMembership}
                                    onChange={(e) => setMonthlyMembership(e.target.value)}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                >
                                    <option value='' disabled selected>Select Membership</option>
                                    {allMemberships.filter((mem) => mem.packageDuration === 30).map((membership) => (
                                        <option key={membership.id} value={membership.id}>{membership.packageName}</option>
                                    ))}
                                </select>

                                <button
                                    className='bg-indigo-200 disabled:bg-gray-400 disabled:text-black flex items-center gap-1 hover:bg-indigo-300 text-indigo-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                    disabled={selectedMonthlyMemberships.length >= 3}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!selectedMonthlyMemberships.find((item) => item.id === parseInt(monthlyMembership))) {
                                            if (monthlyMembership != '') {
                                                setSelectedMonthlyMemberships([...selectedMonthlyMemberships, allMemberships.find((item) => item.id === parseInt(monthlyMembership))]);
                                                setMonthlyMembership('');
                                            }
                                        } else {
                                            alert('Monthly membership already added');
                                        }
                                    }}
                                >
                                    <PlusIcon className='w-5 h-5' /> Add
                                </button>
                            </div>
                            <div className='block my-3'>
                                {selectedMonthlyMemberships.length !== 0 && <div className='text-lg text-nowrap grid grid-cols-2 bg-indigo-600 text-white py-1 rounded-lg'>
                                    <p>Membership</p>
                                    <p>Remove</p>
                                </div>}
                                {selectedMonthlyMemberships.map((membership) => (
                                    <div key={membership.id} className='grid grid-cols-2 bg-indigo-100 py-1 px-3 my-2 rounded-lg'>
                                        {console.log('aaaahdjkh', membership)}
                                        <p className='text-lg text-nowrap'>{membership.packageName}</p>
                                        <button
                                            className='bg-red-200 hover:bg-red-300 text-red-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                            onClick={() => setSelectedMonthlyMemberships(selectedMonthlyMemberships.filter((item) => item.id !== membership.id))}
                                        >
                                            <XMarkIcon className='w-5 h-5' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <hr
                    className='border-[1.5px] border-gray-300 w-3/4 mx-auto my-2'
                />
                {/* Quarterly Memberships Block */}
                <div className="flex relative p-3 my-2">
                    {/* <div className='absolute top-2 right-2'>
                        <Switch
                            checked={pagesLiveStatus.yearlyMemberships}
                            onChange={() => setPagesLiveStatus({ ...pagesLiveStatus, yearlyMemberships: !pagesLiveStatus.yearlyMemberships })}
                            className={`${pagesLiveStatus.yearlyMemberships ? 'bg-green-300' : 'bg-red-300'
                                } relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none`}
                        >
                            <span
                                className={`${pagesLiveStatus.yearlyMemberships ? 'translate-x-7 bg-green-600' : 'translate-x-1 bg-red-600'
                                    } flex items-center justify-center text-white w-6 h-6 transform rounded-full transition-transform`}
                            >
                                {pagesLiveStatus.yearlyMemberships
                                    ?
                                    <CheckIcon className='w-5 h-5' />
                                    :
                                    <XMarkIcon className='w-5 h-5' />
                                }
                            </span>
                        </Switch>
                    </div> */}
                    <div className='flex flex-col justify-evenly w-1/4'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-xl text-black'>Quarterly Memberships Block</p>
                            <p className='text-gray-600'>Select quarterly memberships to display on homepage</p>
                        </div>
                    </div>
                    <div className='w-3/4 select-none grid'>
                        <div className='w-4/5 mx-auto'>
                            <div className='flex gap-3 w-max items-center'>
                                <select
                                    id="quarterlyMembership"
                                    value={quarterlyMembership}
                                    onChange={(e) => setQuarterlyMembership(e.target.value)}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                >
                                    <option value='' disabled selected>Select Membership</option>
                                    {allMemberships.filter((mem) => mem.packageDuration === 90).map((membership) => (
                                        <option key={membership.id} value={membership.id}>{membership.packageName}</option>
                                    ))}
                                </select>

                                <button
                                    className='bg-indigo-200 disabled:bg-gray-400 disabled:text-black flex items-center gap-1 hover:bg-indigo-300 text-indigo-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                    disabled={selectedQuarterlyMemberships.length >= 3}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!selectedQuarterlyMemberships.find((item) => item.id === parseInt(quarterlyMembership))) {
                                            if (quarterlyMembership != '') {
                                                setSelectedQuarterlyMemberships([...selectedQuarterlyMemberships, allMemberships.find((item) => item.id === parseInt(quarterlyMembership))]);
                                                setQuarterlyMembership('');
                                            }
                                        } else {
                                            alert('Quarterly membership already added');
                                        }
                                    }}
                                >
                                    <PlusIcon className='w-5 h-5' /> Add
                                </button>
                            </div>
                            <div className='block my-3'>
                                {selectedQuarterlyMemberships.length !== 0 && <div className='text-lg text-nowrap grid grid-cols-2 bg-indigo-600 text-white py-1 rounded-lg'>
                                    <p>Membership</p>
                                    <p>Remove</p>
                                </div>}
                                {selectedQuarterlyMemberships.map((membership) => (
                                    <div key={membership.id} className='grid grid-cols-2 bg-indigo-100 py-1 px-3 my-2 rounded-lg'>
                                        <p className='text-lg text-nowrap'>{membership.packageName}</p>
                                        <button
                                            className='bg-red-200 hover:bg-red-300 text-red-900 font-medium px-3 py-1.5 mx-auto rounded-lg'
                                            onClick={() => setSelectedQuarterlyMemberships(selectedQuarterlyMemberships.filter((item) => item.id !== membership.id))}
                                        >
                                            <XMarkIcon className='w-5 h-5' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Studio block */}
            <div className="flex relative border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                {/* <div className='absolute top-2 right-2'>
                    <Switch
                        checked={pagesLiveStatus.studio}
                        onChange={() => setPagesLiveStatus({ ...pagesLiveStatus, studio: !pagesLiveStatus.studio })}
                        className={`${pagesLiveStatus.studio ? 'bg-green-300' : 'bg-red-300'
                            } relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none`}
                    >
                        <span
                            className={`${pagesLiveStatus.studio ? 'translate-x-7 bg-green-600' : 'translate-x-1 bg-red-600'
                                } flex items-center justify-center text-white w-6 h-6 transform rounded-full transition-transform`}
                        >
                            {pagesLiveStatus.studio
                                ?
                                <CheckIcon className='w-5 h-5' />
                                :
                                <XMarkIcon className='w-5 h-5' />
                            }
                        </span>
                    </Switch>
                </div> */}
                <div className='flex flex-col justify-evenly w-1/4'>
                    <div className='flex flex-col gap-5'>
                        <p className='text-xl text-black'>Studio Block</p>
                        <p className='text-gray-600'>Well being studio block content</p>
                    </div>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mb-3 w-4/5 mx-auto text-left'>
                        <label
                            htmlFor="wellBeingStudioDescription"
                            className='block'
                        >
                            Description
                        </label>
                        <ReactQuill
                            id='wellBeingStudioDescription'
                            placeholder='Well Being Studio Description...'
                            modules={quillModules}
                            value={studioBlockDescription}
                            onChange={setStudioBlockDescription}
                            className='w-full border-2 group border-gray-400 focus-within:border-indigo-600 outline-none'
                        />
                    </div>
                </div>
            </div>

            {/* Our Story block */}
            <div className="flex relative border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                {/* <div className='absolute top-2 right-2'>
                    <Switch
                        checked={pagesLiveStatus.ourStory}
                        onChange={() => setPagesLiveStatus({ ...pagesLiveStatus, ourStory: !pagesLiveStatus.ourStory })}
                        className={`${pagesLiveStatus.ourStory ? 'bg-green-300' : 'bg-red-300'
                            } relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none`}
                    >
                        <span
                            className={`${pagesLiveStatus.ourStory ? 'translate-x-7 bg-green-600' : 'translate-x-1 bg-red-600'
                                } flex items-center justify-center text-white w-6 h-6 transform rounded-full transition-transform`}
                        >
                            {pagesLiveStatus.ourStory
                                ?
                                <CheckIcon className='w-5 h-5' />
                                :
                                <XMarkIcon className='w-5 h-5' />
                            }
                        </span>
                    </Switch>
                </div> */}
                <div className='flex flex-col justify-evenly w-1/4'>
                    <div className='flex flex-col gap-5'>
                        <p className='text-xl text-black'>Our Story Block</p>
                        <p className='text-gray-600'>Short description for our story / about us block</p>
                    </div>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mb-3 w-4/5 mx-auto text-left'>
                        <label
                            htmlFor="ourStoryBlockDescription"
                            className='block'
                        >
                            Description
                        </label>
                        <ReactQuill
                            id='ourStoryBlockDescription'
                            placeholder='Our Story Description...'
                            modules={quillModules}
                            value={ourStoryBlockDescription}
                            onChange={setOurStoryBlockDescription}
                            className='w-full border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                        />
                    </div>
                </div>
            </div>

            {/* Testimonials block */}
            <div className="flex relative border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                {/* <div className='absolute top-2 right-2'>
                    <Switch
                        checked={pagesLiveStatus.testimonials}
                        onChange={() => setPagesLiveStatus({ ...pagesLiveStatus, testimonials: !pagesLiveStatus.testimonials })}
                        className={`${pagesLiveStatus.testimonials ? 'bg-green-300' : 'bg-red-300'
                            } relative inline-flex items-center h-8 rounded-full w-14 transition-colors focus:outline-none`}
                    >
                        <span
                            className={`${pagesLiveStatus.testimonials ? 'translate-x-7 bg-green-600' : 'translate-x-1 bg-red-600'
                                } flex items-center justify-center text-white w-6 h-6 transform rounded-full transition-transform`}
                        >
                            {pagesLiveStatus.testimonials
                                ?
                                <CheckIcon className='w-5 h-5' />
                                :
                                <XMarkIcon className='w-5 h-5' />
                            }
                        </span>
                    </Switch>
                </div> */}
                <div className='flex flex-col justify-evenly w-1/4'>
                    <div className='flex flex-col gap-5'>
                        <p className='text-xl text-black'>Testimonails Block</p>
                        <p className='text-gray-600'>Testimonials / feedbacks from users for homepage</p>
                    </div>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='w-4/5 mx-auto text-left'>
                        <label
                            htmlFor="testimonial"
                            className='block'
                        >
                            Testimonial
                        </label>
                        <textarea
                            id='testimonial'
                            placeholder='The most exclusive wellness location in Qatar; the recently opened Recovery Lab...'
                            rows={2}
                            value={addTestimonialContent}
                            onChange={(e) => setAddTestimonialContent(e.target.value)}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                    <div className='w-4/5 mb-2 mx-auto text-left'>
                        <label
                            htmlFor="testimonialClient"
                            className='block'
                        >
                            Client Name
                        </label>
                        <input
                            type='text'
                            id='testimonialClient'
                            placeholder='John Doe'
                            value={addTestimonialClient}
                            onChange={(e) => setAddTestimonialClient(e.target.value)}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                    <div className='w-4/5 mx-auto'>
                        <button
                            onClick={handleAddTestimonial}
                            disabled={testimonials.length >= 5}
                            className='bg-indigo-200 disabled:bg-gray-300 disabled:text-gray-700 flex items-center gap-1 hover:bg-indigo-300 text-indigo-900 font-medium px-3 py-1.5 ml-auto rounded-lg'
                        >
                            <PlusIcon className='w-5 h-5' /> Add Testimonial
                        </button>
                    </div>

                    <div className='w-4/5 mx-auto my-3'>

                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className='bg-indigo-100 py-1 px-3 my-2 rounded-lg'>
                                <p className='text-lg text-left'>{testimonial.content}</p>
                                <div className='flex items-center justify-end gap-5'>
                                    <p className='text-lg text-nowrap'> - {testimonial.client}</p>
                                    <button
                                        className='bg-red-200 hover:bg-red-300 text-red-900 flex items-center gap-1 font-medium px-3 py-1.5 rounded-lg'
                                        onClick={() => setTestimonials(testimonials.filter((item) => item.id !== testimonial.id))}
                                    >
                                        <XMarkIcon className='w-5 h-5' /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 my-5">
                <Link
                    to='/pages'
                    className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-medium px-4 py-2 rounded-lg '
                >
                    <XMarkIcon className='w-6 h-6' /> Cancel
                </Link>
                <button
                    onClick={handleSaveHomePage}
                    className='flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg '
                >
                    <ArrowUpCircleIcon className='w-6 h-6' /> Save Home Page Content
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

export default connect(mapStateToProps, null)(EditHomePage);