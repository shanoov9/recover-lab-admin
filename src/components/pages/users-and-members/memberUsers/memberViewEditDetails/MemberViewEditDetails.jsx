import React, { useEffect, useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useParams } from 'react-router-dom';
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal'
import { bookingServiceApi, classApiService, plansPackagesApiService, transactionsServiceApi } from '../../../../../commonServices/apiService';
import { toast } from 'react-toastify';


const MemberViewEditDetails = () => {
    const params = useParams();
    const location = useLocation();

    const [allPurchases, setAllPurchases] = useState([])
    const [allTransactions, setAllTransactions] = useState([])

    const [allClasses, setAllClasses] = useState([]);
    const [allPlans, setAllPlans] = useState([]);

    const [userInfo, setUserInfo] = useState({});
    const [userPurchases, setUserPurchases] = useState([])
    const [userTransactions, setUserTransactions] = useState([]);

    useEffect(() => {
        console.log(location.state);
        if (location.state) {
            console.log("User data from location state: ", location.state.user);
            setUserInfo(location.state.user)
        }
        getUserPurchases();
        getCurrentTransactions();
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
                    setAllPurchases(res.data.data)
                    setUserPurchases(res.data.data.slice(0, 5))
                }
            })
            .catch((err) => {
                console.log("Error fetching user purchases: ", err)
            })
    }

    const getCurrentTransactions = () => {
        transactionsServiceApi.getAllUserTransactions({ id: params.id })
            .then((res) => {
                console.log("User Transactions: ", res.data.data);
                if (res.data.status === true) {
                    setAllTransactions(res.data.data)
                    setUserTransactions(res.data.data.slice(0, 5))
                }
            })
            .catch((err) => {
                console.log("Error fetching user transactions: ", err)
            })
    }




    // Display the selected purchase and transaction details
    const [showPurchaseDetails, setShowPurchaseDetails] = useState(false)
    const [showTransactionDetails, setShowTransactionDetails] = useState(false)
    const [selectedPurchase, setSelectedPurchase] = useState(null)
    const [selectedTransaction, setSelectedTransaction] = useState(null)



    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const getFormattedDate = (date) => {
        const d = new Date(date)
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    }

    const trClassList = {
        'PLAN': 'bg-sky-200',
        'CLASS': 'bg-orange-200',
        'PACKAGE': 'bg-lime-200',
        'MEMBERSHIP': 'bg-pink-200'
    }

    const activePurchasesList = (
        <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
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
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="whitespace-nowrap px-4 py-2 text-right text-sm font-medium">
                                        <Link
                                            to={`/memberDetails/${params.id}/allPurchases`}
                                            state={{ user: userInfo, purchases: allPurchases }}
                                            title='View All Purchases'
                                            className="rounded-full block w-fit bg-indigo-200 ml-auto px-4 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                            <span className='flex items-center gap-1'>
                                                View All Purchases
                                                <ArrowRightIcon className='w-5 h-5' />
                                            </span>
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )

    const transactionStatusClassList = {
        'DONE': 'bg-green-200 text-green-900',
        'CANCELLED': 'bg-red-200 text-red-900',
        'REFUNDED': 'bg-indigo-200 text-indigo-900',
    }

    const recentTransactionsList = (
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
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-200"
                                    >
                                        Booking ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-left text-sm font-semibold text-gray-200"
                                    >
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-left text-sm font-semibold text-gray-200"
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
                                {userTransactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="block text-left">
                                                    <div className="text-sm font-medium text-gray-900">{getFormattedDate(transaction.createdAt)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap text-left px-12 py-4">
                                            <div className="text-sm text-gray-900">RLQ_{transaction.bookingId}</div>
                                        </td>
                                        <td className="whitespace-nowrap text-left px-12 py-4">
                                            <div className="text-sm text-gray-900">QAR {transaction.amount}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <span className={`text-sm text-center py-1 px-3 rounded-full font-medium ${transactionStatusClassList[transaction.transactionStatus]}`} s>{transaction.transactionStatus}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium flex gap-1">
                                            <button onClick={() => {
                                                setShowTransactionDetails(true);
                                                setSelectedTransaction(transaction)
                                            }}
                                                title='Edit/View Admin' className="rounded-full bg-indigo-200 mx-auto px-4 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="whitespace-nowrap px-4 py-2 text-right text-sm font-medium">
                                        <Link
                                            to={`/memberDetails/${params.id}/allTransactions`}
                                            state={{ user: userInfo, transactions: allTransactions }}
                                            title='View All Purchases'
                                            className="rounded-full block w-fit bg-indigo-200 ml-auto px-4 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                            <span className='flex items-center gap-1'>
                                                View All Transactions
                                                <ArrowRightIcon className='w-5 h-5' />
                                            </span>
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className='container mx-auto px-4 mt-10'>
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
                    < div className='flex gap-2' >
                        <button
                            onClick={() => setShowPurchaseDetails(false)}
                            className='bg-indigo-200 px-4 py-2 rounded text-indigo-900 hover:bg-indigo-300'
                        >
                            Close
                        </button>
                    </div >
                }
            />

            {/* Transaction Details Modal */}
            <HeadlessUIModalComponent
                displayState={showTransactionDetails}
                setDisplayState={setShowTransactionDetails}
                headingChildren={<h1 className='text-xl font-semibold'>Transaction Details</h1>}
                bodyChildren={
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Transaction Date:</label>
                            <span>{getFormattedDate(selectedTransaction?.createdAt)}</span>
                        </div>

                        <div className='flex gap-2'>
                            <label className='font-semibold'>Booking ID:</label>
                            <span>RLQ_{selectedTransaction?.bookingId}</span>
                        </div>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Transaction Amount:</label>
                            <span>QAR {selectedTransaction?.amount}</span>
                        </div>
                        <div className='flex gap-2'>
                            <label className='font-semibold'>Transaction Status:</label>
                            <span
                                className={`text-sm text-center py-1 px-3 rounded-full font-medium ${transactionStatusClassList[selectedTransaction?.transactionStatus]}`}
                            >
                                {selectedTransaction?.transactionStatus}
                            </span>
                        </div>
                    </div>
                }
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            onClick={() => setShowTransactionDetails(false)}
                            className='bg-indigo-200 px-4 py-2 rounded text-indigo-900 hover:bg-indigo-300'
                        >
                            Close
                        </button>
                    </div>
                }
            />
            <Link
                to='/allUsers'
                className='block w-fit bg-indigo-200 px-4 py-2 rounded-full text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
            >
                <ArrowLeftIcon className='w-5 h-5 inline-block mr-2 -mt-1' />
                Back to Members
            </Link>
            <h1
                className='text-2xl font-semibold text-center mb-5'
            >
                Manage Member #{params.id}
            </h1>
            <div className="grid grid-cols-2">
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <p className='font-medium'>Name: </p>
                    <p>{userInfo?.firstName} {userInfo?.lastName}</p>
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <p className='font-medium'>Email ID: </p>
                    <p>{userInfo.email}</p>
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <p className='font-medium'>Contact Number: </p>
                    <p>{userInfo.contactNumber}</p>
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <p className='font-medium'>Date Of Birth: </p>
                    <p>{new Date(userInfo.dob).toDateString()}</p>
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <p className='font-medium'>Gender: </p>
                    <p>{userInfo.gender}</p>
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <p className='font-medium'>Status: </p>
                    <p>
                        {userInfo.status ? (
                            <span className='text-green-900 bg-green-200 px-2 py-0.5 rounded-full'>
                                Active
                            </span>
                        ) : (
                            <span className='text-red-900 bg-red-200 px-2 py-0.5 rounded-full'>
                                Inactive
                            </span>
                        )
                        }
                    </p>
                </div>
            </div>

            <div className='w-11/12 mx-auto mt-10'>
                <div className="flex items-center justify-between">
                    <h1 className='text-xl font-semibold text-left '>Recent Purchases</h1>
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
                {activePurchasesList}
            </div>

            <div className='w-11/12 mx-auto'>
                <h1 className='text-xl font-semibold text-left mt-10 mb-5'>Recent Transactions</h1>
                {recentTransactionsList}
            </div>
        </div >

    )
}

export default MemberViewEditDetails;