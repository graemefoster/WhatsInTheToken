import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";
import { IPublicClientApplication } from "@azure/msal-browser";

function handleLogout(instance: IPublicClientApplication) {
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
