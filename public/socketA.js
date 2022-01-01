const socket = io();

socket.on("connect", function () {
  console.log("conectao");
  let data;
  data = "conectado a AlbArd ";
  mensajeToConsola(data);
});

//al conectar con el server mostar el log en consola

socket.on("connection", function (data) {
  console.log("connection detectado en socketA", data);
  datalog(data);
});
function datalog(data) {
  // for (let index = data.mensaje.length; index <= data.mensaje.length; index--) {
  // let element = data.mensaje[index];
  // console.log(element);
  data.mensaje.forEach(element => {
    mensajeToConsola(element)
    
  });

  // }

  // mensajeToConsola(data.mensaje[i]);
}

//gestionar mensajes de octopi
socket.on("mensaje", function (data) {
  console.log("mensaje recibio" + data);
  mensajeToConsola("Octopi: " + data);
});
function mensajeToConsola(data) {
  //  var textArea
  //  textArea=document.createElement('consolaMensajes')
  //  textArea.value+=data+'/r/n'
  let text = document.getElementById("consolaMensajes").value + "&#13;";
  // text= text.replace(/\n/g, "<br />");

  document.getElementById("consolaMensajes").innerHTML =
    data + "&#13;" + text + "&#13;";
}

//SystemInformation cliente

socket.on("dataHard", function (data) {
  //    console.log('HW->'+data)

  mensajeHard(data);
});
socket.on("temp", function (data) {
  //    console.log('HW->'+data)
  document.getElementById("temp").innerHTML = data;
});
function mensajeHard(data) {
  document.getElementById("hardInf").innerHTML = data;
}

//apagar equipo etc
function apagar() {
  console.log("le has dao a apagar");
  //enviar un post
}
