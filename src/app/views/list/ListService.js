import axios from 'axios';

export const getAllList = () => axios.get('/api/list/all');
