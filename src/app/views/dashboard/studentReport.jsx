import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import bc from '../../services/breathecode';
import CohortInformation from './components/CohortInformation';
import StudentInformation from './components/StudentInformation';

const studentReport = () => {
  const { studentID, cohortID } = useParams();
  const [query, setQuery] = useState({
    roles: 'STUDENT',
    users: studentID,
  });
  const [cohortData, setCohortData] = useState({});
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    bc.admissions()
      .getCohort(cohortID)
      .then(({ data }) => setCohortData(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    bc.admissions()
      .getSingleCohortStudent(cohortID, studentID)
      .then(({ data }) => {
        setStudentData(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <CohortInformation data={cohortData} />
      <StudentInformation data={studentData} />
    </div>
  );
};

export default studentReport;
