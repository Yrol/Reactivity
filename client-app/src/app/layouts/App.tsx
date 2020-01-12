import React, {
  useState,
  useEffect,
  Fragment,
  SyntheticEvent,
  useContext
} from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";
import { Route, withRouter, RouteComponentProps } from "react-router-dom";
import { HomePage } from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

/************ Implementation of using Hooks ****************/
const App: React.FC<RouteComponentProps> = ({ location }) => {
  const activityStore = useContext(ActivityStore);

  //This is a State Hook
  //Assigning activities and setActivities for state updates when the page loads. Return an array
  const [activities, setActivities] = useState<IActivity[]>([]);

  //Assigning the activity when user selects an activity. Returns a single activity
  //"selectedActivity" can be either IActivity or null based on an activity has been selected or not
  //the initial value for this useState is "null" when the page loads
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );

  //This is a State Hook
  //Assigning activity when user try to edit an activity
  //the initial value is set to 'false'
  const [editMode, setEditMode] = useState<boolean>(false);

  //State hook for the loading state
  const [loading, setLoading] = useState<boolean>(false);

  //State hook for creating, updating and deleting the activities
  const [submitState, setSubmitState] = useState<boolean>(false);

  const [deleteActivityID, setDeleteActivityID] = useState<string>("");

  //the handler that takes the ID parameter and select the activity from the "activities" array above when user select an activity from the frontend
  //then assign it to the "selectedActivity" variable
  // const handleSelectedActivity = (id: string) => {
  //   setSelectedActivity(activities.filter(a => a.id === id)[0]);
  // };

  //Handler for creating a new activity (will pass this to the Nav bar)
  //set the setSelectedActivity to null
  //set setEditMode to true
  // const handleOpenCreateForm = () => {
  //   setSelectedActivity(null);
  //   setEditMode(true);
  // };

  //handler for creating a new activity
  // The 3 dots (...) below is called the Spread Attribute
  // const handleCreateActivity = (activity: IActivity) => {
  //   setSubmitState(true);
  //   agent.Activities.create(activity).then(() => {
  //     //The Spread Attribute (...) will take the  existing activities and add the new activity to to the array
  //     setActivities([...activities, activity]);
  //     setSelectedActivity(activity);
  //     setEditMode(false);
  //   }).then(() => setSubmitState(false))
  // };

  //handler for editing the activity
  // const handleEditActivity = (activity: IActivity) => {
  //   setSubmitState(true)
  //   agent.Activities.update(activity).then(() => {
  //     //get the activities not equal to the edited activity and inject the edited activity to it
  //     setActivities([...activities.filter(a => a.id !== activity.id), activity]);
  //     setSelectedActivity(activity);
  //     setEditMode(false);
  //   }).then(() => setSubmitState(false))
  // };

  //handler for deleting an activity
  //Accepts the event of SyntheticEvent type initiated from an HTMLButtonElement which contains button properties such as the unique button name
  // const handleDeleteActivity = (
  //   event: SyntheticEvent<HTMLButtonElement>,
  //   id: string
  // ) => {
  //   setSubmitState(true);
  //   setDeleteActivityID(event.currentTarget.name);
  //   agent.Activities.delete(id)
  //     .then(() => {
  //       setActivities([...activities.filter(a => a.id !== id)]);
  //       //if the deleting activity is selected, remove is from selected and edit mode
  //       if (selectedActivity?.id === id) {
  //         setSelectedActivity(null);
  //         setEditMode(false);
  //       }
  //     })
  //     .then(() => setSubmitState(false));
  // };

  //Version 1: Receiving activity
  //This block will receive all the activities from the API
  //useEffect consist of 3 life cycle methods componentDidMount, componentDidUpdate and componentWillUnmount
  //In here we're just using componentDidMount
  // useEffect(() => {
  //   axios
  //     .get<IActivity[]>("http://localhost:5000/api/activities/")
  //     .then(response => {
  //       let activities: IActivity[] = []
  //       response.data.forEach(activity => { //loop through the API response.data
  //         activity.date = activity.date.split('.')[0];//splitting the time before the dot(.)
  //         activities.push(activity)
  //       })
  //       setActivities(activities);
  //     });
  // }, []); // using empty array [] to make sure useEffect will only run once (since we've other life cycle methods baked into this). Otherwise this run into an infinite loop.

  //version 2: Receiving activity using an agent class (web request class)
  /*** Using the web helper class - agent.ts to get all the activities from the API*/
  // useEffect(() => {
  //   setLoading(true)
  //   agent.Activities.list().then(response => { // returns response.data with Promise
  //     let activities: IActivity[] = [];
  //     response.forEach(activity => {
  //       //loop through the API response.data
  //       activity.date = activity.date.split(".")[0]; //splitting the time before the dot(.)
  //       activities.push(activity);
  //     });
  //     setActivities(activities);
  //   }).then(() => setLoading(false));
  // }, []); // using empty array [] to make sure useEffect will only run once (since we've other lifecycle methods baked into this). Otherwise this run into an infinite loop.

  //Version 3: Receiving activity using MobX store
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]); // the array contains the dependencies that needs to run the functions defined in useEffect

  if (activityStore.loadingInitial)
    return (
      <LoadingComponent
        content="Loading activities. Please wait"
        inverted={true}
      />
    );

  //******** Implementation using Routers *******/
  return (
    <Fragment>
      {/* Using the React Semantic UI */}
      <NavBar
      //handleOpenCreateForm={handleOpenCreateForm}
      />
      <Container style={{ marginTop: "7em" }}>
        {/** The keyword "exact" will be used for defining the exact path since "/" includes in routes "/activities" & etc - to prevent loading when these routes are loading"*/}
        <Route exact path="/" component={HomePage} />
        <Route exact path="/activities" component={ActivitiesDashboard} />
        <Route path="/activities/:id" component={ActivityDetails} />

        {/** Loading same component in two different routes when creating('/createActivity') or editing('/manage/:id') an activity. Passing the routes in an array  */}
        {/** Since we're using the same component, we're also adding to key to use between edit and create activities to make decision on switching forms  */}
        <Route
          {/** The 'location.key' will be changed whenever navigate to "/createActivity" or "/manage/:id"  */}
          key={location.key}
          path={["/createActivity", "/manage/:id"]}
          component={ActivityForm}
        />
      </Container>
    </Fragment>
  );

  //******** Implementation for passing /injecting props manually to other components *******/
  // return (
  //   <Fragment>
  //     {/* Using the React Semantic UI */}
  //     <NavBar handleOpenCreateForm={handleOpenCreateForm} />
  //     <Container style={{ marginTop: "7em" }}>
  //       {/** Injecting the "ActivitiesDashboard" component and passing the activities list as a prop */}
  //       <ActivitiesDashboard
  //         activities={activityStore.activities} //pass activity list as a prop
  //         currentSelectedActivity={handleSelectedActivity} //pass select activity function / handler as a prop
  //         selectedActivity={selectedActivity!} //pass the selected activity. The "!" to get around the null since the selected activity can be null sometimes
  //         editMode={editMode} //pass edit mode value as a prop
  //         setEditMode={setEditMode} //pass the Edit Mode function as a prop
  //         setSelectedActivity={setSelectedActivity} //passing the setSelectedActivity as a function
  //         createActivity={handleCreateActivity} //passing the handler for creating a new activity
  //         editActivity={handleEditActivity} //passing the handler for editing an activity
  //         deleteActivity={handleDeleteActivity}
  //         submitState={submitState} //submission state
  //         deleteActivityID={deleteActivityID}
  //       />
  //     </Container>
  //   </Fragment>
  // );
};

