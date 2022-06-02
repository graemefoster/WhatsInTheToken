import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "84b4df4e-ad86-4da6-a267-4b270972d896",
    authority: "https://login.microsoftonline.com/a47f213f-c3ec-49ff-92a1-52d7b0d29e6c",
    redirectUri: "https://santalite.localtest.me/",
  },

  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
