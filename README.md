# FRC 2090 Scouting 2018 App by William Kwok

## Getting started
- Install [git bash](https://git-scm.com/downloads) if you're on windows (git is already installed on macs)
- Install git credential manager for windows if you have windows
- Install [node.js](https://nodejs.org/en/)
- Fork (fork button up top) and then clone this repository into a folder (open git bash and do `cd Desktop` for example to go to desktop). To do this do `git clone ______` where the underline is the link you get from the green button to the top right near the list of files
- Once cloned, `cd` into it, then do `npm install`. This will install modules you need for the app to run.
- Do `npm start` to test if it runs. It should run on localhost:3000. You can press ctrl-c to stop it. If you're on windows, it may not close correctly. To end it on windows, I do `netstat -ano | findstr :3000` and find the task number it is, then do `taskkill //PID #### //F`
- You will need to restart if you install new node modules.
- Modify to your heart's content. Also modify the package.json file to have the correct link, used for gh pages.
- To build, do `npm run deploy`, and then you can clone the gh-pages branch (`git clone ___` then `git checkout gh-pages`) to any host that you use. (In my case, I use my student server provided by the University of Washington)
- To push your changes onto github, do `git add .` then `git commit -m "message"` then `git push`)

To learn more git stuff, read my [INFO 201](https://info201.github.io/) class book.

To understand JavaScript, then React, you'll want to read this course book, [INFO 343](https://info343.github.io/). It is how I learned most of it. I was required to understand it before class, and learn it on my own. While debugging was helpful with teacher guidance, it is definitely possible to learn it all on your own enough to rebuild my app to be better.

## Firebase
You will need to create your own project on http://firebase.google.com, it's free to use, and it was what I used.
- Add project, then you can click on the "Add firebase to your web app" button, and copy the part within the `<script>` tag into `src/index.js` replacing where mine is. You are not done yet.
- Go to database on the sidebar, enable Realtime Database, then under "Rules", change `.read` and `.write` to true.
- My app used client side validation which is good enough for FRC teams, as there is no huge need to be secure. It's fairly easy to implement server side validation, but I was just too rushed to do so. Publish the changes.
- Under `src/AppDataPage.js` I have a button all the way on the bottom that calls a method that creates the teams in the database. You can uncomment it and click on it to add teams. If you don't like the changes, you can delete the entire entry in the database.
- You can modify the teams that are added by modifying the `addTeams()` method. I input them by hand, but there are easy ways to do so from an excel/csv file.
- You should be good to go.
