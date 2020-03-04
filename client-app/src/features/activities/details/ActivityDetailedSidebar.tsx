import React, { Fragment } from "react";
import { Segment, List, ItemMeta, Item, Label, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { IAttendee } from "../../../models/activity";

//passing attendee collection of the type of IAttendee (interface)
interface IProps {
  attendees: IAttendee[];
}

export const ActivityDetailedSidebar: React.FC<IProps> = ({ attendees }) => {
  const IsHost = false;
  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: "none" }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {attendees.length} {attendees.length === 1 ? "Person" : "People"} going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map(attendee => (
            <Item key={attendee.username} style={{ position: "relative" }}>
              {IsHost && (
                <Label
                  style={{ position: "absolute" }}
                  color="orange"
                  ribbon="right"
                >
                  Host
                </Label>
              )}
              {/*Display the attendees image or else display the default image from project assets*/}
              <Image
                size="tiny"
                src={attendee.image || "/assets/logo192.png"}
              />
              <Item.Content verticalAlign="middle">
                <Item.Header as="h3">
                  <Link to={`/profile/${attendee.username}`}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
                <Item.Extra style={{ color: "orange" }}> Following </Item.Extra>
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
};
