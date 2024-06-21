import React, { useEffect, useState } from 'react'
import MemberListPagination from './MemberListPagination';
import { userApiService } from '../../../../../commonServices/apiService';

const MemberUserList = () => {


    const [memberUsers, setMemberUsers] = useState([]);

    useEffect(() => {
        getAllMembers();
    }, [])

    const getAllMembers = () => {
        userApiService.getAllUsers()
            .then((res) => {
                if (res.data.status === true) {
                    setMemberUsers(res.data.data);
                    setCurrentMemberUsers(res.data.data);
                    console.log("Got 'em --> ", res.data.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const [currentMemberUsers, setCurrentMemberUsers] = useState([]);

    const membersList = (
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
                                        User
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
                                {currentMemberUsers.length === 0
                                    ?
                                    <tr><td colSpan={3} className="text-center py-4">No Members Found</td></tr> :

                                    <MemberListPagination
                                        data={currentMemberUsers}
                                        itemsPerPage={10}
                                    />
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )

    const handleMemberSearch = (e) => {
        const searchValue = e.target.value.trim().toLowerCase();
        if (searchValue === "") {
            setCurrentMemberUsers(memberUsers);
            return;
        }
        const filteredMembers = memberUsers.filter((member) => {
            console.log(member);
            return (
                member?.firstName?.toLowerCase()?.includes(searchValue) ||
                member?.lastName?.toLowerCase()?.includes(searchValue) ||
                member?.email?.toLowerCase()?.includes(searchValue) ||
                member?.contactNumber?.toString()?.toLowerCase().includes(searchValue)
            )
        })
        setCurrentMemberUsers(filteredMembers);
    }

    return (
        <div className='w-full p-5'>
            <div className='flex items-center justify-between mx-10' >
                <h1 className='text-2xl'>Members</h1>
                <div className='relative'>
                    <input
                        type="search"
                        className='w-96 h-10 px-3 border-2 border-gray-400 focus:border-indigo-600 rounded-lg focus:outline-none'
                        placeholder='Search Members(name, email or mobile number)'
                        onChange={handleMemberSearch}
                    />
                </div>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <ul>
                    {membersList}
                </ul>
            </div>
        </div>
    )
}

export default MemberUserList