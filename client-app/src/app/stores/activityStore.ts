import { observable, action, computed, configure, runInAction } from "mobx";
import { IActivity } from "../../models/activity";
import agent from "../api/agent";
import { createContext, SyntheticEvent } from "react";
import { history } from '../..';
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { setActivityProps } from "../common/Util/utils";


//enforcing the "strict mode" to make sure the state changes are happening only within the context of actions (@actions)
//configure({enforceActions: 'always'})

export default class ActivityStore {

  rootStore: RootStore | undefined;

  //constructor that accepts RootStore
  constructor (rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();//This activity register will create an observable map using the activities. 
  //@observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | null = null
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitState = false;
  @observable deleteActivityId: string | null = null;

  //get the activities sort by date - using the @computed decorator
  //This is referenced by the ActivityList, hence any changes to the activities (change date & etc) will be reflected (changing the list item positions & etc)
  //If the activities list changes (i.e a new activity has been added & etc), the @computed will get notified and rearrange the activities list in compliance with the new activity 
  @computed get activitiesByDate() {
    //converting observable map (activityRegistry) to an arry using "Array.from" since it is not an array
    return this.groupActivityByDate(Array.from(this.activityRegistry.values()));
  }


  //helper for sorting and grouping activities by the same date 
  groupActivityByDate(activities: IActivity[]) {

    //sorting the activities by date and time 
    const sortedActivities = activities.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )

    //then grouping the activities by date ONLY
    return Object.entries(sortedActivities.reduce((activities, activity) => {
      const date = activity.date.toISOString().split('T')[0];//split by "T". ex:"2020-01-01T01:00:00"
      //The key for each item is the unique activity date. hence, each item can consist of one or more activities fall within the same date
      activities[date] = activities[date] ? [...activities[date], activity] : [activity]; // ternary operation - if activity has the same date put under the same array, else create new entry
      return activities;
    }, {} as {[key: string]: IActivity[]}));
  }

  //loading all the activities
  @action loadActivities = async () => {
    this.loadingInitial = true;
    const user = this.rootStore?.userStore?.user; // getting the user

    try {
      // await will make sure it'll get the list of activities first and then execute the code below
      const activityList = await agent.Activities.list();
      runInAction(() => { //"runInAction" is the strict mode to make sure state changes happens within @action is covered after the "await" above
        activityList.forEach(activity => {
          setActivityProps(activity, user!)
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

    this.loadingInitial = true;
    let activity = this.getActivity(id);
    const user = this.rootStore?.userStore?.user; // getting the user

    if (activity) { // if the activity is available on the loaded list
      runInAction(() => {
        this.selectedActivity = activity;
        this.loadingInitial = false;
      })
      return activity;//return the activity
    } else { //load activity from the API
      try {
        //this.loadingInitial = true;
        const activity = await agent.Activities.details(id);
        runInAction(() =>{
          setActivityProps(activity, user!);
          this.selectedActivity = activity;
          this.loadingInitial = false;

          // adding the activity to the observable map (activityRegister) if it loads from the server. So next time it'll load from this collection instead of making a server call
          this.activityRegistry.set(activity.id, activity);
        })
        return activity;//return the activity
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        })
        //This error originates from agent.ts and will be thrown again as below to be caught within Component classes (ActivityDetails & etc) which has access to route to pages (404 & etc) based on the error type 
        //throw error;
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
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
      })
      console.log(error);
      toast.error("An error occurred while creating the new activity");
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
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
      });
      toast.error("An error occurred while editing the activity");
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

  @action attendActivity = () => {
    
  }

  // @action cancelFormOpen = () => {
  //   this.editMode = false
  // }
}

//createContext will save an instance of the ActivityStore within the React context
//export default createContext(new ActivityStore());
