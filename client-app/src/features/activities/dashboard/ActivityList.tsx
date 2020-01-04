import React, { Fragment } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";

interface IProps {
  activities: IActivity[];

  //referencing the function "currentSelectedActivity" defined in App.tsx to get the selected ID 
  currentSelectedActivity: (id: string) => void;

  setEditMode: (emode: boolean) => void
}

const ActivityList: React.FC<IProps> = ({ 
  activities, 
  currentSelectedActivity,
  setEditMode
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
                {/** currentSelectedActivity is the handleSelectedActivity handler passed/originated in App.tsx */}
                {/** setEditMode is the handleSelectedActivity handler passed/originated in App.tsx */}
                <Button onClick={() => {currentSelectedActivity(activity.id); setEditMode(false)}} floated="right" content="View" color="blue"></Button>
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