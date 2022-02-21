import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "a41af0fc-a0ae-4b57-a1c0-2fd32370c41e",
    authority: "https://login.microsoftonline.com/49f24cca-11a6-424d-b2e2-0650053986cc",
    redirectUri: "https://santalite.localtest.me/",
  },

  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
