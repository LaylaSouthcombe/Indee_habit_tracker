# LAP 2 Debugging Assignment

Welcome to your second debugging assignment! This is a full stack web application with an HTML/CSS/JS client and an Express server connected to PostgreSQL database.

**Please make sure that you read *all* the instructions before starting.**

You are going to debug and complete an app called *The Reading Room*.
- Users can see a list of all books 
- Users can see a list of all authors in the database
- Users can select a book to see more details on the book
- Users can select an author to see a list of books by that author
- Users can add a new book to the database
    - If the new book is by an author not currently in the database, a record is created for that author
- Users can delete a book
    - If, upon deletion of a book, the associated author has no more books in the database, that author's record is also deleted


## Code of Conduct
- Do not ask your classmates (verbally or through any other communication method) for help.
- Do not copy/paste any code from someone else or from any online resource.


## Tasks
Take your time to familiarise yourself with the structure of this app before you start debugging. 

Watch [this clip](https://youtu.be/fq53QtF-5MU) to see the desired user experience.

### Client
- **Do not make changes within the given /client folder** 
- You may, however, find some useful clues in there for what data it is expecting to receive from the API! ***Look but don't touch!***

### Express
- Ensure all existing endpoints are accessible
- Ensure all endpoints return the data structure expected by the client
- Implement an endpoint for the 'delete book' feature

### Postgres
- Ensure database table schemas are complete
- Ensure all database queries are formatted correctly

### Tests
- The existing test configuration does not need changing and no additional test config should be required
- The existing tests do not need changing
- All tests should be passing by the end of your debugging session

### README
- Add a useful README to document your work, take a look at [this guide](https://gist.github.com/getfutureproof-admin/dfe45adba508f931bf83d144cbbf6bbe) on assignment specific requirements.


## Key provided scripts and intended functionality
You should not have to make changes to the scripts or docker-compose configuration themselves. \
**The files they reference may require attention before the containers are successfully started. *Use the Docker output to guide you here* - there may be some very useful errors!**

**bash _scripts/startDev.sh**
- starts client, api & db services
- runs db migrations
- seeds db for development
- serves client on localhost:8080
- serves api on localhost:3000

**bash _scripts/startTest.sh**
- starts api & db services
- runs db migrations
- attaches to api container and triggers full test run
- no ports mapped to local host

**bash _scripts/teardown.sh**
- stop all running services
- removes containers
- removes volumes

These enviroments will take a little time to set up especially the first time you run but both will listen for changes when running *except* for database setup files ie. anything in `db/migrations`. 

***Do not run both dev and test environments at the same time.***

***

## GitHub Classroom Flow
- GitHub Classroom has created this repo, your very own with your username in the title! 
- **DO NOT** fork this repo
- Clone it to your machine and get to work
- Remember to make regular commits with clear and concise messages
- Work on, and make your commits to the master branch
- Push your code back up to GitHub on the master branch (you should only need `git push`)
- **You do not need to make a PR** - GitHub Classroom has created a PR from master to feedback to help us review
- Once you have made all your final commits and pushes, request review on the 'Feedback' PR from your assigned reviewer:
  + Click on 'Pull requests' at the top of this repo
  + Click on 'Feedback', it should be the only open PR
  + On the right hand side, click the cog next to 'Reviewers' and select your assigned reviewer
- **DO NOT** merge or close the PR

***

Have a great day! 😁
# Indee_habit_tracker
