import React, { useContext } from "react";
import { Card, Icon, Image, Button } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import ActivityStore from "../../../app/stores/activityStore"
import { observer } from "mobx-react-lite";

interface IProps {
  //activity: IActivity;
  setEditMode: (emode: boolean) => void;
  setSelectedActivity: (activity: IActivity | null) => void;
}

/** Adding an IProps interface and destructuring them- such as activities, setSelectedActivity and etc...  */
const ActivityDetails: React.FC<IProps> = ({
  // activity,
  setEditMode,
  setSelectedActivity
}) => {
  const activityStore = useContext(ActivityStore)
  const {selectedActivity : activity} = activityStore
  return (
    <Card>
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
        <Card.Meta>{activity!.city}</Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            /** this will set "editMode" to true in "const [editMode, setEditMode]=useState(false)"  defined in Apps.tsx */
            onClick={() => setEditMode(true)}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => setSelectedActivity(null)}
            basic
            color="grey"
            content="Cancel"
          />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default observer(ActivityDetails);
