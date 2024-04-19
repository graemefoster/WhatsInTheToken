import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    authority: "https://login.microsoftonline.com/a47f213f-c3ec-49ff-92a1-52d7b0d29e6c",
    clientId: "cf26fe55-80a7-4ec6-88fb-4da4aa8ca1ef"
  },

  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
