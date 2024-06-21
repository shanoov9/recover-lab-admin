import React from 'react'
import AdminUserList from './adminUsers/adminUserList/AdminUserList';
import InstructorsList from './instructors/instructorsList/InstructorsList';

const InHouseTeam = () => {
  return (
    <div>
      <div>
        <AdminUserList />
      </div>
      <div>
        <InstructorsList />
      </div>
    </div>
  )
}

export default InHouseTeam;