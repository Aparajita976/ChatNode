/*const app = require("express")();
const httpServer = require("http").createServer(app);

const { Server } = require("socket.io")
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"]
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);

    })
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    })

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
httpServer.listen(4000, () => {
    "server is running on port 3000"
})*/
const dotenv = require('dotenv');
const PORT = process.env.PORT || 8800
const io = require('socket.io')(PORT, {
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