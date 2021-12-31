console.log("serverLoG");

const xpress = require("express");

const app = xpress();
const path = require("path");
const { emit } = require("process");
const SocketIO = require("socket.io");
const si = require("systeminformation");
const fs = require("fs");
//server

const server = app.listen(3000, "192.168.1.212", () => {
  console.log("server on en puerto 3000");
});
const io = SocketIO(server);

//websocket

io.on("connection", (socket) => {
  console.log("cliente connection");
  //  if (mensajeDifundir === "Print Done") {
  //    socket.broadcast.emit("mensaje","polla");
  //   console.log("que se envia tema", mensajeDifundir);
  // mensajeDifundir = null
  // }
});
//static

app.use(xpress.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // console.log(req.get.toString());
  res.render("index.html");
  //res.send("servidor escuchando ");
});
//conexion octopi webhook
let mensajeDifundir = {
  mensaje: [],
};

app.post("/", (req, res) => {
  let body = "";
  var jsonRecibido = [];

  console.log(req.query);

  req
    .on("data", function (data) {
      jsonRecibido.push(data);

      body += data;
    })
    .on("end", () => {
      let parsedJson = JSON.parse(jsonRecibido);
      let topic = parsedJson[0];
      let message = parsedJson[1];
      console.log("peticion dice ", body);
      console.log(parsedJson.topic);
      console.log(parsedJson.message);
      res.send("ok");
      // mensajeDifundir = parsedJson.topic;
      mensajeDifundir.mensaje.push(parsedJson.topic + " " + parsedJson.message); //añado a mensajeDifundir el mensaje
      //guardar mensaje difundir como json
      fs.writeFileSync(
        "./mensajesDifundir.json",
        JSON.stringify(mensajeDifundir)
      );
      console.log("archivo mensaje difundir guardado");

      enviarMensaje(parsedJson.topic + " " + parsedJson.message);

      //req.connection.destroy(
      //  req.shouldKeepAlive = false
      // req.socket.destroy()
    });
});

function enviarMensaje(mensaje) {
  console.log("f enviarMensaje", mensaje);
  io.emit("mensaje", mensaje);
}

//systeminformation
//%%%%%%%%%%%%%%%%%

//si.mem(function (data) {
// console.log(data.total);
// console.log(data.used)
// let ramUsada = "RAM: " + ((data.used / data.total) * 100).toFixed(2) + "%";
// dataHard.ram = ramUsada;
// console.log(ramUsada)
//});
var dataHardObj = [];

function dataHard() {
  //temperatura procesador
  si.cpuTemperature(function (data) {
    //console.log(typeof data.main);
    //console.log("tempCPU",data.main
    if (data.main===null) {
      
    } else {
      io.emit("temp", (data.main).toFixed(0));
      
    }
    
  });

  si.mem(function (data) {
    //console.log(data.total);
    //   console.log(data.used)
    let ramUsada = "RAM: " + ((data.used / data.total) * 100).toFixed(2) + "%";
    dataHardObj.push(ramUsada);
    //  console.log(dataHardObj);
    io.emit("dataHard", dataHardObj);
    dataHardObj = []; //emito el objeto dataHard que contiene cpu,ram usage
  });

  si.currentLoad(function (data) {
    let CPU = "CPU:" + data.currentLoad.toFixed(2) + "%";
    dataHardObj.push(CPU);
    // console.log("Cpu:"+CPU.toFixed(2))
    //  console.log(dataHardObj);
  });
  // console.log(dataHardObj);
  // console.log(dataHardObj);
}

setInterval(dataHard, 2000); //emito los valores cada 2s

//saber si ejecuto en win o linux
let plataforma = process.platform;
console.log(plataforma);
