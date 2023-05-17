import express from "express";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils/dirname.js";
//Handlebars
import handlebars from "express-handlebars";

//Socket.io
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManagerFS.js";

//Base de datos
import "./db/dbConfig.js";

//Modelo de mensajes
import { messagesModel } from "./db/models/messages.model.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Ruta publica
app.use("/public", express.static(__dirname + "/public/html"));
app.use(express.static(__dirname + "/public"));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//Handlebars
app.engine("handlebars", handlebars.engine());

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/views", viewsRouter);

app.set("port", process.env.PORT || 8080);

const httpServer = app.listen(app.get("port"), () => {
  console.log("Escuchando puerto:", app.get("port"));
});

//Socket.io

const io = new Server(httpServer);
const productManager = new ProductManager(__dirname + "/productos.json");

const products = await productManager.getProducts();

io.on("connection", (socket) => {
  //Mensaje para el servidor
  console.log(`Usuario ${socket.id} conectado`);

  //Mensaje para el usuario que se conectó
  socket.emit("message0", "Bienvenido al servidor del Desafio 4");

  //Mensaje para todos menos para el usuario que se conectó
  socket.broadcast.emit(
    "message1",
    `Se conectó un nuevo usuario con el id: ${socket.id}`
  );

  //Evento: Agregado de productos a la base de datos
  socket.on("createProduct", async (product) => {
    const productsPush = products;
    productsPush.push(product);

    io.emit("product-list", productsPush);

    await productManager.addProduct(product);

    socket.broadcast.emit(
      "message3",
      `El usuario ${socket.id} ha agregado un nuevo producto a la base de datos`
    );
  });
  //Evento: Eliminación de productos a la base de datos
  socket.on("deleteProduct", async (id) => {
    const productsPush = products.filter((product) => product.id !== id);

    io.emit("product-list", productsPush);

    socket.broadcast.emit(
      "message4",
      `El usuario ${socket.id} ha eliminado el producto con id: ${id}`
    );

    await productManager.deleteProductById(id);
  });

  socket.on("message", async (data) => {
    const newMessage = new messagesModel({
      user: data.user,
      message: data.msg,
    });
    await newMessage.save();

    socket.broadcast.emit("message", data);
  });

  socket.on("usuarioNuevo", async (usuario) => {
    socket.broadcast.emit("broadcast", usuario);

    const messages = await messagesModel.find();

    socket.emit("chat", messages);
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");

    io.emit("message2", `El usuario ${socket.id} se ha desconectado`);
  });
});
