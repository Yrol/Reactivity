import { observable, action, computed } from "mobx";
import { IActivity } from "../../models/activity";
import agent from "../api/agent";
import { createContext } from "react";

class ActivityStore {
  @observable activityRegister = new Map();//This activity register will create an observable map using the activities. 
  @observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitState = false;

  //get the activities sort by date - using the @computed decorator
  @computed get activitiesByDate() {
    //converting observable map (activityRegister) to an arry since it is not an array
    return Array.from(this.activityRegister.values()).sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      // await will make sure it'll get the list of activities first and then execute the code below
      const activityList = await agent.Activities.list();
      activityList.forEach(activity => {
        //loop through the API response.data
        activity.date = activity.date.split(".")[0]; //splitting the time before the dot(.)
        this.activityRegister.set(activity.id, activity);// adding the activity to the observable map (activityRegister)
      });
      this.loadingInitial = false;
    } catch (error) {
      this.loadingInitial = false;
      console.log(error);
    }
  };

  //action for selecting an activity
  @action setSelectActivity = (id: string) => {
    //this.selectedActivity = this.activities.filter(a => a.id === id)[0];
    this.selectedActivity = this.activityRegister.get(id);
    this.editMode = false;
  };

  //action for creating an activity
  @action createActivity = async (activity: IActivity) => {
    this.submitState = true;
    try {
      await agent.Activities.create(activity);
      this.activityRegister.set(activity.id, activity);
      this.editMode = false;
      this.submitState = false;
    } catch (error) {
      this.submitState = false;
      console.log(error);
    }
  };

  //action for opening the create form
  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = null;
  };
}

export default createContext(new ActivityStore());
