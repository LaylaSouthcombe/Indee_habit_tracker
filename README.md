# Indee Habit Tracker

Welcome to Indee! This is a full stack web application with an HTML/CSS/JS client and an Express server connected to PostgreSQL database hosted on Heroku. The purpose of this app is to provide an accessible platform for people with learning difficulties to track task they need to do daily to be able to live independently.

*WIP*

**bash _scripts/startDev.sh**
- starts client, api & db services
- runs db migrations
- seeds db for development
- serves client on localhost:8080
- serves api on localhost:3000
<!-- 
**bash _scripts/startTest.sh**
- starts api & db services
- runs db migrations
- attaches to api container and triggers full test run
- no ports mapped to local host -->

**bash _scripts/teardown.sh**
- stop all running services
- removes containers
- removes volumes

Frontend deployed here https://indee.netlify.app/

