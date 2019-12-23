import React from "react";
import { Menu, Segment, Container, Icon, Button } from "semantic-ui-react";

const NavBar = () => {
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
            <img src="/assets/logo192.png" alt="logo"/>
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item>
            <Button possitive content="Create Activity"/>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
