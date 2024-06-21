import React, { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import HeadlessUIModalComponent from '../../shared-components/modal/HeadlessUIModal'
import { FIXED_PAGES } from '../../../commonServices/commonDataService'
import { pageDetailApiService } from '../../../commonServices/apiService'
import { toast } from 'react-toastify'

const Settings = () => {

    const [completePageData, setCompletePageData] = useState({})

    // Center related states
    const [centerList, setCenterList] = useState([])

    // Add Center States
    const [showAddCenter, setShowAddCenter] = useState(false)
    const [centerName, setCenterName] = useState('')
    const [centerAddress, setCenterAddress] = useState('')
    const [centerPhone1, setCenterPhone1] = useState('')
    const [centerPhone2, setCenterPhone2] = useState('')

    // Edit Center States
    const [showEditCenter, setShowEditCenter] = useState(false)
    const [centerIdToEdit, setCenterIdToEdit] = useState(null)
    const [editCenterName, setEditCenterName] = useState('')
    const [editCenterAddress, setEditCenterAddress] = useState('')
    const [editCenterPhone1, setEditCenterPhone1] = useState('')
    const [editCenterPhone2, setEditCenterPhone2] = useState('')

    // Delete Center States
    const [showDeleteCenter, setShowDeleteCenter] = useState(false)
    const [centerIdToDelete, setCenterIdToDelete] = useState(null)

    // Booking related settings states
    const [preparationTime, setPreparationTime] = useState(0)
    const [taxPercentage, setTaxPercentage] = useState(0)

    useEffect(() => {
        getPageData()
    }, [])

    const updateDataOnPage = (data) => {
        setCenterList(data.centerList)
        setPreparationTime(data.preparationTime)
        setTaxPercentage(data.taxPercentage)
    }

    const getPageData = () => {
        let body = {
            pageTitle: FIXED_PAGES.SETTINGS,
            pageType: 'MAIN',
        }
        pageDetailApiService.getPageDetails(body)
            .then(response => {
                console.log(response)
                if (response.data.status === true) {
                    let data = response.data.data.pageData
                    updateDataOnPage(data)
                    setCompletePageData(data)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }


    const centerListJSX = (
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
                                        Center
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-gray-300/50">
                                {centerList.length === 0 && (
                                    <tr>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium text-gray-900" colSpan="3">
                                            No centers found
                                        </td>
                                    </tr>
                                )}
                                {centerList.map((center) => (
                                    <tr key={center.id}>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="block text-left">
                                                    <div className="text-sm font-medium text-gray-900">{center.name}</div>
                                                    <div className="text-sm text-gray-600">{center.address}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap text-left px-12 py-4">
                                            <div className="text-sm text-gray-900">{center.phone1}</div>
                                            <div className="text-sm text-gray-600">{center.phone2}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium flex gap-2 justify-center">
                                            <button onClick={() => {
                                                setCenterIdToEdit(center.id);
                                                setEditCenterName(center.name);
                                                setEditCenterAddress(center.address);
                                                setEditCenterPhone1(center.phone1);
                                                setEditCenterPhone2(center.phone2);
                                                setShowEditCenter(true)
                                            }}
                                                title='Edit Center'
                                                className="rounded-xl bg-indigo-200 p-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCenterIdToDelete(center.id);
                                                    setShowDeleteCenter(true)
                                                }}
                                                title='Delete Center'
                                                className="rounded-xl bg-red-200 p-2 text-sm font-semibold text-red-900 shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                            >
                                                <TrashIcon className="w-5 h-5" />
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

    const addCenterModalBodyJSX = (
        <div className='flex flex-col gap-4 my-4'>
            <div className='flex flex-col gap-2'>
                <label htmlFor='centerName' className='text-sm font-semibold text-gray-700'>Center Name</label>
                <input
                    type='text'
                    id='centerName'
                    placeholder='Recovery Lab Qatar'
                    value={centerName}
                    onChange={(e) => setCenterName(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='centerAddress' className='text-sm font-semibold text-gray-700'>Center Address</label>
                <input
                    type='text'
                    id='centerAddress'
                    placeholder='123, Street 1, Doha, Qatar'
                    value={centerAddress}
                    onChange={(e) => setCenterAddress(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='centerPhone1' className='text-sm font-semibold text-gray-700'>Phone 1</label>
                <input
                    type='text'
                    id='centerPhone1'
                    placeholder='1234567890'
                    value={centerPhone1}
                    onChange={(e) => setCenterPhone1(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='centerPhone2' className='text-sm font-semibold text-gray-700'>Phone 2</label>
                <input
                    type='text'
                    id='centerPhone2'
                    placeholder='1234567890'
                    value={centerPhone2}
                    onChange={(e) => setCenterPhone2(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
        </div>
    )

    const handleAddCenter = (e) => {
        e.preventDefault()
        if (centerName.trim() === '' || centerAddress.trim() === '' || centerPhone1.trim() === '' || centerPhone2.trim() === '') {
            toast.error('Please fill all the fields')
            return
        }
        let newCenter = {
            id: (centerList.reduce((max, obj) => Math.max(max, obj['id']), null) + 1),
            name: centerName,
            address: centerAddress,
            phone1: centerPhone1,
            phone2: centerPhone2,
        }
        setCenterList([...centerList, newCenter])
        savePageDataForCenters([...centerList, newCenter])
        toast.success('Center added successfully.')
        setShowAddCenter(false)
    }

    const editCenterModalBodyJSX = (
        <div className='flex flex-col gap-4 my-4'>
            <div className='flex flex-col gap-2'>
                <label htmlFor='editCenterName' className='text-sm font-semibold text-gray-700'>Center Name</label>
                <input
                    type='text'
                    id='editCenterName'
                    placeholder='Recovery Lab Qatar'
                    value={editCenterName}
                    onChange={(e) => setEditCenterName(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='editCenterAddress' className='text-sm font-semibold text-gray-700'>Center Address</label>
                <input
                    type='text'
                    id='editCenterAddress'
                    placeholder='123, Street 1, Doha, Qatar'
                    value={editCenterAddress}
                    onChange={(e) => setEditCenterAddress(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='editCenterPhone1' className='text-sm font-semibold text-gray-700'>Phone 1</label>
                <input
                    type='text'
                    id='editCenterPhone1'
                    placeholder='1234567890'
                    value={editCenterPhone1}
                    onChange={(e) => setEditCenterPhone1(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor='editCenterPhone2' className='text-sm font-semibold text-gray-700'>Phone 2</label>
                <input
                    type='text'
                    id='editCenterPhone2'
                    placeholder='1234567890'
                    value={editCenterPhone2}
                    onChange={(e) => setEditCenterPhone2(e.target.value)}
                    className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                />
            </div>
        </div>
    )

    const handleEditSaveCenter = () => {
        if (editCenterName.trim() === '' || editCenterAddress.trim() === '' || editCenterPhone1.trim() === '' || editCenterPhone2.trim() === '') {
            toast.error('Please fill all the fields')
            return
        }
        console.log("Running");
        let newCenterList = centerList.map(center => {
            if (center.id === centerIdToEdit) {
                return {
                    id: center.id,
                    name: editCenterName,
                    address: editCenterAddress,
                    phone1: editCenterPhone1,
                    phone2: editCenterPhone2,
                }
            }
            return center
        })
        setCenterList(newCenterList)
        savePageDataForCenters(newCenterList)
        toast.success('Center updated successfully.')
        setShowEditCenter(false)
        setCenterIdToEdit(null)
        setEditCenterName('')
        setEditCenterAddress('')
        setEditCenterPhone1('')
        setEditCenterPhone2('')
    }

    const handleDeleteCenter = (centerId) => {
        let newCenterList = centerList.filter(center => center.id !== centerId)
        setCenterList(newCenterList)
        savePageDataForCenters(newCenterList)
        toast.success('Center deleted successfully.')
        setCenterIdToDelete(null)
        setShowDeleteCenter(false)
    }

    // Main
    const savePageData = () => {
        let data = {
            centerList: centerList,
            preparationTime: preparationTime,
            taxPercentage: taxPercentage,
        }
        let body = {
            pageTitle: FIXED_PAGES.SETTINGS,
            pageData: data,
            pageType: 'MAIN',
            status: true,
        }
        pageDetailApiService.savePageDetails(body)
            .then(response => {
                console.log(response)
                if (response.data.status === true) {
                    toast.success('Settings saved successfully')
                    getPageData()
                } else {
                    toast.error('Failed to save settings')
                }
            })
            .catch(error => {
                console.log(error)
                toast.error('Failed to save settings')
            })
    }

    // For center list
    const savePageDataForCenters = (centerList) => {
        let data = {
            centerList,
            preparationTime: preparationTime,
            taxPercentage: taxPercentage,
        }
        let body = {
            pageTitle: FIXED_PAGES.SETTINGS,
            pageData: data,
            pageType: 'MAIN',
            status: true,
        }
        pageDetailApiService.savePageDetails(body)
            .then(response => {
                console.log(response)
                if (response.data.status === true) {
                    getPageData()
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className='p-5'>
            {/* Add Center Modal */}
            <HeadlessUIModalComponent
                displayState={showAddCenter}
                setDisplayState={setShowAddCenter}
                headingChildren={"Add Center"}
                bodyChildren={addCenterModalBodyJSX}
                footerChildren={
                    <div className='flex gap-4'>
                        <button
                            onClick={handleAddCenter}
                            title='Add Center'
                            className='bg-indigo-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-700 text-indigo-100 font-semibold'
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setShowAddCenter(false)}
                            title='Cancel'
                            className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Edit Center Modal */}
            <HeadlessUIModalComponent
                displayState={showEditCenter}
                setDisplayState={setShowEditCenter}
                headingChildren={"Edit Center"}
                bodyChildren={editCenterModalBodyJSX}
                footerChildren={
                    <div className='flex gap-4'>
                        <button
                            onClick={handleEditSaveCenter}
                            title='Save Center'
                            className='bg-indigo-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-700 text-indigo-100 font-semibold'
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setShowEditCenter(false)
                                setCenterIdToEdit(null)
                                setEditCenterName('')
                                setEditCenterAddress('')
                                setEditCenterPhone1('')
                                setEditCenterPhone2('')
                            }}
                            title='Cancel'
                            className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Delete Center Modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteCenter}
                setDisplayState={setShowDeleteCenter}
                headingChildren={"Delete Center"}
                bodyChildren={<p>Are you sure you want to delete this <b>{ }</b>?</p>}
                footerChildren={
                    <div className='flex gap-4'>
                        <button
                            onClick={() => { handleDeleteCenter(centerIdToDelete) }}
                            title='Delete Center'
                            className='bg-red-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-red-700 text-red-100 font-semibold'
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => { setCenterIdToDelete(null); setShowDeleteCenter(false) }}
                            title='Cancel'
                            className='bg-red-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-red-400 text-red-900 font-semibold'
                        >
                            Cancel
                        </button>
                    </div>
                }
            />

            {/* Center List */}
            <div>
                <div className='flex mx-10 items-center justify-between' >
                    <h1 className='text-2xl'>Center List</h1>
                    <button
                        onClick={() => setShowAddCenter(true)}
                        title='Add Center'
                        className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                    >
                        <PlusIcon className="w-5 h-5" /> Add Center
                    </button>
                </div>
                <div className='mt-5 w-10/12 mx-auto'>
                    {centerListJSX}
                </div>
            </div>

            {/* Booking Related Settings */}
            <div className='mt-10 mx-10'>
                <h1 className='text-2xl text-left'>Booking Related Settings</h1>
                <div className='mt-5 w-10/12 mx-auto'>
                    <div className='flex gap-4'>
                        <div className='flex w-1/2 text-left flex-col gap-2'>
                            <label htmlFor='preparationTime' className='text-sm font-semibold text-gray-700'>Preparation Time (in minutes)</label>
                            <input
                                type='number'
                                id='preparationTime'
                                placeholder='30'
                                value={preparationTime}
                                onChange={(e) => setPreparationTime(e.target.value)}
                                className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                            />
                        </div>
                        <div className='flex w-1/2 text-left flex-col gap-2'>
                            <label htmlFor='taxPercent' className='text-sm font-semibold text-gray-700'>Tax (in percentage)</label>
                            <input
                                type='number'
                                id='taxPercent'
                                placeholder='15'
                                value={taxPercentage}
                                onChange={(e) => setTaxPercentage(e.target.value)}
                                className='border-2 border-gray-300 focus:border-indigo-600 focus:outline-none rounded-lg p-2'
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className='my-10 mx-10 flex gap-3 justify-end'>
                <button
                    title='Reset Settings'
                    onClick={() => { updateDataOnPage(completePageData) }}
                    className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                >
                    Reset Settings
                </button>
                <button
                    title='Save Settings'
                    onClick={() => { savePageData() }}
                    className='bg-indigo-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-700 text-indigo-100 font-semibold'
                >
                    Save Settings
                </button>
            </div>
        </div>
    )
}

export default Settings;