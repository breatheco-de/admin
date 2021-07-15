import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import bc from '../../services/breathecode';
import CohortInformation from './components/CohortInformation';
import StudentInformation from './components/StudentInformation';
import AssignmentsInformation from './components/AssignmentsInformation';

const studentReport = () => {
  const { studentID, cohortID } = useParams();
  const [cohortData, setCohortData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [studentAssignments, setStudentAssignments] = useState([]);

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

  useEffect(() => {
    bc.assignments()
      .getStudentAssignments(studentID)
      .then(({ data }) => {
        setStudentAssignments(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <CohortInformation data={cohortData} />
      {' '}
      <hr />
      <StudentInformation data={studentData} />
      {' '}
      <hr />
      <AssignmentsInformation data={studentAssignments} />
    </div>
  );
};

export default studentReport;
