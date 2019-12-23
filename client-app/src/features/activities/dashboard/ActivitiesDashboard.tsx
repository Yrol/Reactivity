import React from "react";
import { Grid, List } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import ActivityList from "./ActivityList";

interface IProps {
    activities: IActivity[]
}

{/*Getting the "activities" array as a 'prop' from the App.tsx to create the list below*/}
const ActivitiesDashboard: React.FC<IProps> = ({activities}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
      {/** Passing the activities to the ActivityList */}
      <ActivityList activities={activities}/>
        {/* <List>
          {activities.map(activity => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List> */}
      </Grid.Column>
    </Grid>
  );
};

export default ActivitiesDashboard;
