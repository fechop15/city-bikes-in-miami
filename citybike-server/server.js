const express = require("express");
const http = require("http");
const axios = require('axios');
const socketIo = require("socket.io");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"



const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);

  socket.on("bikes_aviable", biker_socket => {
    console.log(`Requesting bikes: ${biker_socket}`)
    clearInterval(interval);
    interval = setInterval(() => {
      axios.get(citybikeurl)
          .then(function (response) {
            // handle success
            //console.log(response);
            socket.emit("get_biker_info", JSON.stringify(response.data));
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            socket.emit("get_biker_info", false);
          })
          .then(function () {
            // always executed
          });
    }, 5000);

  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`));



