# SantaWeb

The aim of SantaWeb is to demonstrate how to wire up AAD applications, consume OAuth2 tokens in a web-app and a SPA, and to leverage AAD roles.

## Setup
To setup you will need 2 AAD applications.

### SantaWeb
An AAD application with a SPA redirect flow to https://santalite.localtest.me


### SantaApi
An AAD application that exposes an API:
 - Presents.NaughtyNiceList (allow users )

And a role
 - Santa

## Running the sample
There are 2 applications to run. 

### SantaWeb
A Dotnet 6 Web Api (SantaWeb). This listens on https://localhost:4431
```
cd ./Api/SantaWeb/
dotnet run --launch-profile SantaWeb
```

### SantaLite
A react application (Spa/new-breakpoint-spa/) listens on https://santalite.localtest.me
```
cd .Spa/new-breakpoint-spa/
npm run start
```

To access the SantaWeb naughty nice list API you will need to assign a user to the "Santa" role found under the Enterprise Application that represents the SantaWeb API in your AAD.
