import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//We're replaing the below Function Component (FC) to Class Component
//The class Component requires the "render()" to be implemented
//The reason we're changing from FC to a class component is because we get access to component lifecycle methods such as componentDidUpdate & etc
//class component will also give access to component states
class App extends Component{

  //initiating the state and its prameters
  state = {
    values: []
  }

  //when the component is mounted to the native UI
  componentDidMount(){
    this.setState({
      values: [{id:1, name:"Value 1"}, {id:2, name:"Value 2"}]
    })
  }

  render(){  
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/*Using state to get the values when component is rendered (componentDidMount) to the UI*/}
          <ul>
            {this.state.values.map((value : any) => (
              <li>{value.name}</li>
            ))}
          </ul>
        </header>
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
