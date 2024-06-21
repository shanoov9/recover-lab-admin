import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import HeadlessUIModalComponent from '../../../../../shared-components/modal/HeadlessUIModal';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { bookingServiceApi, classApiService, plansPackagesApiService } from '../../../../../../commonServices/apiService';
import { toast } from 'react-toastify';


const MemberAllPurchases = () => {
    const params = useParams();
    const location = useLocation();

    const [showPurchaseDetails, setShowPurchaseDetails] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const [userPurchases, setUserPurchases] = useState([]);

    const [allPlans, setAllPlans] = useState([]);
    const [allClasses, setAllClasses] = useState([]);


    useEffect(() => {
        getUserPurchases();
        getAllPlans();
        getAllClasses();
    }, [])

    const getAllPlans = () => {
        plansPackagesApiService.getAllplans({ packageType: "PLAN" })
            .then(res => {
                if (res.data.status === true) {
                    setAllPlans(res.data.data)
                }
            }).catch(err => console.error(err))
    }

    const getAllClasses = () => {
        classApiService.getAllClassesComplete()
            .then(res => {
                if (res.data.status === true) {
                    setAllClasses(res.data.data)
                }
            }).catch(err => console.error(err))
    }

    const getUserPurchases = () => {
        bookingServiceApi.getAllUserBooking({ id: params.id })
            .then((res) => {
                console.log("User Purchases: ", res.data.data);
                if (res.data.status === true) {
                    setUserPurchases(res.data.data)
                }
            })
            .catch((err) => {
                console.log("Error fetching user purchases: ", err)
            })
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const getFormattedDate = (date) => {
        const d = new Date(date);
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    }

    const trClassList = {
        'PLAN': 'bg-sky-200',
        'CLASS': 'bg-orange-200',
        'PACKAGE': 'bg-lime-200',
        'MEMBERSHIP': 'bg-pink-200'
    }

    const allPurchasesList = (
        <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-50 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-50">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-200"
                                    >
                                        Booking ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-200"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-left text-sm font-semibold text-gray-200"
                                    >
                                        Start Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-left text-sm font-semibold text-gray-200"
                                    >
                                        End Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-center text-sm font-semibold text-gray-200"
                                    >
                                        Total Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-center text-sm font-semibold text-gray-200"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-center text-sm font-semibold text-gray-200"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-gray-300/50">
                                {userPurchases.map((purchase) => (
                                    <tr key={purchase.id} className={trClassList[purchase.bookingType]}>
                                        <td className="whitespace-nowrap text-left p-4">
                                            <div className="text-sm text-gray-900">RLQ_{purchase.id}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="block text-left">
                                                    <div className="text-sm font-medium text-gray-900">{JSON.parse(purchase.bookingService)?.packageName || JSON.parse(purchase.bookingService)?.className}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap text-left px-12 py-4">
                                            <div className="text-sm text-gray-900">{getFormattedDate(purchase.bookingDate)}</div>
                                        </td>
                                        <td className="whitespace-nowrap text-left px-12 py-4">
                                            <div className="text-sm text-gray-900">{(purchase.bookingType === "PACKAGE" || purchase.bookingType === "MEMBERSHIP") ? `${getFormattedDate(purchase.expiryDate)}` : 'NA'}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="text-sm text-center text-gray-900">{(purchase.bookingType === "CLASS") ? `NA` : `QAR ${parseFloat(purchase.totalAmount)}`}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <span className={`text-sm text-center py-1 px-3 rounded-full font-medium ${purchase.isExpired ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'}`}>{`${purchase.isExpired ? 'Inactive' : 'Active'}`}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium flex gap-1">
                                            <button onClick={() => {
                                                setShowPurchaseDetails(true);
                                                setSelectedPurchase(purchase)
                                            }} title='Edit/View Admin' className="rounded-full bg-white/50 mx-auto px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-white/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            {/* Purchase Details Modal */}
            <HeadlessUIModalComponent
                displayState={showPurchaseDetails}
                setDisplayState={setShowPurchaseDetails}
                headingChildren={<h1 className='text-xl font-semibold'>Purchase Details</h1>}
                bodyChildren={
                    <div className='flex flex-col gap-3'>
                        <div className='flex items-center gap-2'>
                            <label className='font-semibold'>Package Type:</label>
                            <span
                                className={`py-0.5 px-3 font-medium rounded-full ${selectedPurchase?.bookingType === "PLAN" ? 'bg-amber-200 text-amber-900' : selectedPurchase?.bookingType === "PACKAGE" ? 'bg-cyan-200 text-cyan-900' : selectedPurchase?.bookingType === "MEMBERSHIP" ? 'bg-indigo-200 text-indigo-900' : selectedPurchase?.bookingType === "CLASS" ? 'bg-pink-200 text-pink-900' : ''}`}
                            >
                                {selectedPurchase?.bookingType}
                            </span>
                        </div>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Booking ID:</label>
                            <span>RLQ_{selectedPurchase?.id}</span>
                        </div>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Package Name:</label>
                            <span>{selectedPurchase?.bookingService && (JSON.parse(selectedPurchase?.bookingService)?.packageName || JSON.parse(selectedPurchase?.bookingService)?.className)}</span>
                        </div>
                        {selectedPurchase?.bookingService && <div className=''>
                            <label className='font-semibold'>Package Description:</label> <br />
                            <span dangerouslySetInnerHTML={{ __html: (JSON.parse(selectedPurchase?.bookingService)?.longDescription || JSON.parse(selectedPurchase?.bookingService)?.classDescription) }} />
                        </div>}
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Start Date:</label>
                            <span>{getFormattedDate(selectedPurchase?.bookingDate)}</span>
                        </div>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>End Date:</label>
                            <span>{(selectedPurchase?.bookingType === "PACKAGE" || selectedPurchase?.bookingType === "MEMBERSHIP") ? `${getFormattedDate(selectedPurchase?.expiryDate)}` : 'NA'}</span>
                        </div>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Status:</label>
                            <span className={`text-sm text-center py-1 px-3 rounded-full font-medium ${selectedPurchase?.isExpired ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'}`}>{`${selectedPurchase?.isExpired ? 'Inactive' : 'Active'}`}</span>
                        </div>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Total Amount:</label>
                            <span>{(selectedPurchase?.bookingType === "CLASS") ? `NA` : `QAR ${parseFloat(selectedPurchase?.totalAmount)}`}</span>
                        </div>
                        {selectedPurchase?.bookingType === "PACKAGE" && <div>
                            <p className='text-lg font-medium text-gray-700'>Package Contents: </p>
                            {
                                JSON.parse(selectedPurchase?.bookingService)?.packageContent.map((content, index) => {

                                    return (
                                        <div key={index} className='mt-2'>
                                            <span className='block font-medium'>{index + 1}. {allPlans.find(pln => pln.id === content.plan)?.packageName || allClasses.find(pln => pln.id === content.plan)?.className} ({allPlans.find(pln => pln.id === content.plan)?.packageTherapyTime || allClasses.find(pln => pln.id === content.plan)?.classDuration} mins.)</span>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className='block ml-5'>Total Frequency: {content.frequency}</span>
                                                    <span className='block ml-5'>Frequency Used: {content.usedFrequency}</span>
                                                </div>
                                                {
                                                    selectedPurchase?.isExpired ? (
                                                        <span className='text-red-500'>Expired</span>
                                                    ) : (
                                                        <>
                                                            {
                                                                content.usedFrequency < content.frequency
                                                                    ?
                                                                    <button
                                                                        onClick={() => {
                                                                            if (content.usedFrequency >= content.frequency) {
                                                                                toast.error("Already Used Maximum frequency");
                                                                                return;
                                                                            }
                                                                            let newBookingService = JSON.parse(selectedPurchase?.bookingService);
                                                                            newBookingService = {
                                                                                ...newBookingService, packageContent: newBookingService.packageContent.map((cnt) => {
                                                                                    if (cnt.plan === content.plan) {
                                                                                        return { ...cnt, usedFrequency: cnt.usedFrequency + 1 }
                                                                                    }
                                                                                    return cnt
                                                                                })
                                                                            }
                                                                            bookingServiceApi.updateBooking({ id: selectedPurchase?.id, bookingService: newBookingService })
                                                                                .then(res => {
                                                                                    if (res.data.status === true) {
                                                                                        toast.success("Frequency used updated successfully");
                                                                                        getUserPurchases();
                                                                                        let newSelectedPurchase = { ...selectedPurchase, bookingService: JSON.stringify(newBookingService) }
                                                                                        setSelectedPurchase(newSelectedPurchase)
                                                                                    }
                                                                                })
                                                                        }}
                                                                        className='flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-200 text-teal-900 hover:bg-teal-300'
                                                                    >
                                                                        <CheckIcon className='w-4 h-4' /> Use
                                                                    </button>
                                                                    :
                                                                    <p className='text-red-900 bg-red-200 rounded-full px-2 py-1'>Exhausted</p>
                                                            }
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>}
                    </div>
                }
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            onClick={() => setShowPurchaseDetails(false)}
                            className='bg-indigo-200 px-4 py-2 rounded text-indigo-900 hover:bg-indigo-300'
                        >
                            Close
                        </button>
                    </div>
                }
            />
            <Link
                to={`/memberDetails/${params.id}`}
                state={{ user: location.state?.user }}
                className='flex items-center gap-2 w-fit py-1 px-3 rounded-full bg-indigo-200 text-indigo-900 hover:bg-indigo-300 font-semibold mt-5 ml-5'
            >
                <ArrowLeftIcon className='w-5 h-5' /> Back
            </Link>
            <div className="flex w-11/12 mx-auto items-center justify-between">
                <h1 className='text-2xl my-5 font-semibold'>Member #{params.id} All Purchases</h1>
                <div className='flex items-center justify-end mx-6 gap-3'>
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
            <div className='w-11/12 mx-auto'>
                {allPurchasesList}
            </div>
        </div>
    );
};

export default MemberAllPurchases;