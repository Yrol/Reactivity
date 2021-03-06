import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { IAttendee } from "../../../models/activity";

//passing attendee collection of the type of IAttendee (interface)
interface IProps {
  attendees: IAttendee[];
}

//returning the attendees list
export const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map(attendee => (
        //Assigning a key to each item (otherwise will throw a unique key error)
        <List.Item key={attendee.username}>
            {/* Pop will display the name when hover over the icon*/}
            <Popup 
                header={attendee.displayName}
                trigger={
                    //display the attendees image or else display the default image from project assets
                    <Image size="mini" circular src={attendee.image || "/assets/logo192.png"} />
                }
            />
        </List.Item>
      ))}
    </List>
  );
};
