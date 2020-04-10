import React, { useContext } from 'react'
import {RouteProps, RouteComponentProps, Route, Redirect} from 'react-router-dom'
import { RootStoreContext } from '../stores/rootStore'
import { observer } from "mobx-react-lite";

// This is a wrapper for the routes that's being used to protect private routes such as Activities, Profile page and etc (and prevent user accessing them if not logged in), and will only expose the common routes such as Login, Register and etc

//Adding a Prop that accepts any react component type
interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>
}

const PrivateRoute: React.FC<IProps> = ({component: Component, ...rest}) => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn} = rootStore.userStore!;
    return (
        //if user logged in send redirect user to the requested route passed through the Prop or else redirect user to the root (homepage)
        <Route
            {...rest}
            render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to={'/'} />}
        />
    )
}

export default observer(PrivateRoute)
