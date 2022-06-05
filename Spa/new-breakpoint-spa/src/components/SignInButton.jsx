import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";

const loginRequest = {
  scopes: ["User.Read"],
  prompt : 'login'
};

function handleLogin(instance) {
  instance.loginRedirect(loginRequest).catch((e) => {
    console.error(e);
  });
}

/**
 * Renders a button which, when selected, will open a popup for login
 */
export const SignInButton = () => {
  const { instance } = useMsal();

  return (
    <Button
      variant="secondary"
      className="ml-auto"
      onClick={() => handleLogin(instance)}
    >
      Sign in
    </Button>
  );
};
