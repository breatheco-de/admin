import axios from "../../axios";

class BreatheCodeClient {
    constructor() {
        this.host = `${process.env.REACT_APP_API_HOST}/v1`;
    }
    admissions = () => {
        return {
            updateCohortUserInfo: (cohort, user, payload) => {
                return axios._put("Cohort",`${this.host}/admissions/cohort/${cohort}/user/${user}`, payload)
            },
            getAllUserCohorts: (query) => {
                const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
                return axios._get("Cohort",`${this.host}/admissions/cohort/user?${qs}`);
            },
            addUserCohort: (cohort, payload) => {
                return axios._post("Cohort",`${this.host}/admissions/cohort/${cohort}/user`, payload)
            },
            deleteUserCohort: (cohort, user) => {
                return axios._delete("Cohort",`${this.host}/admissions/cohort/${cohort}/user/${user}`)
            },
            getCohort: (cohort) => {
                return axios._get("Cohort",`${this.host}/admissions/academy/cohort/${cohort}`)
            },
            updateCohort: (cohort, payload) => {
                return axios._put("Cohort",`${this.host}/admissions/academy/cohort/${cohort}`,payload)
            },
            addCohort: (payload) => {
                return axios._post("Cohort",`${this.host}/admissions/academy/cohort`,payload)
            },
            getCertificates: () => {
                return axios._get("Certificates",`${this.host}/admissions/certificate`)
            },
            getAllCohorts: (query) => {
                const qs = query !== undefined ? Object.keys(query).map(key => `${key}=${query[key]}`).join('&') : '';
                return axios._get("Cohorts",`${this.host}/admissions/academy/cohort${query? '?'+ qs : ''}`)
            },
            getAllCourseSyllabus: (query) => {
                return axios._get("Syllabus",`${this.host}/admissions/certificate/${query}/academy/4/syllabus`)
            }
         }
    }

    auth() {
        return {
            addStudent : (payload) => {
                return axios._post("Academy student",`${this.host}/auth/academy/student`, payload)
            },
            getAllUsers: (query) => {
                return axios._get("Users",`${this.host}/auth/user?like=${query}`)
            },
            getAcademyMember: (user) => {
                return axios._get("Academy member",`${this.host}/auth/academy/member/${user}`)
            },
            addAcademyMember: (payload) => {
                return axios._post("Academy member",`${this.host}/auth/academy/member`,payload)
            },
            getRoles: () => {
                return axios._get("Role",`${this.host}/auth/role`)
            },
            updateAcademyStudent: (user, payload) => {
                return axios._put("Academy student",`${this.host}/auth/academy/student/${user}`,payload)
            },
            updateAcademyMember: (user, payload) => {
                return axios._put("Academy member",`${this.host}/auth/academy/member/${user}`,payload)
            },
            addAcademyStudent: (payload) => {
                return axios._post("Academy student",`${this.host}/auth/academy/student`, payload)
            },
            getAcademyMembers: (query) => {
                const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
                return axios._get("Academy member",`${this.host}/auth/academy/member?${qs}`)
            },
            getAcademyStudents: () => {
                return axios._get("Academy student",`${this.host}/auth/academy/student`)
            }
        }
    }
    marketing = () => ({
        getLeads: (query) => {
            // start=${startDate.format('DD/MM/YYYY')}&academy=${academy}
            const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            return axios._get("Lead report",`${this.host}/marketing/report/lead?${qs}`)
        },
    })
    feedback = () => ({
        getAnswers: (query) => {
            // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
            const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            return axios._get("Academy answers",`${this.host}/feedback/academy/answer?${qs}`)
        },
    })
    events = () => ({
        getCheckins: (query) => {
            // start=${startDate.format('DD/MM/YYYY')}status=${status}&event=${event_id}
            const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            return axios._get("Event",`${this.host}/events/checkin?${qs}`)
        },
        addAcademyEvent: (payload) => {
            return axios._post("Academy event",`${this.host}/events/academy/event`, payload)
        },
        updateAcademyEvent: (event, payload) => {
            return axios._put("Academy event",`${this.host}/events/academy/event/${event}`, payload)
        },
        getAcademyEvents: () => {
            return axios._get("Academy event",`${this.host}/events/academy/event`)
        },
        getAcademyEvent: (event) => {
            return axios._get("Academy event",`${this.host}/events/academy/event/${event}`)
        }
    })

    getItem(key) {
        let value = this.ls.getItem(key)
        try {
            return JSON.parse(value)
        } catch (e) {
            return null
        }
    }

}

export default new BreatheCodeClient();