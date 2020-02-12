import ActivityStore from './activityStore';
import UserStore from './userStore';
import { createContext } from 'react';

export class RootStore {

    //define the stores (ActivityStore and UserStore)
    activityStore: ActivityStore | undefined;
    UserStore: UserStore | undefined;

    //initialize the stores (ActivityStore and UserStore) and pass the Rootstore to each of them (to their constructor which accepts RootStore) using the keyword "this"
    constructor () {
        this.activityStore = new ActivityStore(this);
        this.UserStore = new UserStore(this);
    }
}

//This will add the RootStore (which contains both ActivityStore and UserStore) to the React context
export const RootStoreContext = createContext(new RootStore());