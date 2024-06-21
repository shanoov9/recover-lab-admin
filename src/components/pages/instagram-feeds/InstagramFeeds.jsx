import React, { useEffect, useState } from 'react'
import { EyeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import HeadlessUIModalComponent from '../../shared-components/modal/HeadlessUIModal';
import { instagramFeedsServiceApi } from '../../../commonServices/apiService'
import { toast } from 'react-toastify'

const InstagramFeeds = () => {

    const [showAddModal, setshowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [feedList, setFeedList] = useState([])

    const [addFeedURL, setAddFeedURL] = useState("");

    const [feedDeleteId, setFeedDeleteId] = useState(null);


    useEffect(() => {
        getAllFeeds();
    }, [])

    const getAllFeeds = () => {
        instagramFeedsServiceApi.getAllFeeds()
            .then(res => {
                if (res.data.status === true) {
                    setFeedList(res.data.data)
                }
            }).catch(err => console.error(err))
    }

    const addNewFeedModalBodyJSX = (
        <div className='my-5'>
            <div>
                <label htmlFor='addFeedURL' className="block text-sm mb-1 font-medium">
                    Enter Instagram Link
                </label>
                <input
                    type="text"
                    id='addFeedURL'
                    name='addFeedURL'
                    placeholder='https://www.instagram.com/p/XXXXX-XXXXX/'
                    value={addFeedURL}
                    onChange={(e) => setAddFeedURL(e.target.value)}
                    className="block w-full px-3 py-2 border-2 border-gray-300 focus:outline-none rounded-md shadow-sm placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>
    )

    const feedListJSX = (
        <div className="mt-6 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-50 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-50">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                    >
                                        Feed
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-gray-300/50">
                                {feedList.map((feed) => (
                                    <tr key={feed.id}>
                                        <td className="whitespace-nowrap px-4 py-4 text-left">
                                            <div className="text-sm text-gray-900">{feed.instaUrl}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm justify-center font-medium flex gap-2">
                                            <a href={feed.instaUrl} target='_blank' title='View Feed' className="rounded-xl bg-teal-200 p-2 text-sm font-semibold text-teal-900 shadow-sm hover:bg-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                <EyeIcon className='w-5 h-5' />
                                            </a>
                                            <button onClick={() => { setFeedDeleteId(feed.id); setShowDeleteModal(true) }} title='Delete Feed' className="rounded-xl bg-red-200 p-2 text-sm font-semibold text-red-900 shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                <TrashIcon className='w-5 h-5' />
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

    const newFeedSave = () => {
        if (addFeedURL.trim() === "") {
            toast.error("URL Cannot be empty!");
            return;
        }
        let body = {
            instaUrl: addFeedURL
        }

        instagramFeedsServiceApi.saveNewFeed(body)
            .then(res => {
                if (res.data.status === true) {
                    toast.success("Feed added successfully");
                    setAddFeedURL("");
                    setshowAddModal(false);
                    getAllFeeds();
                }
            }).catch(err => {
                console.error(err);
                toast.error("Could not add feed!")
                setshowAddModal(false)
            })

    }

    const deleteFeed = () => {
        if (feedDeleteId !== null) {
            let body = {
                id: feedDeleteId
            }

            instagramFeedsServiceApi.deleteFeed(body)
                .then(res => {
                    if (res.data.status === true) {
                        toast.success("Feed deleted successfully.")
                        setFeedDeleteId(null);
                        setShowDeleteModal(false)
                        getAllFeeds();
                    }
                }).catch(err => {
                    console.error(err);
                    toast.success("Could not delete feed!")
                    setFeedDeleteId(null);
                    setShowDeleteModal(false)

                })
        }
    }

    return (
        <div className='p-5'>
            {/* Add feed modal */}
            <HeadlessUIModalComponent
                displayState={showAddModal}
                setDisplayState={setshowAddModal}
                headingChildren={"Add New Feed"}
                bodyChildren={addNewFeedModalBodyJSX}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { newFeedSave() }}
                        >
                            Add Feed
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setshowAddModal(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }

            />

            {/* Delete feed modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteModal}
                setDisplayState={setShowDeleteModal}
                headingChildren={<span>Delete Feed</span>}
                bodyChildren={<div className='my-5'>
                    <p>Do you really want to delete this Feed?</p>
                </div>}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { deleteFeed() }}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowDeleteModal(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            <div className='flex items-center justify-between mx-10' >
                <h1 className='text-2xl'>Instagram Feeds</h1>
                <button
                    onClick={() => { setshowAddModal(true) }}
                    className='bg-indigo-200 hover:bg-indigo-300 text-indigo-900 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg'
                >
                    <PlusIcon className='w-5 h-5' />
                    Add New Feed
                </button>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                {feedListJSX}
            </div>

        </div>
    )
}

export default InstagramFeeds;