import React, { SyntheticEvent, useContext, useEffect } from "react";
import { Grid, List, GridColumn } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
//import ActivityStore from "../../../app/stores/activityStore";
import {observer} from 'mobx-react-lite';
import { LoadingComponent } from "../../../app/layouts/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface IProps {
  //activities: IActivity[];

  //referencing the function "currentSelectedActivity" defined in App.tsx to get the selected ID
  //currentSelectedActivity: (id: string) => void;

  // selectedActivity: IActivity;
  // editMode: boolean;

  //setEditMode: (emode: boolean) => void;

  //referencing the "setSelectedActivity" state defined in App.tsx - will be passed to ActivityDetails
  //setSelectedActivity: (activity: IActivity | null) => void;

  //handler for create, edit and delete activities
  //createActivity: (activity: IActivity) => void;
  //editActivity: (activity: IActivity) => void;

  //handler for deleting an activity. Accepts event of SyntheticEvent type which contains button properties such as the unique button name (unique ID)
  //deleteActivity: (e:SyntheticEvent<HTMLButtonElement>, id:string) => void;

  //submitState: boolean;//form submit status 

  //deleteActivityID: string//contains the unique ID of the clicked button
}

{
/** Adding an IProps interface and destructuring them - such as activities, currentSelectedActivity and etc...  */
}
const ActivitiesDashboard: React.FC<IProps> = ({
  //activities,
  //currentSelectedActivity,
  //selectedActivity,
  //editMode,
  //setEditMode,
  //createActivity,
  //editActivity,
  //deleteActivity,
  //setSelectedActivity,
  //submitState,
  //deleteActivityID
}) => {
  //Using the MobX state in activity.ts
  //const activityStore = useContext(ActivityStore)
  //const {editMode, selectedActivity} = activityStore
  const rootStore = useContext(RootStoreContext);
  const {loadActivities, loadingInitial} = rootStore.activityStore!

  useEffect(() => {
    loadActivities();
  }, [loadActivities]); // the array contains the dependencies that needs to run the functions defined in useEffect

  if (loadingInitial)
    return (
      <LoadingComponent
        content="Loading activities. Please wait"
        inverted={true}
      />
    );


  return (
    <Grid>
      {/** The React Grid system supports up to 16 columns */}
      <Grid.Column width={10}>
        {/** Passing the activities to the ActivityList as a Prop */}
        {/** Passing the currentSelectedActivity to the ActivityList as a Prop*/}
        <ActivityList
          //activities={activities}
          //currentSelectedActivity={currentSelectedActivity}
          //setEditMode={setEditMode}
          //deleteActivity={deleteActivity}
          //submitState={submitState}
          //deleteActivityID={deleteActivityID}
        />
        {/* <List>
          {activities.map(activity => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List> */}
      </Grid.Column>
      <Grid.Column width={6}>
        {/** using the "selectedActivity &&"  to display "ActivityDetails" if not null (conditional)*/}
        {/** if edit mode true hide detail view */}
        {/* {selectedActivity && !editMode && (
          <ActivityDetails
            //activity={selectedActivity}
            //setEditMode={setEditMode}
            //setSelectedActivity={setSelectedActivity}
          />
        )} */}

        {/** if edit mode true show the form*/}
        {/** In here we're using "key" to make sure the form will be mounted and unmounted between editing and creating activities. */}
        {/** Without a the "key", the form will not be re-rendered when we have an edit item and then attempting a create a new activity */}
        {/* {editMode && (
          <ActivityForm
            key={selectedActivity && selectedActivity.id || 0}
            setEditMode={setEditMode}
            activity={selectedActivity!}
            createActivity={createActivity}
            editActivity={editActivity}
            submitState={submitState}
          />
        )} */}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivitiesDashboard);
