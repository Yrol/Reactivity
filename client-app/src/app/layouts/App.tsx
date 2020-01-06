import React, { Component, useState, useEffect, Fragment } from "react";
import semantic, { Header, Icon, List, Container } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";

/************ Implementation of using Hooks ****************/
const App = () => {
  //This is a State Hook
  //Assigning activities and setActivities for state updates when the page loads. Return an array
  const [activities, setActivities] = useState<IActivity[]>([]);

  //Assigining the activity when user selects an activity. Returns a single activity
  //"selectedActivity" can be either IActivity or null based on an activity has been selected or not
  //the initial value for this useState is "null" when the page loads
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );

  //This is a State Hook
  //Assigining activity when user try to edit an activity
  //the initial value is set to 'false'
  const [editMode, setEditMode] = useState<boolean>(false);


  //State hook for the loading state
  const [loading, setLoading] = useState<boolean>(true);

  //State hook for creating, updating and deleting the activities
  const [submitState, setSubmitState] = useState<boolean>(false)

  //the handler that takes the ID parameter and select the activity from the "actvities" array above when user select an activity from the frontend
  //then assign it to the "selectedActivity" variable
  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
  };

  //Handler for creating a new activity (will pass this to the Nav bar)
  //set the setSelectedActivityto null
  //set setEditMode to true
  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  //handler for creating a new activity
  // The 3 dots (...) below is called the Spread Atrribute
  const handleCreateActivity = (activity: IActivity) => {
    setSubmitState(true);
    agent.Activities.create(activity).then(() => {
      //The Spread Atrribute (...) will take the  exisiting activities and add the new activity to to the array
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitState(false))
  };

  //handler for editing the activity
  const handleEditActivity = (activity: IActivity) => {
    //get the activities not equal to the edited activity and inject the edited acitivity to it
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  //handler for deleting an activity
  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)]);
    //if the deleting activity is selected, remove is from seleted and edit mode
    if (selectedActivity?.id === id) {
      setSelectedActivity(null);
      setEditMode(false);
    }
  };

  //This block will receive all the activities from the API
  //useEffect consist of 3 lifecycle methods componentDidMount, componentDidUpdate and componentWillUnmount
  //In here we're just using componentDidMount
  // useEffect(() => {
  //   axios
  //     .get<IActivity[]>("http://localhost:5000/api/activities/")
  //     .then(response => {
  //       let activities: IActivity[] = []
  //       response.data.forEach(activity => { //loop through the API response.data
  //         activity.date = activity.date.split('.')[0];//splitting the time befort the dot(.)
  //         activities.push(activity)
  //       })
  //       setActivities(activities);
  //     });
  // }, []); // using empty array [] to make sure useEffect will only run once (since we've other lifecycle methods baked into this). Otherwise this run into an infinite loop.

  /*** Using the web helper class - agent.ts to get all the activities from the API*/
  useEffect(() => {
    agent.Activities.list().then(response => { // returns response.data with Promise
      let activities: IActivity[] = [];
      response.forEach(activity => {
        //loop through the API response.data
        activity.date = activity.date.split(".")[0]; //splitting the time befort the dot(.)
        activities.push(activity);
      });
      setActivities(activities);
    }).then(() => setLoading(false));
  }, []); // using empty array [] to make sure useEffect will only run once (since we've other lifecycle methods baked into this). Otherwise this run into an infinite loop.

  if (loading) return <LoadingComponent content='Loading activities....' inverted={true} />

  return (
    <Fragment>
      {/* Using the React Semantic UI */}
      <NavBar handleOpenCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        {/** Injecting the "ActivitiesDashboard" component and passing the activities list as a prop */}
        <ActivitiesDashboard
          activities={activities} //pass activity list as a prop
          currentSelectedActivity={handleSelectedActivity} //pass select activity fucntion / handler as a prop
          selectedActivity={selectedActivity!} //pass the selected activity. The "!" to get around the null since the selected activivity can be null sometimes
          editMode={editMode} //pass edit mode value as a prop
          setEditMode={setEditMode} //pass the Edit Mode function as a prop
          setSelectedActivity={setSelectedActivity} //passing the setSelectedActivity as a function
          createActivity={handleCreateActivity} //passing the handler for creating a new activity
          editActivity={handleEditActivity} //passing the handler for editing an activity
          deleteActivity={handleDeleteActivity}
          submitState={submitState} //submission state
        />
      </Container>
    </Fragment>
  );
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
/*
const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

export default App;
