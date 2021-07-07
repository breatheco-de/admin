import axios from '../../axios';
console.log('AXIOS_', axios);
class BreatheCodeClient {
  constructor() {
    this.host = `${process.env.REACT_APP_API_HOST}/v1`;
  }

  admissions() {
    return {
      updateCohortUserInfo: (cohort, user, payload) => axios.put(
        'Cohort',
        `${this.host}/admissions/cohort/${cohort}/user/${user}`,
        payload,
      ),
      getAllUserCohorts: (query) => {
        const qs = Object.keys(query)
          .map((key) => `${key}=${query[key]}`)
          .join('&');
        return axios.get('Cohort', `${this.host}/admissions/academy/cohort/user?${qs}`);
      },
      addUserCohort: (cohort, payload) => axios.post('Cohort', `${this.host}/admissions/cohort/${cohort}/user`, payload),
      deleteUserCohort: (cohort, user) => axios.delete('Cohort', `${this.host}/admissions/cohort/${cohort}/user/${user}`),
      deleteStudentBulk: (query) => {
        console.log('query:', query);
        const qs = query.join(',');
        return axios.delete('Cohort', `${this.host}/auth/academy/student?id=${qs}`);
      },
      deleteCohortsBulk: (query) => {
        const qs = query.join(',');
        return axios.delete('Cohort', `${this.host}/admissions/academy/cohort?id=${qs}`);
      },
      deleteStaffBulk: (query) => {
        const qs = query.join(',');
        return axios.delete('Cohort', `${this.host}/auth/academy/member?id=${qs}`);
      },
      deleteLeadsBulk: (query) => {
        const qs = query.join(',');
        return axios.delete('Leads', `${this.host}/marketing/academy/lead?id=${qs}`);
      },
      deleteCertificatesBulk: (query) => {
        const qs = query.join(',');
        return axios.delete('Certificates', `${this.host}/certificate/?id=${qs}`);
      },
      getCohort: (cohort) => axios.get('Cohort', `${this.host}/admissions/academy/cohort/${cohort}`),
      updateCohort: (cohort, payload) => axios.put('Cohort', `${this.host}/admissions/academy/cohort/${cohort}`, payload),
      addCohort: (payload) => axios.post('Cohort', `${this.host}/admissions/academy/cohort`, payload),
      getCertificates: () => axios.get('Certificates', `${this.host}/admissions/certificate`),
      getAllCohorts: (query) => {
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get(
          'Cohorts',
          `${this.host}/admissions/academy/cohort${query ? `?${qs}` : ''}`,
        );
      },
      getAllCourseSyllabus: (query, academyID) => axios.get(
        'Syllabus',
        `${this.host}/admissions/certificate/${query}/academy/${academyID}/syllabus`,
      ),
      getMyAcademy: () => axios.get('My Academy', `${this.host}/admissions/academy/me`),
    };
  }

  auth() {
    return {
      addStudent: (payload) => axios.post('Academy student', `${this.host}/auth/academy/student`, payload),
      getUserByEmail: (email) => axios.get('User', `${this.host}/auth/user/${email}`),
      getAllUsers: (query) => axios.get('Users', `${this.host}/auth/user?like=${query}`),
      getAcademyMember: (user) => axios.get('Academy member', `${this.host}/auth/academy/member/${user}`),
      addAcademyMember: (payload) => axios.post('Academy member', `${this.host}/auth/academy/member`, payload),
      getRoles: () => axios.get('Role', `${this.host}/auth/role`),
      updateAcademyStudent: (user, payload) => axios.put('Academy student', `${this.host}/auth/academy/student/${user}`, payload),
      updateAcademyMember: (user, payload) => axios.put('Academy member', `${this.host}/auth/academy/member/${user}`, payload),
      addAcademyStudent: (payload) => axios.post('Academy student', `${this.host}/auth/academy/student`, payload),
      getAcademyMembers: (query) => {
        const qs = Object.keys(query)
          .map((key) => `${key}=${query[key]}`)
          .join('&');
        return axios.get('Academy member', `${this.host}/auth/academy/member?${qs}`);
      },
      getAcademyStudents: (query) => {
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get(
          'Academy student',
          `${this.host}/auth/academy/student${query ? `?${qs}` : ''}`,
        );
      },
      resendInvite: (user) => axios.put('Invite', `${this.host}/auth/member/invite/resend/${user}`),
      getMemberInvite: (user) => axios.get('Invite', `${this.host}/auth/academy/user/${user}/invite`),
      passwordReset: (userId, payload) => axios.post(
        'Password reset',
        `${this.host}/auth/member/${userId}/password/reset`,
        payload,
      ),
    };
  }

