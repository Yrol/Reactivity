import React, { Component } from 'react';
import semantic, { Header, Icon, List } from 'semantic-ui-react';
import axios from 'axios';

//We're replaing the below Function Component (FC) to Class Component
//The class Component requires the "render()" to be implemented
//The reason we're changing from FC to a class component is because we get access to component lifecycle methods such as componentDidUpdate & etc
//class component will also give access to component states
class App extends Component{

  //initiating the state and its prameters
  state = {
    activities: []
  }

  //when the component is mounted to the native UI, assign values to the "values" param
  componentDidMount(){

    //using Axios to make HTTP request
    axios.get('http://localhost:5000/api/activities/')
      .then((response) => {
        console.log(response.data);
        this.setState({
          activities: response.data
        })
      })
  }

  render(){  
    return (
      <div>
          {/* Using the React Semantic UI */}
          <Header as='h2'>
            <Icon name='users' />
            <Header.Content>Reactivities</Header.Content>
          </Header>
          <List>
            {
            /*Using state to get the values when component is rendered (componentDidMount) to the UI*/
            }
            {this.state.activities.map((activity : any) => (
              <List.Item key={activity.id}>{activity.title}</List.Item>
            ))}
          </List>
      </div>
    );
  }
}

//The original Function Component (FC)
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
