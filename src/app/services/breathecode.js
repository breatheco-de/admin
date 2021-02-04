import axios from "../../axios";

class BreatheCodeClient {
    constructor() {
        this.host = `${process.env.REACT_APP_API_HOST}/v1`;

    }

    auth() {
        return {
            addStudent(payload) {
                return axios.post(`${this.host}/auth/academy/student`, payload)
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