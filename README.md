A bare-bone graphical visualizer to display the Google Mobility Data during the Covid19 pandemic.
Here is the source of the data I used. https://www.google.com/covid19/mobility/

This is an angular application that is deployed to Heroku using docker.

Some development notes (this is really for my to remember what I did)

Create DockerFile and nginx.conf files
change "outputPath": "dist",
heroku container:login
heroku container:push web -a covid-mobility
heroku container:release web -a covid-mobility
https://covid-mobility.herokuapp.com/

Enjoy.
