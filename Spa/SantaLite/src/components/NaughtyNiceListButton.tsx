import React, { useState } from "react";
import { Button, Alert, Toast } from "react-bootstrap";
import { msalInstance } from "../msalConfig";

/**
 * Renders a button which, when selected, will open a popup for login
 */
export const NaughtyNiceListButton = () => {
  const [error, setError] = useState<string | undefined>();
  const [response, setResponse] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();

  function addToNaughtyNiceList() {
    setResponse(undefined);
    setError(undefined);
    console.log("Requesting token");
    const account = msalInstance.getAllAccounts()[0];

    msalInstance
      .acquireTokenPopup({
        account: account,
        scopes: ["api://santaweb/NaughtyNiceList.Write"],
        prompt: "consent",
        extraScopesToConsent: [],
      })
      .then((r) => {
        setToken(r.accessToken);
        return r.accessToken;
      })
      .then((r) =>
        fetch("https://localhost:4431/NewNaughtyNiceList/", {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: `Bearer ${r}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: "Graeme", status: 0 }),
        })
      )
      .then((response) => {
        if (response.ok) {
          setResponse("Added Graeme to naughty / nice list");
        } else {
          if (response.headers.has("www-authenticate")) {
            //Cross domain (CORS) and you won't see this:
            //https://stackoverflow.com/questions/43344819/reading-response-headers-with-fetch-api
            setError(`An error occurred: ${response.headers.get("www-authenticate")}`);
          } else {
            setError(`An error occurred. Code: ${response.status}. ${response.statusText}`);
          }
        }
      })
      .catch((error: any) => {
        setError(error.message);
      });
  }

  return (
    <>
      {error !== undefined ? <Alert variant="danger">{error}</Alert> : ""}
      {response !== undefined ? <Alert variant="success">{response}</Alert> : ""}
      <p>
        <Button
          variant="primary"
          className="ml-auto"
          onClick={() => addToNaughtyNiceList()}
        >
          Add Graeme to naughty / nice list
        </Button>
      </p>
      <textarea rows={20} cols={100} value={token} />
    </>
  );
};
