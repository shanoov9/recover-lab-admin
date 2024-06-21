import React, { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useParams, useLocation } from 'react-router-dom';
import userPlaceholder from '../../../../../assets/images/userPlaceholder.png'
import { userApiService } from '../../../../../commonServices/apiService';
import { toast } from 'react-toastify';
import { ADMIN_DELETED, ADMIN_STATUS_CHANGED_DISABLED, ADMIN_STATUS_CHANGED_ENABLED } from '../../../../../commonServices/messageConstants';
import { useNavigate } from "react-router-dom";



const AdminViewEditDetails = () => {
    const navigate = useNavigate()
    const params = useParams();
    console.log(params)
    const location = useLocation();
    console.log(location)

    const [userInfo, setUserInfo] = useState({})
    // const [enabled, setEnabled] = useState(false)
    const [profilePic, setProfilePic] = useState(userPlaceholder)

    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editUserName, setEditUserName] = useState('');
    // const [editEmail, setEditEmail] = useState('');
    const [editContact, setEditContact] = useState('');


    const handleProfilePicChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setProfilePic(reader.result)
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        if (location.state) {
            setUserInfo(location.state.user)
        }
    }, [])

    const handelAdminStatusChange = (adminId, newStatus) => {
        console.log(adminId, newStatus)
        const body = {
            id: adminId,
            status: newStatus
        }
        userApiService.changeStatus(body).then(response => {
            if (response.data.status == true) {
                setUserInfo(prev => ({ ...prev, status: newStatus }))
                const toastMessage = newStatus == true ? ADMIN_STATUS_CHANGED_ENABLED : ADMIN_STATUS_CHANGED_DISABLED
                toast.success(toastMessage)
            }
        })
    }

    const deleteAdmin = (id) => {
        console.log(id)
        const body = {
            id: id
        }
        userApiService.deleteAdmin(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                toast.success(ADMIN_DELETED)
                navigate("/inHouseTeam");
            }
        })
    }


    const handleSaveDetails = (e) => {
        e.preventDefault();
        if (userInfo.firstName == '' || userInfo.userName == '' || userInfo.email == '' || userInfo.contactNumber == '') {
            toast.error('Please fill all the fields')
            return
        }

        const body = {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            userName: userInfo.userName,
            contactNumber: userInfo.contactNumber
        }

        userApiService.updateUser(body).then(response => {
            console.log(response)
            if (response.data.status == true) {
                toast.success('Details updated successfully')
                navigate("/inHouseTeam");
            }
        }).catch(error => {
            console.log(error)
            toast.error('Something went wrong')
        })
    }

    return (
        <div className='container mx-auto px-4 mt-10'>
            <h1
                className='text-2xl font-semibold text-center mb-5'
            >
                Role : Admin
            </h1>
            <div className='mb-5 mx-14 flex flex-col md:flex-row items-center gap-5'>
                <img
                    src={profilePic}
                    className='rounded-3xl w-40 h-40 border border-gray-400'
                />
                <div>
                    <label
                        htmlFor="avatar"
                        className='bg-indigo-200 px-4 py-2 rounded text-indigo-900 text-sm font-bold hover:bg-indigo-300 cursor-pointer'
                    >
                        Change avatar
                    </label>
                    <input
                        type="file"
                        name="avatar"
                        accept='.jpg, .jpeg, .gif, .png'
                        id="avatar"
                        className='hidden'
                        onChange={handleProfilePicChange}
                    />
                    <p className='text-sm text-center mt-2 text-gray-600'>JPG, GIF or PNG.</p>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className="flex w-4/5 mx-auto gap-3">
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="adminFirstName"
                            className='block'
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id='adminFirstName'
                            placeholder='John'
                            value={userInfo?.firstName}
                            onChange={(e) => { setUserInfo(prev => ({ ...prev, firstName: e.target.value })) }}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                    <div className='mb-3 w-1/2 mx-auto text-left'>
                        <label
                            htmlFor="adminLastName"
                            className='block'
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id='adminName'
                            placeholder='Doe'
                            value={userInfo?.lastName}
                            onChange={(e) => { setUserInfo(prev => ({ ...prev, lastName: e.target.value })) }}
                            className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="adminUsername"
                        className='block'
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id='adminUsername'
                        placeholder='johndoe'
                        value={userInfo?.userName}
                        onChange={(e) => { setUserInfo(prev => ({ ...prev, userName: e.target.value })) }}
                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="adminEmail"
                        className='block'
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id='adminEmail'
                        placeholder='user@example.com'
                        value={userInfo?.email}
                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="adminContact"
                        className='block'
                    >
                        Contact
                    </label>
                    <input
                        type="text"
                        id='adminContact'
                        placeholder='9123456789'
                        value={userInfo?.contactNumber}
                        onChange={(e) => { setUserInfo(prev => ({ ...prev, contactNumber: e.target.value })) }}
                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                    />
                </div>
                <div className='flex w-4/5 mx-auto items-center gap-2'>
                    <label>Status</label>
                    <Switch
                        checked={userInfo?.status}
                        onChange={(newStatus) => { handelAdminStatusChange(userInfo.id, newStatus) }}
                        className={`border ${userInfo?.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-[34px] w-[70px] shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${userInfo?.status ? 'translate-x-9 bg-green-700/90' : 'translate-x-0 bg-red-700/90'}
                                                  pointer-events-none text-white inline-block h-[30px] w-[30px] transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                        >
                            {userInfo.status
                                ?
                                <CheckIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                :
                                <XMarkIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                            }
                        </span>
                    </Switch>
                </div>
            </div>

            <div className='flex mx-14 mt-5 gap-2'>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    onClick={() => { deleteAdmin(userInfo.id) }}
                >
                    Remove Admin
                </button>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    onClick={handleSaveDetails}
                >
                    Save Details
                </button>
                <Link
                    to={'/inHouseTeam'}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                    Cancel
                </Link>
            </div>
        </div>

    )
}

export default AdminViewEditDetails