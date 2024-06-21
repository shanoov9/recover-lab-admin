import React, { useEffect, useRef, useState } from 'react';
import AllAppointments from '../all-appointments/AllAppointments';
import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { transactionsServiceApi } from '../../../commonServices/apiService'

const AllTransactions = () => {

    const dateRef = useRef(null);

    // Replace this with your actual transaction data
    const [allTransactions, setAllTransactions] = useState([]);
    const [currentTransactions, setCurrentTransactions] = useState(allTransactions);

    useEffect(() => {
        getTransactionList();
    }, []);

    const getTransactionList = () => {
        transactionsServiceApi.getAllTransactions()
            .then(response => {
                console.log(response.data);
                if (response.data.status === true) {
                    setAllTransactions(response.data.data);
                    setCurrentTransactions(response.data.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    const transactionStatusClasses = {
        'DONE': 'bg-green-200 text-green-900',
        'CANCELLED': 'bg-red-200 text-red-900',
        'REFUNDED': 'bg-sky-200 text-sky-900',
    }

    return (
        <div className='p-5'>
            <div className="flex flex-col">
                <div className="flex justify-between items-center my-4">
                    <div className=" text-left">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            All Transactions
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
                                    setCurrentTransactions(allTransactions.filter(trans => new Date(trans.createdAt).toDateString() === new Date(val).toDateString()));
                                }}
                                className="bg-indigo-200 px-3 py-2 rounded-lg focus:outline-none"
                            />
                            {dateRef?.current?.value !== '' && <button
                                onClick={() => {
                                    console.log(dateRef?.current?.value);
                                    setCurrentTransactions(allTransactions);
                                    dateRef.current.value = '';
                                }}
                                className="bg-red-200 hover:bg-red-300 p-2 rounded-full text-red-900 focus:outline-none"
                            >
                                <NoSymbolIcon className="h-5 w-5" />
                            </button>}
                        </div>

                        {/* Search */}
                        <input
                            type="search"
                            onChange={(e) => {
                                let val = e.target.value;
                                if (val === '') {
                                    setCurrentTransactions(allTransactions);
                                } else {
                                    setCurrentTransactions(allTransactions.filter(trans => (
                                        `RLQ_${trans.bookingId}`.toLowerCase().includes(val.toLowerCase()) ||
                                        trans.transactionId.toLowerCase().includes(val.toLowerCase()) ||
                                        trans.packagePlanName.toLowerCase().includes(val.toLowerCase())
                                    )
                                    ));
                                }
                            }
                            }
                            placeholder="Search by Transaction ID or Service Name"
                            dlaceholder="Search by ID, Name, Email, Mobile Number"
                            className="bg-indigo-200 px-3 py-2 w-[22rem] placeholder-gray-500 rounded-lg focus:outline-none"
                        />
                    </div>
                </div>
                <div className="-my-2 -mx-4 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="max-h-[70vh] overflow-y-auto border border-gray-50 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead className="bg-gray-300">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            Transaction ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            Booking ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            Service
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
                                            Amount
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="max-h-96 overflow-y-scroll divide-y divide-gray-50 bg-gray-300/50">
                                    {currentTransactions.length === 0 && <tr>
                                        <td colSpan={7} className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center justify-center gap-2 text-center">
                                                <div className="block text-center">
                                                    <div className="text-sm font-medium text-gray-900">No transactions to display!</div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>}
                                    {currentTransactions.map(transaction => <tr key={transaction.id}>
                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{transaction.transactionId}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">RLQ_{transaction.bookingId}</div>
                                        </td>

                                        <td className="whitespace-nowrap text-left px-1 py-4 font-semibold">
                                            <div className="text-sm text-gray-900">{transaction.packagePlanName}</div>
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{new Date(transaction.createdAt).toDateString()}</div>
                                            <div className="text-sm text-gray-900">{new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">QAR {parseFloat(transaction.amount)}</div>
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-3 text-center text-sm font-medium">
                                            <div className="flex justify-center">
                                                <span
                                                    className={`py-1 px-2 rounded-full ${transactionStatusClasses[transaction.transactionStatus]}`}
                                                >
                                                    {transaction.transactionStatus}
                                                </span>
                                            </div>
                                        </td>

                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTransactions;