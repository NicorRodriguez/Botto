# Botto
Botto es un bot de Slack que permite acceder a cierta informacion de un servidor de Readmine ademas de algunas funcionalidades extra.

# Instalacion

Docker:

	git clone https://github.com/NicorRodriguez/Botto.git

	Cambiar los valores de SLACK_BOT_AUTH y serv con la token del bot y la url del servidor de Redmine en src/constants.js

	docker build . -t (nombre de la imagen)

	docker run -d (nombre de la imagen creada anteriormente)

Local:(npm y node como requisitos)

	git clone https://github.com/NicorRodriguez/Botto.git

	Cambiar los valores de SLACK_BOT_AUTH y serv con la token del bot y la url del servidor de Redmine en src/constants.js

	npm install

	node src/index.js
