import React from 'react';
import PropTypes from 'prop-types';

const StudentInformation = ({ data }) => {
  const { user, finantial_status, educational_status } = data;
  return (
    <>
      <img src={user?.profile.avatar_url} alt={user?.first_name} />
      <p>{`${user?.first_name}  ${user?.last_name}`}</p>
      <p>{user?.email}</p>
      <p>
        Finantial Status:
        {finantial_status || 'not available'}
      </p>
      <p>
        Educational Status:
        {educational_status || 'not available'}
      </p>
    </>
  );
};

StudentInformation.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StudentInformation;
