import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router } from "react-router-dom";
import {createBrowserHistory} from 'history';
import 'react-widgets/dist/css/react-widgets.css';//css for the react-widgets - this includes DatePicker & etc
import 'react-toastify/dist/ReactToastify.min.css';
import "./app/layouts/styles.css";
import App from "./app/layouts/App";
import * as serviceWorker from "./serviceWorker";
import ScrollToTop from "./app/layouts/ScrollToTop";
import dateFnsLocalizer from 'react-widgets-date-fns';

//calling the date-fns localizer function as per the documentation
dateFnsLocalizer();

export const history = createBrowserHistory();

//Implement using <Router> which is more low level and gives the ability to create custom history objects
 ReactDOM.render(
  <Router history={history}>
    <ScrollToTop>
      <App />
    </ScrollToTop>
  </Router>,
  document.getElementById("root")
);


//Implement using <BrowserRouter> which is a subset of the <Router>
// ReactDOM.render(
//   <BrowserRouter>
//     <ScrollToTop>
//       <App />
//     </ScrollToTop>
//   </BrowserRouter>,
//   document.getElementById("root")
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
