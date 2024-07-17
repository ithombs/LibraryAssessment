# LibraryAssessment
This repo contains the frontend and backend projects required for the technical assessment.

<br/>

### General Notes
- It's assumed that a smaller dataset will be used with these two projects. Pagination is left to be done on the frontend, as is sorting and filtering for the most part
- Only 10 dummy books will be generated on first startup. If dbo.books is ever empty after that that, the seeding will run again
- A naive version of JWT is used in regards to authentication

<br/><br/>

## Frontend - Angular 18
There is nothing unusual to point out for the frontend Angular project in regards to running it. It contains a mostly barebones UI made up of an amalgamation of basic Angular components styled with Bootstrap CSS and Angular Material. There is likely some easily spotted cludge due to my familiarity with Angular being rather limited.

<br/><br/>

## Backend - ASP.NET Core 8 Web API
Also nothing unusual to point out in regards to running the backend ASP.NET project.
