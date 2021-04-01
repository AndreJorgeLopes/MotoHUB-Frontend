const initListeners = require("./listeners");
const config = require('../config/api');
const routes = require('./api/routes');
const express = require('express');
const path = require("path");
var cors = require('cors');
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);
initListeners(io);

require('pg').defaults.parseInt8 = true;
require('../database')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "public", "uploads"))
  );
app.use(`/api`,routes);

app.listen(config.port, async () => {
    console.log(`App running at port ${config.port}`);
});

/* 
meter uma div com o nome e foto do vendedor no mesmo sitio do icon de favorito(mas à esquerda)

os pedidos delete não eliminam se tiverem dependencias(não elimina o user se ele tiver algum post ou favorito)

o socket fecha ao fechar um chat especifico e não só ao fechar a pagina da net

const socket = io({
  query: {
    userId,
    chatId
  } 
})

no controller das transactions tenho de meter o adyen a funcionar
criar email de compras e meter no controller

Mandar email de verificação ao user

ao tentar criar uma conversa verificar se é a primeira
->se for a primeira conversa, usar o controller de criar chat

tentar implementar 'vista' nas mensagens
*/