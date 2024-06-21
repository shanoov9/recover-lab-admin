import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { ArrowPathIcon, BanknotesIcon, CurrencyDollarIcon, MinusIcon, PlusIcon, SquaresPlusIcon, TrashIcon, UsersIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Chart from 'react-apexcharts';
import { Link, json } from "react-router-dom";
import { bookingServiceApi, dashboardServiceApi, instructorServiceApi, pageDetailApiService } from "../../../commonServices/apiService";
import { FIXED_PAGES } from "../../../commonServices/commonDataService";
import { toast } from 'react-toastify'
import HeadlessUIModalComponent from '../../shared-components/modal/HeadlessUIModal';

const Dashboard = () => {

    const [tilesData, setTilesData] = useState([
        { id: 1, title: "Earnings", value: 0 },
        { id: 2, title: "Services", value: 0 },
        { id: 3, title: "Users", value: 0 },
    ]);

    const [earningChartSeries, setEarningChartSeries] = useState([
        {
            name: "Earnings",
            data: Array(12).fill(0),
        }
    ]);

    const [userChartSeries, setUserChartSeries] = useState([
        {
            name: "Users",
            data: Array(12).fill(0),
        }
    ]);

    const [allAppointments, setAllAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [centerList, setCenterList] = useState([]);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        getUserDetails();
        getTransactionDetails();
        getTodayAppointments();
        getDashboardMain();
        getCenterList();
        getInstructorList();
    }, []);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [appointmentIdToCancel, setAppointmentIdToCancel] = useState(null);
    const [processRefund, setProcessRefund] = useState(false);

    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [rescheduleId, setRescheduleId] = useState(null);
    const [rescheduleTime, setRescheduleTime] = useState(null);
    const [rescheduleDate, setRescheduleDate] = useState(null);
    const [rescheduleInstructorId, setRescheduleInstructorId] = useState(null);

    const checkDate = (bookingDate, bookingTime) => {
        var ToDate = new Date()
        const booking = bookingDate.substring(0, 10) + "T" + bookingTime
        if (new Date(booking).getTime() <= ToDate.getTime()) {
            return false;
        }
        return true;
    }

    const getUserDetails = () => {
        dashboardServiceApi.getUserCounts().then((res) => {
            console.log(res);
            if (res.data.status === true) {
                let data = res.data.data;

                // Setting User Chart Data
                let userChartData = Array(12).fill(0);
                console.log(data);
                data.forEach((item) => {
                    userChartData[item.month - 1] = item.count;
                });
                let tempData = [{}];
                tempData[0].name = userChartSeries[0].name;
                tempData[0].data = userChartData;
                setUserChartSeries(tempData);

            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const getTransactionDetails = () => {
        dashboardServiceApi.getTransactionDashboard().then((res) => {
            console.log(res);
            if (res.data.status === true) {
                let data = res.data.purchasePlansRecord;

                // Setting Earning Chart Data
                let earningChartData = Array(12).fill(0);
                data.forEach((item) => {
                    earningChartData[item.month - 1] = parseFloat(item.transactionAmount);
                });

                let tempData = [{}];
                tempData[0].name = earningChartSeries[0].name;
                tempData[0].data = earningChartData;
                setEarningChartSeries(tempData);
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const getTodayAppointments = () => {
        dashboardServiceApi.getTodayBooking().then((res) => {
            console.log(res);
            if (res.data.status === true) {
                let data = res.data.data;
                setTodayAppointments(data);
                setAllAppointments(data);
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const getDashboardMain = () => {
        dashboardServiceApi.getDashboardMain().then((res) => {
            console.log(res);
            if (res.data.status === true) {
                let data = res.data;

                // Setting Tiles Data
                let tilesDataCopy = [...tilesData];
                tilesDataCopy[0].value = parseFloat(data.totalEarning[0].total || 0);
                tilesDataCopy[1].value = data.ServiceCount[0].count;
                tilesDataCopy[2].value = data.userTotal[0].count;
                setTilesData(tilesDataCopy);
            }
        }).catch((err) => {
            console.log(err);
        });
    };
    const getCenterList = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.SETTINGS })
            .then((response) => {
                if (response.data.status === true) {
                    const centers = response.data.data.pageData.centerList;
                    setCenterList(centers);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    let chartOptions = {
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'left',
        },
        colors: ["#4f46e5"],
        chart: {
            id: "earning-chart",
            toolbar: {
                show: false,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 4,
            colors: '#fff',
            strokeColors: ['#4f46e5'],
            strokeWidth: 3,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            discrete: [],
            hover: {
                size: undefined,
                sizeOffset: 5,
            },
        },
    };

    const cancelAppointment = (id) => {
        bookingServiceApi.changeBookingStatus({ id, isExpired: true, processRefund })
            .then((response) => {
                if (response.data.status === true) {
                    toast.success("Appointment Cancelled Successfully");
                    let updatedAppointments = todayAppointments.map(booking => {
                        if (booking.id === id) {
                            booking.isExpired = true;
                        }
                        return booking;
                    });
                    setTodayAppointments(updatedAppointments);
                    setAllAppointments(updatedAppointments);
                    setAppointmentIdToCancel(null);
                }
            })
            .catch((error) => {
                console.log(error);
                setAppointmentIdToCancel(null);
            });
    };

    const getInstructorList = () => {
        instructorServiceApi.getAllInstructors()
            .then((response) => {
                if (response.data.status === true) {
                    setInstructors(response.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const rescheduleAppointmentModalBodyJSX = (
        <div className="my-5">
            <div className="flex flex-col gap-4">
                <div className="block">
                    <label htmlFor="rescheduleInstructor" className="text-gray-700 block font-medium">New Instructor</label>
                    <select
                        name="rescheduleInstructor"
                        id="rescheduleInstructor"
                        value={rescheduleInstructorId}
                        onChange={(e) => setRescheduleInstructorId(e.target.value)}
                        className="bg-gray-200 px-3 py-2 w-full rounded-lg focus:outline-none"
                    >
                        {instructors.map(instructor => <option key={instructor.id} value={instructor.id}>{instructor.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <div className="block w-1/2 mb-3">
                        <label htmlFor="rescheduleDate" className="text-gray-700 block font-medium">New Date</label>
                        <input
                            type="date"
                            id="rescheduleDate"
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="bg-gray-200 px-3 py-2 rounded-lg w-full focus:outline-none"
                        />
                    </div>
                    <div className="block w-1/2 mb-3">
                        <label htmlFor="rescheduleTime" className="text-gray-700 block font-medium">New Time</label>
                        <input
                            type="time"
                            id="rescheduleTime"
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                            className="bg-gray-200 px-3 py-2 rounded-lg w-full focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const rescheduleAppointment = () => {
        let data = {
            instructorId: rescheduleInstructorId,
            bookingDate: rescheduleDate,
            bookingTime: rescheduleTime,
        }
        bookingServiceApi.rescheduleBooking({ id: rescheduleId, ...data })
            .then((response) => {
                if (response.data.status === true) {
                    toast.success("Appointment Rescheduled Successfully");
                    getTodayAppointments();
                    setRescheduleId(null);
                    setRescheduleInstructorId(null);
                    setRescheduleDate(null);
                    setRescheduleTime(null);
                }
            })
            .catch((error) => {
                console.log(error);
                setRescheduleId(null);
                setRescheduleInstructorId(null);
                setRescheduleDate(null);
                setRescheduleTime(null);
            });

    }


    return (
        <div className="p-5">

            {/* Rescedule Appointment Modal */}
            <HeadlessUIModalComponent
                displayState={showRescheduleModal}
                setDisplayState={setShowRescheduleModal}
                headingChildren={<h1 className="text-2xl font-semibold text-gray-800">Reschedule Appointment RLQ_{rescheduleId}</h1>}
                bodyChildren={rescheduleAppointmentModalBodyJSX}
                footerChildren={
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowRescheduleModal(false);
                                setRescheduleId(null);
                                setRescheduleInstructorId(null);
                                setRescheduleDate(null);
                                setRescheduleTime(null);
                            }}
                            className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                rescheduleAppointment();
                                setShowRescheduleModal(false);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 font-medium text-white px-4 py-2 rounded-lg"
                        >
                            Reschedule
                        </button>
                    </div>
                }
            />

            {/* Cancel Appointment Modal */}
            <HeadlessUIModalComponent
                displayState={showCancelModal}
                setDisplayState={setShowCancelModal}
                headingChildren={<h1 className="text-2xl font-semibold text-gray-800">Cancel Appointment</h1>}
                bodyChildren={<div>
                    <p className="text-gray-700 my-5">Are you sure you want to cancel appointment <b>RLQ_{appointmentIdToCancel}</b>?</p>
                    <div class="inline-flex items-center">
                        <label class="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="checkbox">
                            <input type="checkbox"
                                class="before:content[''] peer relative border-gray-400 h-5 w-5 cursor-pointer appearance-none focus:outline-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-600 checked:bg-indigo-600 checked:before:bg-indigo-600 hover:before:opacity-10"
                                id="checkbox"
                                value={processRefund}
                                onChange={(e) => setProcessRefund(e.target.checked)}
                            />
                            <span
                                class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                    stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </span>
                        </label>
                        Process Refund
                    </div>
                </div>
                }

                footerChildren={
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setShowCancelModal(false);
                                cancelAppointment(appointmentIdToCancel);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => {
                                setShowCancelModal(false)
                                setAppointmentIdToCancel(null)
                            }}
                            className="bg-red-200 hover:bg-red-300 text-red-900 px-4 py-2 rounded-lg"
                        >
                            No
                        </button>
                    </div>
                }
            />

            {/* Data Cards */}
            <div className="grid grid-cols-3 gap-5">
                {tilesData.map((tile) => (
                    <div key={tile.id} className="relative flex flex-col justify-between h-32 bg-gray-800 text-gray-200 text-left py-2 px-4 ">
                        <div className="flex items-center justify-between px-2 h-4/5">
                            <div className="bg-gray-700 p-2 rounded-full">
                                {tile.id === 1 ? (
                                    <BanknotesIcon className="w-8 h-8 text-gray-200" />
                                ) : tile.id === 2 ? (
                                    <SquaresPlusIcon className="w-8 h-8 text-gray-200" />
                                ) : (
                                    <UsersIcon className="w-8 h-8 text-gray-200" />
                                )}
                            </div>
                            <p className="text-4xl font-semibold">{tile.id === 1 ? 'QAR ' : ''}{tile.value}</p>
                        </div>
                        <label className="text-xl font-semibold">Total {tile.title}</label>
                    </div>
                ))}
            </div>
            {/* Todays Appointments */}
            <div className="mt-6 flex flex-col">
                <div className="flex justify-between items-center my-4">
                    <div className=" text-left">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Today's Appointments &nbsp;
                            <Link to="/all-bookings" className="text-indigo-600 hover:underline text-lg">View All</Link>
                        </h2>
                        <span className="text-gray-700">{new Date().toDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            name="bookingCenter"
                            onChange={(e) => {
                                let val = e.target.value;
                                if (val === "all") {
                                    setTodayAppointments(allAppointments);
                                } else {
                                    setTodayAppointments(allAppointments.filter(booking => booking.bookingCenter === val));
                                }
                            }}
                            className="bg-indigo-200 px-3 py-2 rounded-lg focus:outline-none"
                        >
                            <option value="all">All Centers</option>
                            {centerList.map(center => <option key={center.id} value={center.id}>{center.name}</option>)}
                        </select>
                        <input
                            type="search"
                            onChange={(e) => {
                                let val = e.target.value;
                                setTodayAppointments(allAppointments
                                    .filter(booking => (
                                        `RLQ_${booking.id}`.toLowerCase() === val.toLowerCase()
                                        || JSON.parse(booking.guestOneDetails)?.fName?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.guestOneDetails)?.lName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (`${JSON.parse(booking.guestOneDetails)?.fName} ${JSON.parse(booking.guestOneDetails)?.lName}`)?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.guestTwoDetails)?.fName?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.guestTwoDetails)?.lName?.toLowerCase()?.includes(val.toLowerCase())
                                        || (`${JSON.parse(booking.guestTwoDetails)?.fName} ${JSON.parse(booking.guestTwoDetails)?.lName}`)?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.guestOneDetails)?.email?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.guestOneDetails)?.mNumber?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.bookingService)?.packageName?.toLowerCase()?.includes(val.toLowerCase())
                                        || JSON.parse(booking.bookingService)?.className?.toLowerCase()?.includes(val.toLowerCase())
                                    )))
                            }
                            }
                            placeholder="Search by ID, Name, Email, Mobile Number"
                            className="bg-indigo-200 px-3 py-2 w-96 rounded-lg placeholder-gray-500 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="-my-2 -mx-4 overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="max-h-72 overflow-y-auto border border-gray-50 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead className="bg-gray-300">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            ID
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700"
                                        >
                                            Customer
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
                                            Package
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Time
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Center
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-center text-sm font-normal text-gray-700"
                                        >
                                            Cancel
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-gray-300/50">
                                    {todayAppointments.length === 0 && <tr>
                                        <td colSpan={7} className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center justify-center gap-2 text-center">
                                                <div className="block text-center">
                                                    <div className="text-sm font-medium text-gray-900">No Appointments for today. View All</div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>}
                                    {todayAppointments.map(booking => <tr>
                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">RLQ_{booking.id} </div>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="block text-left">
                                                    <div className="text-sm font-medium text-gray-900">{JSON.parse(booking?.guestOneDetails)?.fName} {JSON.parse(booking?.guestOneDetails)?.lName}</div>
                                                    {booking.bookingGuest !== "JustMe" && <div className="text-sm font-medium text-gray-900">{JSON.parse(booking?.guestTwoDetails)?.fName} {JSON.parse(booking?.guestTwoDetails)?.lName}</div>}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap text-left px-1 py-4 font-semibold">
                                            <div className="text-sm text-gray-900">{JSON.parse(booking?.guestOneDetails)?.email}</div>
                                            <div className="text-sm text-gray-900">{JSON.parse(booking?.guestOneDetails)?.mNumber}</div>

                                            {
                                                booking.guestOneDetails ?
                                                    <>
                                                        <div className="text-sm text-gray-900">{(booking.guestOneDetails)?.email}</div>
                                                        {booking.bookingGuest === "TwoTwoGuest"
                                                            ?
                                                            <div className="text-sm text-gray-900">{(booking.guestOneDetails)?.mNumber}</div>
                                                            :
                                                            <div className="text-sm text-gray-900">{(booking.guestOneDetails)?.contactNumber}</div>}
                                                    </>
                                                    :
                                                    <>
                                                        <div className="text-sm text-gray-900">{JSON.parse(booking.guestTwoDetails)?.email}</div>
                                                        {/* {JSON.stringify(booking.bookingGuest)} */}
                                                        <div className="text-sm text-gray-900">{JSON.parse(booking.guestTwoDetails)?.mNumber}</div>
                                                    </>
                                            }
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{JSON.parse(booking.bookingService).packageName} </div>
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{booking.bookingTime}</div>
                                        </td>

                                        <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium">
                                            <div className="text-sm text-gray-900">{centerList.find(center => center.id === parseInt(booking.bookingCenter))?.name}</div>
                                        </td>
                                        <td className="whitespace-nowrap py-2 text-center text-sm font-medium">
                                            {booking.isExpired === true
                                                ?
                                                <span className="text-red-900">Cancelled</span>
                                                :
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        title="Reschedule"
                                                        className="text-teal-900 bg-teal-200 hover:bg-teal-300 p-2 rounded-full"
                                                        onClick={() => {
                                                            setRescheduleId(booking.id);
                                                            setRescheduleInstructorId(booking.instructorId);
                                                            setRescheduleDate(new Date(booking.bookingDate).toISOString().split('T')[0]);
                                                            setRescheduleTime(booking.bookingTime);
                                                            setShowRescheduleModal(true);
                                                        }
                                                        }
                                                    >
                                                        <ArrowPathIcon className="w-5 h-5" />
                                                    </button>

                                                    {checkDate(booking.bookingDate, booking.bookingTime) && <button
                                                        title="Cancel"
                                                        className="text-red-900 bg-red-200 hover:bg-red-300 p-2 rounded-full"
                                                        onClick={() => {
                                                            setAppointmentIdToCancel(booking.id);
                                                            setShowCancelModal(true);
                                                        }}
                                                    >
                                                        <XMarkIcon className="w-5 h-5" />
                                                    </button>}
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* Charts */}
            <div className="grid gap-2 grid-cols-2 my-5">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 text-left mx-4">Earnings</h1>
                    <Chart
                        options={chartOptions}
                        series={earningChartSeries}
                        type="area"
                        width="100%"
                        height="350"
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800 text-left mx-4">Users</h1>
                    <Chart
                        options={{ ...chartOptions, colors: ["#ff0095"], chart: { id: "user-chart", toolbar: { show: false } } }}
                        series={userChartSeries}
                        type="bar"
                        width="100%"
                        height="350"
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