/************ Implementation of using classes ****************/
//interface for strongly typed Activity object
// interface IState {
//   activities: IActivity[]
// }

// //We're replacing the below Function Component (FC) to Class Component
// //The class Component requires the "render()" to be implemented
// //The reason we're changing from FC to a class component is because we get access to component life cycle methods such as componentDidUpdate & etc
// //class component will also give access to component states
// //Passing the "IState" as a state to the component. Note the first parameter {} - is for passing Props
// class App extends Component<{}, IState>{

//   //initiating the state and its parameters
//   state: IState = {
//     activities: []
//   }

//   //when the component is mounted to the native UI, assign values to the "values" param
//   componentDidMount(){

//     //using Axios to make HTTP request and make sure it's strongly typed to an IActivity
//     axios.get<IActivity[]>('http://localhost:5000/api/activities/')
//       .then((response) => {
//         this.setState({
//           activities: response.data
//         })
//       })
//   }

//   render(){
//     return (
//       <div>
//           {/* Using the React Semantic UI */}
//           <Header as='h2'>
//             <Icon name='users' />
//             <Header.Content>Reactivities</Header.Content>
//           </Header>
//           <List>
//             {
//             /*Using state to get the values when component is rendered (componentDidMount) to the UI*/
//             }
//             {this.state.activities.map((activity) => (
//               <List.Item key={activity.id}>{activity.title}</List.Item>
//             ))}
//           </List>
//       </div>
//     );
//   }
// }

//************The original Function Component (FC)***************
// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

//since the App component is watching the observables (ex: in "activityStore.ts"), we need to bind it with an observer
//Observer is a higher level component which takes a component (in this case App) as an argument and return it with extra features (in this case with observer capabilities)
//"withRouter" is a higher order DOM which consist of props such as location, history and etc which we can access within the App components.
export default withRouter(observer(App));
