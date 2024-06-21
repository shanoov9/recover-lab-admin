import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import userPlaceholder from '../../../../../assets/images/userPlaceholder.png'
import { Link } from 'react-router-dom';
import { Switch } from '@headlessui/react'
import { CheckIcon, MinusIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { IMAGE_BASE_URL, defaultClassList } from '../../../../../commonServices/commonDataService';
import ReactQuill from 'react-quill';
import { quillModules } from '../../../../../commonServices/quillModules';
import MultiselectListbox from '../../../../shared-components/ListboxMultiselect/MultiselectListbox';
import { connect } from 'react-redux';
import { imageFileServiceApi, instructorServiceApi } from '../../../../../commonServices/apiService';
import { toast } from 'react-toastify';
import { IMAGE_UPDATED_SUCCESSFULLY, INSTRUCTOR_COULDNT_DELETED, INSTRUCTOR_DELETED_SUCCESSFULLY, INSTRUCTOR_UPDATED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants';
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal';

const InstructorsViewEditDetails = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(userPlaceholder)

    const reactLocation = useLocation();
    const locationState = reactLocation?.state;
    const [instructorData, setInstructorData] = useState({});

    const [showDeleteInstructorModal, setShowDeleteInstructorModal] = useState(false);


    useEffect(() => {
        if (locationState) {
            setInstructorData(locationState.instructor)
            setProfilePic(locationState?.instructor?.profileImage)
            // console.log(locationState.instructor.shifts)
        }
        console.log("Location state: ", locationState);
    }, [locationState])

    const handleProfilePicChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        let fdata = new FormData();
        fdata.append('image', file);
        fdata.append('prevImageName', profilePic);
        if (file) {
            imageFileServiceApi.uploadImage(fdata)
                .then((response) => {
                    setProfilePic(response.data.data.filename)
                    saveInstructorUpdatedDetails()
                    toast.success(IMAGE_UPDATED_SUCCESSFULLY)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const saveInstructorUpdatedDetails = (from = 'image') => {
        let body = {
            id: params.id,
            data: {
                name: instructorData.name,
                address: instructorData.address,
                contactNumber: instructorData.contactNumber,
                description: instructorData.description,
                skills: instructorData.skills,
                associatedServices: instructorData.associatedServices,
                associatedClasses: instructorData.associatedClasses,
                workDays: instructorData.workDays,
                shiftTiming: instructorData.shiftTiming,
                status: instructorData.status,
                profileImage: profilePic
            }
        }
        console.log(body)
        instructorServiceApi.updateInstructor(body)
            .then((response) => {
                console.log(response)
                if (response.data.status === true) {
                    if (from === 'save') {
                        toast.success(INSTRUCTOR_UPDATED_SUCCESSFULLY)
                        navigate('/inHouseTeam')
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return (
        <div className='container mx-auto px-4 mt-10'>
            {/* Deletion modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteInstructorModal}
                setDisplayState={setShowDeleteInstructorModal}
                headingChildren={<span>Delete Instructor</span>}
                bodyChildren={<span>Are you sure you want to delete <b>{instructorData?.name}</b>?</span>}
                footerChildren={
                    <div className='flex gap-4'>
                        <button
                            onClick={() => {
                                let body = { id: params.id }
                                instructorServiceApi.deleteInstructor(body)
                                    .then(responseData => {
                                        if (responseData.data.status === true) {
                                            toast.success(INSTRUCTOR_DELETED_SUCCESSFULLY);
                                            navigate('/inHouseTeam');
                                        } else {
                                            toast.error(INSTRUCTOR_COULDNT_DELETED);
                                        }
                                    })
                                    .catch(err => {
                                        console.error(err)
                                        toast.error(INSTRUCTOR_COULDNT_DELETED);
                                    })
                                setShowDeleteInstructorModal(false);
                            }}
                            className='bg-red-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-red-700 text-white font-semibold'
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setShowDeleteInstructorModal(false)}
                            className='bg-red-200 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-red-300 text-red-900 font-semibold'
                        >
                            Cancel
                        </button>
                    </div>
                }
                maxWidthClass='max-w-md'
            />
            <h1
                className='text-2xl font-semibold text-center mb-5'
            >
                Manage Instructor #{params.id}
            </h1>
            <div className="flex justify-between">
                <div className='mb-5 mx-14 flex flex-col md:flex-row items-center gap-5'>
                    <img
                        src={profilePic ? IMAGE_BASE_URL + profilePic : userPlaceholder}
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
                <div className='flex mx-auto items-center gap-2'>
                    <label>Status</label>
                    <Switch
                        checked={instructorData?.status}
                        onChange={() => setInstructorData({ ...instructorData, status: !instructorData?.status })}
                        className={`border ${instructorData?.status ? 'bg-green-300 border-green-500' : 'bg-red-300 border-red-500'} relative inline-flex h-[34px] w-[70px] shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${instructorData?.status ? 'translate-x-9 bg-green-700/90' : 'translate-x-0 bg-red-700/90'}
                                                  pointer-events-none text-white inline-block h-[30px] w-[30px] transform mt-[1px] ml-[1px] rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                        >
                            {instructorData?.status
                                ?
                                <CheckIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                                :
                                <XMarkIcon className='w-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2' />
                            }
                        </span>
                    </Switch>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorName"
                        className='block'
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id='instructorName'
                        placeholder='John Doe'
                        value={instructorData?.name}
                        onChange={(e) => setInstructorData({ ...instructorData, name: e.target.value })}
                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorAddress"
                        className='block'
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        id='instructorAddress'
                        value={instructorData?.address}
                        onChange={(e) => setInstructorData({ ...instructorData, address: e.target.value })}
                        placeholder='123, Main Street, City, State, Country'
                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorEmail"
                        className='block'
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id='instructorEmail'
                        value={instructorData?.email}
                        onChange={(e) => setInstructorData({ ...instructorData, email: e.target.value })}
                        placeholder='user@example.com'
                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorContact"
                        className='block'
                    >
                        Contact
                    </label>
                    <div className='flex items-center relative'>
                        <span className='text-gray-800 absolute left-1'>{"+91"}</span>
                        <input
                            type="text"
                            id='instructorContact'
                            value={instructorData?.contactNumber}
                            onChange={(e) => setInstructorData({ ...instructorData, contactNumber: e.target.value })}
                            placeholder='9123456789'
                            className='w-full border-2 pl-10 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                        />
                    </div>
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorDescription"
                        className='block'
                    >
                        Description
                    </label>
                    <ReactQuill
                        id='instructorDescription'
                        modules={quillModules}
                        value={instructorData?.description}
                        onChange={(value) => setInstructorData({ ...instructorData, description: value })}
                        className='w-full border-2 border-gray-400 focus-within:border-indigo-600 outline-none'
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorSkills"
                        className='block'
                    >
                        Skills (comma separated)
                    </label>
                    <textarea
                        id='instructorSkills'
                        rows={3}
                        placeholder='Skill 1, Skill 2, Skill 3'
                        value={instructorData?.skills ? JSON.parse(instructorData?.skills).join(', ') : instructorData?.skills}
                        onChange={(e) => setInstructorData({ ...instructorData, skills: JSON.stringify(e.target.value.split(', ')) })}
                        className='w-full border-2 border-gray-400 focus:border-indigo-600 outline-none rounded-lg p-2'
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorServices"
                        className='block'
                    >
                        Associated Services
                    </label>
                    <MultiselectListbox
                        items={props.allServices.allServicesData}
                        label={""}
                        nameVariable={"treatmentServiceName"}
                        type={"services"}
                        selectedItems={instructorData?.associatedServices ? JSON.parse(instructorData?.associatedServices) : []}
                        setSelectedItems={(selectedOptions) => setInstructorData({ ...instructorData, associatedServices: JSON.stringify(selectedOptions) })}
                    />
                </div>
                <div className='mb-3 w-4/5 mx-auto text-left'>
                    <label
                        htmlFor="instructorClasses"
                        className='block'
                    >
                        Associated Classes
                    </label>
                    <MultiselectListbox
                        items={defaultClassList}
                        label={""}
                        nameVariable={"title"}
                        type={"classes"}
                        selectedItems={instructorData?.associatedClasses ? JSON.parse(instructorData?.associatedClasses) : []}
                        setSelectedItems={(selectedOptions) => setInstructorData({ ...instructorData, associatedClasses: JSON.stringify(selectedOptions) })}
                    />
                </div>
            </div>
            <div className='mb-3 mx-auto w-[90%] text-left'>
                <label
                    htmlFor="instructorWorkDays"
                    className='block'
                >
                    Working Days
                </label>
                <div className="flex items-center gap-5 mt-2">
                    {Object.keys(instructorData?.workDays ? JSON.parse(instructorData?.workDays) : {}).map((day) => {
                        let instructorWorkingDays = instructorData?.workDays
                        instructorWorkingDays = JSON.parse(instructorWorkingDays)
                        return (
                            <div key={day} className='select-none'>
                                <label
                                    htmlFor={`day_${day}`}
                                    className={` flex items-center gap-0.5 cursor-pointer ${instructorWorkingDays[day] ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'} px-3 py-1.5 rounded-md shadow-sm focus:outline-none`}
                                >
                                    {
                                        instructorWorkingDays[day] ?
                                            <MinusIcon className='w-4 h-4 inline-block' />
                                            :
                                            <PlusIcon className='w-4 h-4 inline-block' />
                                    }
                                    {day.slice(0, 3).toUpperCase()}
                                </label>

                                <input
                                    type='checkbox'
                                    name={day}
                                    id={`day_${day}`}
                                    checked={instructorWorkingDays[day]}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setInstructorData({ ...instructorData, workDays: JSON.stringify({ ...instructorWorkingDays, [day]: true }) });
                                        } else {
                                            setInstructorData({ ...instructorData, workDays: JSON.stringify({ ...instructorWorkingDays, [day]: false }) });
                                        }
                                    }
                                    }
                                    className='hidden'
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='mb-3 w-[90%] mx-auto text-left'>
                <label htmlFor='shifts' className='block text-sm font-medium text-gray-700'>
                    Working Shifts
                    {/* <button
                        disabled={instructorData.shiftTiming && JSON.parse(instructorData?.shiftTiming).length === 2}
                        className='text-indigo-900 disabled:bg-gray-400 disabled:text-gray-800 bg-indigo-200 hover:bg-indigo-300 ml-2 py-0.5 px-1 rounded-full'
                        onClick={() => setInstructorData({ ...instructorData, shiftTiming: JSON.stringify([...JSON.parse(instructorData?.shiftTiming), { id: (JSON.parse(instructorData.shiftTiming).reduce((max, obj) => Math.max(max, obj['id']), null) + 1), startTime: '', endTime: '' }]) })}
                    >
                        + Add
                    </button> */}
                </label>
                <div className="flex flex-col items-center gap-2 mt-2">
                    {instructorData?.shiftTiming && JSON.parse(instructorData?.shiftTiming).map((shift, index) => {
                        let instructorShifts = JSON.parse(instructorData?.shiftTiming)
                        return (
                            <div key={shift.id} className='flex gap-5 items-center'>
                                <div className='text-sm font-bold text-gray-950 -ml-20 mr-28'>{`Shift ${index + 1}`}</div>
                                <label htmlFor={`startTime_${index}`} className='block text-sm font-medium text-gray-700'>Start Time</label>
                                <input
                                    type='time'
                                    name={`startTime_${index}`}
                                    id={`startTime_${index}`}
                                    value={shift.startTime}
                                    onChange={(e) => {
                                        const newShifts = [...instructorShifts];
                                        newShifts[index].startTime = e.target.value;
                                        setInstructorData({ ...instructorData, shiftTiming: JSON.stringify(newShifts) });
                                    }}
                                    className='px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                                />
                                <label htmlFor={`endTime_${index}`} className='block text-sm font-medium text-gray-700'>End Time</label>
                                <input
                                    type='time'
                                    name={`endTime_${index}`}
                                    id={`endTime_${index}`}
                                    value={shift.endTime}
                                    onChange={(e) => {
                                        const newShifts = [...instructorShifts];
                                        newShifts[index].endTime = e.target.value;
                                        setInstructorData({ ...instructorData, shiftTiming: JSON.stringify(newShifts) });
                                    }}
                                    className='px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                                />
                                {/* <button
                                    disabled={instructorShifts.length === 1}
                                    onClick={() => {
                                        const newShifts = instructorShifts.filter((shft) => shft.id !== shift.id);
                                        setInstructorData({ ...instructorData, shiftTiming: JSON.stringify(newShifts) });
                                    }}
                                    className='text-red-900 bg-red-200 hover:bg-red-300 disabled:bg-gray-400 disabled:text-gray-800 p-1 rounded-full'
                                >
                                    <TrashIcon className='w-[18px] h-[18px]' />
                                </button> */}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='flex mx-14 my-5 gap-2'>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-red-100 hover:bg-red-700 focus:outline-none "
                    onClick={e => {
                        e.preventDefault();
                        setShowDeleteInstructorModal(true);
                    }}
                >
                    Delete Instructor
                </button>
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    onClick={e => {
                        e.preventDefault();
                        saveInstructorUpdatedDetails('save');
                    }}
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

const mapStateToProps = (state) => ({
    allServices: state.allServices
})
export default connect(mapStateToProps, null)(InstructorsViewEditDetails)