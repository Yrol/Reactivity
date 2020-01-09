import React, { Fragment, SyntheticEvent, useContext } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import { observer } from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStore'

interface IProps {
  //activities: IActivity[];

  //referencing the function "currentSelectedActivity" defined in App.tsx to get the selected ID
  currentSelectedActivity: (id: string) => void;

  setEditMode: (emode: boolean) => void;

  //handler for deleting an activity. Accepts event of SyntheticEvent type which contains button properties such as the unique button name (unique ID)
  deleteActivity: (e:SyntheticEvent<HTMLButtonElement> ,id: string) => void;

  submitState:boolean;

  deleteActivityID:string;//contains the unique ID of the clicked button
}
/** Setting IProps and destructuring them - such as activities, currentSelectedActivity and etc...  */
const ActivityList: React.FC<IProps> = ({
  //activities,
  currentSelectedActivity,
  setEditMode,
  deleteActivity,
  submitState,
  deleteActivityID
}) => {
  const activityStore = useContext(ActivityStore);
  const {activities, setSelectActivity} = activityStore
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
                <Button
                  onClick={() => {
                    setSelectActivity(activity.id)
                    //currentSelectedActivity(activity.id);
                    //setEditMode(false);

                  }}
                  floated="right"
                  content="View"
                  color="blue"
                ></Button>
                <Button
                  name={activity.id}

                  //event "e" will be used for passing button properties in this case the "name" to the deleteActivity method. Event e is a type of SyentheticEvent
                  onClick={(e) => {
                    deleteActivity(e, activity.id);
                  }}
                  loading={deleteActivityID === activity.id &&submitState}
                  floated="right"
                  content="Delete"
                  color="red"
                >  
                </Button>
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
