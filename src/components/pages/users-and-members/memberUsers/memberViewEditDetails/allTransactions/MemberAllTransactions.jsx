import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import HeadlessUIModalComponent from '../../../../../shared-components/modal/HeadlessUIModal';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const MemberAllTransactions = () => {
    const params = useParams();
    const location = useLocation();

    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [showTransactionDetails, setShowTransactionDetails] = useState(false)


    const [userTransactions, setUserTransactions] = useState([])

    useEffect(() => {
        const userTransactions = location.state?.transactions;
        if (userTransactions) {
            setUserTransactions(userTransactions)
        }
    }, [location.state?.transactions])

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const getFormattedDate = (date) => {
        const d = new Date(date);
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    }

    const transactionStatusClassList = {
        'DONE': 'bg-green-200 text-green-900',
        'CANCELLED': 'bg-red-200 text-red-900',
        'REFUNDED': 'bg-indigo-200 text-indigo-900',
    }


    const allTransactionsList = (
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
                                        className="px-12 py-3.5 text-left text-sm font-semibold text-gray-200"
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
                                            <span className={`text-sm text-center py-1 px-3 rounded-full font-medium ${transactionStatusClassList[transaction.transactionStatus]}`}s>{transaction.transactionStatus}</span>
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div>
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
                to={`/memberDetails/${params.id}`}
                state={{ user: location.state?.user }}
                className='flex items-center gap-2 w-fit py-1 px-3 rounded-full bg-indigo-200 text-indigo-900 hover:bg-indigo-300 font-semibold mt-5 ml-5'
            >
                <ArrowLeftIcon className='w-5 h-5' /> Back
            </Link>
            <h1 className='text-2xl my-5 font-semibold'>Member #{params.id} All Transactions</h1>
            <div className='w-11/12 mx-auto'>
                {allTransactionsList}
            </div>
        </div>
    );
};

export default MemberAllTransactions;