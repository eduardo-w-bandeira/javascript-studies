const http = require("http");

const server = http.createServer((req, res) => {
    console.log("Incoming request at: ", req.url);
    res.write("Hello from the server");
    res.end();

});

server.listen(3000, () => {
    console.log("Server Listening on Port 3000");
});