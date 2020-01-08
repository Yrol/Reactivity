import {observable, action} from 'mobx';
import { IActivity } from '../../models/activity';
import agent from '../api/agent';
import { createContext } from 'react';

class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable loadingInitial = false

    @action loadActivities = () => {
        this.loadingInitial = true;
        agent.Activities.list().then(response => { // returns response.data with Promise
            response.forEach((activity) => {
              //loop through the API response.data
              activity.date = activity.date.split(".")[0]; //splitting the time before the dot(.)
              console.log(activity);
              this.activities.push(activity);
            });
          }).then(() => this.loadingInitial = false);
    }
}

export default createContext(new ActivityStore())