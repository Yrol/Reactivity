import React from "react";
import { Grid, List } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";

interface IProps {
    activities: IActivity[]
}

{/*Getting the "activities" array as a 'prop' from the App.tsx to create the list below*/}
const ActivitiesDashboard: React.FC<IProps> = ({activities}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <List>
          {/*Using state to get the values when component is rendered (componentDidMount) to the UI*/}
          {activities.map(activity => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
      </Grid.Column>
    </Grid>
  );
};

export default ActivitiesDashboard;
