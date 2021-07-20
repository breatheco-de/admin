import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';

const StudentInformation = ({ data }, classes) => {
  const { user, finantial_status, educational_status } = data;
  return (
    <>
      <div className="flex-column items-center mb-6">
        <Avatar className="w-84 h-84 " src={user?.profile.avatar_url || ''} />
        <p>{`${user?.first_name}  ${user?.last_name}`}</p>
        <p className="mt-0">{user?.email}</p>
      </div>
      <div className="flex justify-center ">
        <div className="mr-8">
          <p className="uppercase text-light-white">FINANTIAL</p>
          <h4 className="font-medium text-white">{finantial_status || 'not available'}</h4>
        </div>
        <div>
          <p className="uppercase text-light-white">EDUCATIONAL</p>
          <h4 className="font-medium text-white">{educational_status || 'not available'}</h4>
        </div>
      </div>
    </>
  );
};

StudentInformation.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StudentInformation;
