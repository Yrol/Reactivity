import ActivityStore from './activityStore';
import UserStore from './userStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import CommonStore from './commnStore';

//enforcing the "strict mode" to make sure the state changes are happening only within the context of actions (@actions)
configure({enforceActions: 'always'})

export class RootStore {

    //define the stores (ActivityStore and UserStore)
    activityStore: ActivityStore | undefined;
    userStore: UserStore | undefined;
    commonStore: CommonStore | undefined

    //initialize the stores (ActivityStore and UserStore) and pass the Rootstore to each of them (to their constructor which accepts RootStore) using the keyword "this"
    constructor () {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
    }
}

//This will add the RootStore (which contains both ActivityStore and UserStore) to the React context
export const RootStoreContext = createContext(new RootStore());