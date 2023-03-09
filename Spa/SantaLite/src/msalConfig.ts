import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    authority: "https://login.microsoftonline.com/a47f213f-c3ec-49ff-92a1-52d7b0d29e6c",
    clientId: "66494e09-0eaf-4333-ba84-789a1d1e36f2"
  },

  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
