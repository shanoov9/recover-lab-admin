import React, { useContext, useEffect, useState } from 'react'
import {
    HomeIcon,
    UsersIcon,
    CodeBracketIcon,
    BanknotesIcon,
    RectangleStackIcon,
    UserGroupIcon,
    RectangleGroupIcon,
    ChevronDownIcon,
    WindowIcon,
    SparklesIcon,
    StarIcon,
    ChartBarIcon,
    Cog8ToothIcon,
    GiftTopIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    PhotoIcon,
} from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { classApiService } from '../../../commonServices/apiService';

export default function AdminSidebar() {
    const location = useLocation();

    const [allClasses, setAllClasses] = useState([])
    useEffect(() => {
        getAllclassNames()
    }, [location.pathname])


    const getAllclassNames = () => {
        classApiService.getAllClassNames().then(res => {
            console.log(res)
            if (res.data.status === true) {
                setAllClasses(res.data.data)
            }
        }).catch(err => console.error(err))
    }


    const [isPlansPackagesOpen, setIsPlansPackagesOpen] = useState(location.pathname.includes('/plans-packages'));
    const [isClassesOpen, setIsClassesOpen] = useState(location.pathname.includes('/classes'));


    return (
        <aside className="flex fixed h-[calc(100vh-64px)] w-16 md:w-60 p-4 pr-2 flex-col py-6 items-start overflow-y-auto bg-gray-950 mx-0">
            <nav className="flex flex-1 flex-col items-start space-y-3 w-full">
                <Link
                    to="/"
                    title='Dashboard'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/" ? 'bg-gray-800 text-white ' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <ChartBarIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >Dashboard</span>
                </Link>

                <Link
                    to="/all-bookings"
                    title='All Bookings'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/all-bookings" ? 'bg-gray-800 text-white ' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <ShoppingCartIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >All Bookings</span>
                </Link>

                <Link
                    to="/all-transactions"
                    title='All Bookings'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/all-transactions" ? 'bg-gray-800 text-white ' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <CreditCardIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >All Transactions</span>
                </Link>

                <Link
                    to="/pages"
                    title='About Us'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/pages" ? 'bg-gray-800 text-white ' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <CodeBracketIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >Pages</span>
                </Link>

                <div className={`w-full overflow-hidden ${isPlansPackagesOpen ? 'h-[184px]' : 'h-10'} transition-all`} >
                    <button
                        title='Master'
                        onClick={() => { setIsPlansPackagesOpen(prev => !prev); setIsClassesOpen(false) }}
                        className={`rounded-lg flex items-center justify-between w-full p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none hover:bg-gray-800 hover:text-white`}
                    >
                        <div className='flex items-center gap-3'>
                            <RectangleGroupIcon className='h-6 w-6' />
                            <span className='hidden md:inline' >Plans & Packages</span>
                        </div>
                        <ChevronDownIcon className={`w-5 float-right ${isPlansPackagesOpen && 'rotate-180'} transition-transform`} />
                    </button>

                    <div className="ml-4 mt-2 flex flex-col gap-2">
                        <Link
                            to="/plans-packages/plans"
                            title='Single Time Plans'
                            className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname === "/plans-packages/plans" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                        >
                            <BanknotesIcon className='h-6 w-6' />
                            <span className='hidden md:inline' >Single Time Plans</span>
                        </Link>
                        <Link
                            to="/plans-packages/packages"
                            title='Packages'
                            className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname === "/plans-packages/packages" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                        >
                            <RectangleStackIcon className='h-6 w-6' />
                            <span className='hidden md:inline' >Packages</span>
                        </Link>
                        <Link
                            to="/plans-packages/memberships"
                            title='Memberships'
                            className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname === "/plans-packages/memberships" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                        >
                            <UsersIcon className='h-6 w-6' />
                            <span className='hidden md:inline' >Memberships</span>
                        </Link>
                    </div>
                </div>
                <div className={`w-full overflow-hidden ${isClassesOpen ? 'h-auto' : 'h-10'} transition-all`} >
                    <button
                        title='Master'
                        onClick={() => { setIsClassesOpen(prev => !prev); setIsPlansPackagesOpen(false) }}
                        className={`rounded-lg flex items-center justify-between w-full p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none hover:bg-gray-800 hover:text-white`}
                    >
                        <div className='flex items-center gap-3'>
                            <SparklesIcon className='h-6 w-6' />
                            <span className='hidden md:inline' >Classes</span>
                        </div>
                        <ChevronDownIcon className={`w-5 float-right ${isClassesOpen && 'rotate-180'} transition-transform`} />
                    </button>

                    <div className="ml-4 mt-2 flex flex-col gap-2">
                        {allClasses.map((item, index) => {
                            return (
                                <Link
                                    key={item.id}
                                    to={`/classes/${item.id}?title=${item.className}`}
                                    title={item.className}
                                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname === `/classes/${item.id}` ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                                >
                                    <StarIcon className='h-6 w-6' />
                                    <span className='hidden md:inline' >{item.className}</span>
                                </Link>
                            )
                        })
                        }
                    </div>
                </div>
                <Link
                    to="/allUsers"
                    title='Single Time Plans'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/allUsers" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <UserGroupIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >Members</span>
                </Link>
                {/* 
                <Link
                    to="/instagramFeeds"
                    title='Instagram Feeds'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/instagramFeeds" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <PhotoIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >Instagram Feeds</span>
                </Link> */}

                <Link
                    to="/inHouseTeam"
                    title='Single Time Plans'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/inHouseTeam" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <HomeIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >In House Team</span>
                </Link>

                <Link
                    to="/newsLetterMembers"
                    title='Single Time Plans'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/newsLetterMembers" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <UserGroupIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >Subscribers</span>
                </Link>

                {/* <Link
                    to="/gift-cards"
                    title='Settings'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/gift-cards" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <GiftTopIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >Gift Cards</span>
                </Link> */}

                <Link
                    to="/settings"
                    title='Settings'
                    className={`rounded-lg flex items-center w-full gap-3 p-1 md:p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${location.pathname == "/settings" ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
                >
                    <Cog8ToothIcon className='h-6 w-6' />
                    <span className='hidden md:inline' >Settings</span>
                </Link>
            </nav>
        </aside>
    )
}
