import { observable, action, computed } from "mobx";
import { IActivity } from "../../models/activity";
import agent from "../api/agent";
import { createContext, SyntheticEvent } from "react";

class ActivityStore {
  @observable activityRegistry = new Map();//This activity register will create an observable map using the activities. 
  //@observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitState = false;
  @observable deleteActivityId: string| null = null;

  //get the activities sort by date - using the @computed decorator
  //This is referenced by the ActivityList, hence any changes to the activities (change date & etc) will be reflected (changing the list item positions & etc)
  @computed get activitiesByDate() {
    //converting observable map (activityRegister) to an arry since it is not an array
    return Array.from(this.activityRegistry.values()).sort(
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
        this.activityRegistry.set(activity.id, activity);// adding the activity to the observable map (activityRegister)
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
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  //action for creating an activity
  @action createActivity = async (activity: IActivity) => {
    this.submitState = true;
    try {
      await agent.Activities.create(activity);
      this.activityRegistry.set(activity.id, activity);
      this.editMode = false;
      this.submitState = false;
    } catch (error) {
      this.submitState = false;
      console.log(error);
    }
  };

  //editing an activity
  @action editActivity = async (activity: IActivity) => {
    this.submitState = true;
    try {
      await agent.Activities.update(activity);
      this.activityRegistry.set(activity.id, activity);
      this.setSelectActivity(activity.id);
      this.submitState = false;
      this.editMode = false;
    } catch (error) {
      this.submitState = false;
      console.log(error);
    }
  }

  //deleting an activity
  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitState = true;
    this.setDeleteActivityID(event.currentTarget.name);
    try {
      await agent.Activities.delete(id)
      this.activityRegistry.delete(id)
      if(this.selectedActivity?.id === id){
        this.cancelSelectedActivity();
        this.cancelFormOpen();
      }
      this.submitState = false;
    } catch (error) {
      this.submitState = false;
      this.setDeleteActivityID(null)
      console.log(error);
    }
  }

  @action setDeleteActivityID = (id: string | null) =>{
    this.deleteActivityId = id;
  } 

  //action for opening the create form
  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = null;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id)
    this.editMode = true;
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = null;
  }

  @action cancelFormOpen = () => {
    this.editMode = false
  }
}

export default createContext(new ActivityStore());
