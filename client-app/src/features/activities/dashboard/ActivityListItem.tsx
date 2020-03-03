import React, { useContext } from "react";
import { Item, Button, Label, Segment, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IActivity, IAttendee } from "../../../models/activity";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import {format} from 'date-fns';// date-fns formatter to format the date values
import { ActivityListItemAttendees } from "./ActivityListItemAttendees";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src="/assets/logo192.png" />
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
              <Item.Extra>
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" /> {format(activity.date!, 'h:mm a')}
        <Icon name="marker" /> {activity.city}
      </Segment>
      <Segment secondary><ActivityListItemAttendees attendees={activity.attendees}/></Segment>
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
          floated="right"
          content="View"
          color="blue"
        ></Button>
        <Button
          name={activity.id}
          //event "e" will be used for passing button properties in this case the "name" to the deleteActivity method. Event e is a type of SyentheticEvent
          onClick={e => {
            // deleteActivity(e, activity.id);
          }}
          //loading={deleteActivityId === activity.id &&submitState}
          floated="right"
          content="Delete"
          color="red"
        ></Button>
      </Segment>
    </Segment.Group>
  );
};

export default observer(ActivityListItem);
