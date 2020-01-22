import axios, { AxiosResponse } from 'axios'
import { url } from 'inspector';
import { IActivity } from '../../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';

//base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

//This will receive all the server responses
//The exceptions thrown here will be caught by the "activityStore" which calls this class
axios.interceptors.response.use(undefined, error => {

    //handling network errors - ex: when the API
    if (error.message === 'Network Error' && !error.response) {
        console.log(error.message);
        toast.error('Network error - Make sure the API is running!');
    }

    const {status, data, config} = error.response;

    if (status === 404) {
        history.push('/notfound');// getting the access to history from <Router> which has been defined in index.tsx
    }

    //Handling the 400 GUID error
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }

    //handling the 500 server errors using the "react-toastify" library  (ActivityDetails for now)
    if (status === 500) {
        toast.error('Server error');
    }

});

//the response we're getting from the request - [response.data]
const responseBody = (response : AxiosResponse) => response.data;

//Creating a "Curry" function to add delay/sleep for debugging purposes - to test the loader when doing CRUD operations
//Currying means creating a function that returns another function
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() =>  resolve(response), ms));

//contains all the request TYPES - GET, POST, PUT and DELETE
//Chaining the "Currying" function defined above to mimic a delay of 1000ms
const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),// taking only 1 argument - url
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody), //taking 2 arguments - url & body
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody), //taking 2 arguments - url & body
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody)
}


//object that contains all the requests specific to this app
const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'), // get all activities with the return type of IActivity in a Promise
    details: (id: string) => requests.get(`/activities/${id}`), //accepts a string argument
    create: (activity: IActivity) => requests.post('/activities', activity), //accepts an IActivity as argument
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity), //accepts an IActivity as argument
    delete: (id: string) => requests.del(`/activities/${id}`)  //accepts a string argument
}

//give access to the Activities object
export default {
    Activities
}



