import React, { Fragment, SyntheticEvent, useContext } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import { observer } from "mobx-react-lite";
//import ActivityStore from "../../../app/stores/activityStore";
import { Link } from "react-router-dom";
import ActivityListItem from "./ActivityListItem";
import { RootStoreContext } from "../../../app/stores/rootStore";
import {format} from 'date-fns'

interface IProps {
  //activities: IActivity[];
  //referencing the function "currentSelectedActivity" defined in App.tsx to get the selected ID
  //currentSelectedActivity: (id: string) => void;
  //setEditMode: (emode: boolean) => void;
  //handler for deleting an activity. Accepts event of SyntheticEvent type which contains button properties such as the unique button name (unique ID)
  //deleteActivity: (e:SyntheticEvent<HTMLButtonElement> ,id: string) => void;
  //submitState:boolean;
  //deleteActivityID:string;//contains the unique ID of the clicked button
}
/** Setting IProps and destructuring them - such as activities, currentSelectedActivity and etc...  */
const ActivityList: React.FC<IProps> = (
  {
    //activities,
    //currentSelectedActivity,
    //setEditMode,
    //deleteActivity,
    //submitState,
    //deleteActivityID
  }
) => {
  //Defining the MobX store (ActivityStore) and destructuring the required functions and variables from it
  //const activityStore = useContext(ActivityStore);
  const rootStore = useContext(RootStoreContext);
  const { activitiesByDate } = rootStore.activityStore!
  // const {
  //   activitiesByDate,
  //   setSelectActivity,
  //   submitState,
  //   deleteActivity,
  //   deleteActivityId
  // } = activityStore;
  return (
    <Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size="large" color="blue">
            {/** formatting the date */}
            {format(group, 'eeee do  MMMM')}
          </Label>
            <Item.Group divided>
              {activities.map(activity => (
                <ActivityListItem key={activity.id} activity={activity} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ActivityList);
