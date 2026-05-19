# api-node-solid

GymPass style app

## FRs (Functional Requirements)

- [x] It must be possible to register;
- [ ] It must be possible to authenticate;
- [ ] It must be possible to get the profile of a logged-in user;
- [ ] It must be possible to get the number of check-ins made by the logged-in user;
- [ ] It must be possible for the user to get their check-in history;
- [ ] It must be possible for the user to search for nearby gyms;
- [ ] It must be possible for the user to search for a gym by name;
- [ ] It must be possible to validate a user's check-in;
- [ ] It must be possible to register a gym;

## BRs (Business Rules)

- [x] The user must not be able to register with a duplicated email;
- [ ] The user must not be able to make 2 check-ins on the same day;
- [ ] The user must not be able to check in if they are not within 10m of the gym;
- [ ] The check-in can only be validated up to 20 minutes after its creation;
- [ ] The check-in can only be validated by administrators;
- [ ] The gym can only be registered by administrators;

## NFRs (Non-Functional Requirements)

- [x] The user's password must be hashed;
- [ ] Application data must be persisted in a PostgreSQL database;
- [ ] All data lists must be paginated with 20 items per page;
- [ ] The user must be identified by a JWT (JSON Web Token);
