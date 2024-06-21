import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { PlusCircleIcon, ArrowPathIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../commonServices/quillModules';
import { imageFileServiceApi, pageDetailApiService } from '../../../../commonServices/apiService';
import { FIXED_PAGES, IMAGE_BASE_URL } from '../../../../commonServices/commonDataService';
import { IMAGE_UPDATED_SUCCESSFULLY, PAGE_UPDATED_SUCCESSFULLY } from '../../../../commonServices/messageConstants';
import { toast } from 'react-toastify';

const Services = (props) => {
    const navigate = useNavigate();

    const [pilotBlockImage, setPilotBlockImage] = useState(null);
    const [pilotBlockTitle, setPilotBlockTitle] = useState('');
    const [treatmentBenefits, setTreatmentBenefits] = useState('');
    const [treatmentsData, setTreatmentsData] = useState([]);

    // useEffect(() => {
    //     let serviceList = props.allServices.allServices.allServicesData;
    //     console.log(serviceList);
    //     let tempTreatmentsData = serviceList.map(service => ({
    //         id: service.id,
    //         treatmentServiceName: service.treatmentServiceName,
    //         treatmentServiceDescription: "",
    //         treatmentServiceImage: null
    //     }))
    //     console.log(tempTreatmentsData);
    //     setTreatmentsData(prev => tempTreatmentsData)
    //     setTimeout(() => {
    //         console.log(treatmentsData);
    //     }, 1500);
    // }, [props.allServices.allServices.allServicesData])

    useEffect(() => {
        getPageDetail()
    }, [props.allServices.allServices.allServicesData])

    const getPageDetail = () => {
        const body = {
            pageTitle: FIXED_PAGES.SERVICES
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

        setPilotBlockTitle(pageData?.pilotBlockData?.pilotBlockTitle)
        setPilotBlockImage(pageData?.pilotBlockData?.pilotBlockImage)


        setTreatmentBenefits(pageData?.treatmentBenefits)

        console.log(pageData?.treatmentsData);
        console.log(treatmentsData);
        // let tempTreatmentsData = treatmentsData.map(item => {
        //     let service = pageData?.treatmentsData.find(data => data.id === item.id)
        //     if (service) {
        //         return {
        //             id: service.id,
        //             treatmentServiceName: service.treatmentServiceName,
        //             treatmentServiceDescription: service.treatmentServiceDescription,
        //             treatmentServiceImage: service.treatmentServiceImage
        //         }
        //     } else {
        //         return item
        //     }
        // })

        let tempTreatmentsData = []
        props.allServices.allServices.allServicesData.forEach(service => {
            let serviceData = pageData?.treatmentsData.find(data => data.id === service.id)
            if (serviceData) {
                tempTreatmentsData.push({
                    id: service.id,
                    treatmentServiceName: service.treatmentServiceName,
                    treatmentServiceDescription: serviceData.treatmentServiceDescription,
                    treatmentServiceImage: serviceData.treatmentServiceImage
                })
            } else{
                tempTreatmentsData.push({
                    id: service.id,
                    treatmentServiceName: service.treatmentServiceName,
                    treatmentServiceDescription: "",
                    treatmentServiceImage: null
                })
            }
        })
        console.log(tempTreatmentsData);
        setTreatmentsData(tempTreatmentsData)

    }

    const handleTreatmentsDataChange = (id, key, value) => {
        let updatedTreatmentsData = treatmentsData.map(service => {
            if (service.id === id) {
                service[key] = value;
            }
            return service;
        })
        setTreatmentsData(updatedTreatmentsData);
    }

    const handleServicesLandingPageChanges = (e) => {
        e.preventDefault();
        let data = {
            pilotBlockData: {
                pilotBlockImage,
                pilotBlockTitle
            },
            treatmentBenefits,
            treatmentsData
        }
        console.log(data);
        const body = {
            pageTitle: FIXED_PAGES.SERVICES,
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

    const servicesLandingPageChangesSave = () => {
        let data = {
            pilotBlockData: {
                pilotBlockImage,
                pilotBlockTitle
            },
            treatmentBenefits,
            treatmentsData
        }
        console.log(data);
        const body = {
            pageTitle: FIXED_PAGES.SERVICES,
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
                if (block == 'TREATMENTLISTBLOCK') {
                    handleTreatmentsDataChange(classId, key, IMAGE_BASE_URL + responseData.data.data.filename)
                    servicesLandingPageChangesSave()
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
                    servicesLandingPageChangesSave()
                }
            }
        }).catch(err => console.error(err))

    }

    return (
        <div className='p-5'>
            <h1 className="my-5 text-2xl font-medium">Edit Services Landing Page</h1>
            {/* Pilot Block Image */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Pilot Block</p>
                    <p className='text-gray-600'>Select title and image to display on pilot block of the Services page.</p>
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
                                    uploadPic('PILOTBLOCK', pilotBlockImage, e.target.files[0])
                                    // if (e.target.files.length > 0) setPilotBlockImage(e.target.files[0]);
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
                </div>
            </div>
            {/* Treatment Benefits Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Treatment Benefits Block</p>
                    <p className='text-gray-600'>Treatment benefits to display on the Services page. Use Bullet points if applicable.</p>
                </div>
                <div className='w-3/4 select-none'>
                    <div className='mx-auto mb-3'>
                        <label htmlFor="treatmentBenefits" className='w-[600px] mx-auto text-left group block cursor-pointer relative'>
                            Treatment Benefits
                        </label>
                        <ReactQuill
                            theme="snow"
                            modules={quillModules}
                            value={treatmentBenefits}
                            onChange={setTreatmentBenefits}
                            className='w-[600px] mx-auto border-2 border-gray-400 focus-within:border-indigo-600'
                        />
                    </div>
                </div>
            </div>
            {/* Services List Block */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Services List Block</p>
                    <p className='text-gray-600'>Manage the description and image to be shown for all services on Services landing page</p>
                </div>
                <div className="w-3/4 text-left select-none">
                    {treatmentsData.map((service, index) => {
                        return (<div key={service.id} className='w-4/5 mx-auto'>
                            {index !== 0 && <hr className='h-1 rounded-full my-3 bg-gradient-to-r from-indigo-400 via-indigo-300 to-indigo-400' />}
                            <h1 className='font-medium text-lg mb-2'>Service name: {service.treatmentServiceName}</h1>
                            <div className='mx-auto mb-3'>
                                <label htmlFor={`serviceImage_${service.id}`} className='w-96 group block mx-auto cursor-pointer relative'>
                                    {service.treatmentServiceImage === null ? (
                                        <div className='w-96 h-52 text-gray-600 flex flex-col items-center justify-center gap-5 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer'>
                                            <PlusCircleIcon className='w-8 h-8 text-gray-500' /> Select {service.treatmentServiceName} service Image
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={service.treatmentServiceImage}
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
                                        id={`serviceImage_${service.id}`}
                                        onChange={(e) => {
                                            uploadDynamicContentPics('TREATMENTLISTBLOCK', service.treatmentServiceImage, e.target.files[0], service.id, 'treatmentServiceImage')
                                            // if (e.target.files.length > 0) handleTreatmentsDataChange(service.id, 'treatmentServiceImage', e.target.files[0]);
                                        }}
                                    />

                                </label>
                            </div>
                            <div className='w-96 mx-auto mb-3'>
                                <label htmlFor={`serviceDescription_${service.id}`} className='w-96 mx-auto text-left group block cursor-pointer relative'>
                                    Service Description
                                </label>

                                <ReactQuill
                                    theme="snow"
                                    modules={quillModules}
                                    value={service.treatmentServiceDescription}
                                    onChange={(value) => handleTreatmentsDataChange(service.id, 'treatmentServiceDescription', value)}
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
                    onClick={handleServicesLandingPageChanges}
                    className='flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium'
                >
                    <CheckIcon className='w-5 h-5' /> Save Changes
                </button>
            </div>
        </div>
    )
}

export default connect(state => ({ allServices: state }))(Services);