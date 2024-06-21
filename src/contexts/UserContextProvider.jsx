import React, { useState } from 'react';
import UserContext from './UserContext';
// import { useNavigate } from 'react-router-dom';
import { userApiService } from '../commonServices/apiService'
import { toast } from 'react-toastify';

const UserContextProvider = ({ children }) => {
    // const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const getUserInformation = async (token) => {
        userApiService.getUserInfo({ token })
            .then((response) => {
                setUser({ ...response.data.data, token });
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const logoutUser = () => {
        localStorage.removeItem("RLQ_Admin_Token");
        setUser(null);
        toast.success('Logged out successfully');
    }

    return (
        <UserContext.Provider value={{ user, setUser, getUserInformation, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;