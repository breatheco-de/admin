import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';
import clsx from 'clsx';

const StudentInformation = ({ data }, classes) => {
  const { user, finantial_status, educational_status } = data;
  return (
    <>
      <div className={clsx('flex-column items-center', classes.sidenav)}>
        <Avatar className="h-84 w-84 mb-5" src={user?.profile.avatar_url || ''} />
        <p className="text-white">{`${user?.first_name}  ${user?.last_name}`}</p>
        <p className="mt-0">{user?.email}</p>
        <div className="py-3" />
        <div className="flex flex-wrap w-full px-12 mb-11">
          <div className="flex-grow">
            <p className="uppercase text-light-white">FINANTIAL</p>
            <h4 className="font-medium text-white">{finantial_status || 'not available'}</h4>
          </div>
          <div>
            <p className="uppercase text-light-white">EDUCATIONAL</p>
            <h4 className="font-medium text-white">{educational_status || 'not available'}</h4>
          </div>
          <div />
        </div>
      </div>
    </>
  );
};

StudentInformation.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StudentInformation;
