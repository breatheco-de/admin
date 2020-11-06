import axios from 'axios';

export const getAllEvents = () => {
    return axios.get("/api/calendar/events/all");
}

export const addNewEvent = (event) => {
    return axios.post("/api/calendar/events/add",event);
}

export const updateEvent = (event) => {
    return axios.post("/api/calendar/events/update",event);
}

export const deleteEvent = (event) => {
    return axios.post("/api/calendar/events/delete",event);
}