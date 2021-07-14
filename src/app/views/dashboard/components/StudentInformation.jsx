import React from 'react';

import PropTypes from 'prop-types';

const StudentInformation = ({ data }) => {
  const {
    user, cohort, finantial_status, stage,
  } = data;
  return (
    <div>
      <h1>Student info</h1>
      <img src={user?.profile.avatar_url} />
      <h1>{user?.first_name + user?.last_name}</h1>
      <p>{user?.email}</p>
      <p>{finantial_status || 'not available'}</p>
    </div>
  );
};

StudentInformation.propTypes = {
  data: PropTypes.object.isRequired,
};

export default StudentInformation;
