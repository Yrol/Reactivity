import React, { useContext } from 'react';
import { Item, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../models/activity';
import ActivityList from './ActivityList';
import { observer } from 'mobx-react-lite';

const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
    return (
        <Item>
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
                  as={Link} to={`/activities/${activity.id}`} // Routes integration
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
                  onClick={(e) => {
                   // deleteActivity(e, activity.id);
                  }}
                  //loading={deleteActivityId === activity.id &&submitState}
                  floated="right"
                  content="Delete"
                  color="red"
                >  
                </Button>
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
    )
};

export default observer(ActivityListItem)