  marketing() {
    return {
      getLeads: (query) => {
        // start=${startDate.format('DD/MM/YYYY')}&academy=${academy}
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get(
          'Lead report',
          `${this.host}/marketing/report/lead${query ? `?${qs}` : ''}`,
        );
      },
      getAcademyLeads: (query) => {
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get(
          'Academy lead',
          `${this.host}/marketing/academy/lead${query ? `?${qs}` : ''}`,
        );
      },
      getAcademyTags: () => axios.get('Academy tags', `${this.host}/marketing/academy/tag`),
      getAcademyAutomations: () => axios.get('Academy automations', `${this.host}/marketing/academy/automation`),
      addNewLead: (newLead) => axios.post('New lead', `${this.host}/marketing/lead`, newLead),
    };
  }

  feedback() {
    return {
      getAnswers: (query) => {
        // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
        const qs = Object.keys(query)
          .map((key) => `${key}=${query[key]}`)
          .join('&');
        return axios.get('Academy answers', `${this.host}/feedback/academy/answer?${qs}`);
      },
      addNewSurvey: (newSurvey) => axios.post('New Survey', `${this.host}/feedback/academy/survey`, newSurvey),
      updateSurvey: (survey, id) => axios.put('Survey', `${this.host}/feedback/academy/survey/${id}`, survey),
    };
  }

  certificates() {
    return {
      getAllCertificates: (query) => {
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get('Certificates', `${this.host}/certificate${query ? `?${qs}` : ''}`);
      },
      getCertificatesByCohort: (query) => {
        // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
        const qs = Object.keys(query)
          .map((key) => `${key}=${query[key]}`)
          .join('&');
        return axios.get(`${this.host}/certificate/cohort/?${qs}`);
      },
      addBulkCertificates: (payload) => axios.post('Re-attemps certificates', `${this.host}/certificate/`, payload),
      generateSingleStudentCertificate: (cohortID, userID, payload) => axios.post(
        'Student Certificate',
        `${this.host}/certificate/cohort/${cohortID}/student/${userID}`,
        payload,
      ),
      generateAllCohortCertificates: (cohortID, payload) => axios.post(
        'All Cohort Certificates',
        `${this.host}/certificate/cohort/${cohortID}`,
        payload,
      ),
      downloadCSV: (query) => {
        const qs = Object.keys(query)
          .map((key) => `${key}=${query[key]}`)
          .join('&');
        return axios.post(
          'All Pages Table CSV',
          `${this.host}/certificate?${qs}`,
          {},
          {
            headers: { Accept: 'text/csv' },
            responseType: 'blob',
          },
        );
      },
    };
  }

  events() {
    return {
      getCheckins: (query) => {
        // start=${startDate.format('DD/MM/YYYY')}status=${status}&event=${event_id}
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get('Event', `${this.host}/events/academy/checkin${query ? `?${qs}` : ''}`);
      },
      addAcademyEvent: (payload) => axios.post('Academy event', `${this.host}/events/academy/event`, payload),
      updateAcademyEvent: (event, payload) => axios.put('Academy event', `${this.host}/events/academy/event/${event}`, payload),
      getAcademyEvents: (query) => {
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get(
          'Academy event',
          `${this.host}/events/academy/event${query ? `?${qs}` : ''}`,
        );
      },
      getAcademyEvent: (event) => axios.get('Academy event', `${this.host}/events/academy/event/${event}`),
      getAcademyVenues: () => axios.get('Venues', `${this.host}/events/academy/venues`),
      getAcademyEventType: () => axios.get('Event Type', `${this.host}/events/academy/eventype`),
    };
  }

  media() {
    return {
      upload: (payload) => axios.put('Media', `${this.host}/media/upload`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      getAllCategories: () => axios.get('Media', `${this.host}/media/category`),
      getMedia: (query) => {
        const qs = query !== undefined
          ? Object.keys(query)
            .map((key) => `${key}=${query[key]}`)
            .join('&')
          : '';
        return axios.get('Media', `${this.host}/media${query ? `?${qs}` : ''}`);
      },
      updateMedia: (media, payload) => axios.put('Media', `${this.host}/media/info/${media}`, payload),
      deleteMedia: (media) => axios.delete('Media', `${this.host}/media/info/${media}`),
      createCategory: (payload) => axios.post('Category', `${this.host}/media/category`, payload),
      updateMediaBulk: (payload) => axios.put('Media', `${this.host}/media/info`, payload),
    };
  }

  getItem(key) {
    const value = this.ls.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
}

export default new BreatheCodeClient();
