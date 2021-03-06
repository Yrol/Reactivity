import React, { useContext } from "react";
import { Item, Button, Label, Segment, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IActivity, IAttendee } from "../../../models/activity";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { format } from "date-fns"; // date-fns formatter to format the date values
import { ActivityListItemAttendees } from "./ActivityListItemAttendees";
import { RootStoreContext } from "../../../app/stores/rootStore";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const host = activity.attendees.filter(x => x.isHost === true)[0]; // getting the host of the activity from the "IAttendee" object available inside the "IActivity" (which has the "isHost"). Getting the 0th element since "filter" returns an array
  //console.log(JSON.stringify(host))
  const rootStore = useContext(RootStoreContext);
  const { deleteActivity, loading } = rootStore.activityStore!
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            {/* using the host image if availale or else the defualt image*/}
            <Item.Image size="tiny" circular src={host.image || "/assets/logo192.png"} />
            <Item.Content>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
              <Item.Description>{host.username}</Item.Description>
              {/* if the activity is hosted by the logged in user*/}
              {activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You're hosting this activity"
                  />
                </Item.Description>
              )}

              {/* if the logged in user is going to the activity */}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You're going to this activity"
                  />
                </Item.Description>
              )}

              <Item.Extra>
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(activity.date!, "h:mm a")}
        <Icon name="marker" /> {activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        {/** currentSelectedActivity is the handleSelectedActivity handler passed/originated in App.tsx */}
        {/** setEditMode is the handleSelectedActivity handler passed/originated in App.tsx */}
        <Button
          as={Link}
          to={`/activities/${activity.id}`} // Routes integration
          // onClick={() => {
          //   setSelectActivity(activity.id) //After MobX integration
          //   //currentSelectedActivity(activity.id); // IProps (without MobX)
          //   //setEditMode(false); // IProps (without MobX)

          // }}
          disabled={loading} // disable the view when deleting the activity
          floated="right"
          content="View"
          color="blue"
        ></Button>
        <Button
          name={activity.id}
          //event "e" will be used for passing button properties in this case the "name" to the deleteActivity method. This will make sure each button will be identified uniquely. Event e is a type of SyentheticEvent
          onClick={e => {
            deleteActivity(e, activity.id);
          }}
          //loading={deleteActivityId === activity.id &&submitState}
          loading={loading}
          floated="right"
          content="Delete"
          color="red"
        ></Button>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
