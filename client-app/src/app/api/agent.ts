import axios, { AxiosResponse } from 'axios'
import { url } from 'inspector';
import { IActivity, IActivitiesEnvelope } from '../../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../../models/user';

//base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

//Utilizing the token send with every request using "axios request interceptors"
axios.interceptors.request.use((config) => {

    //Grab the token from localStorage pass it along with the request header as Bearer
    const token = window.localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},error => {
    //"Promise.reject" returns a Promise object that is rejected with a given reason - Promise.reject(reason)
    return Promise.reject(error)
} )

//This will receive all the server responses using "axios response interceptors"
//The exceptions thrown here will be caught by the "activityStore" which calls this class
axios.interceptors.response.use(undefined, error => {

    //handling network errors - ex: when the API
    if (error.message === 'Network Error' && !error.response) {
        console.log(error.message);
        //throw error; will be caught by the "activityStore"
        toast.error('Network error - Make sure the API is running!');
    }

    //exposing the properties of the error response values such as header, data & etc
    const {status, data, config, headers} = error.response;

    if (status === 404) {
        //throw error; will be caught by the "activityStore"
        history.push('/notfound');// getting the access to history from <Router> which has been defined in index.tsx
    }

    //Handling the 400 GUID error for GET methods only 
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        //throw error; will be caught by the "activityStore"
        history.push('/notfound');
    }

    //handling the token expiry
    if (status === 401 && headers['www-authenticate'].includes('Bearer error="invalid_token", error_description="The token expired at"')) {
        window.localStorage.removeItem('jwt');//remove the token
        history.push('/');//send user to the home page
        toast.info('Youe session has expired, please log back again');
    }

    //handling the 500 server errors using the "react-toastify" library  (ActivityDetails for now)
    if (status === 500) {
        //throw error; will be caught by the "activityStore"
        toast.error('Server error');
    }

    //error response will throw a proper error response
    throw error.response;

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


//object that contains all the requests specific to Activities of the app
const Activities = {
    //Ver1: list: (): Promise<IActivity[]> => requests.get('/activities'), // get all activities with the return type of IActivity in a Promise.
    //Ver2: list: (limit?: number, page? : number): Promise<IActivitiesEnvelope> => requests.get(`/activities?limit=${limit}&offset=${page ? page*limit! : 0}`), //  get all activities with the return type of IActivitiesEnvelope that sets the limt and the offset
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get('/activities', {params: params}).then(sleep(1000)).then(responseBody), //use sleep to cause a delay deliberately
    details: (id: string) => requests.get(`/activities/${id}`), //accepts a string argument
    create: (activity: IActivity) => requests.post('/activities', activity), //accepts an IActivity as argument
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity), //accepts an IActivity as argument
    delete: (id: string) => requests.del(`/activities/${id}`),  //accepts a string argument
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}), //accepts string argument. Need to pass an empty body "{}" since this is a post request
    unattend: (id: string) => requests.del(`/activities/${id}/attend`)
}

//object that contains all the requests specific to Users of the app
const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user), //passing[post] an IUserFormValues object to the login and returning an IUser object
    register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user), //passing[post] an IUserFormValues object to the login and returning an IUser object
}

//give access to the Activities object
export default {
    Activities,
    User
}



