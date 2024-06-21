import './App.css';
import Navbar from './components/shared-components/navAndSidenav/Navbar';
import AdminSidebar from './components/shared-components/navAndSidenav/SideNav';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/pages/dashboard/Dashboard';
import Pages from './components/pages/pages/Pages';
import EditService from './components/pages/pages/services/edit/EditService';
import PlanList from './components/pages/plans-and-memberships/plans-packages-list/Plans/PlanList';
import AllAdminAndUserList from './components/pages/users-and-members/AllAdminAndUserList';
import AdminViewEditDetails from './components/pages/in-house-team/adminUsers/adminViewEditDetails/AdminViewEditDetails';
import PackageList from './components/pages/plans-and-memberships/plans-packages-list/Packages/PackageList';
import MembershipList from './components/pages/plans-and-memberships/plans-packages-list/Memberships/MembershipList';
import { useContext, useEffect, useState } from 'react';
import EditHomePage from './components/pages/pages/editPage/home/EditHome';
import EditAboutUsPage from './components/pages/pages/editPage/aboutUs/EditAboutUs';
import { TreatmentServiceApis } from '../src/commonServices/apiService'
import { connect } from 'react-redux';
import { allServices_Action } from './commonServices/Actions/actions';
import MemberViewEditDetails from './components/pages/users-and-members/memberUsers/memberViewEditDetails/MemberViewEditDetails';
import MemberAllPurchases from './components/pages/users-and-members/memberUsers/memberViewEditDetails/allPurchases/MemberAllPurchases';
import MemberAllTransactions from './components/pages/users-and-members/memberUsers/memberViewEditDetails/allTransactions/MemberAllTransactions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InHouseTeam from './components/pages/in-house-team/InHouseteam';
import InstructorsViewEditDetails from './components/pages/in-house-team/instructors/instructorsViewEditDetails/InstructorsViewEditDetails';
import Login from './components/pages/user/login/Login';
import MyAccount from './components/pages/user/myaccount/MyAccount';
import EditClass from './components/pages/pages/classes/edit/EditClass';
import Services from './components/pages/pages/services/Services';
import Classes from './components/pages/pages/classes/Classes';
import NewsletterMemberListPage from './components/pages/newsletter/NewsletterMemberListPage';
import Settings from './components/pages/settings/Settings';
import GiftCards from './components/pages/gift-cards/GiftCards';
import EditContactUs from './components/pages/pages/editPage/contactUs/EditContactUs';
import EditCorporateWellness from './components/pages/pages/editPage/corporateWellness/EditCorporateWellness';
import UserContextProvider from './contexts/UserContextProvider';
import UserContext from './contexts/UserContext';
import AllAppointments from './components/pages/all-appointments/AllAppointments';
import AllTransactions from './components/pages/all-transactions/AllTransactions';
import InstagramFeeds from './components/pages/instagram-feeds/InstagramFeeds';
import ClassesPlans from './components/pages/classes/ClassesPlans';


function App({ allServicePagesHandler }) {
    useEffect(() => {
        getAllServices()
    }, [])


    const getAllServices = () => {
        TreatmentServiceApis.getAllServices().then(response => {
            const allServicesResponseData = response.data.data
            console.log('app.js', allServicesResponseData)
            // setAllServices(allServicesResponseData)
            allServicePagesHandler(allServicesResponseData)

            // console.log(allServices)
        })
    }


    const { user } = useContext(UserContext);
    const [isLoggeIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (user !== null) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [user?.token])


    return (
        <div className="App">
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <BrowserRouter>
                <Navbar />
                <main className='pt-16 flex'>
                    {isLoggeIn
                        ?
                        <>
                            <AdminSidebar />
                            <main className='w-[calc(100vw-240px)] h-[calc(100vh-64px)] overflow-y-scroll ml-60'>
                                <Routes>
                                    <Route path='/' exact element={<Dashboard />} />
                                    <Route path='/all-bookings' exact element={<AllAppointments />} />
                                    <Route path='/all-transactions' exact element={<AllTransactions />} />
                                    <Route path='/pages' exact element={<Pages />} />
                                    <Route path='/pages/edit/home' exact element={<EditHomePage />} />
                                    <Route path='/pages/edit/about-us' exact element={<EditAboutUsPage />} />
                                    <Route path='/pages/edit/contact-us' exact element={<EditContactUs />} />
                                    <Route path='/pages/edit/corporate-wellness' exact element={<EditCorporateWellness />} />
                                    <Route path='/pages/edit/services' exact element={<Services />} />
                                    <Route path='/pages/edit/classes' exact element={<Classes />} />
                                    <Route path='/pages/service/:id' exact element={<EditService />} />
                                    <Route path='/pages/class/:id' exact element={<EditClass />} />
                                    <Route path="/plans-packages/plans" element={< PlanList />} />
                                    <Route path="/plans-packages/packages" element={< PackageList />} />
                                    <Route path="/plans-packages/memberships" element={< MembershipList />} />
                                    <Route path='/allUsers' exact element={<AllAdminAndUserList />} />
                                    <Route path='/adminDetails' exact element={<AdminViewEditDetails />} />
                                    <Route path='/memberDetails/:id' exact element={<MemberViewEditDetails />} />
                                    <Route path='/memberDetails/:id/allPurchases' exact element={<MemberAllPurchases />} />
                                    <Route path='/memberDetails/:id/allTransactions' exact element={<MemberAllTransactions />} />
                                    <Route path='/inHouseTeam' exact element={<InHouseTeam />} />
                                    <Route path='/instructorDetails/:id' exact element={<InstructorsViewEditDetails />} />
                                    <Route path='/classes/:id' exact element={<ClassesPlans />} />

                                    <Route path='/myaccount' exact element={<MyAccount />} />
                                    <Route path='/newsLetterMembers' exact element={<NewsletterMemberListPage />} />
                                    <Route path='/instagramFeeds' exact element={<InstagramFeeds />} />
                                    <Route path='/settings' element={<Settings />} />
                                    {/* <Route path='/gift-cards' element={<GiftCards />} /> */}
                                </Routes>
                            </main>
                            {/* <Routes>
            <Route path='/' exact element={<Dashboard />} />
            <Route path='/pages' exact element={<Pages />} />

          </Routes> */}
                        </>
                        :
                        <Login />
                    }
                </main>
            </BrowserRouter>

        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        allServicePagesHandler: data => dispatch(allServices_Action(data)),
    }
}

export default connect(null, mapDispatchToProps)(App);
