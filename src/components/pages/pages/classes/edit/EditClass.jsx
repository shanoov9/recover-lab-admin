import { ArrowPathIcon, CheckIcon, MinusCircleIcon, PlusCircleIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../../commonServices/quillModules';
import { classApiService, imageFileServiceApi, pageDetailApiService, plansPackagesApiService } from '../../../../../commonServices/apiService';
import { CLASS_TYPE_HOT_YOGA, CLASS_TYPE_MEDITATION, CLASS_TYPE_YOGA, IMAGE_BASE_URL } from '../../../../../commonServices/commonDataService';
import { IMAGE_UPDATED_SUCCESSFULLY, PAGE_UPDATED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants';

const EditClass = (props) => {

    const navigate = useNavigate();

    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // Class related states
    const [classId, setClassId] = useState(params.id);
    const [classTitle, setClassTitle] = useState(searchParams.get('title'));
    // Pilot Block States
    const [pilotBlockImage, setPilotBlockImage] = useState(null);
    const [pilotBlockTitle, setPilotBlockTitle] = useState('');
    const [pilotBlockDescription, setPilotBlockDescription] = useState('');

    // Content Block States
    const [contentBlocks, setContentBlocks] = useState([{ title: '', description: '', image: null }]);

    const [currentPlan, setCurrentPlan] = useState('');
    const [selectedPlans, setSelectedPlans] = useState([]);

    // Class IDs: 1-Yoga, 2-Meditation, 3-Hot Yoga
    const [allClassPlans, setAllClassPlans] = useState([])

    useEffect(() => {
        getPageDetail()

        getAllClasses()
    }, [])

    const getPageDetail = () => {
        const body = {
            pageTitle: classTitle.toUpperCase()
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
        setPilotBlockTitle(pageData?.pilotBlock?.pilotBlolckHeading)
        setPilotBlockDescription(pageData?.pilotBlock?.pilotBlockDescription)
        setPilotBlockImage(pageData?.pilotBlock?.pilotBlockImage)
        setContentBlocks(pageData?.contentBlock?.content)

        setSelectedPlans(pageData?.pricingBlock?.plans)
    }


    const getAllClasses = () => {
        console.log(classTitle)
        let classTypeId = classTitle === 'Yoga' ? CLASS_TYPE_YOGA : classTitle === 'Meditation' ? CLASS_TYPE_MEDITATION : classTitle === 'Hot Yoga' ? CLASS_TYPE_HOT_YOGA : null
        // console.log(classtype)
        const body = {
            classType: classTypeId,
        }
        classApiService.getAllClasses(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                setAllClassPlans(response.data.data)
            }
        })
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

    const handleSaveClass = (e) => {
        let data = {
            pilotBlock: {
                pilotBlockImage: pilotBlockImage,
                pilotBlolckHeading: pilotBlockTitle,
                pilotBlockDescription: pilotBlockDescription
            },
            contentBlock: {
                content: contentBlocks,
                isenabled: true
            },
            pricingBlock: {
                plans: selectedPlans,
                isenabled: true
            }
        }
        console.log(data)
        e.preventDefault();
        const body = {
            treatmentServiceId: classId,
            pageTitle: classTitle.toUpperCase(),
            pageData: data,
            pageType: "CLASS",
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

    const saveClassData = () => {
        let data = {
            pilotBlock: {
                pilotBlockImage: pilotBlockImage,
                pilotBlolckHeading: pilotBlockTitle,
                pilotBlockDescription: pilotBlockDescription
            },
            contentBlock: {
                content: contentBlocks,
                isenabled: true
            },
            pricingBlock: {
                plans: selectedPlans,
                isenabled: true
            }
        }
        console.log(data)
        const body = {
            pageTitle: classTitle.toUpperCase(),
            pageData: data,
            pageType: "CLASS",
            status: 1
        }
        pageDetailApiService.savePageDetails(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                toast.success(IMAGE_UPDATED_SUCCESSFULLY)
            }
        }).catch(err => console.error(err))

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
                    saveClassData()
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
        console.log(formData.value)
        imageFileServiceApi.uploadImage(formData).then(responseData => {

            console.log(responseData)
            if (responseData) {
                if (block == 'PILOTBLOCK') {
                    setPilotBlockImage(IMAGE_BASE_URL + responseData.data.data.filename)
                    saveClassData()
                }
            }
        }).catch(err => console.error(err))

    }

    return (
        <div className='p-5'>
            <h1 className='text-2xl mb-5'>Class #{classId} - {classTitle}</h1>
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
                                    uploadPic('PILOTBLOCK', pilotBlockImage, e.target.files[0]);
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
                                                if (e.target.files.length > 0) handleContentBlockChange(index, 'image', e.target.files[0]);
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
                    <p className='text-gray-600'>Select 3 plans of {classTitle} class to display on class page.</p>
                </div>
                <div className='w-3/4 select-none'>
                    <div>
                        <div className="w-4/5 mx-auto">
                            <div className='flex items-center gap-5 w-full'>
                                <label htmlFor="plans" className='block text-lg'>Select Plans</label>
                                <select
                                    id="plans"
                                    value={currentPlan}
                                    onChange={(e) => { setCurrentPlan(e.target.value) }}
                                    className='border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                >
                                    <option value='' disabled selected>Select Plan</option>
                                    { }
                                    {allClassPlans.map((plan, index) => (
                                        <option key={index} value={plan.id} >
                                            {plan.className} - price : {plan.classPrice}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    disabled={currentPlan === '' || selectedPlans.length >= 3}
                                    className='flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400 disabled:text-gray-700 px-4 py-2 rounded-lg '
                                    onClick={() => {
                                        if (currentPlan !== '') {
                                            console.log("Current Plan ID: ", currentPlan);
                                            console.log("Current Plan: ", allClassPlans.find(p => p.id === parseInt(currentPlan)));
                                            if (selectedPlans.find(p => p.id === parseInt(currentPlan)) !== undefined) {
                                                toast.error('Plan already added');
                                                return;
                                            }
                                            setSelectedPlans([...selectedPlans, allClassPlans.find(p => p.id === parseInt(currentPlan))]);
                                            setCurrentPlan('');
                                        }
                                    }}
                                >
                                    <PlusIcon className='w-5 h-5' /> Add Plan
                                </button>
                            </div>
                            <div className='flex flex-col gap-3 mt-3'>
                                {selectedPlans.map((plan) => (
                                    // <div>
                                    <div key={plan.id} className='flex text-nowrap items-center justify-between bg-indigo-200 text-indigo-900 px-4 py-2 rounded-lg'>
                                        {plan.className}
                                        <p> price - {plan.classPrice} </p>
                                        <p> {plan.classDuration} min </p>
                                        <button
                                            className='flex items-center gap-1 bg-red-200 hover:bg-red-300 text-red-900 px-2 py-1 rounded-lg '
                                            onClick={() => {
                                                setSelectedPlans(selectedPlans.filter(p => p.id !== plan.id));
                                            }}
                                        >
                                            <TrashIcon className='w-5 h-5' />
                                        </button>
                                    </div>
                                    // </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-3 justify-end my-5'>
                <Link
                    to='/pages'
                    className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-4 py-2 rounded-lg '
                >
                    <XMarkIcon className='w-5 h-5' /> Cancel
                </Link>
                <button
                    className='flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg '
                    onClick={handleSaveClass}>
                    <CheckIcon className='w-5 h-5' /> Save Class
                </button>
            </div>
        </div>
    )
}

export default EditClass;