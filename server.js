import { initNetwork } from "./network.js"

import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express();
export const server = http.createServer(app);
export const io = new Server(server);

app.use(express.static("public")); // send client side html and js to the client on connect

initNetwork();