import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v1 as uuidv1 } from 'uuid';
import userRouter from "./Router/user-router"
import conversationRouter from './Router/conversation-router';
import messageRouter from './Router/message-router';
import multer from 'multer';
import path from "path";
import dotenv from 'dotenv';

import { dirname } from 'path';


const __dirname = path.resolve();
const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, './frontend/build')))
app.use("/images", express.static("public"));
//app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/user", userRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);
dotenv.config();
mongoose.connect('mongodb+srv://aparajitabandyopadhyay5:AlpYKZb87kVK26n4@cluster0.mtabm9g.mongodb.net/?retryWrites=true&w=majority').then(() => console.log("DBconnection successfull")).catch((error) => { console.log("error") });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        const name = req.body.name;
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});
app.get("/images/:name", upload.single("file"), (req, res) => {
    const name = req.params.name



});
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log("server is running")
})


//AlpYKZb87kVK26n4
import { Server } from "socket.io";
const io = new Server(server, {
    cors: {
        origin: "*",
        method: ["GET", "POST"]
    },
});

let users = [];


/*const addUser = (newuserId, socketId) => {
    if (!users.some((user) => user.userId === newuserId)) {
    users.push({ userId: newuserId, socketId: socketId });

    //users.push({ userId: userId, socketid: socketId });
    //}

    // };
}}*/

/*const getUser = (userId) => {

    const user = users.find((user) => user.userId === userId);
    //console.log("72" + user)

};*/


io.on("connection", socket => {
    //when ceonnect
    console.log("a user connected." + socket.id);

    socket.on('custom-event', (newuserId) => {
        console.log(newuserId)
        if (!users.some((user) => user.userId === newuserId)) {
            users.push({ userId: newuserId, socketId: socket.id });
        }
        console.log("connected  " + " users " + users + " socketid: " + users[0].socketId + " userId: " + users[0].userId + " " + users[1])
        console.log(JSON.stringify(users));
        io.emit("getusers", users)
    })

    //console.log("89" + users.object)
    //send and get message
    /* socket.on("sendMessage", ({ senderId, receiverId, text }) => {
          console.log(senderId + " " + receiverId + " " + text)
          const user = getUser(receiverId);
          io.to(user.socketId).emit("getMessage", {
              senderId,
              text,
          });
      })*/
    socket.on("sendMessage", (body) => {
        console.log(body)
        const senderId = body.senderId
        const text = body.text
        const receiverId = body.receiverId
        //console.log(senderId)
        //console.log(text)
        //console.log("106" + users)

        console.log(users)
        const user = users.find((user) => user.userId === receiverId);
        console.log(user)
        console.log(user?.socketId)
        io.to(user?.socketId).emit("getMessagefromsocket", {
            senderId: senderId,
            text: text,
        });
    })


    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");

        users = users.filter((user) => user.socketId !== socket.id);
        io.emit("getUsers", users);
    });

})