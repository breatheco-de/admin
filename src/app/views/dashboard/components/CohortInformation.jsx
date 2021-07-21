import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import CohortDetailCards from '../shared/CohortDetailCards';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const CohortInformation = ({ data }) => {
  const {
    name, kickoff_date, ending_date, stage,
  } = data;
  const startDate = dayjs(kickoff_date).format('MM-DD-YYYY');
  const endingDate = dayjs(ending_date).format('MM-DD-YYYY');
  return (
    <CohortDetailCards
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
  );
};

CohortInformation.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CohortInformation;
