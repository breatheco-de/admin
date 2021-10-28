import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Button, Icon } from '@material-ui/core';
import { toast } from 'react-toastify';

import { AddNoteModal } from 'app/components/AddNoteModal';
import bc from '../../services/breathecode';
import StudentIndicators from './components/StudentIndicators';
import StudentInformation from './components/StudentInformation';
import CohortStudentActivity from './components/CohortStudentActivity';
import DowndownMenu from '../../components/DropdownMenu';

toast.configure();
const toastOption = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 8000,
};

const options = [{ label: 'Add new note', value: 'add_note' }];

const studentReport = () => {
  const [query, setQuery] = useState({ limit: 10, offset: 0 });
  const [cohortUsersQuery, setCohortUsersQuery] = useState({
    roles: 'TEACHER,ASSISTANT',
  });
  const { studentID, cohortID } = useParams();
  const studentAttendanceQuery = {
    limit: 60,
    offset: 0,
    user_id: studentID,
  };
  const [cohortData, setCohortData] = useState({});
  const [studentData, setStudentData] = useState({});
  const [studentStatus, setStudentStatus] = useState({});
  const [studentAssignments, setStudentAssignments] = useState([]);
  const [studentActivity, setStudentActivity] = useState([]);
  const [studenAttendance, setStudenAttendance] = useState([]);
  const [hasMoreActivity, setHasMoreActivity] = useState(0);

  // notes modal
  const [newNoteDialog, setNewNoteDialog] = useState(false);
  const [noteFormValues, setNoteFormValues] = useState({
    cohort: cohortData.slug,
    data: '',
    user_id: studentID,
    slug: '',
    user_agent: 'postman',
  });

  // cohort data
  useEffect(() => {
    bc.admissions()
      .getCohort(cohortID)
      .then(({ data }) => {
        if (!data) {
          toast.error('Cohort not Found', toastOption);
        }
        setCohortData(data);
        setCohortUsersQuery({ ...cohortUsersQuery, cohorts: data.slug });
        setNoteFormValues({ ...noteFormValues, cohort: data.slug });
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
    bc.auth()
      .getAcademyMember(studentID)
      .then(({ data }) => {
        setStudentData(data);
        setQuery({ ...query, user_id: data.user.id });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    bc.admissions()
      .getSingleCohortStudent(cohortID, studentID)
      .then(({ data }) => {
        setStudentStatus(data);
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
    if (Object.keys(query).length !== 0 && query.constructor === Object && query.user_id) {
      bc.activity()
        .getCohortActivity(cohortID, query)
        .then(({ data }) => {
          const newData = data?.results || [];
          setHasMoreActivity(data?.next);
          setStudentActivity(
            studentActivity.length !== 0 ? [...studentActivity, ...newData] : data?.results || [],
          );
        })
        .catch((err) => console.log(err));
    }
  }, [query]);

  const reRenderActivitiesAfterSubmit = () => {
    bc.activity()
      .getCohortActivity(cohortID, query)
      .then(({ data }) => {
        const newData = data?.results || [];
        setHasMoreActivity(data?.next);
        setStudentActivity(
          studentActivity.length !== 0 ? [...studentActivity, ...newData] : data?.results || [],
        );
      })
      .catch((err) => console.log(err));
  };
  // Attendance data
  useEffect(() => {
    bc.activity()
      .getCohortActivity(cohortID, studentAttendanceQuery)
      .then(({ data }) => {
        setStudenAttendance(data?.results || []);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className=" pt-7 px-8 bg-primary text-white flex mb-8">
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <div className="py-8" />
          <StudentInformation data={studentData} studentStatus={studentStatus} />
        </Grid>
        <Grid item lg={9} md={9} sm={12} xs={12}>
          <div className="flex flex-wrap justify-end pb-6 bg-primary ">
            <DowndownMenu
              options={options}
              icon="more_horiz"
              onSelect={({ value }) => {
                setNewNoteDialog(value === 'add_note');
              }}
            >
              <Button style={{ color: 'white' }}>
                <Icon>playlist_add</Icon>
                Additional Actions
              </Button>
            </DowndownMenu>
          </div>
          <StudentIndicators
            data={studentAssignments}
            studentActivity={studentActivity}
            studenAttendance={studenAttendance}
            studentData={studentData}
          />
        </Grid>
      </div>
      <div className="pb-24 pt-7 px-8 bg-default text-grey flex">
        <CohortStudentActivity
          data={studentAssignments}
          studentActivity={studentActivity}
          cohortData={cohortData}
          setQuery={setQuery}
          query={query}
          hasMoreActivity={hasMoreActivity}
        />
      </div>
      <AddNoteModal
        newNoteDialog={newNoteDialog}
        noteFormValues={noteFormValues}
        setNewNoteDialog={setNewNoteDialog}
        setNoteFormValues={setNoteFormValues}
        stdId={studentID}
        reRenderActivitiesAfterSubmit={reRenderActivitiesAfterSubmit}
      />
    </>
  );
};

export default studentReport;
