import React, { useContext, useEffect } from "react";
import { Card, Icon, Image, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps, Link } from "react-router-dom";
import { LoadingComponent } from "../../../app/layouts/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import { ActivityDetailedInfo } from "./ActivityDetailedInfo";
import { ActivityDetailedChat } from "./ActivityDetailedChat";
import { ActivityDetailedSidebar } from "./ActivityDetailedSidebar";
import { RootStoreContext } from "../../../app/stores/rootStore";

interface IProps {
  //activity: IActivity;
  //setEditMode: (emode: boolean) => void;
  //setSelectedActivity: (activity: IActivity | null) => void;
}

//interface to cast the parameters passed in the details
interface DetailParams {
  id: string; //id parameter
}

/** Adding the "RouteComponentProps" which give access to history, current location(URL) and match(params attached to the URL such as IDs & etc)  */
const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  // activity,
  //setEditMode,
  //setSelectedActivity
  match, //match will consist of parameters sent with the URL such as ID and etc
  history // history object
}) => {
  //const activityStore = useContext(ActivityStore);
  // const {
  //   selectedActivity,
  //   openEditForm,
  //   cancelSelectedActivity,
  //   loadActivity,
  //   loadingInitial
  // } = activityStore;

  const rootStore = useContext(RootStoreContext);
  const {loadingInitial, loadActivity, selectedActivity} = rootStore.activityStore!

  //implementation of using catch exception when loading the activity (catching the exception thrown from "activityStore")
  // useEffect(() => {
  //   loadActivity(match.params.id).catch(() => {
  //     history.push('/notfound');//if an error occurred redirect to NotFound page
  //   })
  // }, [loadActivity, match.params.id])

  //implementation of useEffect without exception handling
  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);

  //if loading is true and the selectedActivity is empty
  if (loadingInitial) {
    return <LoadingComponent content="Loading details...." inverted={true} />;
  }

  //this block will be presented when there is a 500 error. Rest of the errors are handled in the "agent.ts" by redirecting to not found
  if (!loadingInitial && !selectedActivity) {
    return (
      <Grid.Column>
        <Grid.Column width={10}>
          <p>Activity not found</p>
        </Grid.Column>
      </Grid.Column>
    );
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={selectedActivity!} />
        <ActivityDetailedInfo activity={selectedActivity!} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
    // <Card>
    //   <Card.Content>
    //     <Card.Header>{selectedActivity!.title}</Card.Header>
    //     <Card.Meta>
    //       <span className="date">{selectedActivity!.date}</span>
    //     </Card.Meta>
    //     <Card.Description>{selectedActivity!.description}</Card.Description>
    //     <Card.Meta>{selectedActivity!.city}</Card.Meta>
    //   </Card.Content>
    //   <Card.Content extra>
    //     <Button.Group widths={2}>
    //       <Button
    //         /** this will set "editMode" to true in "const [editMode, setEditMode]=useState(false)"  defined in Apps.tsx */
    //         // onClick={() => setEditMode(true)}
    //         //onClick={() => openEditForm(selectedActivity!.id)}
    //         as={Link} to={`/manage/${selectedActivity.id}`}
    //         basic
    //         color="blue"
    //         content="Edit"
    //       />
    //       <Button
    //         onClick={() => history.push('/activities')}
    //         basic
    //         color="grey"
    //         content="Cancel"
    //       />
    //     </Button.Group>
    //   </Card.Content>
    // </Card>
  );
};

export default observer(ActivityDetails);
