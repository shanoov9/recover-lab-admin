import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userPlaceholder from '../../../../../assets/images/userPlaceholder.png'
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import HeadlessUIModalComponent from '../../../../shared-components/modal/HeadlessUIModal'
import MultiselectListbox from '../../../../shared-components/ListboxMultiselect/MultiselectListbox'
import { connect } from 'react-redux'
import { IMAGE_BASE_URL, defaultClassList } from '../../../../../commonServices/commonDataService'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { quillModules } from '../../../../../commonServices/quillModules'
import { classApiService, imageFileServiceApi, instructorServiceApi } from '../../../../../commonServices/apiService'
import { toast } from 'react-toastify'
import axios from 'axios'
import { INSTRUCTOR_COULDNT_CREATED, INSTRUCTOR_COULDNT_DELETED, INSTRUCTOR_CREATED_SUCCESSFULLY, INSTRUCTOR_DELETED_SUCCESSFULLY } from '../../../../../commonServices/messageConstants'

const InstructorsList = (props) => {
    const navigate = useNavigate()
    const [allInstructors, setAllInstructors] = useState([])
    const [allClassNames, setAllClassNames] = useState([])

    const navigateToPage = (instructor) => {
        navigate(`/instructorDetails/${instructor.id}`, { state: { instructor } })
    }

    const [allCountries, setAllCountries] = useState([])
    const [curCountry, setCurCountry] = useState('IN')

    useEffect(() => {

        getInstructorList();
        getAllClasses();

        axios.get('https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json')
            .then((res) => {
                console.log(res.data);
                setAllCountries(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    const getInstructorList = () => {
        instructorServiceApi.getAllInstructors()
            .then(responseData => {
                console.log(responseData);
                if (responseData.data.status === true) {
                    setAllInstructors(responseData.data.data);
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    const getAllClasses = () => {
        classApiService.getAllClassNames()
            .then(responseData => {
                console.log(responseData);
                if (responseData.data.status === true) {
                    setAllClassNames(responseData.data.data);
                }
            })
            .catch(err => {
                console.error(err)
            })
    }



    const [showAddInstructorModal, setShowAddInstructorModal] = useState(false)
    const [addInstructorName, setAddInstructorName] = useState('')
    const [addInstructorEmail, setAddInstructorEmail] = useState('')
    const [addInstructorContact, setAddInstructorContact] = useState('')
    const [addInstructorAddress, setAddInstructorAddress] = useState('')
    const [addInstructorDescription, setAddInstructorDescription] = useState('')
    const [addInstructorSkills, setAddInstructorSkills] = useState('')
    const [addInstructorImage, setAddInstructorImage] = useState(null)
    const [addInstructorServices, setAddInstructorServices] = useState([])
    const [addInstructorClasses, setAddInstructorClasses] = useState([])
    const [addInstructorWorkingDays, setAddInstructorWorkingDays] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    })
    const [addInstructorShifts, setAddInstructorShifts] = useState([
        { id: 0, startTime: '', endTime: '' },
    ])

    // Deletion states
    const [showDeleteInstructorModal, setShowDeleteInstructorModal] = useState(false)
    const [deleteInstructorId, setDeleteInstructorId] = useState(null)
    const instructorsList = (
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
                                        Instructor
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
                                {allInstructors.length === 0 && (
                                    <tr>
                                        <td colSpan='4' className='text-center py-4 text-gray-700'>No Instructors to display!</td>
                                    </tr>
                                )}
                                {allInstructors.map((instructor) => (
                                    <tr key={instructor.id}>
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className='w-10 h-10'>
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={instructor.profileImage ? IMAGE_BASE_URL + instructor.profileImage : userPlaceholder}
                                                        alt={instructor.name}
                                                    />
                                                </div>
                                                <div className="block text-left">
                                                    <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                                                    <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: `${instructor.description.substring(0, 50)}${instructor.description.length <= 50 ? '' : '...'}` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap text-left px-12 py-4">
                                            <div className="text-sm text-gray-900">{instructor.email}</div>
                                            <div className="text-sm text-gray-600">{instructor.countryCode} {instructor.contactNumber}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${instructor.status ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}>
                                                {instructor.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-medium flex gap-1">
                                            <button onClick={() => navigateToPage(instructor)} title='Edit/View Admin' className="rounded-xl bg-indigo-200 mx-auto px-4 py-2 text-sm font-semibold text-indigo-900 shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                Edit / View
                                            </button>
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                setDeleteInstructorId(instructor.id);
                                                setShowDeleteInstructorModal(true);
                                            }}
                                                title='Delete Admin' className="rounded-xl bg-red-200 mx-auto p-2 text-sm font-semibold text-red-900 shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
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

    const handleUploadInstructorImage = (e) => {
        if (e.target.files[0]) {
            let file = e.target.files[0];
            let fdata = new FormData();
            fdata.append('image', file);
            fdata.append('prevImageName', addInstructorImage);
            imageFileServiceApi.uploadImage(fdata)
                .then((res) => {
                    console.log(res);
                    setAddInstructorImage(res.data.data.filename);
                    toast.success('Image uploaded successfully');
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const handleAddInstructor = (e) => {
        if (addInstructorName.trim() === '' || addInstructorEmail.trim() === '' || addInstructorContact.trim() === '' || addInstructorAddress.trim() === '' || addInstructorDescription.trim() === '' || addInstructorSkills.trim() === '' || addInstructorShifts.some((shift) => shift.startTime === '' || shift.endTime === '')) {
            toast.error('All fields are required');
            return;
        }

        e.preventDefault();
        let body = {
            name: addInstructorName,
            email: addInstructorEmail,
            contactNumber: parseInt(addInstructorContact),
            countryCode: allCountries.find((country) => country.code === curCountry).dial_code,
            address: addInstructorAddress,
            description: addInstructorDescription,
            skills: addInstructorSkills.split(',').map((skill) => skill.trim()),
            associatedServices: addInstructorServices.map((service) => ({ id: service.id, treatmentServiceName: service.treatmentServiceName })),
            associatedClasses: addInstructorClasses,
            workDays: addInstructorWorkingDays,
            shiftTiming: addInstructorShifts,
            profileImage: addInstructorImage,
            status: 0
        }
        console.log(body);
        instructorServiceApi.createInstructor(body)
            .then(responseData => {
                if (responseData.data.status === true) {
                    toast.success(INSTRUCTOR_CREATED_SUCCESSFULLY);
                    getInstructorList();
                    setAddInstructorName('');
                    setAddInstructorEmail('');
                    setAddInstructorContact('');
                    setAddInstructorAddress('');
                    setAddInstructorDescription('');
                    setAddInstructorSkills('');
                    setAddInstructorServices([]);
                    setAddInstructorClasses([]);
                    setAddInstructorWorkingDays({
                        monday: false,
                        tuesday: false,
                        wednesday: false,
                        thursday: false,
                        friday: false,
                        saturday: false,
                        sunday: false
                    });
                    setAddInstructorShifts([{ id: 0, startTime: '', endTime: '' }]);
                    setAddInstructorImage(null);
                } else {
                    toast.error(INSTRUCTOR_COULDNT_CREATED);
                }
            })
            .catch(err => {
                console.error(err)
                toast.error(INSTRUCTOR_COULDNT_CREATED);
            })
        setShowAddInstructorModal(false);
    }

    const addInstructorModalBody = (
        <div className='mt-4'>
            <div className="flex items-center gap-2">
                <div className='mb-2 w-1/2'>
                    <label htmlFor='instructorName' className='block text-sm font-medium text-gray-700'>Instructor Name</label>
                    <input
                        type='text'
                        name='instructorName'
                        id='instructorName'
                        placeholder='John Doe'
                        required
                        value={addInstructorName}
                        onChange={(e) => setAddInstructorName(e.target.value)}
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                <div className='mb-2 w-1/2'>
                    <label htmlFor='instructorContact' className='block text-sm font-medium text-gray-700'>Contact</label>
                    <div className='flex items-center mt-[2px]'>
                        <select
                            name="countryCode"
                            id="countryCode"
                            className="shadow-sm text-sm rounded-l-md py-1.5 border-2 border-gray-300 focus:border-indigo-600"
                            value={curCountry}
                            onChange={(e) => { setCurCountry(e.target.value) }}
                        >
                            {allCountries.map(country => <option
                                key={country.code}
                                value={country.code}
                            >
                                {country.code} ({country.dial_code})
                            </option>
                            )}
                        </select>
                        <input
                            type='text'
                            name='instructorContact'
                            id='instructorContact'
                            placeholder='9876543210'
                            required
                            value={addInstructorContact}
                            maxLength={12}
                            onChange={(e) => setAddInstructorContact(e.target.value.replace(/[^0-9]/, ''))}
                            className='block w-full px-3 py-1.5 border-2 border-gray-300 rounded-r-md shadow-sm focus:border-indigo-500 sm:text-sm focus:outline-none'
                        />
                    </div>
                </div>
            </div>
            <div className='mb-2'>
                <label htmlFor='instructorEmail' className='block text-sm font-medium text-gray-700'>Instructor Email</label>
                <input
                    type='email'
                    name='instructorEmail'
                    id='instructorEmail'
                    placeholder='johndoe@example.com'
                    required
                    value={addInstructorEmail}
                    onChange={(e) => setAddInstructorEmail(e.target.value)}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className='mb-2'>
                <label htmlFor='instructorAddress' className='block text-sm font-medium text-gray-700'>Instructor Address</label>
                <input
                    type='text'
                    name='instructorAddress'
                    id='instructorAddress'
                    placeholder='123, Street Name, City, State, Country - 123456'
                    required
                    value={addInstructorAddress}
                    onChange={(e) => setAddInstructorAddress(e.target.value)}
                    className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                />
            </div>
            <div className="flex items-center gap-2">
                <div className='mb-2 w-1/2'>
                    <label htmlFor='instructorDescription' className='block text-sm font-medium text-gray-700'>Description</label>
                    <ReactQuill
                        theme="snow"
                        modules={quillModules}
                        value={addInstructorDescription}
                        onChange={setAddInstructorDescription}
                        placeholder='Write something about the instructor...'
                        className='mt-[2px] border-2 border-gray-300 rounded-md shadow-sm focus-within:border-indigo-600 sm:text-sm focus:outline-none'
                    />
                </div>
                <div className='mb-2 w-1/2'>
                    <label htmlFor='instructorSkills' className='block text-sm font-medium text-gray-700'>Skills (comma separated)</label>
                    <textarea
                        id='instructorSkills'
                        rows={3}
                        required
                        value={addInstructorSkills}
                        onChange={(e) => setAddInstructorSkills(e.target.value)}
                        placeholder='Skill 1, Skill 2, Skill 3...'
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className='mb-2 w-1/2'>
                    <MultiselectListbox
                        items={props.allServices.allServicesData}
                        selectedItems={addInstructorServices}
                        setSelectedItems={setAddInstructorServices}
                        label='Select Services'
                        type='services'
                        nameVariable='treatmentServiceName'
                    />
                </div>
                <div className='mb-2 w-1/2'>
                    <MultiselectListbox
                        items={allClassNames}
                        selectedItems={addInstructorClasses}
                        setSelectedItems={setAddInstructorClasses}
                        label='Select Classes'
                        type='classes'
                        nameVariable='className'
                    />
                </div>
            </div>
            <div className="mb-2">
                <label htmlFor='days' className='block text-sm font-medium text-gray-700'>Working Days</label>
                <div className="flex items-center gap-1 mt-2">
                    {Object.keys(addInstructorWorkingDays).map((day) => (
                        <div key={day} className='select-none'>
                            <label
                                htmlFor={`day_${day}`}
                                className={` flex items-center gap-0.5 cursor-pointer ${addInstructorWorkingDays[day] ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'} px-3 py-1.5 rounded-md shadow-sm focus:outline-none`}
                            >
                                {
                                    addInstructorWorkingDays[day] ?
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
                                checked={addInstructorWorkingDays[day]}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAddInstructorWorkingDays({ ...addInstructorWorkingDays, [day]: true });
                                    } else {
                                        setAddInstructorWorkingDays({ ...addInstructorWorkingDays, [day]: false });
                                    }
                                }
                                }
                                className='hidden'
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-2">
                <label htmlFor='shifts' className='block text-sm font-medium text-gray-700'>
                    Working Shifts
                    {/* <button
                        disabled={addInstructorShifts.length === 2}
                        className='text-indigo-900 disabled:bg-gray-400 disabled:text-gray-800 bg-indigo-200 hover:bg-indigo-300 ml-2 py-0.5 px-1 rounded-full'
                        onClick={() => setAddInstructorShifts([...addInstructorShifts, { id: (addInstructorShifts.reduce((max, obj) => Math.max(max, obj['id']), null) + 1), startTime: '', endTime: '' }])}

                    >
                        + Add
                    </button> */}
                </label>
                <div className="flex flex-col items-center gap-2 mt-2">
                    {addInstructorShifts.map((shift, index) => (
                        <div key={shift.id} className='flex gap-2 items-center'>
                            <div className='text-sm font-bold text-gray-950 mr-12'>{`Shift ${index + 1}`}</div>
                            <label htmlFor={`startTime_${index}`} className='block text-sm font-medium text-gray-700'>Start Time</label>
                            <input
                                type='time'
                                name={`startTime_${index}`}
                                id={`startTime_${index}`}
                                value={shift.startTime}
                                onChange={(e) => {
                                    const newShifts = [...addInstructorShifts];
                                    newShifts[index].startTime = e.target.value;
                                    setAddInstructorShifts(newShifts);
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
                                    const newShifts = [...addInstructorShifts];
                                    newShifts[index].endTime = e.target.value;
                                    setAddInstructorShifts(newShifts);
                                }}
                                className='px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                            />
                            <button
                                disabled={addInstructorShifts.length === 1}
                                onClick={() => {
                                    const newShifts = addInstructorShifts.filter((shft) => shft.id !== shift.id);
                                    setAddInstructorShifts(newShifts);
                                }}
                                className='text-red-900 bg-red-200 hover:bg-red-300 disabled:bg-gray-400 disabled:text-gray-800 p-1 rounded-full'
                            >
                                <TrashIcon className='w-[18px] h-[18px]' />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className='mb-2 w-1/2'>
                    <label htmlFor='instructorImage' className='block text-sm font-medium text-gray-700'>Instructor Image</label>
                    <input
                        type='file'
                        name='instructorImage'
                        id='instructorImage'
                        onChange={handleUploadInstructorImage}
                        required
                        className='mt-[2px] block w-full px-3 py-1.5 border-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm focus:outline-none'
                    />
                </div>
                <div className='w-1/2 flex justify-center'>
                    <img src={addInstructorImage ? IMAGE_BASE_URL + addInstructorImage : userPlaceholder} className='w-20 h-20 rounded-lg' />
                </div>
            </div>
        </div>
    )

    return (
        <div className='w-full p-5'>
            {/* Add instructor modal */}
            <HeadlessUIModalComponent
                displayState={showAddInstructorModal}
                setDisplayState={setShowAddInstructorModal}
                headingChildren={<span>Add Instructor</span>}
                bodyChildren={addInstructorModalBody}
                footerChildren={
                    <div className='flex gap-4'>
                        <button
                            onClick={handleAddInstructor}
                            className='bg-indigo-600 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-700 text-white font-semibold'
                        >
                            Add Instructor
                        </button>
                        <button
                            onClick={() => setShowAddInstructorModal(false)}
                            className='bg-indigo-200 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-300 text-indigo-900 font-semibold'
                        >
                            Cancel
                        </button>
                    </div>
                }
                maxWidthClass='max-w-xl'
            />

            {/* Delete instructor modal */}
            <HeadlessUIModalComponent
                displayState={showDeleteInstructorModal}
                setDisplayState={setShowDeleteInstructorModal}
                headingChildren={<span>Delete Instructor</span>}
                bodyChildren={<span>Are you sure you want to delete <b>{allInstructors.find(ins => ins.id === deleteInstructorId)?.name}</b>?</span>}
                footerChildren={
                    <div className='flex gap-4'>
                        <button
                            onClick={() => {
                                let body = { id: deleteInstructorId }
                                instructorServiceApi.deleteInstructor(body)
                                    .then(responseData => {
                                        if (responseData.data.status === true) {
                                            toast.success(INSTRUCTOR_DELETED_SUCCESSFULLY);
                                            getInstructorList();
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
            <div className='flex mx-10 items-center justify-between' >
                <h1 className='text-2xl'>Instructors</h1>
                <button
                    onClick={() => setShowAddInstructorModal(true)}
                    className='bg-indigo-300 flex items-center gap-1 py-2 px-4 rounded-lg hover:bg-indigo-400 text-indigo-900 font-semibold'
                >
                    <PlusIcon className="w-5 h-5" /> Add Instructor
                </button>
            </div>
            <div className='mt-5 w-10/12 mx-auto'>
                <ul>
                    {instructorsList}
                </ul>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    allServices: state.allServices
})
export default connect(mapStateToProps, null)(InstructorsList)