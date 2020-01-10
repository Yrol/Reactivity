import React, { useContext } from "react";
import { Menu, Segment, Container, Icon, Button } from "semantic-ui-react";
import ActivityStore from "../../app/stores/activityStore";
import { observer } from "mobx-react-lite";

interface IProps {
  //handleOpenCreateForm: () => void;
}

const NavBar: React.FC<IProps> = ({
  //handleOpenCreateForm
}) => {
  //Defining the MobX store (ActivityStore)
  const activityStore = useContext(ActivityStore)
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
            <img src="/assets/logo192.png" alt="logo" style={{marginRight:'10px'}}/>
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
            {/* <Button onClick={() => handleOpenCreateForm()} positive content="Create Activity"/> */}
            <Button onClick={activityStore.openCreateForm} positive content="Create Activity"/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(NavBar);
