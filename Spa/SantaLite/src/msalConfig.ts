import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    authority: "https://login.microsoftonline.com/a47f213f-c3ec-49ff-92a1-52d7b0d29e6c",
    clientId: "f95a88e8-43b7-45fc-ae55-3801040587bf"
  },

  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
