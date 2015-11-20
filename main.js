var app = require("http").createServer(handler);
var io = require("socket.io").listen(app);
var fs = require("fs");

function handler(req, res){
    var html = fs.readFileSync("index.html", "utf8");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Length", Buffer.byteLength(html, "utf8"));
    res.end(html);
}

app.listen(80);

/*
客户端和服务端的交互演示了两种不同命令封装
1.服务端到客户端，不同命令使用相同名称（message），由命令参数的name字段指定实际命令名称，这方便于客户端统一处理
2.客户端到服务端，不同命令使用不同名称，这更接近于“方法名-参数列表”的结构，便于服务端的多个响应函数分别处理
当然，从本例来看，不采用第2种方式也许更简单，如下面代码中重复的部分可以简写为：
socket.on("message", function(msg){
    msgs.push(msg);
    io.sockets.emit("message", msg);
});
这更符合DRY的原则，也方便以后再添加画图命令。
*/
io.sockets.on("connection", function(socket){
    //从客户端获得命令
    socket.on("line", function(msg){//画线
        //向客户端发命令
        msg.name = "line";
        msgs.push(msg);
        io.sockets.emit("message", msg);
    });
    socket.on("text", function(msg){//文字
        msg.name = "text";
        msgs.push(msg);
        io.sockets.emit("message", msg);
    });
    socket.on("eraser", function(msg){//橡皮
        msg.name = "eraser";
        msgs.push(msg);
        io.sockets.emit("message", msg);
    });
    socket.on("load", function(msg){//从头画
        socket.emit("load", {
            name : "load",
            msgs : msgs
        });
    });
    socket.on("clear", function(msg){
        msgs.length = 0;
        io.sockets.emit("message", {
            name : "clear"
        });
    });
});

var msgs = [];
