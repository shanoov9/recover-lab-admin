import React, { useEffect, useState } from 'react'
import { PlusCircleIcon, ArrowPathIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../commonServices/quillModules';
import { FIXED_PAGES, IMAGE_BASE_URL } from '../../../../commonServices/commonDataService';
import { toast } from 'react-toastify';
import { IMAGE_UPDATED_SUCCESSFULLY, PAGE_UPDATED_SUCCESSFULLY } from '../../../../commonServices/messageConstants';
import { imageFileServiceApi, pageDetailApiService } from '../../../../commonServices/apiService';

const Classes = () => {
    const navigate = useNavigate();

    const [pilotBlockTitle, setPilotBlockTitle] = useState('');
    const [pilotBlockDescription, setPilotBlockDescription] = useState('');
    const [pilotBlockImage, setPilotBlockImage] = useState(null);
    const [aboutOurSpaceTitle, setAboutOurSpaceTitle] = useState('');
    const [aboutOurSpaceDescription, setAboutOurSpaceDescription] = useState('');
    const [classesData, setClassesData] = useState(
        ["Yoga", "Meditation", "Hot Yoga"]
            .map((cls, index) => ({
                id: index + 1,
                clsName: cls,
                clsDescription: '',
                clsImage: null
            }))
    );

    useEffect(() => {
        getPageDetail()
    }, [])

    const getPageDetail = () => {
        const body = {
            pageTitle: FIXED_PAGES.CLASSES
        }
        pageDetailApiService.getPageDetails(body).then((response) => {
            if (response.data.status == true) {
                const responseData = response.data.data
                const responsePageData = responseData.pageData
                console.log(responsePageData)
                // setUpdateData(responsePageData)
                setUpdateData(JSON.parse(responsePageData))

            }
        }).catch(err => console.error(err))
    }

    const setUpdateData = (pageData) => {

        setPilotBlockImage(pageData?.pilotBlockData?.pilotBlockImage || null)
        setPilotBlockTitle(pageData?.pilotBlockData?.pilotBlockTitle)
        setPilotBlockDescription(pageData?.pilotBlockData?.pilotBlockDescription)


        setAboutOurSpaceTitle(pageData?.aboutOurSpaceData?.aboutOurSpaceTitle)
        setAboutOurSpaceDescription(pageData?.aboutOurSpaceData?.aboutOurSpaceDescription)

        setClassesData(pageData?.classesData)
    }

    const handleClassesDataChange = (id, key, value) => {
        console.log(id, key, value)
        let updatedClassesData = classesData.map(cls => {
            if (cls.id === id) {
                cls[key] = value;
            }
            return cls;
        });
        console.log(updatedClassesData)
        setClassesData(updatedClassesData);
    }

    const handleClassesLandingPageChangesSave = (e) => {
        e.preventDefault();
        let data = {
            pilotBlockData: {
                pilotBlockTitle,
                pilotBlockDescription,
                pilotBlockImage
            },
            aboutOurSpaceData: {
                aboutOurSpaceTitle,
                aboutOurSpaceDescription
            },
            classesData
        }
        console.log(data);

        const body = {
            pageTitle: FIXED_PAGES.CLASSES,
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

    const classesLandingPageChangesSave = () => {
        let data = {
            pilotBlockData: {
                pilotBlockTitle,
                pilotBlockDescription,
                pilotBlockImage
            },
            aboutOurSpaceData: {
                aboutOurSpaceTitle,
                aboutOurSpaceDescription
            },
            classesData
        }
        console.log(data);

        const body = {
            pageTitle: FIXED_PAGES.CLASSES,
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
    
    const uploadDynamicContentPics = (block, prevImage, imageFile,classId, key) => {
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
                if (block == 'CLASSLISTBLOCK') {
                    handleClassesDataChange(classId, key,IMAGE_BASE_URL + responseData.data.data.filename)
                    classesLandingPageChangesSave()
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
                    classesLandingPageChangesSave()
                }
            }
        }).catch(err => console.error(err))

    }

    return (
        <div className='p-5 '>
            <h1 className="my-5 text-2xl font-medium">Edit Classes Landing Page</h1>
            {/* Pilot Block Image */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Pilot Block</p>
                    <p className='text-gray-600'>Select title and image to display on pilot block of the Classes page.</p>
                </div>
                <div className='w-3/4 select-none'>

                    <div className='mx-auto mb-3'>
                        <label htmlFor="pilotPageImageUpload" className='w-96 group block mx-auto cursor-pointer relative'>
                            {pilotBlockImage === null ? (
                                <div className='w-96 h-52 text-gray-600 flex flex-col items-center justify-center gap-5 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer'>
                                    <PlusCircleIcon className='w-8 h-8 text-gray-500' /> Select Pilot Block Image
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
                                    if (e.target.files.length > 0) {
                                        uploadPic('PILOTBLOCK', pilotBlockImage, e.target.files[0])
                                        // setPilotBlockImage(e.target.files[0])
                                    };
                                }}
                            />

                        </label>
                    </div>
                    <div className='w-96 mx-auto mb-3'>
                        <label htmlFor="pilotBlockTitle" className='w-96 mx-auto text-left group block cursor-pointer relative'>
                            Pilot Block Title
                        </label>
                        <input
                            type="text"
                            id='pilotBlockTitle'
                            value={pilotBlockTitle}
                            onChange={(e) => setPilotBlockTitle(e.target.value)}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg py-1.5 px-3'
                        />
                    </div>
                    <div className='w-96 mx-auto mb-3'>
                        <label htmlFor="pilotBlockDescription" className='w-96 mx-auto text-left group block cursor-pointer relative'>
                            Pilot Block Description
                        </label>
                        <ReactQuill
                            theme="snow"
                            id='pilotBlockDescription'
                            modules={quillModules}
                            value={pilotBlockDescription}
                            onChange={setPilotBlockDescription}
                            className='w-96 text-left mx-auto border-2 border-gray-400 focus-within:border-indigo-600'
                        />
                    </div>
                </div>
            </div>
            {/* Our Space Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Our Space Block</p>
                    <p className='text-gray-600'>About Our Space block title and description to display on Classes Landing page.</p>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mx-auto mb-3'>
                        <label htmlFor="aboutOurSpaceTitle" className='w-[600px] mx-auto text-left group block cursor-pointer relative'>
                            About Our Space Title
                        </label>
                        <input
                            type="text"
                            id='aboutOurSpaceTitle'
                            value={aboutOurSpaceTitle}
                            onChange={(e) => setAboutOurSpaceTitle(e.target.value)}
                            className='w-[600px] border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg py-1.5 px-3'
                        />
                    </div>
                    <div className='mx-auto mb-3'>
                        <label htmlFor="aboutOurSpaceDescription" className='w-[600px] mx-auto text-left group block cursor-pointer relative'>
                            About Our Space Description
                        </label>
                        <ReactQuill
                            theme="snow"
                            id='aboutOurSpaceDescription'
                            modules={quillModules}
                            value={aboutOurSpaceDescription}
                            onChange={setAboutOurSpaceDescription}
                            className='w-[600px] text-left mx-auto border-2 border-gray-400 focus-within:border-indigo-600'
                        />
                    </div>
                </div>
            </div>
            {/* Classes List Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Classes List Block</p>
                    <p className='text-gray-600'>Manage the description and image to be shown for all classes on Classes landing page</p>
                </div>
                <div className="w-3/4 text-left select-none">
                    {classesData.map((cls, index) => {
                        return (<div key={cls.id} className='w-4/5 mx-auto'>
                            {index !== 0 && <hr className='h-1 rounded-full my-3 bg-gradient-to-r from-indigo-400 via-indigo-300 to-indigo-400' />}
                            <h1 className='font-medium text-lg mb-2'>Class name: {cls.clsName}</h1>
                            <div className='mx-auto mb-3'>
                                <label htmlFor={`classImage_${cls.id}`} className='w-96 group block mx-auto cursor-pointer relative'>
                                    {cls.clsImage === null ? (
                                        <div className='w-96 h-52 text-gray-600 flex flex-col items-center justify-center gap-5 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer'>
                                            <PlusCircleIcon className='w-8 h-8 text-gray-500' /> Select {cls.clsName} class Image
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={cls.clsImage}
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
                                    <input
                                        type="file"
                                        accept='image/*'
                                        className='hidden'
                                        id={`classImage_${cls.id}`}
                                        onChange={(e) => {
                                            if (e.target.files.length > 0) {
                                                //handleClassesDataChange(cls.id, 'clsImage', e.target.files[0])
                                                uploadDynamicContentPics('CLASSLISTBLOCK', cls.clsImage,e.target.files[0], cls.id,'clsImage')
                                            };
                                        }}
                                    />

                                </label>
                            </div>
                            <div className='w-96 mx-auto mb-3'>
                                <label htmlFor={`classDescription_${cls.id}`} className='w-96 mx-auto text-left group block cursor-pointer relative'>
                                    Class Description
                                </label>

                                <ReactQuill
                                    theme="snow"
                                    id={`classDescription_${cls.id}`}
                                    modules={quillModules}
                                    value={cls.clsDescription}
                                    onChange={(value) => handleClassesDataChange(cls.id, 'clsDescription', value)}
                                    className='w-96 mx-auto border-2 border-gray-400 focus-within:border-indigo-600'
                                />
                            </div>
                        </div>)
                    })}
                </div>
            </div>
            {/* Buttons */}
            <div className='flex items-center justify-end mr-10 my-5 gap-5'>
                <Link
                    to='/pages'
                    className='flex items-center gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-4 py-2 rounded-lg font-medium'
                >
                    <XMarkIcon className='w-5 h-5' /> Cancel
                </Link>
                <button
                    onClick={handleClassesLandingPageChangesSave}
                    className='flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium'
                >
                    <CheckIcon className='w-5 h-5' /> Save Changes
                </button>
            </div>
        </div>
    )
}

export default Classes;