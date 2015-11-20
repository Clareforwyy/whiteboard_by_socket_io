var app = require("http").createServer(handler);
var io = require("./node_modules/socket.io").listen(app);
var fs = require("fs");

function handler(req, res){
    var html = fs.readFileSync("index.html", "utf8");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Length", Buffer.byteLength(html, "utf8"));
    res.end(html);
}

app.listen(80);

io.sockets.on("connection", function(socket){
    //从客户端获得命令
    socket.on("line", function(msg){//画线
        //向客户端发命令
        msg.name = "line";
        msgs.push(msg);
        io.sockets.send(msg);
    });
    socket.on("text", function(msg){//文字
        msg.name = "text";
        msgs.push(msg);
        io.sockets.send(msg);
    });
    socket.on("eraser", function(msg){//橡皮
        msg.name = "eraser";
        msgs.push(msg);
        io.sockets.send(msg);
    });
    socket.on("load", function(msg){//从头画
        socket.emit("load", {
            name : "load",
            msgs : msgs
        });
    });
    socket.on("clear", function(msg){
        msgs.length = 0;
        io.sockets.send({
            name : "clear"
        });
    });
});

var msgs = [];
