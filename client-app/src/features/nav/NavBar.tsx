import React from "react";
import { Menu, Segment, Container, Icon, Button } from "semantic-ui-react";

interface IProps {
  handleOpenCreateForm: () => void;
}

const NavBar: React.FC<IProps> = ({
  handleOpenCreateForm
}) => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
            <img src="/assets/logo192.png" alt="logo" style={{marginRight:'10px'}}/>
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
            <Button onClick={() => handleOpenCreateForm()} positive content="Create Activity"/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;