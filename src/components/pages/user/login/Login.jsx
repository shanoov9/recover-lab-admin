import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import React, { useContext, useState } from 'react';
import RLQ_Logo from '../../../../assets/images/logoBlack.svg';
import { userApiService } from '../../../../commonServices/apiService';
import UserContext from '../../../../contexts/UserContext';
import { toast } from 'react-toastify';

const Login = () => {

    const { getUserInformation } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLoginFormSubmit = (e) => {
        e.preventDefault();

        let body = {
            email: email,
            password: password
        }

        userApiService.adminLogin(body)
            .then((response) => {
                if (response.data.status === true) {
                    let token = response.data.data.token;
                    localStorage.setItem('RLQ_Admin_Token', token)
                    getUserInformation(token);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }


    return (
        <div className="flex select-none bg-gray-200 min-h-[calc(100vh-64px)] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-16 w-auto"
                    src={RLQ_Logo}
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleLoginFormSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm text-left font-medium leading-6 text-gray-800">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                // required
                                className="block w-full rounded-md border-2 px-3 py-1.5 border-gray-400 focus:border-indigo-600 focus:outline-none text-black bg-gray-200 shadow-sm placeholder:text-gray-500 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-800">
                                Password
                            </label>
                            <div className="text-sm">
                                <p to={"/forgotPassword"} className="font-semibold text-indigo-500 hover:text-indigo-600">
                                    Forgot password?
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 relative z-0">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Shhh..."
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                // required
                                className="block w-full rounded-md border-2 px-3 py-1.5 border-gray-400 focus:border-indigo-600 focus:outline-none text-black bg-gray-200 shadow-sm placeholder:text-gray-500 sm:text-sm sm:leading-6"
                            />
                            <div
                                className="absolute top-2.5 right-2 cursor-pointer"
                                onClick={() => { setShowPassword(!showPassword) }}
                            >
                                {showPassword
                                    ?
                                    <EyeSlashIcon size={20} className={`w-5 h-5`} />
                                    :
                                    <EyeIcon size={20} className={`w-5 h-5`} />
                                }
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <ShieldCheckIcon className="w-[18px]" /> Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;