import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    authority: "https://login.microsoftonline.com/<tenantid>",
    clientId: "<clientid>"
  },

  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
