import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import bc from '../../services/breathecode';
import CohortInformation from './components/CohortInformation';
import StudentInformation from './components/StudentInformation';
import StudentActivity from './components/StudentActivity';

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
    <>
      <div className="pb-24 pt-7 px-8 bg-primary text-white flex">
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <StudentInformation data={studentData} />
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <CohortInformation data={cohortData} />
        </Grid>
      </div>
      <div className="pb-24 pt-7 px-8 bg-default text-grey flex">
        <StudentActivity data={studentAssignments} />
      </div>
    </>
  );
};

export default studentReport;
