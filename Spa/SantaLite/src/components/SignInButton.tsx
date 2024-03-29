import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";
import { IPublicClientApplication } from "@azure/msal-browser";

const loginRequest = {
  scopes: ["User.Read"],
  prompt : 'login'
};

function handleLogin(instance: IPublicClientApplication) {
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
      variant="primary"
      className="ml-auto"
      onClick={() => handleLogin(instance)}
    >
      Sign in
    </Button>
  );
};
