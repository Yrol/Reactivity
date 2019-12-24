import React, { Component, useState, useEffect, Fragment } from "react";
import semantic, { Header, Icon, List, Container } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";

/************ Implementation of using Hooks ****************/
const App = () => {
  //Assigning activities and setActivities for state updates when the page loads. Return an array
  const [activities, setActivities] = useState<IActivity[]>([]);

  //Assigining the activity when user selects an activity. Returns a single activity
  //"selectedActivity" can be either IActivity or null based on an activity has been selected or not
  //the initial value for this useState is "null" when the page loads
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );

  //Assigining activity when user try to edit an activity
  //the initial value is set to 'false'
  const [editMode, setEditMode] = useState(
    false
  );

  //the handler that takes the ID parameter and select the activity from the "actvities" array above when user select an activity from the frontend
  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0])
  }

  //useEffect consist of 3 lifecycle methods componentDidMount, componentDidUpdate and componentWillUnmount
  //In here we're just using componentDidMount
  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities/")
      .then(response => {
        setActivities(response.data);
      });
  }, []); // using empty array [] to make sure useEffect will only run once (since we've other lifecycle methods baked into this). Otherwise this run into an infinite loop.

  return (
    <Fragment>
      {/* Using the React Semantic UI */}
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        {/** Injecting the "ActivitiesDashboard" component and passing the activities list as a prop */}
        <ActivitiesDashboard 
          activities={activities} //pass activity list as a prop

          currentSelectedActivity={handleSelectedActivity} //pass select activity fucntion / handler as a prop
          selectedActivity={selectedActivity!}//pass selected activity

          editMode={editMode}//pass edit mode value as a prop
          setEditMode={setEditMode}//passset edit mode function as a prop
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
