import axios from "../../axios";

class BreatheCodeClient {
  constructor() {
    this.host = `${process.env.REACT_APP_API_HOST}/v1`;
  }
  admissions = () => {
    return {
      updateCohortUserInfo: (cohort, user, payload) => {
        return axios._put(
          "Cohort",
          `${this.host}/admissions/cohort/${cohort}/user/${user}`,
          payload
        );
      },
      getAllUserCohorts: (query) => {
        const qs = Object.keys(query)
          .map((key) => `${key}=${query[key]}`)
          .join("&");
        return axios._get(
          "Cohort",
          `${this.host}/admissions/academy/cohort/user?${qs}`
        );
      },
      addUserCohort: (cohort, payload) => {
        return axios._post(
          "Cohort",
          `${this.host}/admissions/cohort/${cohort}/user`,
          payload
        );
      },
      deleteUserCohort: (cohort, user) => {
        return axios._delete(
          "Cohort",
          `${this.host}/admissions/cohort/${cohort}/user/${user}`
        );
      },
      deleteStudentBulk: (query) => {
        console.log("query:", query);
        const qs = query.join(",");
        return axios._delete(
          "Cohort",
          `${this.host}/auth/academy/student?id=${qs}`
        );
      },
      deleteCohortsBulk: (query) => {
        const qs = query.join(",");
        return axios._delete(
          "Cohort",
          `${this.host}/admissions/academy/cohort?id=${qs}`
        );
      },
      deleteStaffBulk: (query) => {
        const qs = query.join(",");
        return axios._delete(
          "Cohort",
          `${this.host}/auth/academy/member?id=${qs}`
        );
      },
      deleteLeadsBulk: (query) => {
        const qs = query.join(",");
        return axios._delete(
          "Leads",
          `${this.host}/marketing/academy/lead?id=${qs}`
        );
      },
      deleteCertificatesBulk: (query) => {
        const qs = query.join(",");
        return axios._delete(
          "Certificates",
          `${this.host}/certificate/?id=${qs}`
        );
      },
      getCohort: (cohort) => {
        return axios._get(
          "Cohort",
          `${this.host}/admissions/academy/cohort/${cohort}`
        );
      },
      updateCohort: (cohort, payload) => {
        return axios._put(
          "Cohort",
          `${this.host}/admissions/academy/cohort/${cohort}`,
          payload
        );
      },
      addCohort: (payload) => {
        return axios._post(
          "Cohort",
          `${this.host}/admissions/academy/cohort`,
          payload
        );
      },
      getCertificates: () => {
        return axios._get(
          "Certificates",
          `${this.host}/admissions/certificate`
        );
      },
      getAllCohorts: (query) => {
        const qs =
          query !== undefined
            ? Object.keys(query)
                .map((key) => `${key}=${query[key]}`)
                .join("&")
            : "";
        return axios._get(
          "Cohorts",
          `${this.host}/admissions/academy/cohort${query ? "?" + qs : ""}`
        );
      },
      getAllCourseSyllabus: (query, academyID) => {
        return axios._get(
          "Syllabus",
          `${this.host}/admissions/certificate/${query}/academy/${academyID}/syllabus`
        );
      },
      getMyAcademy: () =>
        axios._get("My Academy", `${this.host}/admissions/academy/me`),
    };
  };
  auth() {
    return {
      addStudent: (payload) => {
        return axios._post(
          "Academy student",
          `${this.host}/auth/academy/student`,
          payload
        );
      },
      getAllUsers: (query) => {
        return axios._get("Users", `${this.host}/auth/user?like=${query}`);
      },
      getAcademyMember: (user) => {
        return axios._get(
          "Academy member",
          `${this.host}/auth/academy/member/${user}`
        );
      },
      addAcademyMember: (payload) => {
        return axios._post(
          "Academy member",
          `${this.host}/auth/academy/member`,
          payload
        );
      },
      getRoles: () => {
        return axios._get("Role", `${this.host}/auth/role`);
      },
      updateAcademyStudent: (user, payload) => {
        return axios._put(
          "Academy student",
          `${this.host}/auth/academy/student/${user}`,
          payload
        );
      },
      updateAcademyMember: (user, payload) => {
        return axios._put(
          "Academy member",
          `${this.host}/auth/academy/member/${user}`,
          payload
        );
      },
      addAcademyStudent: (payload) => {
        return axios._post(
          "Academy student",
          `${this.host}/auth/academy/student`,
          payload
        );
      },
      getAcademyMembers: (query) => {
        const qs = Object.keys(query)
          .map((key) => `${key}=${query[key]}`)
          .join("&");
        return axios._get(
          "Academy member",
          `${this.host}/auth/academy/member?${qs}`
        );
      },
      getAcademyStudents: (query) => {
        const qs =
          query !== undefined
            ? Object.keys(query)
                .map((key) => `${key}=${query[key]}`)
                .join("&")
            : "";
        return axios._get(
          "Academy student",
          `${this.host}/auth/academy/student${query ? "?" + qs : ""}`
        );
      },
      resendInvite: (user) => {
        return axios._put(
          "Invite",
          `${this.host}/auth/member/invite/resend/${user}`
        );
      },
    };
  }
  marketing = () => ({
    getLeads: (query) => {
      // start=${startDate.format('DD/MM/YYYY')}&academy=${academy}
      const qs =
        query !== undefined
          ? Object.keys(query)
              .map((key) => `${key}=${query[key]}`)
              .join("&")
          : "";
      return axios._get(
        "Lead report",
        `${this.host}/marketing/report/lead${query ? "?" + qs : ""}`
      );
    },
    getAcademyLeads: (query) => {
      const qs =
        query !== undefined
          ? Object.keys(query)
              .map((key) => `${key}=${query[key]}`)
              .join("&")
          : "";
      return axios._get(
        "Academy lead",
        `${this.host}/marketing/academy/lead${query ? "?" + qs : ""}`
      );
    },
    getAcademyTags: () =>
      axios._get("Academy tags", `${this.host}/marketing/academy/tag`),
    getAcademyAutomations: () =>
      axios._get(
        "Academy automations",
        `${this.host}/marketing/academy/automation`
      ),
    addNewLead: (newLead) =>
      axios._post("New lead", `${this.host}/marketing/lead`, newLead),
  });

