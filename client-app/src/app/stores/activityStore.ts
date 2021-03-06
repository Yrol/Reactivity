import { observable, action, computed, configure, runInAction, values, keys, reaction, toJS } from "mobx";
import { IActivity } from "../../models/activity";
import agent from "../api/agent";
import { createContext, SyntheticEvent } from "react";
import { history } from "../..";
import { toast } from "react-toastify";
import { RootStore } from "./rootStore";
import { setActivityProps, createAttendee } from "../common/Util/utils";

//enforcing the "strict mode" to make sure the state changes are happening only within the context of actions (@actions)
//configure({enforceActions: 'always'})

const LIMIT = 2;

export default class ActivityStore {
  rootStore: RootStore | undefined;

  //constructor that accepts RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    
    //using a MobX reaction to trigger automatically if the predicate values have changed
    reaction(
      () => this.predicate.keys(),//if the predicate keys changed, do the following - set page to 0, clear the registry and reload the activities
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    )
  }

  @observable activityRegistry = new Map(); //This activity register will create an observable map using the activities.
  //@observable activities: IActivity[] = [];
  @observable selectedActivity: IActivity | null = null;
  @observable loadingInitial = false;
  @observable editMode = false;
  @observable submitState = false;
  @observable deleteActivityId: string | null = null;
  @observable loading = false;
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map(); // will store query string as key value pairs. For ex: limit set to a number. IsGoing set to true/false & etc

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();//clear the exisiting predicate
    if (predicate !== 'all') {
      this.predicate.set(predicate, value)
    }
  }

  //build/rebuild the query parameter for retriving activities. This will be passed down to the "loadActivities" action below
  @computed get axiosParams() {
    const params = new URLSearchParams(); //using the JavaScript URLSearchParams interface for building the query string

    //the "limit" and "offset" query params will always be added
    params.append('limit', String(LIMIT));//set the limit
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`) //set the offset
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {// this is for isHost and isGoing query params
        params.append(key, value); 
      }
    })
    return params;
  }

  //computed method to get the total number of pages with the limiter is in place (using ceil to get the nearest number after dividing the activity count)
  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  //action which sets the page number
  @action setPage = (page: number) => {
    this.page = page
  }

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
    );

    //then grouping the activities by date ONLY
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0]; //split by "T". ex:"2020-01-01T01:00:00"
        //The key for each item is the unique activity date. hence, each item can consist of one or more activities fall within the same date
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity]; // ternary operation - if activity has the same date put under the same array, else create new entry
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  //loading all the activities
  @action loadActivities = async () => {
    this.loadingInitial = true;
    const user = this.rootStore?.userStore?.user; // getting the user

    try {
      // await will make sure it'll get the list of activities first and then execute the code below
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const {activities, activityCount} = activitiesEnvelope;
      //"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
      runInAction(() => {
        activities.forEach(activity => {
          setActivityProps(activity, user!);
          this.activityRegistry.set(activity.id, activity); // adding the activity to the observable map (activityRegister)
        });
        this.activityCount = activityCount;
        this.loadingInitial = false;
      });
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
  };

  //loading an individual activity (when navigate to the details view)
  @action loadActivity = async (id: string) => {
    this.loadingInitial = true;
    let activity = this.getActivity(id);//trying to retrive the activity from cache
    const user = this.rootStore?.userStore?.user; // getting the user

    if (activity) {//if activity is available in cache
      //"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
      // if the activity is available on the loaded list
      runInAction(() => {
        this.selectedActivity = activity;
        this.loadingInitial = false;
      });
      //convert the activity to a JavaScript object (toJS) and return. 
      //The reason to convert to a JS object because the item return from the cahce is an observable and we're manupilating/changing the activity date format in "activity.ts" (in "constructor(init?: IActivityFormValues )") when initializing the activity. This is not allowed in MobX and causes to throw an error since we're trying to modifiy it outside the actions
      return toJS(activity);
    } else {//if the activity is not in cache, get it from the API
      //load activity from the API
      try {
        //this.loadingInitial = true;
        const activity = await agent.Activities.details(id);
        //"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
        runInAction(() => {
          setActivityProps(activity, user!);
          this.selectedActivity = activity;
          this.loadingInitial = false;

          // adding the activity to the observable map (activityRegister) if it loads from the server. So next time it'll load from this collection instead of making a server call
          this.activityRegistry.set(activity.id, activity);
        });
        return activity; //return the activity as JavaScript Object (not as an observable - "const activity")
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        });
        //This error originates from agent.ts and will be thrown again as below to be caught within Component classes (ActivityDetails & etc) which has access to route to pages (404 & etc) based on the error type
        //throw error;
      }
    }
  };

  //a helper method to return an activity
  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
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

      //adding the creator of the activity (the logged in user) as an attendee as well as the host of the activity
      const attendee = createAttendee(this.rootStore?.userStore?.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;

      //"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submitState = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
      });
      console.log(error);
      toast.error("An error occurred while creating the new activity");
    }
  };

  //editing an activity
  @action editActivity = async (activity: IActivity) => {
    this.submitState = true;
    try {
      await agent.Activities.update(activity);
      //"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.setSelectActivity(activity.id);
        this.submitState = false;
        this.editMode = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
      });
      toast.error("An error occurred while editing the activity");
    }
  };

  //deleting an activity
  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.loading = true;
    this.submitState = true;
    this.setDeleteActivityID(event.currentTarget.name);
    try {
      await agent.Activities.delete(id);
      //"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
      runInAction(() => {
        this.activityRegistry.delete(id);
        if (this.selectedActivity?.id === id) {
          this.cancelSelectedActivity();
          //this.cancelFormOpen();
        }
        this.submitState = false;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitState = false;
        this.loading = false;
      });
      toast.error("An error occured while deleting the activity");
    }
  };

  @action setDeleteActivityID = (id: string) => {
    this.deleteActivityId = id;
  };

  //action for opening the create form
  @action openCreateForm = () => {
    //this.editMode = true;
    this.selectedActivity = null;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    //this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = null;
  };

  //action for attending an activity
  @action attendActivity = async () => {
    //getting the return object of the current user  defined in utils class to be used as an attendee
    const attendee = createAttendee(this.rootStore?.userStore?.user!);
    this.loading = true;

    try {
      await agent.Activities.attend(this.selectedActivity?.id!);
      runInAction(() => {//"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
        //if an activity is selected then pass the attendee object
        if (this.selectedActivity) {
          this.selectedActivity.attendees.push(attendee);
          this.selectedActivity.isGoing = true;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          ); //updating the activityRegistry with the new changes to the selected activity (adding the current user as an attendee)
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        toast.error("Problem signing up to activity");
      });
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.selectedActivity?.id!)
      runInAction(() => { //"runInAction" is the strict mode to make sure state changes (to the @observable variables) happens within @action is covered after the "await" above
        if (this.selectedActivity) {
          //remove the current user from attendees by selecting all the users from attendees colletion of the currently selected activity
          this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
            a => a.username !== this.rootStore?.userStore?.user?.username
          );
          this.selectedActivity.isGoing = false;
          this.activityRegistry.set(
            this.selectedActivity.id,
            this.selectedActivity
          );
          this.loading = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        toast.error("Problem canceling attendance");
      })
    }
  };

  // @action cancelFormOpen = () => {
  //   this.editMode = false
  // }
}

//createContext will save an instance of the ActivityStore within the React context
//export default createContext(new ActivityStore());
