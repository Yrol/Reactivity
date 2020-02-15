import React, { useContext } from "react";
import { Menu, Segment, Container, Icon, Button, Image, Dropdown } from "semantic-ui-react";
import ActivityStore from "../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

interface IProps {
  //handleOpenCreateForm: () => void;
}

const NavBar: React.FC<IProps> = ({
  //handleOpenCreateForm
}) => {
  //Defining the MobX store (ActivityStore)
  //const activityStore = useContext(ActivityStore)

  const rootStore = useContext(RootStoreContext);
  const {openCreateForm} = rootStore.activityStore!
  const {isLoggedIn, user, logout} = rootStore.userStore!
  return (
    <Menu fixed="top" inverted>
      <Container>
        {/** using "as={NavLink}" to render the element as a  link then use "to" to specify the location */}
        {/** The keyword "exact" will be used for defining the exact path since "/" is included in routes "/activities" & etc - to prevent loading when these routes are loading"*/}
        <Menu.Item header as={NavLink} exact to='/'>
            <img src="/assets/logo192.png" alt="logo" style={{marginRight:'10px'}}/>
        </Menu.Item>
        <Menu.Item name="Activities" as={NavLink} to='/activities' />
        <Menu.Item>
            {/* <Button onClick={() => handleOpenCreateForm()} positive content="Create Activity"/> */}
            <Button onClick={openCreateForm} positive content="Create Activity" as={NavLink} to='/createactivity'/>
        </Menu.Item>
        
        {/*Showing the menu if logged in */}
        {user && 
          <Menu.Item position='right'>
            <Image avatar spaced='right' src={user.image || '/assets/logo192.png'}/>
            <Dropdown pointing='top left' text={user.displayName} >
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/profile/username`} text="My profile" icon='user'/>
                <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        }
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
