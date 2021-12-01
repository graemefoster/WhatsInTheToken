import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { NaughtyNiceListButton } from "./NaughtyNiceListButton";
import christmasTree from "./christmas-tree.png";
import { Container, Row, Col, ListGroup } from "react-bootstrap";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();

  const mainContent = isAuthenticated ? (
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
        <a className="navbar-brand" href="/">
          SantaLite v1.0
        </a>
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
