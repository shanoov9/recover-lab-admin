import React, { useEffect, useRef, useState } from 'react';
import { bookingServiceApi, classApiService, pageDetailApiService, plansPackagesApiService } from '../../../commonServices/apiService';
import { FIXED_PAGES, PLAN_TYPE_SINGLE_TIME_PLAN } from '../../../commonServices/commonDataService';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import HeadlessUIModalComponent from '../../shared-components/modal/HeadlessUIModal';

const AllAppointments = () => {

    const dateRef = useRef(null);

    const [allAppointments, setAllAppointments] = useState([]);
    const [currentAppointments, setCurrentAppointments] = useState([]);
    const [centerList, setCenterList] = useState([]);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [appointmentIdToCancel, setAppointmentIdToCancel] = useState(null);
    const [processRefund, setProcessRefund] = useState(false);

    const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [selectedPurchaseType, setSelectedPurchaseType] = useState(null);

    // plans
    const [allPlans, setAllPlans] = useState([])

    // Classes
    const [allClasses, setAllClasses] = useState([]);
    const [allClassTypes, setAllClassTypes] = useState([]);

    useEffect(() => {
        getCenterList();
        getAllBooking();
        getAllClasses();
        getAllplans();
        getAllClassTypes();
    }, []);

    const getAllplans = () => {
        plansPackagesApiService.getAllplans({ packageType: PLAN_TYPE_SINGLE_TIME_PLAN }).then(response => {
            console.log('all currentPlans', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllPlans(responseData)
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

    const getAllClasses = () => {
        classApiService.getAllClassesComplete().then(response => {
            console.log('all classes', response.data.data)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAllClasses(responseData)
            }
        }).catch(err => console.error(err))
    }

    const checkDate = (bookingDate, bookingTime) => {
        var ToDate = new Date()
        const booking = bookingDate.substring(0, 10) + "T" + bookingTime + ".000Z"

        if (new Date(booking).getTime() <= ToDate.getTime()) {
            return false;
        }
        return true;
    }

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

    const getAllBooking = () => {
        bookingServiceApi.getAllBookings()
            .then((response) => {
                console.log(response.data.data)
                if (response.data.status === true) {
                    setAllAppointments(response.data.data);
                    setCurrentAppointments(response.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }


    const trClasses = {
        'PLAN': 'bg-sky-200',
        'CLASS': 'bg-orange-200',
        'PACKAGE': 'bg-lime-200',
        'MEMBERSHIP': 'bg-pink-200'
    }

    const cancelBooking = (id) => {
        bookingServiceApi.changeBookingStatus({ id, isExpired: true, processRefund })
            .then((response) => {
                if (response.data.status === true) {
                    toast.success("Appointment Cancelled Successfully");
                    let updatedAppointments = allAppointments.map(booking => {
                        if (booking.id === id) {
                            booking.isExpired = true;
                        }
                        return booking;
                    });
                    setAllAppointments(updatedAppointments);
                    setCurrentAppointments(updatedAppointments);
                    setAppointmentIdToCancel(null);
                }
            })
            .catch((error) => {
                console.log(error);
                setAppointmentIdToCancel(null);
            });
    };

    const getFormattedTime = (time) => {
        if (time === undefined) {
            return "";
        }
        let hours = parseInt(time.split(':')[0]);
        let minutes = parseInt(time.split(':')[1]);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    }

    const planDetailsJSX = (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Plan Name:</div>
                <div className="text-gray-900">{selectedPurchase?.packageName}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Price:</div>
                <div className="text-gray-900">{selectedPurchase?.packageAmount}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Duration:</div>
                <div className="text-gray-900">{selectedPurchase?.packageTherapyTime} mins.</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Service Name:</div>
                <div className="text-gray-900">{selectedPurchase?.treatmentServiceName}</div>
            </div>
        </div>
    );

    const packageDetailsJSX = (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Package Name:</div>
                <div className="text-gray-900">{selectedPurchase?.packageName}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Price:</div>
                <div className="text-gray-900">{selectedPurchase?.packageAmount}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Package Category:</div>
                <div className="text-gray-900">{selectedPurchase?.packageTypeName}</div>
            </div>
            <div className='text-left my-2'>
                <p className='text-gray-900 mb-3'><span className='font-medium text-gray-950'>Package Contents:</span> </p>
                <div className='grid grid-cols-1 gap-2'>
                    {selectedPurchase?.packageContent && selectedPurchase?.packageContent.map((content, index) => (
                        <div key={index} className='bg-indigo-100 flex items-center justify-between px-4 py-2 rounded-lg shadow-md shadow-indigo-200 border border-indigo-300'>
                            <span>{allPlans.find(pln => pln.id === content.plan)?.packageName || allClasses.find(pln => pln.id === content.plan)?.className}</span>
                            <span>{content.frequency} X {allPlans.find(pln => pln.id === content.plan)?.packageTherapyTime || allClasses.find(pln => pln.id === content.plan)?.classDuration} mins.</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const membershipDetailsJSX = (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Membership Name:</div>
                <div className="text-gray-900">{selectedPurchase?.packageName}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Price:</div>
                <div className="text-gray-900">{selectedPurchase?.packageAmount}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Validity:</div>
                <div className="text-gray-900">{selectedPurchase?.packageDuration} days</div>
            </div>
            <div className="">
                <div className="text-gray-700 font-medium">Membership Description:</div>
                <div className="text-gray-900" dangerouslySetInnerHTML={{ __html: selectedPurchase?.longDescription }} />
            </div>
        </div>
    );

    const classDetailsJSX = (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Class Name:</div>
                <div className="text-gray-900">{selectedPurchase?.className}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Price:</div>
                <div className="text-gray-900">{selectedPurchase?.classPrice}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Duration:</div>
                <div className="text-gray-900">{selectedPurchase?.classDuration} mins.</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Instructor Name:</div>
                <div className="text-gray-900">{selectedPurchase?.instructorName}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Class Type:</div>
                <div className="text-gray-900">{allClassTypes.find(ct => ct.id === parseInt(selectedPurchase?.classType))?.className}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Class Start Time:</div>
                <div className="text-gray-900">{getFormattedTime(selectedPurchase?.classStartTime)}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-gray-700 font-medium">Class Batch Size:</div>
                <div className="text-gray-900">{selectedPurchase?.batchSize}</div>
            </div>
            <div className='text-left my-2'>
                <p className='mb-2 font-medium'>Class Days: </p>
                <div className="flex">
                    {
                        selectedPurchase?.classDays && Object.keys(JSON.parse(selectedPurchase?.classDays)).map((day, index) => (
                            JSON.parse(selectedPurchase?.classDays)[day] &&
                            <p key={index} className=' mx-1 px-2 py-1 bg-indigo-200 text-indigo-900 text-sm rounded-lg'>{day.slice(0, 3).toUpperCase()}</p>
                        ))
                    }
                </div>
            </div>
        </div>
    )

    return (
        <div className='p-5'>
            {/* View */}
            <HeadlessUIModalComponent
                displayState={showPurchaseDetails}
                setDisplayState={setShowPurchaseDetails}
                headingChildren={<h1 className="text-2xl font-semibold text-gray-800">Purchase Details</h1>}
                bodyChildren={
                    selectedPurchaseType === "PLAN"
                        ?
                        planDetailsJSX
                        :
                        (selectedPurchaseType === "PACKAGE"
                            ?
                            packageDetailsJSX
                            :
                            (selectedPurchaseType === "MEMBERSHIP"
                                ?
                                membershipDetailsJSX
                                :
                                (selectedPurchaseType === "CLASS"
                                    ?
                                    classDetailsJSX
                                    :
                                    <></>)))
                }
                footerChildren={
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowPurchaseDetails(false);
                                setSelectedPurchase(null);
                                setSelectedPurchaseType(null);
                            }}
                            className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-4 py-2 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                }
            />
            {/* Cancel */}
            <HeadlessUIModalComponent
                displayState={showCancelModal}
                setDisplayState={setShowCancelModal}
                headingChildren={<h1 className="text-2xl font-semibold text-gray-800">Cancel Appointment</h1>}
                bodyChildren={<div>
                    <p className="text-gray-700 my-5">Are you sure you want to cancel appointment <b>RLQ_{appointmentIdToCancel}</b>?</p>
                    <div class="inline-flex items-center">
                        <label class="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="checkbox">
                            <input type="checkbox"
                                class="before:content[''] peer relative border-gray-400 h-5 w-5 cursor-pointer appearance-none focus:outline-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                                id="checkbox"
                                value={processRefund}
                                onChange={(e) => setProcessRefund(e.target.checked)}
                            />
                            <span
                                class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                    stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </span>
                        </label>
                        Process Refund
                    </div>
                </div>
                }
                footerChildren={
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowCancelModal(false);
                                cancelBooking(appointmentIdToCancel);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => {
                                setShowCancelModal(false)
                                setAppointmentIdToCancel(null)
                            }}
                            className="bg-red-200 hover:bg-red-300 text-red-900 px-4 py-2 rounded-lg"
                        >
                            No
                        </button>
                    </div>
                }
            />
            <div className="flex flex-col">
                <div className="flex justify-between items-center my-4">
                    <div className=" text-left">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            All Bookings
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Date */}
                        <div className='flex items-center gap-1'>
                            <input
                                type="date"
                                ref={dateRef}
                                id='bookingDate'
                                onChange={(e) => {
                                    let val = e.target.value;
                                    setCurrentAppointments(allAppointments.filter(booking => new Date(booking.bookingDate).toDateString() === new Date(val).toDateString()));
                                }}
                                className="bg-indigo-200 px-3 py-2 rounded-lg focus:outline-none"
                            />
                            {dateRef?.current?.value !== '' && <button
                                onClick={() => {
                                    console.log(dateRef?.current?.value);
                                    setCurrentAppointments(allAppointments);
                                    dateRef.current.value = '';
                                }}
                                className="bg-red-200 hover:bg-red-300 p-2 rounded-full text-red-900 focus:outline-none"
                            >
                                <NoSymbolIcon className="h-5 w-5" />
                            </button>}
                        </div>

                        {/* Center */}
                        <select
                            name="bookingCenter"
                            onChange={(e) => {
                                let val = e.target.value;
                                if (val === "all") {
                                    setCurrentAppointments(allAppointments);
                                } else {
                                    setCurrentAppointments(allAppointments.filter(booking => booking.bookingCenter === val));
                                }
                            }}
                            className="bg-indigo-200 px-3 py-2 rounded-lg focus:outline-none"
                        >
                            <option value="all">All Centers</option>
                            {centerList.map(center => <option key={center.id} value={center.id}>{center.name}</option>)}
                        </select>

                        {/* Search */}
                        <input
                            type="search"
                            onChange={(e) => {
                                let val = e.target.value.trim();
                                setCurrentAppointments(allAppointments
                                    .filter(booking => (
                                        `RLQ_${booking.id}`.toLowerCase().includes(val.toLowerCase())
                                        || (booking.guestOneDetails)?.fName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (booking.guestOneDetails)?.lName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (`${(booking.guestOneDetails)?.fName} ${(booking.guestOneDetails)?.lName}`)?.toLowerCase()?.includes(val.toLowerCase())
                                        || (booking.guestOneDetails)?.firstName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (booking.guestOneDetails)?.lastName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (`${(booking.guestOneDetails)?.firstName} ${(booking.guestOneDetails)?.lastName}`)?.toLowerCase()?.includes(val.toLowerCase())
                                        || (booking.guestTwoDetails)?.fName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (booking.guestTwoDetails)?.lName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (`${(booking.guestTwoDetails)?.fName} ${(booking.guestTwoDetails)?.lName}`)?.toLowerCase()?.includes(val.toLowerCase())
                                        || (booking.guestOneDetails)?.email.toLowerCase().includes(val.toLowerCase())
                                        || (booking.guestOneDetails)?.mNumber?.toLowerCase()?.includes(val.toLowerCase())
                                        || (booking.guestOneDetails)?.contactNumber?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.bookingService)?.packageName?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.bookingService)?.className?.toLowerCase()?.includes(val.toLowerCase())
                                    )))
                            }
                            }
                            placeholder="Search by ID, Name, Email, Mobile Number"
                            className="bg-indigo-200 px-3 py-2 w-[22rem] placeholder-gray-500 rounded-lg focus:outline-none"
                        />
                    </div>
                </div>
                <div className="-my-2 -mx-4 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="max-h-96 overflow-y-auto border border-gray-50 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead className="bg-gray-300">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            Customer
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            Contact
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Package
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Date & Time
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Center
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Cancel
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-gray-300/50">
                                    {currentAppointments.length === 0 && <tr>
                                        <td colSpan={7} className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center justify-center gap-2 text-center">
                                                <div className="block text-center">
                                                    <div className="text-sm font-medium text-gray-900">No Appointments to display!</div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>}
                                    {currentAppointments.map(booking => <tr key={booking.id} className={trClasses[booking.bookingType]}>
                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">RLQ_{booking.id} </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {booking.bookingGuest === "TwoTwoGuest"
                                                    ?
                                                    <div className="block text-left">
                                                        <div className="text-sm font-medium text-gray-900">{booking.guestOneDetails?.fName} {booking.guestOneDetails?.lName}</div>
                                                        <div className="text-sm font-medium text-gray-900">{booking.guestTwoDetails?.fName} {booking.guestTwoDetails?.lName}</div>
                                                    </div>
                                                    :
                                                    <div className="text-sm font-medium text-gray-900">{booking.guestOneDetails?.firstName} {booking.guestOneDetails?.lastName}</div>
                                                }
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap text-left px-1 py-4 font-semibold">
                                            {
                                                booking.guestOneDetails ?
                                                    <>
                                                        <div className="text-sm text-gray-900">{(booking.guestOneDetails)?.email}</div>
                                                        {booking.bookingGuest === "TwoTwoGuest"
                                                            ?
                                                            <div className="text-sm text-gray-900">{(booking.guestOneDetails)?.mNumber}</div>
                                                            :
                                                            <div className="text-sm text-gray-900">{(booking.guestOneDetails)?.contactNumber}</div>}
                                                    </>
                                                    :
                                                    <>
                                                        <div className="text-sm text-gray-900">{(booking.guestTwoDetails)?.email}</div>
                                                        {booking.bookingGuest === "TwoTwoGuest"
                                                            ?
                                                            <div className="text-sm text-gray-900">{(booking.guestTwoDetails)?.mNumber}</div>
                                                            :
                                                            <div className="text-sm text-gray-900">{(booking.guestTwoDetails)?.contactNumber}</div>}</>
                                            }

                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{JSON.parse(booking.bookingService).packageName || JSON.parse(booking.bookingService).className} </div>
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{new Date(booking.bookingDate).toDateString()}</div>
                                            <div className="text-sm text-gray-900">{booking.bookingTime}</div>
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{centerList.find(center => center.id === parseInt(booking.bookingCenter))?.name}</div>
                                        </td>
                                        <td className="whitespace-nowrap py-2 text-center text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    console.log(booking.bookingType)
                                                    setShowPurchaseDetails(true);
                                                    setSelectedPurchase(JSON.parse(booking.bookingService));
                                                    setSelectedPurchaseType(booking.bookingType);
                                                }}
                                                className="text-blue-900 bg-white/50 hover:bg-white/75 py-1 px-2 rounded-full"
                                            >
                                                Details
                                            </button>

                                            <>
                                                {booking.isExpired === true &&
                                                    <span className="text-red-900">
                                                        Cancelled
                                                    </span>
                                                }

                                                {
                                                    (booking.isExpired === false && checkDate(booking.bookingDate, booking.bookingTime)) &&
                                                    (
                                                        <button
                                                            onClick={() => {
                                                                setAppointmentIdToCancel(booking.id);
                                                                setShowCancelModal(true);
                                                            }}
                                                            className="text-red-900 bg-white/50 hover:bg-white/75 py-1 px-2 rounded-full">
                                                            Cancel
                                                        </button>
                                                    )
                                                }
                                            </>
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-2 flex items-center justify-end mx-6 gap-3'>
                <div className="flex bg-sky-200 text-green-900 rounded-full justify-center items-center gap-2 px-2">
                    PLAN
                </div>
                <div className="flex bg-orange-200 text-orange-900 rounded-full justify-center items-center gap-2 px-2">
                    CLASS
                </div>
                <div className="flex bg-lime-200 text-lime-900 rounded-full justify-center items-center gap-2 px-2">
                    PACKAGE
                </div>
                <div className="flex bg-pink-200 text-pink-900 rounded-full justify-center items-center gap-2 px-2">
                    MEMBERSHIP
                </div>
            </div>
        </div>
    );
};

export default AllAppointments;