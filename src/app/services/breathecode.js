import axios from "../../axios";

class BreatheCodeClient {
    constructor() {
        this.host = `${process.env.REACT_APP_API_HOST}/v1`;
    }
    admissions = () => {
        return {
            updateCohortUserInfo: (cohort, user, payload) => {
                return axios.put(`${this.host}/admissions/cohort/${cohort}/user/${user}`, payload)
            },
            getAllUserCohorts: (query) => {
                const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
                return axios.get(`${this.host}/admissions/cohort/user?${qs}`);
            },
            addUserCohort: (cohort, payload) => {
                return axios.post(`${this.host}/admissions/cohort/${cohort}/user`, payload)
            },
            deleteUserCohort: (cohort, user) => {
                return axios.delete(`${this.host}/admissions/cohort/${cohort}/user/${user}`)
            },
            getCohort: (cohort) => {
                return axios.get(`${this.host}/admissions/academy/cohort/${cohort}`)
            },
            updateCohort: (cohort, payload) => {
                return axios.put(`${this.host}/admissions/academy/cohort/${cohort}`,payload)
            },
            addCohort: (payload) => {
                return axios.post(`${this.host}/admissions/academy/cohort`,payload)
            },
            getCertificates: () => {
                return axios.get(`${this.host}/admissions/certificate`)
            },
            getAllCohorts: () => {
                return axios.get(`${this.host}/admissions/academy/cohort`)
            }
         }
    }

    auth() {
        return {
            addStudent : (payload) => {
                return axios.post(`${this.host}/auth/academy/student`, payload)
            },
            getAllUsers: (query) => {
                return axios.get(`${this.host}/auth/user?like=${query}`)
            },
            getAcademyMember: (user) => {
                return axios.get(`${this.host}/auth/academy/member/${user}`)
            },
            addAcademyMember: (payload) => {
                return axios.post(`${this.host}/auth/academy/member`,payload)
            },
            getRoles: () => {
                return axios.get(`${this.host}/auth/role`)
            },
            updateAcademyStudent: (user, payload) => {
                return axios.put(`${this.host}/auth/academy/student/${user}`,payload)
            },
            updateAcademyMember: (user, payload) => {
                return axios.put(`${this.host}/auth/academy/member/${user}`,payload)
            },
            addAcademyStudent: (payload) => {
                return axios.post(`${this.host}/auth/academy/student`, payload)
            },
            getAcademyMembers: (query) => {
                const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
                return axios.get(`${this.host}/auth/academy/member?${qs}`)
            },
            getAcademyStudents: () => {
                return axios.get(`${this.host}/auth/academy/student`)
            }
        }
    }
    marketing = () => ({
        getLeads: (query) => {
            // start=${startDate.format('DD/MM/YYYY')}&academy=${academy}
            const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            return axios.get(`${this.host}/marketing/report/lead?${qs}`)
        },
    })
    feedback = () => ({
        getAnswers: (query) => {
            // start=${startDate.format('DD/MM/YYYY')}&astatus=ANSWERED
            const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            return axios.get(`${this.host}/feedback/academy/answer?${qs}`)
        },
    })
    events = () => ({
        getCheckins: (query) => {
            // start=${startDate.format('DD/MM/YYYY')}status=${status}&event=${event_id}
            const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
            return axios.get(`${this.host}/events/checkin?${qs}`)
        },
        addAcademyEvent: (payload) => {
            return axios.post(`${this.host}/events/academy/event`, payload)
        },
        updateAcademyEvent: (event, payload) => {
            return axios.put(`${process.env.REACT_APP_API_HOST}/v1/events/academy/event/${event}`, payload)
        },
        getAcademyEvents: () => {
            return axios.get(`${this.host}/events/academy/event`)
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