# Botto
Botto es un bot de Slack que permite acceder a cierta informacion de un servidor de Readmine ademas de algunas funcionalidades extra.

# Instalacion

git clone https://github.com/NicorRodriguez/Botto.git

Change the values of SLACK_BOT_AUTH and serv to match your own on src/constants.js

docker build . -t (name of the image that you want)

docker run -d (name of the image set before)

Now you have your Slack bot running on docker.