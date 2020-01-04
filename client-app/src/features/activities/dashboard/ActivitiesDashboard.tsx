import React from "react";
import { Grid, List, GridColumn } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails"
import ActivityForm from "../form/ActivityForm";

interface IProps {
    activities: IActivity[];

    //referencing the function "currentSelectedActivity" defined in App.tsx to get the selected ID   
    currentSelectedActivity: (id: string) => void; 
    selectedActivity:IActivity;

    editMode: boolean;
    setEditMode: (emode: boolean) => void;

    //referencing the "setSelectedActivity" state defined in App.tsx - will be passed to ActivityDetails
    setSelectedActivity: (activity: IActivity | null) => void;

    //handler for create and edit activity
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
}

{/*Getting the "activities" array as a 'prop' from the App.tsx to create the list below*/}
const ActivitiesDashboard: React.FC<IProps> = ({
    activities, 
    currentSelectedActivity, 
    selectedActivity,
    editMode,
    setEditMode,
    createActivity,
    editActivity,
    setSelectedActivity}) => {
  return (
    <Grid>
      {/** The React Grid system supports upto 16 columns */}
      <Grid.Column width={10}>
      {/** Passing the activities to the ActivityList as a Prop */}
      {/** Passing the currentSelectedActivity to the ActivityList as a Prop*/}
      <ActivityList 
        activities={activities} 
        currentSelectedActivity={currentSelectedActivity}
        setEditMode={setEditMode}
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
        {selectedActivity && !editMode && <ActivityDetails 
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}/>
        }

        {/** if edit mode true show the form*/}
        {editMode && <ActivityForm
          setEditMode={setEditMode}
          activity={selectedActivity!}
          createActivity={createActivity}
          editActivity={editActivity}/>        
        }
      </Grid.Column>
    </Grid>
  );
};

export default ActivitiesDashboard;
