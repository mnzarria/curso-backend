const socket = io();
//Configuracion chat
const btnSend = document.getElementById("send-message");
const message = document.getElementById("message-area");
const boxMessages = document.getElementById("chat-box");
const tituloUsuario = document.getElementById('nombre-to-name')
const divChat = document.getElementById('chat')

let usuario

// ingreso al chat - colocar el usuario
Swal.fire({
    title: 'Bienvenid@ al chat!',
    text: 'Ingresa tu nombre de usuario',
    input: 'text',
    inputValidator: (value) => {
        if (!value) {
            return 'El nombre de usuario es obligatorio'
        }
    },
}).then((username) => {
    usuario = username.value
    tituloUsuario.innerText = `Bienvenid@ ${usuario}!`
    socket.emit('usuarioNuevo', usuario)
})

//Mensaje propio
btnSend.addEventListener("click", () => {
    if (message.value == "") {
        message.focus();
    } else {
        boxMessages.innerHTML += `
  <div class="chat from-message">
    <div class="detalles">
        <span>Tú</span>
      <p>${message.value}</p>
    </div>
  </div>
      `;
        scrollBottom();
        socket.emit("message", { user: usuario, msg: message.value });
        message.value = null;
    }
});


// Chat Anterior
socket.on('chat', (mensajes) => {
    console.log(mensajes)

    const chatParrafo = mensajes
        .map((obj) => {
            return `<p>${obj.user}: ${obj.message}</p>`
        })
        .join(' ')

    divChat.innerHTML = chatParrafo
})


/* ENTER KEY  */
function enterkey() {
    keyenter = event.keyCode;
    if (keyenter == 13) {
        btnSend.click();
        scrollBottom();
    }
}
window.onkeydown = enterkey;

function scrollBottom() {
    boxMessages.scrollTop = boxMessages.scrollHeight;
}

/* LISTENER SOCKET */
//Mensaje de otro usuario
socket.on("message", (data) => {
    boxMessages.innerHTML += `
  <div class="chat to-message">
    <div class="detalles">
        <span>${data.user}</span>
      <p>${data.msg}</p>
    </div>
  </div>
  `;
    scrollBottom()
});

// notificacion usuario nuevo conectado
socket.on('broadcast', usuario => {
    Toastify({
        text: `${usuario} se unió al chat`,
        duration: 5000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #1f0b84)",
        },
    }).showToast();
})