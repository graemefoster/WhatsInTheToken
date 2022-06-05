import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "d37a8774-cd99-46cd-b353-c80dc884309b",
    authority: "https://login.microsoftonline.com/a47f213f-c3ec-49ff-92a1-52d7b0d29e6c",
    redirectUri: "https://santalite.localtest.me/",
  },

  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
