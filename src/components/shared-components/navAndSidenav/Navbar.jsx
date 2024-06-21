import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import tempAvatar from '../../../assets/images/userPlaceholder.png';
import RLQ_Logo from '../../../assets/images/logoWhite.svg';
import { Link } from 'react-router-dom';
import UserContext from '../../../contexts/UserContext';
import { IMAGE_BASE_URL } from '../../../commonServices/commonDataService';

const Navbar = () => {

    const { user, getUserInformation, logoutUser } = useContext(UserContext);
    const userAvatar = user?.profileImage ? IMAGE_BASE_URL + user.profileImage : tempAvatar;
    useEffect(() => {
        let token = localStorage.getItem('RLQ_Admin_Token');
        if (token) {
            getUserInformation(token);
        }
    }, [])
    return (
        <>
            <div className="h-16 fixed min-w-full font-display z-10">
                <Disclosure as="nav" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        {/* <label className='text-white'><a href="/">RecoveryLab</a></label> */}
                                        <div className="flex-shrink-0">
                                            <Link to="/">
                                                <img
                                                    className="h-10 w-10 hover:ml-1 transition-all"
                                                    src={RLQ_Logo}
                                                    alt="Your Company"
                                                />
                                            </Link>
                                        </div>
                                        {/* <div className="hidden md:block">
                                            
                                        </div> */}
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">

                                            {/* Profile dropdown */}
                                            {user != null
                                                &&
                                                <Menu as="div" className="relative ml-3">
                                                    <div>
                                                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                            <span className="absolute -inset-1.5" />
                                                            <span className="sr-only">Open user menu</span>
                                                            <img className="h-8 w-8 rounded-full" src={userAvatar} alt={user?.firstName} />
                                                        </Menu.Button>
                                                    </div>
                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-inner shadow-gray-700/50 border border-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <Menu.Item>
                                                                <p className='block px-4 py-2 text-sm text-left text-gray-400'>
                                                                    Hey, {user?.firstName}!
                                                                </p>
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                <Link
                                                                    to={'/myaccount'}
                                                                    className='block text-left px-4 py-2 text-sm text-white hover:bg-gray-700'
                                                                >
                                                                    My Account
                                                                </Link>
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                <button
                                                                    onClick={logoutUser}
                                                                    className='block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left'
                                                                >
                                                                    Sign Out
                                                                </button>
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </>
                    )}
                </Disclosure>
            </div>
        </>
    )
}

export default Navbar;