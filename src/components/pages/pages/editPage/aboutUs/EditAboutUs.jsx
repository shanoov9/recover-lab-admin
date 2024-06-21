import { ArrowPathIcon, CheckIcon, MinusCircleIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import './editAboutUs.css'
import ReactQuill from 'react-quill';
import { quillModules } from '../../../../../commonServices/quillModules';
import { FIXED_PAGES, IMAGE_BASE_URL } from '../../../../../commonServices/commonDataService';
import { imageFileServiceApi, pageDetailApiService } from '../../../../../commonServices/apiService';
import { IMAGE_UPDATED_SUCCESSFULLY, PAGE_UPDATED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditAboutUsPage = () => {

    const navigate = useNavigate();

    // Pilot Block States
    const [pilotBlockImage, setPilotBlockImage] = useState(null);
    const [pilotBlockTitle, setPilotBlockTitle] = useState('');

    // Article Block States
    const [articleBlockTitle, setArticleBlockTitle] = useState('');
    const [articleBlockContent, setArticleBlockContent] = useState('');

    // Content Block States
    const [contentBlocks, setContentBlocks] = useState([{ title: '', description: '', image: null }]);

    // Treatment Info block States
    const [treatmentInfoTitle, setTreatmentInfoTitle] = useState('');
    const [treatmentInfoDescription, setTreatmentInfoDescription] = useState('');
    const [treatmentInfoImage, setTreatmentInfoImage] = useState(null);


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

    useEffect(() => {
        getPageDetails()
    }, [])

    const setUpdateData = (pageData) => {
        // Pilot Block
        setPilotBlockTitle(pageData?.pilotBlockData?.pilotBlolckHeading)
        setPilotBlockImage(pageData?.pilotBlockData?.pilotBlockImage)
        // Article Block
        setArticleBlockTitle(pageData?.articleBlockData?.articleBlockTitle)
        setArticleBlockContent(pageData?.articleBlockData?.articleBlockContent)
        // Content Block
        setContentBlocks(pageData?.contentBlockData?.content)
        // Treatment Info Block
        setTreatmentInfoTitle(pageData?.treatmentInfoBlockData?.treatmentInfoBlockTitle)
        setTreatmentInfoDescription(pageData?.treatmentInfoBlockData?.treatmentInfoBlockDescription)
        setTreatmentInfoImage(pageData?.treatmentInfoBlockData?.treatmentInfoBlockImage)
    }

    // Fetching Page Details
    const getPageDetails = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.ABOUTUS }).then(response => {
            console.log(response)
            if (response.data.status == true) {
                const data = response.data.data.pageData;
                setUpdateData(data)
            }
        }).catch(err => console.error(err))
    }

    // Saving on button click
    const handleSaveAboutUs = (e) => {
        let data = {
            pilotBlockData: {
                pilotBlockImage: pilotBlockImage,
                pilotBlolckHeading: pilotBlockTitle,
            },
            articleBlockData: {
                articleBlockTitle: articleBlockTitle,
                articleBlockContent: articleBlockContent
            },
            contentBlockData: {
                content: contentBlocks,
                isenabled: true
            },
            treatmentInfoBlockData: {
                treatmentInfoBlockImage: treatmentInfoImage,
                treatmentInfoBlockTitle: treatmentInfoTitle,
                treatmentInfoBlockDescription: treatmentInfoDescription
            }
        }
        console.log(data)

        const body = {
            pageTitle: FIXED_PAGES.ABOUTUS,
            pageData: data,
            pageType: "MAIN",
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
    // Saving after image upload
    const saveAboutUsData = () => {
        let data = {
            pilotBlockData: {
                pilotBlockImage: pilotBlockImage,
                pilotBlolckHeading: pilotBlockTitle,
            },
            articleBlockData: {
                articleBlockTitle: articleBlockTitle,
                articleBlockContent: articleBlockContent
            },
            contentBlockData: {
                content: contentBlocks,
                isenabled: true
            },
            treatmentInfoBlockData: {
                treatmentInfoBlockImage: treatmentInfoImage,
                treatmentInfoBlockTitle: treatmentInfoTitle,
                treatmentInfoBlockDescription: treatmentInfoDescription
            }
        }
        const body = {
            pageTitle: FIXED_PAGES.ABOUTUS,
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
                    saveAboutUsData()
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
                    saveAboutUsData()
                } else if (block == 'TREATMENTINFOBLOCK') {
                    setTreatmentInfoImage(IMAGE_BASE_URL + responseData.data.data.filename)
                    saveAboutUsData()
                }
            }
        }).catch(err => console.error(err))
    }


    return (
        <div className='p-5'>
            <h1 className='text-2xl mb-5'>Edit About Us Page</h1>
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
                </div>
            </div>

            {/* Article Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Article Block</p>
                    <p className='text-gray-600'>This content is the main about section article.</p>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="articleBlockTitle"
                            className='block'
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id='articleBlockTitle'
                            placeholder='Article Block Title...'
                            value={articleBlockTitle}
                            onChange={(e) => setArticleBlockTitle(e.target.value)}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="articleBlockContent"
                            className='block'
                        >
                            Content
                        </label>
                        <ReactQuill
                            id='articleBlockContent'
                            modules={quillModules}
                            value={articleBlockContent}
                            onChange={setArticleBlockContent}
                            className='border-2 border-gray-400 focuswithinborder-indigo-600 outline-none'
                        />
                    </div>
                </div>
            </div>

            {/* Content Blocks */}
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
                                    {contentBlocks.length < 3
                                        ?
                                        <button
                                            className='border flex items-center justify-center gap-2 px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700'
                                            onClick={addContentBlock}
                                        >
                                            <PlusCircleIcon className='w-6' /> Add Content Block
                                        </button>
                                        :
                                        <p className='text-sm text-gray-600'>
                                            Only upto 3 content blocks are allowed
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

            {/* Treatment Info Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Treatment Info Block</p>
                    <p className='text-gray-600'>This block controls in content to be displayed after content blocks.</p>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mx-auto mb-3'>
                        <label htmlFor="treatmentInfoImageUpload" className='w-96 group block mx-auto cursor-pointer relative'>
                            {treatmentInfoImage === null ? (
                                <div className='w-96 h-52 text-gray-600 flex flex-col items-center justify-center gap-5 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer'>
                                    <PlusCircleIcon className='w-8 h-8 text-gray-500' /> Select Image
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={treatmentInfoImage}
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
                                id='treatmentInfoImageUpload'
                                onChange={(e) => {
                                    uploadPic('TREATMENTINFOBLOCK', treatmentInfoImage, e.target.files[0])
                                    // if (e.target.files.length > 0) setTreatmentInfoImage(e.target.files[0]);
                                }}
                            />

                        </label>
                    </div>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="treatmentInfoTitle"
                            className='block'
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id='treatmentInfoTitle'
                            placeholder='Treatment Info Block Title...'
                            value={treatmentInfoTitle}
                            onChange={(e) => setTreatmentInfoTitle(e.target.value)}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="treatmentInfoDescription"
                            className='block'
                        >
                            Description
                        </label>
                        <ReactQuill
                            id='treatmentInfoDescription'
                            modules={quillModules}
                            value={treatmentInfoDescription}
                            onChange={setTreatmentInfoDescription}
                            className='border-2 border-gray-400 focuswithinborder-indigo-600 outline-none'
                        />
                    </div>
                </div>
            </div>

            {/* Save and Cancel Buttons */}
            <div className='flex items-center gap-3 justify-end my-5'>
                <Link
                    to='/pages'
                    className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-4 py-2 rounded-lg '
                >
                    <XMarkIcon className='w-5 h-5' /> Cancel
                </Link>
                <button
                    className='flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg '
                    onClick={handleSaveAboutUs}>
                    <CheckIcon className='w-5 h-5' /> Save Abous Us Page
                </button>
            </div>


        </div>
    )
}

export default EditAboutUsPage;