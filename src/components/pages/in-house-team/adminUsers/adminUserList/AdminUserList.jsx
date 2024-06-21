import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { PlusIcon } from '@heroicons/react/24/outline'
import userPlaceholder from '../../../../../assets/images/userPlaceholder.png'
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal';
import { toast } from 'react-toastify';
import { ADMIN_CREATED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants';
import { userApiService } from '../../../../../commonServices/apiService';
import axios from 'axios';


const AdminUserList = () => {
    const navigate = useNavigate()
    const [adminUsers, setAdminUsers] = useState([
        // { id: 1, name: "Admin One", username: "admin1", contactNumber: 1234567890, email: "abc@gm.com", isActive: true },
        // { id: 2, name: "Admin Two", username: "admin2", contactNumber: 1234567890, email: "xyz@gm.com", isActive: false },
        // { id: 3, name: "Admin Three", username: "admin3", contactNumber: 1234567890, email: "123@gm.com", isActive: true },
    ])

    const navigateToPage = (userData) => {
        navigate(`/adminDetails`, { state: { user: userData } })
    }
    const [showAddAdmin, setShowAddAdmin] = useState(false)

    const [adminFirstName, setAdminFirstName] = useState('')
    const [adminLastName, setAdminLastName] = useState('')
    const [adminUsername, setAdminUsername] = useState('')
    const [adminEmail, setAdminEmail] = useState('')
    const [adminContactNumber, setAdminContactNumber] = useState('')

    const [allCountries, setAllCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState('+974')


    useEffect(() => {
        userApiService.getAllAdmins().then(response => {
            if (response.data.status == true) {
                setAdminUsers(response.data.data)
            }
        })

        axios.get('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json')
            .then((res) => {
                console.log(res.data);
                setAllCountries(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    // const pagesList = adminUsers.map((adminUser) => {
    //     return <li className='h-14 bg-gray-200 rounded-lg px-3 mt-2 flex'>
    //         <div className="flex items-center justify-between w-full">
    //             <div className="ml-4">
    //                 <div className="text-left font-medium text-gray-900">{adminUser.name}</div>
    //             </div>
    //             <div>
    //                 <button onClick={() => navigateToPage(adminUser.id)} title='Edit Page' className="rounded-full bg-indigo-600/80 mx-[3px] px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
    //                     Edit / View
    //                 </button>
    //             </div>
    //         </div>
    //     </li>
    // })

    const adminList = (
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
                                        Admin
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-left text-sm font-normal text-gray-700"
                                    >
                                        Contact
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-12 py-3.5 text-center text-sm font-normal text-gray-700"
                                    >
                                        Status
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
                                {adminUsers.map((admin) => (
                                    <tr key={admin.id}>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className='w-10 h-10'>
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={userPlaceholder}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="block text-left">
                                                    <div className="text-sm font-medium text-gray-900">{admin.firstName} {admin.lastName}</div>
                                                    <div className="text-sm text-gray-600">@{admin.userName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap text-left px-12 py-4">
                                            <div className="text-sm text-gray-900">{admin.email}</div>
                                            <div className="text-sm text-gray-600">{admin.contactNumber}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div>
                                                {admin.status ? (
                                                    <span className="px-2 inline-flex text-[13px] leading-5 font-semibold rounded-full bg-green-200 text-green-900">Active</span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-[13px] leading-5 font-semibold rounded-full bg-red-200 text-red-900">Inactive</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium flex gap-1">
                                            <button onClick={() => navigateToPage(admin)} title='Edit/View Admin' className="rounded-xl bg-indigo-200 mx-auto px-4 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                Edit / View
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

    const addAdminModalBody = (
        <div className='flex flex-col gap-4'>
            <div className="flex gap-2">
                <div className='flex w-1/2 flex-col gap-2'>
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        value={adminFirstName}
                        onChange={(e) => setAdminFirstName(e.target.value)}
                        className="block w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                    />
                </div>
                <div className='flex w-1/2 flex-col gap-2'>
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        value={adminLastName}
                        onChange={(e) => setAdminLastName(e.target.value)}
                        className="block w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                    />
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="block w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="block w-full px-3 py-2 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                />
            </div>
            <div className='flex flex-col gap-2'>
                <label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">Contact Number</label>
                <div className='flex'>
                    <select
                        id="country"
                        name="country"
                        className="block w-1/4 px-3 py-2 border-2 border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                        {allCountries.map((country) => (
                            <option key={country.code} value={country.dial_code}>{country.code} ({country.dial_code})</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="contactNumber"
                        id="contactNumber"
                        required
                        maxLength={11}
                        value={adminContactNumber}
                        onChange={(e) => setAdminContactNumber(e.target.value.replace(/[^0-9]/, ''))}
                        className="block w-3/4 px-3 py-2 border-2 border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none sm:text-sm"
                    />
                </div>
            </div>
        </div >
    )

    const handleAddAdmin = () => {
        if (adminFirstName.trim() === '' || adminLastName.trim() === '' || adminUsername.trim() === '' || adminEmail.trim() === '' || adminContactNumber.trim() === '') {
            toast.error('Please fill all the fields')
            return
        }

        const body = {
            userType: 8,  // superadmin=9, admin=8, user=1
            firstName: adminFirstName,
            lastName: adminLastName,
            userName: adminUsername,
            contactNumber: `${selectedCountry}-${adminContactNumber}`,
            email: adminEmail,
        }
        console.log(body)
        userApiService.createAdmin(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                const responseData = response.data.data
                setAdminUsers([...adminUsers, {
                    id: responseData.id,
                    firstName: responseData.firstName,
                    lastName: responseData.lastName,
                    userName: responseData.userName,
                    email: responseData.email,
                    contactNumber: responseData.contactNumber,
                    isActive: responseData.status
                }]);
                setShowAddAdmin(false)
                setAdminFirstName('')
                setAdminLastName('')
                setAdminUsername('')
                setAdminEmail('')
                setAdminContactNumber('')
                toast.success(ADMIN_CREATED_SUCCESSFULLY)
            }
        })



    }

    return (
        <div className='w-full p-5'>
            <HeadlessUIModalComponent
                displayState={showAddAdmin}
                setDisplayState={setShowAddAdmin}
                headingChildren={<span>Add New Admin</span>}
                bodyChildren={addAdminModalBody}
                footerChildren={
                    <div className='flex gap-2'>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={handleAddAdmin}
                        >
                            Add Admin
                        </button>
                        <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            onClick={() => { setShowAddAdmin(false) }}
                        >
                            Cancel
                        </button>
                    </div>
                }
            />
            <div className='flex mx-10 items-center justify-between' >
                <h1 className='text-2xl'>Admins</h1>
                <button
                    onClick={() => setShowAddAdmin(true)}
                    className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                >
                    <PlusIcon className="w-5 h-5" /> Add Admin
                </button>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <ul>
                    {adminList}
                </ul>
            </div>
        </div>
    )
}

export default AdminUserList