import axios from "../../axios";

class localStorageService {
  host = `${process.env.REACT_APP_API_HOST}/v1/`;

//   admissions() {
//     return {
//         addStudent(){
//             axios.post(`${this.host}/auth/academy/${academy_id}/student`, { ...values })
//         }
//     }
//   }
  auth() {
    return {
        addStudent(payload){
            axios.post(`${this.host}/auth/academy/student`, payload)
        }
    }
  }

  getItem(key) {
    let value = this.ls.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return null
    }
  }

}

export default new localStorageService();