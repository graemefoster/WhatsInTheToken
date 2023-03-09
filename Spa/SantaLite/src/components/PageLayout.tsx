import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { NaughtyNiceListButton } from "./NaughtyNiceListButton";
import christmasTree from "./christmas-tree.png";
import { Container, Row, Col, ListGroup, NavItem } from "react-bootstrap";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();

  const mainContent = isAuthenticated && accounts.length > 0 ? (
    <>
      <br />
      <br />
      <h2>Welcome {accounts[0].name}!</h2>
      <hr />
      <h5>What do you want to do today?</h5>
      <ListGroup>
        <ListGroup.Item>
          <NaughtyNiceListButton />
        </ListGroup.Item>
      </ListGroup>
      <br />
      <br />
    </>
  ) : (
    <>
      <p>Please Login to continue</p>
      <SignInButton />
    </>
  );

  return (
    <>
      <Navbar variant="dark" bg="danger">
        <Container>
          <Navbar.Brand href="#">SantaLite v1.0</Navbar.Brand>
          {isAuthenticated ? <SignOutButton /> : <></>}
        </Container>
      </Navbar>
      <Container fluid={"lg"}>
        <Row>
          <Col>
            <img src={christmasTree} style={{ height: "300px" }} alt='Christmas Tree' />
          </Col>
          <Col xl={9}>{mainContent}</Col>
        </Row>
      </Container>
    </>
  );
};
