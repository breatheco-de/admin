import axios from 'axios';

const getAllList = () => axios.get('/api/list/all');
export default getAllList;
