import React, { useContext, Fragment } from "react";
import { Container, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import { LoginForm } from "../user/LoginForm";
import { RegisterForm } from "../user/RegisterForm";

export const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore!;
  const { openModal } = rootStore.modalStore!;
  const token = window.localStorage.getItem('jwt');

  return (
    <Container style={{ marginTop: "7em" }}>
      <h1>Home page</h1>
      {/*Using the tenary operator (?) to either show activities or login links */}
      {isLoggedIn && user && token ? (
        <Fragment>
          <Button as={Link} to="/activities" size="huge">
            Go to activities
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          {/* <Button as={Link} to="/login" size="huge">
            Login
          </Button> */}

          {/** passing the <LoginForm/> to the modal which'll then render out the form inside the modal*/}
          <Button onClick={() => openModal(<LoginForm />)} size="huge">
            Login
          </Button>

          {/** Register form modal */}
          <Button onClick={() => openModal(<RegisterForm />)} size="huge">
            Register
          </Button>

        </Fragment>
      )}
    </Container>
  );
};
