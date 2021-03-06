import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { msalInstance } from "../msalConfig";

/**
 * Renders a button which, when selected, will open a popup for login
 */
export const NaughtyNiceListButton = () => {
  const [error, setError] = useState();
  const [response, setResponse] = useState();
  const [token, setToken] = useState();

  function addToNaughtyNiceList() {
    setResponse(null);
    setError(null);
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
        if (r.errorDesc) {
          setError(r.errorDesc);
        } else {
          setToken(r.accessToken);
          return r.accessToken;
        }
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
          setError(response.statusText);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <>
      {error ? <Alert variant="danger">{error}</Alert> : ""}
      {response ? <Alert variant="success">{response}</Alert> : ""}
      <p>
        <Button
          variant="secondary"
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
