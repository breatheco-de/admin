import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import StatCards from '../shared/StatCards';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const CohortInformation = ({ data }) => {
  const {
    name, kickoff_date, ending_date, stage,
  } = data;
  const startDate = dayjs(kickoff_date).format('MM-DD-YYYY');
  const endingDate = dayjs(ending_date).format('MM-DD-YYYY');
  return (
    <StatCards
      metrics={[
        { label: 'Name', value: name, icon: 'group' },
        { label: 'Start Date', value: startDate, icon: 'star' },
        {
          label: 'Ending Date',
          value: endingDate,
          icon: 'tag_faces',
        },
        { label: 'Stage', value: stage, icon: 'group' },
      ]}
    />
    // <div>
    //   <h1>Cohort Info</h1>
    //   <p>{name}</p>
    //   <p>{kickoff_date}</p>
    //   <p>{ending_date}</p>
    //   <p>{stage}</p>
    // </div>
  );
};

CohortInformation.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CohortInformation;
