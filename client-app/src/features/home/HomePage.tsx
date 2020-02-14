import React, { useContext, Fragment } from "react";
import { Container, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

export const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore!;

  return (
    <Container style={{ marginTop: "7em" }}>
      <h1>Home page</h1>
      {/*Using the tenary operator (?) to either show activities or login links */}
      {isLoggedIn && user ? (
        <Fragment>
          <Button as={Link} to="/activities" size="huge">
            Go to activities
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <Button as={Link} to="/login" size="huge">
            Login
          </Button>
        </Fragment>
      )}
    </Container>
  );
};
