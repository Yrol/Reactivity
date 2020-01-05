import axios, { AxiosResponse } from 'axios'
import { url } from 'inspector';
import { IActivity } from '../../models/activity';

//base URL
axios.defaults.baseURL = '"http://localhost:5000/api';

const responseBody = (response : AxiosResponse) => response.data;

//contains all the request TYPES - GET, POST, PUT and DELETE
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),// taking only 1 argument - url
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody), //taking 2 arguments - url & body
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody), //taking 2 arguments - url & body
    del: (url: string) => axios.delete(url).then(responseBody)
}


//object that contains all the requests specific to this app
const Activities = {
    list: () => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

//give access to the Activities object
export default {
    Activities
}



