This is a bare-bone graphical visualizer written in Angular to display the Google Mobility Data during the Covid19 pandemic.
This application is deplyed to Heroku using docker and served using NGINX.

You can checkout the application here: https://covid-mobility.herokuapp.com

Some development notes (this is really for me to remember what I did)

Create DockerFile and nginx.conf files
change "outputPath": "dist",
heroku container:login
heroku container:push web -a covid-mobility
heroku container:release web -a covid-mobility
https://covid-mobility.herokuapp.com/

The data source from Google can be found here: https://www.google.com/covid19/mobility/

Enjoy.
