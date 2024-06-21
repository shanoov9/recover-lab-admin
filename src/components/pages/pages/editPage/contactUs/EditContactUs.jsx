import React, { useEffect, useState } from 'react'
import { imageFileServiceApi, pageDetailApiService } from '../../../../../commonServices/apiService';
import { FIXED_PAGES, IMAGE_BASE_URL } from '../../../../../commonServices/commonDataService';
import { ArrowPathIcon, CheckIcon, PlusCircleIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { quillModules } from '../../../../../commonServices/quillModules';
import { toast } from 'react-toastify';
import { IMAGE_UPDATED_SUCCESSFULLY, PAGE_UPDATED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants';
import { Link, useNavigate } from 'react-router-dom'

const EditContactUs = () => {

    const navigate = useNavigate();

    // Pilot Block States
    const [pilotBlockImage, setPilotBlockImage] = useState(null);
    const [pilotBlockTitle, setPilotBlockTitle] = useState('');
    const [pilotBlockDescription, setPilotBlockDescription] = useState('');

    // Contact Us States
    const [centerList, setCenterList] = useState([]);
    const [centerData, setCenterData] = useState({
        centerId: '',
        centerName: '',
        centerAddress: '',
        centerPhone: '',
    });

    // Email IDs
    const [inquiryEmail, setInquiryEmail] = useState('');
    const [eventsEmail, setEventsEmail] = useState('');
    const [hiringEmail, setHiringEmail] = useState('');
    const [pressEmail, setPressEmail] = useState('');

    // Opening and Closing Hours
    const [mondayToThursday, setMondayToThursday] = useState({
        openingTime: '00:00',
        closingTime: '00:00',
    });
    const [friday, setFriday] = useState({
        openingTime: '00:00',
        closingTime: '00:00',
    });
    const [saturdaySunday, setSaturdaySunday] = useState({
        openingTime: '00:00',
        closingTime: '00:00',
    });

    // Holiday Hours
    const [holidayHours, setHolidayHours] = useState([]);
    const [holidayDay, setHolidayDay] = useState('');
    const [holidayDate, setHolidayDate] = useState(new Date());
    const [holidayOpeningTime, setHolidayOpeningTime] = useState('00:00');
    const [holidayClosingTime, setHolidayClosingTime] = useState('00:00');

    useEffect(() => {
        getPageDetails();
        getCenterList();
    }, []);

    const getCenterList = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.SETTINGS })
            .then((response) => {
                if (response.data.status === true) {
                    const centers = response.data.data.pageData.centerList;
                    setCenterList(centers);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getPageDetails = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.CONTACTUS })
            .then((response) => {
                if (response.data.status === true) {
                    const pageData = response.data.data.pageData;
                    setUpdatedData(pageData);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const setUpdatedData = (pageData) => {
        setPilotBlockImage(pageData.pilotBlock.image);
        setPilotBlockTitle(pageData.pilotBlock.title);
        setPilotBlockDescription(pageData.pilotBlock.description);

        setCenterData(pageData.centerData);

        setInquiryEmail(pageData.emailIds.inquiryEmail);
        setEventsEmail(pageData.emailIds.eventsEmail);
        setHiringEmail(pageData.emailIds.hiringEmail);
        setPressEmail(pageData.emailIds.pressEmail);

        setMondayToThursday(pageData.openingClosingHours.mondayToThursday);
        setFriday(pageData.openingClosingHours.friday);
        setSaturdaySunday(pageData.openingClosingHours.saturdaySunday);

        setHolidayHours(pageData.holidayHours);
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
                    saveContactUsData();
                }
            }
        }).catch(err => console.error(err))
    }

    // Save data on button click
    const handleContactUsSaveData = (e) => {
        e.preventDefault();
        const contactUsData = {
            pilotBlock: {
                image: pilotBlockImage,
                title: pilotBlockTitle,
                description: pilotBlockDescription,
            },
            centerData: centerData,
            emailIds: {
                inquiryEmail: inquiryEmail,
                eventsEmail: eventsEmail,
                hiringEmail: hiringEmail,
                pressEmail: pressEmail,
            },
            openingClosingHours: {
                mondayToThursday: mondayToThursday,
                friday: friday,
                saturdaySunday: saturdaySunday,
            },
            holidayHours: holidayHours,
        }
        let body = {
            pageTitle: FIXED_PAGES.CONTACTUS,
            pageData: contactUsData,
            pageType: 'MAIN',
            status: 1,
        }
        pageDetailApiService.savePageDetails(body)
            .then((response) => {
                if (response.data.status === true) {
                    toast.success(PAGE_UPDATED_SUCCESSFULLY);
                    navigate('/pages')
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Save data on button click
    const saveContactUsData = () => {
        const contactUsData = {
            pilotBlock: {
                image: pilotBlockImage,
                title: pilotBlockTitle,
                description: pilotBlockDescription,
            },
            centerData: centerData,
            emailIds: {
                inquiryEmail: inquiryEmail,
                eventsEmail: eventsEmail,
                hiringEmail: hiringEmail,
                pressEmail: pressEmail,
            },
            openingClosingHours: {
                mondayToThursday: mondayToThursday,
                friday: friday,
                saturdaySunday: saturdaySunday,
            },
            holidayHours: holidayHours,
        }
        let body = {
            pageTitle: FIXED_PAGES.CONTACTUS,
            pageData: contactUsData,
            pageType: 'MAIN',
            status: 1,
        }
        pageDetailApiService.savePageDetails(body)
            .then((response) => {
                if (response.data.status === true) {
                    toast.success(IMAGE_UPDATED_SUCCESSFULLY);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className='p-5'>
            <h1 className='text-2xl mb-5'>Edit Contact Us Page</h1>
            {/* Pilot Block Data */}
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
                            className='border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                        />
                    </div>
                </div>
            </div>

            {/* Contact Us Data */}
            <div className="flex border-2 p-3 rounded-lg border-gray-400 hover:border-indigo-400 my-2">
                <div className='flex flex-col gap-5 w-1/4'>
                    <p className='text-xl text-black'>Contact Us</p>
                    <p className='text-gray-600'>This content will be on the contact us page.</p>
                </div>
                <div className='w-3/4 select-none'>
                    <p className='text-xl text-black'>Center Details</p>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="centerName"
                            className='block'
                        >
                            Center to Display
                        </label>
                        <select
                            id='centerName'
                            value={centerData.centerId}
                            onChange={(e) => {
                                const center = centerList.find(center => center.id == e.target.value)
                                setCenterData({
                                    centerId: center.id,
                                    centerName: center.name,
                                    centerAddress: center.address,
                                    centerPhone: center.phone1,
                                })
                            }}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        >
                            <option value='' disabled>Select Center</option>
                            {centerList.map(center => (
                                <option key={center.id} value={center.id}>{center.name}</option>
                            ))}
                        </select>
                    </div>

                    <p className='text-xl text-black my-2'>Email IDs to contact</p>
                    <div>
                        <div className='mb-3 w-1/2 mx-auto text-left'>
                            <label
                                htmlFor="centerEmail1"
                                className='block'
                            >
                                For General Inquiries
                            </label>
                            <input
                                type="email"
                                id='centerEmail1'
                                placeholder='inquiry@rlq.com'
                                value={inquiryEmail}
                                onChange={(e) => setInquiryEmail(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            />
                        </div>
                        <div className='mb-3 w-1/2 mx-auto text-left'>
                            <label
                                htmlFor="centerEmail2"
                                className='block'
                            >
                                For events, partnerships, and space rentals
                            </label>
                            <input
                                type="email"
                                id='centerEmail2'
                                placeholder='events@rlq.com'
                                value={eventsEmail}
                                onChange={(e) => setEventsEmail(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            />
                        </div>
                        <div className='mb-3 w-1/2 mx-auto text-left'>
                            <label
                                htmlFor="centerEmail3"
                                className='block'
                            >
                                For Hiring Inquiries
                            </label>
                            <input
                                type="email"
                                id='centerEmail3'
                                placeholder='career@rlq.com'
                                value={hiringEmail}
                                onChange={(e) => setHiringEmail(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            />
                        </div>
                        <div className='mb-3 w-1/2 mx-auto text-left'>
                            <label
                                htmlFor="centerEmail4"
                                className='block'
                            >
                                For Press Requests
                            </label>
                            <input
                                type="email"
                                id='centerEmail4'
                                placeholder='press@rlq.com'
                                value={pressEmail}
                                onChange={(e) => setPressEmail(e.target.value)}
                                className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                            />
                        </div>
                    </div>

                    <p className='text-xl text-black my-2'>Opening and Closing Hours</p>
                    <div className='w-1/2 mx-auto'>
                        <p className='text-gray-900 font-medium text-left'>Monday to Thursday</p>
                        <div className="flex items-center gap-3">
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="mondayToThursdayOpeningTime"
                                    className='block'
                                >
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    id='mondayToThursdayOpeningTime'
                                    value={mondayToThursday.openingTime}
                                    onChange={(e) => setMondayToThursday({ ...mondayToThursday, openingTime: e.target.value })}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="mondayToThursdayClosingTime"
                                    className='block'
                                >
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    id='mondayToThursdayClosingTime'
                                    value={mondayToThursday.closingTime}
                                    onChange={(e) => setMondayToThursday({ ...mondayToThursday, closingTime: e.target.value })}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                        </div>

                        <p className='text-gray-900 font-medium text-left'>Friday</p>
                        <div className="flex items-center gap-3">
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="fridayOpeningTime"
                                    className='block'
                                >
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    id='fridayOpeningTime'
                                    value={friday.openingTime}
                                    onChange={(e) => setFriday({ ...friday, openingTime: e.target.value })}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="fridayClosingTime"
                                    className='block'
                                >
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    id='fridayClosingTime'
                                    value={friday.closingTime}
                                    onChange={(e) => setFriday({ ...friday, closingTime: e.target.value })}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                        </div>

                        <p className='text-gray-900 font-medium text-left'>Saturday & Sunday</p>
                        <div className="flex items-center gap-3">
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="satSunOpeningTime"
                                    className='block'
                                >
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    id='satSunOpeningTime'
                                    value={saturdaySunday.openingTime}
                                    onChange={(e) => setSaturdaySunday({ ...saturdaySunday, openingTime: e.target.value })}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="satSunClosingTime"
                                    className='block'
                                >
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    id='satSunClosingTime'
                                    value={saturdaySunday.closingTime}
                                    onChange={(e) => setSaturdaySunday({ ...saturdaySunday, closingTime: e.target.value })}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                        </div>
                    </div>

                    <p className='text-xl text-black my-2'>Holiday Opening Hours</p>
                    <div className='w-1/2 mx-auto'>
                        <div className="flex items-center gap-3">
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="holidayDay"
                                    className='block'
                                >
                                    Holiday Day
                                </label>
                                <input
                                    type="text"
                                    id='holidayDay'
                                    value={holidayDay}
                                    onChange={(e) => setHolidayDay(e.target.value)}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                            <div className='mb-3 w-1/2 mx-auto text-left'>
                                <label
                                    htmlFor="holidayDate"
                                    className='block'
                                >
                                    Holiday Date
                                </label>
                                <input
                                    type="date"
                                    id='holidayDate'
                                    value={holidayDate}
                                    onChange={(e) => setHolidayDate(e.target.value)}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className='mb-3 w-1/3 mx-auto text-left'>
                                <label
                                    htmlFor="holidayOpeningTime"
                                    className='block'
                                >
                                    Opening Time
                                </label>
                                <input
                                    type="time"
                                    id='holidayOpeningTime'
                                    value={holidayOpeningTime}
                                    onChange={(e) => setHolidayOpeningTime(e.target.value)}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                            <div className='mb-3 w-1/3 mx-auto text-left'>
                                <label
                                    htmlFor="holidayClosingTime"
                                    className='block'
                                >
                                    Closing Time
                                </label>
                                <input
                                    type="time"
                                    id='holidayClosingTime'
                                    value={holidayClosingTime}
                                    onChange={(e) => setHolidayClosingTime(e.target.value)}
                                    className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setHolidayHours([...holidayHours, {
                                        id: holidayHours.reduce((max, obj) => Math.max(max, obj['id']), null) + 1,
                                        day: holidayDay,
                                        date: holidayDate,
                                        openingTime: holidayOpeningTime,
                                        closingTime: holidayClosingTime,
                                    }])
                                    setHolidayDay('')
                                    setHolidayDate(new Date())
                                    setHolidayOpeningTime('00:00')
                                    setHolidayClosingTime('00:00')
                                }}
                                className='w-1/3 flex items-center justify-center mt-2.5 font-medium gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 py-2 border-2 border-transparent rounded-lg'
                            >
                                <PlusIcon className='w-5 h-5' /> Add
                            </button>
                        </div>
                        <div>
                            <ul>
                                {holidayHours.map(holiday => (
                                    <li
                                        key={holiday.id}
                                        className='rounded-lg p-2 my-2 bg-teal-100 text-left'
                                    >
                                        <p className='font-medium text-lg'>{holiday.day}</p>
                                        <div className="flex items-center justify-between gap-3">
                                            <p>{new Date(holiday.date).toDateString()}</p>
                                            <p>{holiday.openingTime} - {holiday.closingTime}</p>
                                            <button
                                                onClick={() => {
                                                    setHolidayHours(holidayHours.filter(h => h.id !== holiday.id))
                                                }}
                                                className='p-2 bg-red-200 hover:bg-red-300 rounded-lg text-red-900'
                                            >
                                                <TrashIcon className='w-5 h-5' />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className='flex items-center justify-end gap-5 mt-5'>
                <Link
                    to={'/pages'}
                    className='flex items-center justify-center font-medium gap-1 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 py-2 px-4 border-2 border-transparent rounded-lg'
                >
                    <XMarkIcon className='w-5 h-5' />
                    Cancel
                </Link>
                <button
                    onClick={handleContactUsSaveData}
                    className='flex items-center justify-center font-medium gap-1 bg-indigo-600 hover:bg-indigo-700 text-indigo-100 py-2 px-4 border-2 border-transparent rounded-lg'
                >
                    <CheckIcon className='w-5 h-5' />
                    Save
                </button>
            </div>

        </div>
    )
}

export default EditContactUs;