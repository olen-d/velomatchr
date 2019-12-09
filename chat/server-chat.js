const express = require("express");
const path = require("path");
const app = express();

const server = require("http").Server(app);
const io = require("socket.io").listen(server);

const port =  process.env.PORT || 5010;

app.use(express.static(path.join(__dirname, "public")));
app.use("/scripts", express.static(__dirname + "node_modules/"));

const routes = require("./routes/routes")(app);

io.on("connection", socket => {
    socket.on("chat_message", msg => {
        io.emit("chat_message", msg);
    });
});

server.listen(port, () => {
    console.log(`Chat server is listening on port ${port}!`);
});
