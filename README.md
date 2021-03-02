# typescript-react-and-node-websockets-boilerplate
Lightweight starter, built using create-react-app + node - both using typescript. Code is provided to establish a websocket connection between the client & server, via socket.io.

To get started, run the following two commands -

> Run the /src/server file using nodemon - hot reloading the server on any changes

`cd server && yarn && yarn debug`

> Start our create-react-app project, also supporting hot reloading

`cd frontend && yarn && yarn start`

You can then navigate to localhost:3000 (default create-react-app port), and you should see a "Socket connected" message
