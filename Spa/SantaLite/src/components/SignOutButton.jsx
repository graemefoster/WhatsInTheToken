import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";

function handleLogout(instance) {
  instance.logoutPopup().catch((e) => {
    console.error(e);
  });
  console.info('Logged out?');
}

/**
 * Signs out the current user
 */
export const SignOutButton = () => {
  const { instance } = useMsal();

  return (
    <Button
      variant="primary"
      className="ml-auto"
      onClick={() => handleLogout(instance)}
    >
      Logout
    </Button>
  );
};
