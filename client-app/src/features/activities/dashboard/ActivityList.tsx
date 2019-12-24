import React, { Fragment } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";

interface IProps {
  activities: IActivity[];

  //referencing the function "currentSelectedActivity" defined in App.tsx to get the selected ID 
  currentSelectedActivity: (id: string) => void;
}

const ActivityList: React.FC<IProps> = ({ 
  activities, 
  currentSelectedActivity
 }) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(activity => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>{activity.city}</div>
              </Item.Description>
              <Item.Extra>
                <Button onClick={() => currentSelectedActivity(activity.id)} floated="right" content="View" color="blue"></Button>
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default ActivityList;
