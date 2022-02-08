const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const Msg = require('./models/Message');
const socketio = require('socket.io');
const {userJoin, getCurrentUser, getRoomUser, userLeave} = require('./models/users');
const User = require('./models/users');
const UserSchema = require('./models/userSchema')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const server = http.createServer(app);
const io = socketio(server);


app.post('/login.html', async (req, res) => {
    const user = await UserSchema.find({username : req.body.username})
    try{
        if(user){res.redirect('/index2.html')}
    }
    catch (e) {
        console.log(e)
    }

    let newUser = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        createon: Date.now
    }
    console.log(newUser)
    let createUser = new UserSchema(newUser)
    req.body.content = new UserSchema(createUser)
    await req.body.content.save(createUser)
    .then(res.status(200).redirect('/login.html'))
    .catch( e => console.log(e))

   
})

app.post('/chat', async (req, res) => {
    const user = await UserSchema.find({username : req.body.username})
    if(user){res.redirect('/chat.html')}
})

app.get('/', async(req, res) => {
    res.redirect('/index.html')
    .catch(e => console.log(e))
})

app.get('/login', async(req, res) => {
    res.redirect('/login.html')
    .catch(e => console.log(e))
})


 app.post('/room.html', async(req, res) => {
    const user = await UserSchema.find({username : req.body.username, password : req.body.password})
     try{
        if(user[0].username != undefined){
            res.redirect("room.html?username=" + req.body.username)
         }
         else{
            res.redirect('/login2.html')
         }
     }
     catch (e) {
        res.redirect('/login2.html')
    }
  })


app.get('/room/:username', async(req, res) => {
    res.redirect('/room.html')
   .catch(e => console.log(e))
})

app.get('/logout', async(req, res) => {
    res.redirect('/index.html')
   .catch(e => console.log(e))
})


app.use(express.static(path.join(__dirname, 'public')));
const Admin = "Admin"

io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        const messageWelcome = new Msg({from_user: Admin, to_user: [], room: room, message: 'Welcome to Chat_With_Wynne !', createon: ""})
        socket.emit('message', messageWelcome)


        const messageConnect = new Msg({from_user: Admin,to_user: [], room: room,  message: `${user.username} has joined the chat room ${user.room}`, createon: ""})
        socket.broadcast.to(user.room).emit('message', messageConnect);

        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users: getRoomUser(user.room)

        })


        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            const message = new Msg ({from_user:Admin ,to_user: [], room: room,  message: `${user.username} has left the room`, createon: ""})
            if(user){
                io.to(user.room).emit('message', (message.from_user, message.message));
            }

            io.to(user.room).emit('roomUsers', {
                room:user.room,
                users: getRoomUser(user.room)
    
            })
            

        })

        socket.on('chatMessage', (msg) => {
            const user = getCurrentUser(socket.id)
            const message = new Msg({from_user: username, 
                                            to_user: User.users[0].username, 
                                            room: room,
                                            message: msg
                                            })
            message.save().then(
                () => {io.to(user.room).emit('message', {from_user: message.from_user, message: msg})}
            )
            
        })
    });


});


const DB_URL = "mongodb+srv://101161665_assignment2:101161665@cluster0.ivcmc.mongodb.net/101161665_assignment2?retryWrites=true&w=majority"

// TODO - Update your mongoDB Atals Url here to Connect to the database
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => {
    server.listen(3000, console.log("sucessfully connected to the database mongoDB Atlas Server"))
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
});