import React, { Component, useState, useEffect } from "react";
import semantic, { Header, Icon, List } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../../models/activity";
import NavBar from "../../features/nav/NavBar";

/************ Implementation of using Hooks ****************/
const App = () => {
  //Assigning activities and setActivities for state updates
  const [activities, setActivities] = useState<IActivity[]>([]);

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
    <div>
      {/* Using the React Semantic UI */}
      <NavBar />
      <List>
        {/*Using state to get the values when component is rendered (componentDidMount) to the UI*/}
        {activities.map(activity => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </div>
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