  feedback = () => ({
    getAnswers: (query) => {
      // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
      const qs = Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&");
      return axios._get(
        "Academy answers",
        `${this.host}/feedback/academy/answer?${qs}`
      );
    },
    getSingleAnswers: (query, id) => {
      // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
      const qs = Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&");
      return axios._get(
        "Academy single answers",
        `${this.host}/feedback/academy/answer/${qs}`
      );
    },
    addNewSurvey: (newSurvey) =>
      axios._post(
        "New Survey",
        `${this.host}/feedback/academy/survey`,
        newSurvey
      ),
    updateSurvey: (survey, id) =>
      axios._put(
        "Survey",
        `${this.host}/feedback/academy/survey/${id}`,
        survey
      ),
  });
  certificates = () => ({
    getCertificatesByCohort: (query) => {
      // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
      const qs = Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&");
      return axios.get(`${this.host}/certificate/cohort/?${qs}`);
    },
  });
  events = () => ({
    getCheckins: (query) => {
      // start=${startDate.format('DD/MM/YYYY')}status=${status}&event=${event_id}
      const qs =
        query !== undefined
          ? Object.keys(query)
              .map((key) => `${key}=${query[key]}`)
              .join("&")
          : "";
      return axios._get(
        "Event",
        `${this.host}/events/academy/checkin${query ? "?" + qs : ""}`
      );
    },
    addAcademyEvent: (payload) => {
      return axios._post(
        "Academy event",
        `${this.host}/events/academy/event`,
        payload
      );
    },
    updateAcademyEvent: (event, payload) => {
      return axios._put(
        "Academy event",
        `${this.host}/events/academy/event/${event}`,
        payload
      );
    },
    getAcademyEvents: (query) => {
      const qs =
        query !== undefined
          ? Object.keys(query)
              .map((key) => `${key}=${query[key]}`)
              .join("&")
          : "";
      return axios._get(
        "Academy event",
        `${this.host}/events/academy/event${query ? "?" + qs : ""}`
      );
    },
    getAcademyEvent: (event) => {
      return axios._get(
        "Academy event",
        `${this.host}/events/academy/event/${event}`
      );
    },
    getAcademyVenues: () => {
      return axios._get("Venues", `${this.host}/events/academy/venues`);
    },
    getAcademyEventType: () => {
      return axios._get("Event Type", `${this.host}/events/academy/eventype`);
    },
  });

  certificates = () => ({
    getAllCertificates: (query) => {
      const qs =
        query !== undefined
          ? Object.keys(query)
              .map((key) => `${key}=${query[key]}`)
              .join("&")
          : "";
      return axios._get(
        "Certificates",
        `${this.host}/certificate${query ? "?" + qs : ""}`
      );
    },
  });

  media() {
    return {
      upload: (payload) => {
        return axios._put("Media", `${this.host}/media/upload`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      },
      getAllCategories: () => {
        return axios._get("Media", `${this.host}/media/category`);
      },
      getMedia: (query) => {
        const qs =
          query !== undefined
            ? Object.keys(query)
                .map((key) => `${key}=${query[key]}`)
                .join("&")
            : "";
        return axios._get(
          "Media",
          `${this.host}/media${query ? "?" + qs : ""}`
        );
      },
      updateMedia: (media, payload) => {
        return axios._put("Media", `${this.host}/media/info/${media}`, payload);
      },
      deleteMedia: (media) => {
        return axios._delete("Media", `${this.host}/media/info/${media}`);
      },
      createCategory: (payload) => {
        return axios._post("Category", `${this.host}/media/category`, payload);
      },
    };
  }

  getItem(key) {
    let value = this.ls.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
}

export default new BreatheCodeClient();
