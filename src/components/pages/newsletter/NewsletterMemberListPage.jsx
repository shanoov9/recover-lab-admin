import React, { useEffect, useState } from 'react'
import SubscriberListPagination from './SubscriberListPagination'
import { subcribersServiceApi } from '../../../commonServices/apiService'

function NewsletterMemberListPage() {

    const [allSubscribers, setAllSubscribers] = useState([])
    const [currentSubscribers, setCurrentSubscribers] = useState(Array.from({ length: 100 }, (_, i) => ({ id: i + 1, email: `user${i + 1}@example.com` })))

    const handleSubscribersSearch = (e) => {
        const searchQuery = e.target.value
        if (searchQuery.trim() !== '') {
            setCurrentSubscribers(allSubscribers.filter(subscriber => subscriber.email.toLowerCase().includes(searchQuery.trim().toLowerCase())))
        }
        else {
            setCurrentSubscribers(allSubscribers)
        }
    }

    useEffect(() => {
        getCurrentSubscribers();
    }, [])

    const getCurrentSubscribers = () => {
        subcribersServiceApi.getAllSubscribers()
            .then(res => {
                if (res.data.status === true) {
                    setAllSubscribers(res.data.data);
                    setCurrentSubscribers(res.data.data)
                }
            }).catch(err => console.error(err))
    }

    const subscriberListJSX = (
        <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-50 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-50">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                    >
                                        Email
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-gray-300/50">
                                <SubscriberListPagination
                                    data={currentSubscribers}
                                    itemsPerPage={10}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className='p-5' >
            <div className='flex items-center justify-between mx-10' >
                <h1 className='text-2xl'>Newsletter Subscribers</h1>
                <div className='relative'>
                    <input
                        type="search"
                        className='w-96 h-10 px-3 border-2 border-gray-400 focus:border-indigo-600 rounded-lg focus:outline-none'
                        placeholder='Search Subscribers (email)'
                        onChange={handleSubscribersSearch}
                    />
                </div>
            </div>
            <div className=''>
                {subscriberListJSX}
            </div>
        </div>
    )
}

export default NewsletterMemberListPage