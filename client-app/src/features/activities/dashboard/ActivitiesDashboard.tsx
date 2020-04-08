import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import { Grid, List, GridColumn, Button, Loader } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
//import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { LoadingComponent } from "../../../app/layouts/LoadingComponent";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

interface IProps {
  //activities: IActivity[];
  //referencing the function "currentSelectedActivity" defined in App.tsx to get the selected ID
  //currentSelectedActivity: (id: string) => void;
  // selectedActivity: IActivity;
  // editMode: boolean;
  //setEditMode: (emode: boolean) => void;
  //referencing the "setSelectedActivity" state defined in App.tsx - will be passed to ActivityDetails
  //setSelectedActivity: (activity: IActivity | null) => void;
  //handler for create, edit and delete activities
  //createActivity: (activity: IActivity) => void;
  //editActivity: (activity: IActivity) => void;
  //handler for deleting an activity. Accepts event of SyntheticEvent type which contains button properties such as the unique button name (unique ID)
  //deleteActivity: (e:SyntheticEvent<HTMLButtonElement>, id:string) => void;
  //submitState: boolean;//form submit status
  //deleteActivityID: string//contains the unique ID of the clicked button
}

{
  /** Adding an IProps interface and destructuring them - such as activities, currentSelectedActivity and etc...  */
}
const ActivitiesDashboard: React.FC<IProps> = (
  {
    //activities,
    //currentSelectedActivity,
    //selectedActivity,
    //editMode,
    //setEditMode,
    //createActivity,
    //editActivity,
    //deleteActivity,
    //setSelectedActivity,
    //submitState,
    //deleteActivityID
  }
) => {
  //Using the MobX state in activity.ts
  //const activityStore = useContext(ActivityStore)
  //const {editMode, selectedActivity} = activityStore
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingInitial,
    setPage,
    page,
    totalPages,
  } = rootStore.activityStore!;
  const [loadingNext, setLoadingNext] = useState(false); //state for loading activities on "view more" / pagination (binding this with the "View More" button loading state)

  //getting the next set of activites on "view more"
  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);

    //setting the setLoadingNext to false when loadActivities in activityStore finishes (i.e. return promise )
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]); // the array contains the dependencies that needs to run the functions defined in useEffect

  //Show loading component if the items are loading
  // if (loadingInitial && page === 0)
  //   //make sure only loads in the first time
  //   return (
  //     <LoadingComponent
  //       content="Loading activities. Please wait"
  //       inverted={true}
  //     />
  //   );

  return (
    <Grid>
      {/** The React Grid system supports up to 16 columns */}
      <Grid.Column width={10}>
        {/** Passing the activities to the ActivityList as a Prop */}
        {/** Passing the currentSelectedActivity to the ActivityList as a Prop*/}

        {/** implementation of "react-infinite-scroll" with semantic-ui placeholder */}
        {loadingInitial && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}

        {/** implementation of "react-infinite-scroll" */}
        {/* <InfiniteScroll
        pageStart={0}
        loadMore={handleGetNext}
        hasMore={!loadingNext && page + 1 < totalPages}
        initialLoad={false}
        >
          <ActivityList/>
        </InfiniteScroll> */}
        {/* <ActivityList/> */}
        {/* <ActivityList
        activities={activities}
        currentSelectedActivity={currentSelectedActivity}
        setEditMode={setEditMode}
        deleteActivity={deleteActivity}
        submitState={submitState}
        deleteActivityID={deleteActivityID}
        /> */}

        {/** Button for view more activities */}
        {/* <Button
          floated="left"
          content="View More"
          positive
          onClick={handleGetNext}
          disabled={totalPages === page + 1} // disable when all the pages have been loaded
          loading={loadingNext}
        /> */}
        {/* <List>
          {activities.map(activity => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List> */}
      </Grid.Column>
      <Grid.Column width={6}>
        {/** using the "selectedActivity &&"  to display "ActivityDetails" if not null (conditional)*/}
        {/** if edit mode true hide detail view */}
        {/* {selectedActivity && !editMode && (
          <ActivityDetails
            //activity={selectedActivity}
            //setEditMode={setEditMode}
            //setSelectedActivity={setSelectedActivity}
          />
        )} */}

        {/** if edit mode true show the form*/}
        {/** In here we're using "key" to make sure the form will be mounted and unmounted between editing and creating activities. */}
        {/** Without a the "key", the form will not be re-rendered when we have an edit item and then attempting a create a new activity */}
        {/* {editMode && (
          <ActivityForm
            key={selectedActivity && selectedActivity.id || 0}
            setEditMode={setEditMode}
            activity={selectedActivity!}
            createActivity={createActivity}
            editActivity={editActivity}
            submitState={submitState}
          />
        )} */}
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivitiesDashboard);
