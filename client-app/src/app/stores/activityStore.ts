import { observable, action, computed, configure, runInAction } from "mobx";
import { IActivity } from "../../models/activity";
import agent from "../api/agent";
import { createContext, SyntheticEvent } from "react";

//enforcing the "strict mode" to make sure the state changes are happening only within the context of actions (@actions)
configure({enforceActions: 'always'})

class ActivityStore {
  @observable activityRegistry = new Map();//This activity register will create an observable map using the activities. 
  //@observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | null = null
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitState = false;
  @observable deleteActivityId: string | null = null;

  //get the activities sort by date - using the @computed decorator
  //This is referenced by the ActivityList, hence any changes to the activities (change date & etc) will be reflected (changing the list item positions & etc)
  @computed get activitiesByDate() {
    //converting observable map (activityRegister) to an arry since it is not an array
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(b.date) - Date.parse(a.date)
    );
  }

  //loading all the activities
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      // await will make sure it'll get the list of activities first and then execute the code below
      const activityList = await agent.Activities.list();
      runInAction(() => { //strict mode to make sure state changes happens within @action is covered after the "await" above
        activityList.forEach(activity => {
          //loop through the API response.data
          activity.date = activity.date.split(".")[0]; //splitting the time before the dot(.)
          this.activityRegistry.set(activity.id, activity);// adding the activity to the observable map (activityRegister)
        });
        this.loadingInitial = false;
      })
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  //clearing the activity
  @action clearActivity = () => {
    this.selectedActivity = null;
  }

  //loading an individual activity (when navigate to the details view)
  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) { // if the activity is available on the loaded list
      this.selectedActivity = activity
    } else { //load activity from the API
      try {
        //this.loadingInitial = true;
        const activity = await agent.Activities.details(id);
        runInAction(() =>{
          this.selectedActivity = activity;
          this.loadingInitial = false;
          console.log(activity);
        })
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        })
        console.log(error);
      }
    }
  }

  //a helper method to return an activity
  getActivity = (id: string) => {
    return this.activityRegistry.get(id)
  }

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
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitState = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
      })
      console.log(error);
    }
  };

  //editing an activity
  @action editActivity = async (activity: IActivity) => {
    this.submitState = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {//strict mode to make sure state changes happens within @action is covered after the "await" above
        this.activityRegistry.set(activity.id, activity);
        this.setSelectActivity(activity.id);
        this.submitState = false;
        this.editMode = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
      });
      console.log(error);
    }
  }

  //deleting an activity
  @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitState = true;
    this.setDeleteActivityID(event.currentTarget.name);
    try {
      await agent.Activities.delete(id)
      runInAction(() => {//strict mode to make sure state changes happens within @action is covered after the "await" above
        this.activityRegistry.delete(id)
        if(this.selectedActivity?.id === id){
          this.cancelSelectedActivity();
          //this.cancelFormOpen();
        }
        this.submitState = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
      })
      console.log(error);
    }
  }

  @action setDeleteActivityID = (id: string) =>{
    this.deleteActivityId = id;
  } 

  //action for opening the create form
  @action openCreateForm = () => {
    //this.editMode = true;
    this.selectedActivity = null;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id)
    //this.editMode = true;
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = null;
  }

  // @action cancelFormOpen = () => {
  //   this.editMode = false
  // }
}

export default createContext(new ActivityStore());
