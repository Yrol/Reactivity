//class that contains additional functions

import { IActivity, IAttendee } from "../../../models/activity";
import { IUser } from "../../../models/user";

//function for extracting time
export const combineDateAndTime = (date: Date, time: Date) => {
  //getting the time
  //const timeString = time.getHours() + ":" + time.getMinutes() + ":00";

  //getting the date
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1; // adding '+1' since "getMonth()" starts from 0
  // const day = date.getDate();
  // const dateString = `${year}-${month}-${day}`;
  //return new Date(dateString + " " + timeString);

  //Getting the date and the time with Safari bug Fix!
  const dateString = date.toISOString().split('T')[0];
  const timeString = time.toISOString().split('T')[1];
  return new Date(dateString + "T" + timeString);
};

//generic functionality being used by loadActivities() and loadactivity() in activityStore.ts
export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date); //assign the activity's Date to JS Date object

  //The some() method executes the callback function once for each element present in the array until it finds the one where callback returns a truthy value -  will return boolean true / false
  //check if the logged in user is going to the event
  //based on the boolean value return from "some()", the "isGoing" will be set
  activity.isGoing = activity.attendees.some(
    a => a.username === user?.username
  );

  //check if the logged in user is the host of the activity
  //based on the boolean value return from  "some()", the "isHost" will be set
  activity.isHost = activity.attendees.some(
    a => a.username === user?.username && a.isHost
  );

  return activity;
};

//create the user object from the currently logged in user when need to attend to a given activity
export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image! // adding "!" since the image could potentially be null
  }
}