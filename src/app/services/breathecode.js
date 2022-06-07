import axios from "../../axios";

function serializeQuerystring(object) {
    const querystring =
        object !== undefined
            ? Object.keys(object)
                  .map((key) => `${key}=${object[key]}`)
                  .join("&")
            : "";
    return querystring;
}

class BreatheCodeClient {
    constructor() {
        this.host = `${process.env.REACT_APP_API_HOST}/v1`;
    }

    admissions() {
        return {
            addSchedule: (payload) =>
                axios.bcPost(
                    "Schedule",
                    `${this.host}/admissions/academy/schedule`,
                    payload
                ),
            updateSyllabus: (pk, payload) =>
                axios.bcPut(
                    "Syllabus",
                    `${this.host}/admissions/syllabus/${pk}`,
                    payload
                ),
            addSyllabus: (payload) =>
                axios.bcPost(
                    "Syllabus",
                    `${this.host}/admissions/syllabus`,
                    payload
                ),
            updateSyllabusVersion: (pk, version, payload) =>
                axios.bcPut(
                    "Syllabus version",
                    `${this.host}/admissions/syllabus/${pk}/version/${version}`,
                    payload
                ),
            updateCohortUserInfo: (cohort, user, payload) =>
                axios.bcPut(
                    "Cohort",
                    `${this.host}/admissions/cohort/${cohort}/user/${user}`,
                    payload
                ),
            getAllUserCohorts: (query) => {
                const qs = Object.keys(query)
                    .map((key) => `${key}=${query[key]}`)
                    .join("&");
                return axios.bcGet(
                    "Cohort",
                    `${this.host}/admissions/academy/cohort/user?${qs}`
                );
            },
            addUserCohort: (cohort, payload) =>
                axios.bcPost(
                    "Cohort",
                    `${this.host}/admissions/cohort/${cohort}/user`,
                    payload
                ),
            deleteUserCohort: (cohort, user) =>
                axios.bcDelete(
                    "Cohort",
                    `${this.host}/admissions/cohort/${cohort}/user/${user}`
                ),
            deleteStudentBulk: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Cohort",
                    `${this.host}/auth/academy/student?id=${qs}`
                );
            },
            deleteCohortsBulk: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Cohort",
                    `${this.host}/admissions/academy/cohort?id=${qs}`
                );
            },
            deleteStaffBulk: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Cohort",
                    `${this.host}/auth/academy/member?id=${qs}`
                );
            },
            deleteLeadsBulk: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Leads",
                    `${this.host}/marketing/academy/lead?id=${qs}`
                );
            },
            deleteCertificatesBulk: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Certificates",
                    `${this.host}/certificate/?id=${qs}`
                );
            },
            getCohort: (cohort) =>
                axios.bcGet(
                    "Cohort",
                    `${this.host}/admissions/academy/cohort/${cohort}`
                ),
            updateCohort: (cohort, payload) =>
                axios.bcPut(
                    "Cohort",
                    `${this.host}/admissions/academy/cohort/${cohort}`,
                    payload
                ),
            addCohort: (payload) =>
                axios.bcPost(
                    "Cohort",
                    `${this.host}/admissions/academy/cohort`,
                    payload
                ),
            getCertificates: () =>
                axios.bcGet("Certificates", `${this.host}/admissions/syllabus`),
            getAllSyllabus: () =>
                axios.bcGet("Syllabus", `${this.host}/admissions/syllabus`),
            getAllTimeZone: () =>
                axios.bcGet(
                    "TimeZone",
                    `${this.host}/admissions/catalog/timezones`
                ),
            addTimeslot: (pk, payload) =>
                axios.bcPost(
                    "Syllabus",
                    `${this.host}/admissions/academy/schedule/${pk}/timeslot`,
                    payload
                ),
            getSyllabus: (query) =>
                axios.bcGet(
                    "Syllabus",
                    `${this.host}/admissions/syllabus/${query}`
                ),
            getAllCohorts: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Cohorts",
                    `${this.host}/admissions/academy/cohort${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            getAllAcademySyllabus: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Syllabus",
                    `${this.host}/admissions/syllabus${query ? `?${qs}` : ""}`
                );
            },
            getReport: () =>
                axios.bcGet("Report", `${this.host}/admissions/report`),
            getAllCourseSyllabus: (query) =>
                axios.bcGet(
                    "Syllabus",
                    `${this.host}/admissions/syllabus/${query}/version`
                ),
            getAllRelatedCertificates: (query) =>
                axios.bcGet(
                    "Certificates",
                    `${this.host}/admissions/syllabus?syllabus_slug=${query}`
                ),
            getAllRelatedCertificatesById: (query) =>
                axios.bcGet(
                    "Certificates",
                    `${this.host}/admissions/syllabus?syllabus_id=${query}`
                ),
            getAllRelatedSchedulesById: (syllabus, academy) =>
                axios.bcGet(
                    "Certificates",
                    `${this.host}/admissions/academy/schedule?syllabus_id=${syllabus}` +
                        (academy ? `&academy_id=${academy}` : "")
                ),
            getAllRelatedSchedulesBySlug: (query) =>
                axios.bcGet(
                    "Certificates",
                    `${this.host}/admissions/academy/schedule?syllabus_slug=${query}`
                ),
            getAllTimeslotsBySchedule: (pk) =>
                axios.bcGet(
                    "Schedule timeslots",
                    `${this.host}/admissions/academy/schedule/${pk}/timeslot`
                ),
            deleteTimeslot: (scheduleId, timeslotId) =>
                axios.bcDelete(
                    "Schedule timeslots",
                    `${this.host}/admissions/academy/schedule/${scheduleId}/timeslot/${timeslotId}`
                ),
            getSingleCohortStudent: (cohortID, studentID) =>
                axios.bcGet(
                    "Single Cohort Student",
                    `${this.host}/admissions/academy/cohort/${cohortID}/user/${studentID}`
                ),
            getMyAcademy: () =>
                axios.bcGet("My Academy", `${this.host}/admissions/academy/me`),

            getTemporalToken: (member) =>
                axios.bcPost(
                    "Token Temporal",
                    `${this.host}/auth/member/${member?.id}/token`
                ),
        };
    }

    auth() {
        return {
            addStudent: (payload) =>
                axios.bcPost(
                    "Academy student",
                    `${this.host}/auth/academy/student`,
                    payload
                ),
            getUserByEmail: (email) =>
                axios.bcGet("User", `${this.host}/auth/user/${email}`),
            getAllUsers: (query) =>
                axios.bcGet("Users", `${this.host}/auth/user?like=${query}`),
            getAcademyMember: (user) =>
                axios.bcGet(
                    "Academy member",
                    `${this.host}/auth/academy/member/${user}`
                ),
            getAcademyToken: () =>
                axios.bcGet(
                    "Academy Token",
                    `${this.host}/auth/academy/token/`
                ),
            postTemporalToken: () =>
                axios.bcPost("Academy Token", `${this.host}/auth/token/me`),
            addAcademyMember: (payload) =>
                axios.bcPost(
                    "Academy member",
                    `${this.host}/auth/academy/member`,
                    payload
                ),
            getRoles: () => axios.bcGet("Role", `${this.host}/auth/role`),
            getSingleRole: (role) =>
                axios.bcGet(
                    "Role",
                    `${this.host}/auth/role/${role.slug || role}`
                ),
            updateAcademyStudent: (user, payload) =>
                axios.bcPut(
                    "Academy student",
                    `${this.host}/auth/academy/student/${user}`,
                    payload
                ),
            updateAcademyMember: (user, payload) =>
                axios.bcPut(
                    "Academy member",
                    `${this.host}/auth/academy/member/${user}`,
                    payload
                ),
            addAcademyStudent: (payload) =>
                axios.bcPost(
                    "Academy student",
                    `${this.host}/auth/academy/student`,
                    payload
                ),
            getAcademyMembers: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy member",
                    `${this.host}/auth/academy/member${query ? `?${qs}` : ""}`
                );
            },
            getAcademyInvites: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy member",
                    `${this.host}/auth/academy/user/invite${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            deleteAcademyInvites: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Academy member",
                    `${this.host}/auth/academy/user/invite?id=${qs}`
                );
            },
            getAcademyStudents: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy student",
                    `${this.host}/auth/academy/student${query ? `?${qs}` : ""}`
                );
            },
            getGitpodUsers: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Gitpod Users",
                    `${this.host}/auth/academy/gitpod/user${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            updateGitpodUser: (id, user) =>
                axios.bcPut(
                    "Invite",
                    `${this.host}/auth/academy/gitpod/user/${id}`,
                    user
                ),
            resendInvite: (user) =>
                axios.bcPut(
                    "Invite",
                    `${this.host}/auth/member/invite/resend/${user}`
                ),
            getUserInvite: (id) =>
                axios.bcGet("Invite", `${this.host}/auth/academy/invite/${id}`),
            getMemberInvite: (id) =>
                axios.bcGet(
                    "Invite",
                    `${this.host}/auth/academy/member/${id}/invite`
                ),
            passwordReset: (userId, payload) =>
                axios.bcPost(
                    "Password reset",
                    `${this.host}/auth/member/${userId}/password/reset`,
                    payload
                ),
        };
    }

    marketing() {
        return {
            getLeads: (query) => {
                // start=${startDate.format('DD/MM/YYYY')}&academy=${academy}
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Lead report",
                    `${this.host}/marketing/report/lead${query ? `?${qs}` : ""}`
                );
            },
            getAcademyLeads: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy lead",
                    `${this.host}/marketing/academy/lead${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            getAcademyTags: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy tags",
                    `${this.host}/marketing/academy/tag${query ? `?${qs}` : ""}`
                );
            },
            getAcademyShort: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy short",
                    `${this.host}/marketing/academy/short${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            updateShort: (slug, short) =>
                axios.bcPut(
                    "Edit Short Link",
                    `${this.host}/marketing/academy/short/${slug}`,
                    short
                ),
            deleteShortsBulk: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Short Links",
                    `${this.host}/marketing/academy/short?id=${qs}`
                );
            },
            addNewShort: (newShort) =>
                axios.bcPost(
                    "New Short Link",
                    `${this.host}/marketing/academy/short`,
                    newShort
                ),
            getAcademyAutomations: () =>
                axios.bcGet(
                    "Academy automations",
                    `${this.host}/marketing/academy/automation`
                ),
            getAcademyUtm: () =>
                axios.bcGet(
                    "Academy Utm",
                    `${this.host}/marketing/academy/utm`
                ),
            addNewLead: (newLead) =>
                axios.bcPost(
                    "New lead",
                    `${this.host}/marketing/lead`,
                    newLead
                ),
            bulkSendToCRM: (query) =>{
                const qs = query.join(",");
                return axios.bcPut(
                    "Send to CRM",
                    `${this.host}/marketing/academy/lead/process?id=${qs}`
                )},
        };
    }

    mentorship() {
        return {
            getAcademyMentors: (query) => {
                console.log("getAcadmyMentors querys", query);
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy mentor",
                    `${this.host}/mentorship/academy/mentor${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            getAllMentorSessions: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy mentor sessions",
                    `${this.host}/mentorship/academy/session${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            getSingleMentorSessions: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy single mentor sessions",
                    `${this.host}/mentorship/academy/mentor/${
                        query.mentor
                    }/session${query ? `?${qs}` : ""}`
                );
            },
            updateMentorSession: (id, payload) =>
                axios.bcPut(
                    "Academy session",
                    `${this.host}/mentorship/academy/session/${id}`,
                    payload
                ),
            getAllAcademyMentorshipBills: (querys) => {
                const qs = serializeQuerystring(querys);
                return axios.bcGet(
                    "all service sessions",
                    `${this.host}/mentorship/academy/bill${
                        querys ? `?${qs}` : ""
                    }`
                );
            },
            getSingleAcademyMentorshipBill: (id) => {
                return axios.bcGet(
                    "Mentorship Bill",
                    `${this.host}/mentorship/academy/bill/${id}`
                );
            },
            updateMentorshipBills: (payload) =>{
                return axios.bcPut(
                    "Update Bills",
                    `${this.host}/mentorship/academy/bill`,
                    payload
                )
            },
            deleteMentorshipBill: (id) =>{
                return axios.bcDelete(
                    "Bill",
                    `${this.host}/mentorship/academy/bill/${id}`,
                )
            },
            getAllServices: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy services",
                    `${this.host}/mentorship/academy/service${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            getSingleService: (serviceId) => {
                return axios.bcGet(
                    "Single Academy service",
                    `${this.host}/mentorship/academy/service/${serviceId}`
                );
            },
            getSingleAcademyMentor: (mentorID) =>
                axios.bcGet(
                    "Academy mentor",
                    `${this.host}/mentorship/academy/mentor/${mentorID}`
                ),
            updateAcademyMentor: (user, payload) =>
                axios.bcPut(
                    "Academy mentor",
                    `${this.host}/mentorship/academy/mentor/${user}`,
                    payload
                ),
            updateAcademyService: (service, payload) =>
                axios.bcPut(
                    "Academy service",
                    `${this.host}/mentorship/academy/service/${service}`,
                    payload
                ),
            addAcademyMentor: (payload) =>
                axios.bcPost(
                    "Academy mentor",
                    `${this.host}/mentorship/academy/mentor`,
                    payload
                ),
            addAcademyService: (payload) =>
                axios.bcPost(
                    "Academy service",
                    `${this.host}/mentorship/academy/service`,
                    payload
                ),
            generateBills: (mentor) =>
                axios.bcPost(
                    "Academy service",
                    `${this.host}/mentorship/academy/mentor/${mentor.id}/bill`
                ),
        };
    }

    feedback() {
        return {
            getAnswers: (query) => {
                // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
                const qs = Object.keys(query)
                    .map((key) => `${key}=${query[key]}`)
                    .join("&");
                return axios.bcGet(
                    "Academy answers",
                    `${this.host}/feedback/academy/answer?${qs}`
                );
            },
            addNewSurvey: (newSurvey) =>
                axios.bcPost(
                    "New Survey",
                    `${this.host}/feedback/academy/survey`,
                    newSurvey
                ),
            updateSurvey: (survey, id) =>
                axios.bcPut(
                    "Survey",
                    `${this.host}/feedback/academy/survey/${id}`,
                    survey
                ),
            getSurveys: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy survey",
                    `${this.host}/feedback/academy/survey${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            // deleteSurveysBulk: (query) => axios.bcDelete (
            //     'Academy survey',
            //     `${this.host}/feedback/academy/survey${query}`,
            // ),
            deleteSurveysBulk: (ids) => {
                const qs = ids.join(",");
                return axios.bcDelete(
                    "Academy survey",
                    `${this.host}/feedback/academy/survey?id=${qs}`
                );
            },
            getSurvey: (id) =>
                axios.bcGet(
                    "Academy survey",
                    `${this.host}/feedback/academy/survey/${id}`
                ),
            getReviews: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Review",
                    `${this.host}/feedback/academy/review${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            updateReview: (id, data) =>
                axios.bcPut(
                    "Review",
                    `${this.host}/feedback/academy/review/${id}`,
                    data
                ),
        };
    }

    certificates() {
        return {
            getAllCertificates: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Certificates",
                    `${this.host}/certificate${query ? `?${qs}` : ""}`
                );
            },
            getCertificatesByCohort: (query) => {
                // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
                const qs = Object.keys(query)
                    .map((key) => `${key}=${query[key]}`)
                    .join("&");
                return axios.get(`${this.host}/certificate/cohort/?${qs}`);
            },
            addBulkCertificates: (payload) =>
                axios.bcPost(
                    "Re-attemps certificates",
                    `${this.host}/certificate/`,
                    payload
                ),
            generateSingleStudentCertificate: (cohortID, userID, payload) =>
                axios.bcPost(
                    "Student Certificate",
                    `${this.host}/certificate/cohort/${cohortID}/student/${userID}`,
                    payload
                ),
            generateAllCohortCertificates: (cohortID, payload) =>
                axios.bcPost(
                    "All Cohort Certificates",
                    `${this.host}/certificate/cohort/${cohortID}`,
                    payload
                ),
            downloadCSV: (query) => {
                const qs = Object.keys(query)
                    .map((key) => `${key}=${query[key]}`)
                    .join("&");
                return axios.bcGet(
                    "All Pages Table CSV",
                    `${this.host}/certificate?${qs}`,
                    {
                        headers: { Accept: "text/csv" },
                        responseType: "blob",
                    }
                );
            },
        };
    }

    events() {
        return {
            getCheckins: (query) => {
                // start=${startDate.format('DD/MM/YYYY')}status=${status}&event=${event_id}
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Event",
                    `${this.host}/events/academy/checkin${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            addAcademyEvent: (payload) =>
                axios.bcPost(
                    "Academy event",
                    `${this.host}/events/academy/event`,
                    payload
                ),
            updateAcademyEvent: (event, payload) =>
                axios.bcPut(
                    "Academy event",
                    `${this.host}/events/academy/event/${event}`,
                    payload
                ),
            getAcademyEvents: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy event",
                    `${this.host}/events/academy/event${query ? `?${qs}` : ""}`
                );
            },
            getAcademyEvent: (event) =>
                axios.bcGet(
                    "Academy event",
                    `${this.host}/events/academy/event/${event}`
                ),
            deleteEventsBulk: (query) => {
                const qs = query.join(",");
                return axios.bcDelete(
                    "Event",
                    `${this.host}/events/academy/event?id=${qs}`
                );
            },
            getAcademyEventOrganization: () =>
                axios.bcGet(
                    "Academy event",
                    `${this.host}/events/academy/organization`
                ),
            getAcademyEventOrganizer: () =>
                axios.bcGet(
                    "Academy event",
                    `${this.host}/events/academy/organizer`
                ),
            postAcademyEventOrganization: (payload) =>
                axios.bcPost(
                    "Academy event",
                    `${this.host}/events/academy/organization`,
                    payload
                ),
            putAcademyEventOrganization: (payload) =>
                axios.bcPut(
                    "Academy event",
                    `${this.host}/events/academy/organization`,
                    payload
                ),
            getAcademyEventOrganizationOrganizer: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Academy event",
                    `${this.host}/events/academy/organization/organizer${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            deleteAcademyEventOrganizationOrganizer: (org) =>
                axios.bcDelete(
                    "Delete organizer",
                    `${this.host}/events/academy/organization/organizer/${org}`
                ),
            getEventbriteWebhook: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Eventbrite_Webhook",
                    `${
                        this.host
                    }/events/academy/organization/eventbrite/webhook${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            getAcademyVenues: () =>
                axios.bcGet("Venues", `${this.host}/events/academy/venues`),
            getAcademyEventType: () =>
                axios.bcGet(
                    "Event Type",
                    `${this.host}/events/academy/eventype`
                ),
            downloadCSV: (query) => {
                const qs = Object.keys(query)
                    .map((key) => `${key}=${query[key]}`)
                    .join("&");
                return axios.bcGet(
                    "Download CSV",
                    `${this.host}/events/academy/checkin${
                        query ? `?${qs}` : ""
                    }`,
                    {
                        headers: { Accept: "text/csv" },
                        responseType: "blob",
                    }
                );
            },
        };
    }

    layout() {
        return {
            getDefaultLayout: () =>
                axios.bcGet(
                    "Layout",
                    `${this.host}/certificate/academy/layout`
                ),
        };
    }

    media() {
        return {
            upload: (payload) =>
                axios.bcPut("Media", `${this.host}/media/upload`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                }),
            getAllCategories: () =>
                axios.bcGet("Media", `${this.host}/media/category`),
            getMedia: (query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Media",
                    `${this.host}/media${query ? `?${qs}` : ""}`
                );
            },
            updateMedia: (media, payload) =>
                axios.bcPut(
                    "Media",
                    `${this.host}/media/info/${media}`,
                    payload
                ),
            deleteMedia: (media) =>
                axios.bcDelete("Media", `${this.host}/media/info/${media}`),
            createCategory: (payload) =>
                axios.bcPost(
                    "Category",
                    `${this.host}/media/category`,
                    payload
                ),
            updateMediaBulk: (payload) =>
                axios.bcPut("Media", `${this.host}/media/info`, payload),
        };
    }

    assignments() {
        return {
            getStudentAssignments: (studentID) =>
                axios.bcGet(
                    "Student Assignments",
                    `${this.host}/assignment/task/?user=${studentID}`
                ),
        };
    }

    registry() {
        return {
            getAsset: (associatedSlug) =>
                axios.bcGet(
                    "Asset",
                    `${this.host}/registry/asset/${associatedSlug}`
                ),
        };
    }

    activity() {
        return {
            getCohortActivity: (cohortID, query) => {
                const qs = serializeQuerystring(query);
                return axios.bcGet(
                    "Cohort Activity",
                    `${this.host}/activity/academy/cohort/${cohortID}${
                        query ? `?${qs}` : ""
                    }`
                );
            },
            createStudentActivity: (studentId, payload) =>
                axios.bcPost(
                    "Student Activity",
                    `${this.host}/activity/academy/student/${studentId}`,
                    payload
                ),
            getActivityTypes: () =>
                axios.bcGet(
                    "Cohort Activity Type",
                    `${this.host}/activity/type`
                ),
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
