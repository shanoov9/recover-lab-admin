import React, { useContext, useEffect, useState } from 'react'
import defaultPic from "../../../../assets/images/userPlaceholder.png";
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import UserContext from '../../../../contexts/UserContext';
import { IMAGE_BASE_URL } from '../../../../commonServices/commonDataService';
import { imageFileServiceApi, userApiService } from '../../../../commonServices/apiService';

const MyAccount = () => {

    const { user, setUser, logoutUser } = useContext(UserContext);

    // Profile Picture
    const [profilePic, setProfilePic] = useState(defaultPic.src);

    // Name Updation States
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    // Password Change States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);


    useEffect(() => {
        if (user != null) {
            setFirstname(user.firstName);
            setLastname(user.lastName);
            setProfilePic(user.profileImage ? IMAGE_BASE_URL + user.profileImage : defaultPic)
        }
    }, []);

    const handleUpdateNameFormReset = (e) => {
        e.preventDefault();
        setFirstname(user?.firstName);
        setLastname(user?.lastName);
    };

    const handleUpdateNameFormSubmit = async (e) => {
        e.preventDefault();
        if (firstname.trim() === "" || lastname.trim() === "") {
            toast.error("Please provide both first and last name!");
            return;
        }

        userApiService.updateUser({ ...user, firstName: firstname, lastName: lastname })
            .then((res) => {
                console.log(res);
                if (res.data.status === true) {
                    setUser({ ...user, firstName: firstname, lastName: lastname });
                    toast.success("Name Updated Successfully!");
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Could not update name!");
            });
    };

    const handleAvatarChange = async (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            let newAvatar = e.target.files[0];
            if (/^.*\.(jpg|jpeg|gif|png)$/.test(newAvatar.name)) {
                console.log(newAvatar);
                let fdata = new FormData();
                fdata.append("image", newAvatar);
                fdata.append("prevImageName", user.profileImage);
                imageFileServiceApi.uploadImage(fdata)
                    .then((prevRes) => {
                        console.log(prevRes);
                        if (prevRes) {
                            userApiService.updateUser({ ...user, profileImage: prevRes.data.data.filename })
                                .then((res) => {
                                    console.log(res);
                                    if (res.data.status === true) {
                                        setUser({ ...user, profileImage: prevRes.data.data.filename });
                                        setProfilePic(IMAGE_BASE_URL + prevRes.data.data.filename);
                                        toast.success("Profile Picture Updated Successfully!");
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                    toast.error("Could not update prfile picture!");
                                });

                        } else {
                            toast.error("Could not update prfile picture!");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error("Could not update prfile picture!");
                    });
            } else {
                toast.error("Please provide only JPG/JPEG, GIF or PNG file!")
            }
        }
    };

    const handleChangePasswordFormSubmit = async (e) => {
        e.preventDefault();

        if (oldPassword.trim() === "" || newPassword.trim() === "") {
            toast.error("Please provide both old and new password!");
            return;
        }

        let body = {
            oldPassword,
            newPassword
        };
        let headers = {
            "x-access-token": user.token
        };

        userApiService.changePassword(body, headers)
            .then((res) => {
                console.log(res);
                if (res.data.status === true) {
                    toast.success("Password Changed Successfully! Login again.");
                    setOldPassword("");
                    setNewPassword("");
                    logoutUser();
                } else {
                    toast.error(res.data.message);
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Could not change password!");
            });
    };

    const handleChangePasswordFormReset = (e) => {
        e.preventDefault();
        setOldPassword("");
        setNewPassword("");
    };



    return (
        <div className='bg-white p-5 min-h-screen flex flex-col gap-5 select-none'>
            <h1 className='text-3xl font-bold text-center'>My Account</h1>
            {/* Avatar and Name  */}
            <div className='m-0 lg:mx-5 border border-gray-400 p-3 rounded-xl flex flex-col md:flex-row'>
                <h2 className="text-lg font-bold w-full text-center md:w-1/3">Personal Information</h2>
                <div className='w-full md:w-2/3 mt-10 md:mt-1'>
                    <div className='mb-4'>
                        <p className='text-lg text-black text-center md:text-left'>
                            Email: <span className='text-gray-600'>{user?.email || ""}</span>
                        </p>
                    </div>
                    <div className='mb-5 flex flex-col md:flex-row items-center gap-5'>
                        <img
                            src={profilePic}
                            className='rounded-3xl w-40 h-40 border border-gray-400'
                        />
                        <div>
                            <label
                                htmlFor="avatar"
                                className='bg-indigo-600 px-4 py-2 rounded text-sm font-bold hover:bg-indigo-700 text-white cursor-pointer'
                            >
                                Change avatar
                            </label>
                            <input
                                type="file"
                                name="avatar"
                                accept='.jpg, .jpeg, .gif, .png'
                                id="avatar"
                                className='hidden'
                                onChange={handleAvatarChange}
                            />
                            <p className='text-sm text-center mt-2 text-gray-500'>JPG, GIF or PNG.</p>
                        </div>
                    </div>
                    <form onSubmit={handleUpdateNameFormSubmit} onReset={handleUpdateNameFormReset}>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div>
                                <div className="mt-2">
                                    <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-600 text-left">
                                        First Name
                                    </label>
                                    <input
                                        id="firstname"
                                        name="firstname"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        placeholder='John'
                                        value={firstname}
                                        onChange={(e) => { setFirstname(e.target.value) }}
                                        className="block w-full rounded-md border-2 border-gray-400 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="mt-2">
                                    <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-600 text-left">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastname"
                                        name="lastname"
                                        type="text"
                                        autoComplete="family-name"
                                        required
                                        placeholder='Doe'
                                        value={lastname}
                                        onChange={(e) => { setLastname(e.target.value) }}
                                        className="block w-full rounded-md border-2 border-gray-400 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type='submit'
                                className='text-sm bg-indigo-600 hover:bg-indigo-700 font-medium text-white py-2 px-5 mt-3 rounded-lg'
                            >
                                Save Details
                            </button>
                            <button
                                type='reset'
                                className='text-sm bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-medium py-2 px-5 mt-3 rounded-lg'
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Change Password */}
            <div className='m-0 lg:mx-5 border border-gray-400 p-3 rounded-xl flex flex-col md:flex-row'>
                <h2 className="text-lg font-bold w-full text-center md:w-1/3">Change Password</h2>
                <div className='w-full md:w-2/3 mt-10 md:mt-1'>
                    <form onSubmit={handleChangePasswordFormSubmit} onReset={handleChangePasswordFormReset}>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className='mt-2'>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="CurrentPassword" className="block text-sm font-medium leading-6 text-gray-600">
                                        Current Password
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type={showOldPass ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Shhh..."
                                        value={oldPassword}
                                        onChange={(e) => { setOldPassword(e.target.value) }}
                                        required
                                        className="block w-full rounded-md border-2 border-gray-400 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <div
                                        className="absolute top-2 right-2 cursor-pointer"
                                        onClick={() => { setShowOldPass(!showOldPass) }}
                                    >
                                        {showOldPass
                                            ?
                                            <EyeSlashIcon size={20} className={`w-5 h-5`} />
                                            :
                                            <EyeIcon size={20} className={`w-5 h-5`} />
                                        }                                        </div>
                                </div>
                            </div>
                            <div className='mt-2'>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-600">
                                        New Password
                                    </label>
                                </div>
                                <div className="relative z-0">
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPass ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Shhh..."
                                        value={newPassword}
                                        onChange={(e) => { setNewPassword(e.target.value) }}
                                        required
                                        className="block w-full rounded-md border-2 border-gray-400 px-3 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <div
                                        className="absolute top-2 right-2 cursor-pointer"
                                        onClick={() => { setShowNewPass(!showNewPass) }}
                                    >
                                        {showNewPass
                                            ?
                                            <EyeSlashIcon size={20} className={`w-5 h-5`} />
                                            :
                                            <EyeIcon size={20} className={`w-5 h-5`} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type='submit'
                                className='text-sm bg-indigo-600 hover:bg-indigo-700 font-medium text-white py-2 px-5 mt-3 rounded-lg'
                            >
                                Update Password
                            </button>
                            <button
                                type='reset'
                                className='text-sm bg-indigo-300 hover:bg-indigo-400 text-indigo-900 font-medium py-2 px-5 mt-3 rounded-lg'
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MyAccount;