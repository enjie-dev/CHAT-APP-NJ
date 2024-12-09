import { Server } from "socket.io";
import http from "http";
import express from "express";



const app = express();
const server = http.createServer(app);


const io = new Server (server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}


// let's listen for to any incoming connection , whenever someone conncect we are going to get this callback call
io.on("connection", (socket) => {
    console.log("A user connected",socket.id);



// about disconnection

socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
 
  });

});


export {io, app, server};

// after that we gonna go in our front end and get install the soket client
// cd front , nom i soket.io-client