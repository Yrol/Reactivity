import React from "react";
import { Segment, Item, Header, Button, Image } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";

const activityImageStyle = {
    filter: 'brightness(30%)'
}

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

export const ActivityDetailedHeader: React.FC<{activity : IActivity}> = ({activity}) => {
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image style={activityImageStyle} src={`/assets/image-placeholder.png`} fluid />
        {/*"basic" keyword will remove all the default styling*/}
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{activity.date}</p>
                <p>
                    Hosted by <strong>Bob</strong>
                </p>

              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
          <Button color='teal'>Join Activity</Button>
          <Button>Cancel attendance</Button>
          <Button color='orange' floated='right'>Manage Event</Button>
      </Segment>
    </Segment.Group>
  );
};
