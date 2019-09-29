import axios from 'axios';

const webservice = axios.create({
    baseURL: 'http://192.168.1.221:31112/function'
});

export const getTasks = () =>
    webservice.get('/todos');

export const createTask = task =>
    webservice.post('/todos', task);