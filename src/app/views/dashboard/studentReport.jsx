import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import bc from '../../services/breathecode';
import StudentIndicators from './components/StudentIndicators';
import StudentInformation from './components/StudentInformation';
import CohortStudentActivity from './components/CohortStudentActivity';

const studentReport = () => {
  const [query, setQuery] = useState({});
  const [cohortUsersQuery, setCohortUsersQuery] = useState({
    roles: 'TEACHER',
  });
  const { studentID, cohortID } = useParams();
  const [cohortData, setCohortData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [studentActivity, setStudentActivity] = useState([]);

  // cohort data
  useEffect(() => {
    bc.admissions()
      .getCohort(cohortID)
      .then(({ data }) => {
        setCohortData(data);
        setCohortUsersQuery({ ...cohortUsersQuery, cohorts: data.slug });
      })
      .catch((err) => console.log(err));
  }, []);

  // cohort teacher
  useEffect(() => {
    if (
      Object.keys(cohortUsersQuery).length !== 0
      && cohortUsersQuery.constructor === Object
      && 'cohorts' in cohortUsersQuery
    ) {
      bc.admissions()
        .getAllUserCohorts(cohortUsersQuery)
        .then(({ data }) => {
          setCohortData({ ...cohortData, teachers: data });
        })
        .catch((err) => console.log(err));
    }
  }, [cohortUsersQuery]);

  // student info
  useEffect(() => {
    bc.admissions()
      .getSingleCohortStudent(cohortID, studentID)
      .then(({ data }) => {
        setStudentData(data);
        setQuery({ ...query, user_id: data.user.id });
      })
      .catch((err) => console.log(err));
  }, []);

  // student assignments
  useEffect(() => {
    bc.assignments()
      .getStudentAssignments(studentID)
      .then(({ data }) => {
        setStudentAssignments(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // cohort activity
  useEffect(() => {
    if (Object.keys(query).length !== 0 && query.constructor === Object) {
      bc.activity()
        .getCohortActivity(cohortID, query)
        .then(({ data }) => {
          setStudentActivity(data);
        })
        .catch((err) => console.log(err));
    }
  }, [query]);

  return (
    <>
      <div className="pb-24 pt-7 px-8 bg-primary text-white flex">
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <div className="py-8" />
          <StudentInformation data={studentData} />
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12}>
          <div className="py-8" />
          <StudentIndicators data={studentAssignments} studentActivity={studentActivity} />
        </Grid>
      </div>
      <div className="pb-24 pt-7 px-8 bg-default text-grey flex">
        <CohortStudentActivity
          data={studentAssignments}
          studentActivity={studentActivity}
          cohortData={cohortData}
        />
      </div>
    </>
  );
};

export default studentReport;
