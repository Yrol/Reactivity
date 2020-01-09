import {observable, action} from 'mobx';
import { IActivity } from '../../models/activity';
import agent from '../api/agent';
import { createContext } from 'react';

class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable selectedActivity : IActivity | null = null;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitState = false;

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            // await will make sure it'll get the list of activities first and then execute the code below
            const activities =  await agent.Activities.list()
            activities.forEach((activity) => {
                //loop through the API response.data
                activity.date = activity.date.split(".")[0]; //splitting the time before the dot(.)
                this.activities.push(activity);
            })
            this.loadingInitial = false;
        } catch(error) {
            this.loadingInitial = false;
            console.log(error);
        }
    }

    //action for selecting an activity
    @action setSelectActivity = (id: string) => {
        this.selectedActivity = this.activities.filter(a => a.id === id)[0];
        this.editMode = false;
    }

    //action for creating an activity
    @action createActivity = async (activity: IActivity) => {
        this.submitState = true;
        try {
            await agent.Activities.create(activity)
            this.activities.push(activity);
            this.editMode = false;
            this.submitState = false;
        } catch (error) {
            this.submitState = false;
            console.log(error);
        }
    }

    //action for opening the create form
    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = null;
    }
}

export default createContext(new ActivityStore())