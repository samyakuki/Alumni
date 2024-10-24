const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const socketIO = require('socket.io');

const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

const session = require('express-session');

app.use(session({
    secret: 'yjgjyfyutfuysr54y354yuyfu6e', 
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://localhost:27017/alumni_connect')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));




app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/chat'));   

app.get("/",(req,res)=>{
    res.send("api is running");
})

  
// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', (req, res, next) => {
    require('./routes/auth')(req, res, next);
});

app.use('/api', (req, res, next) => {
    require('./routes/chat')(req, res, next);
});

// Socket.IO
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = socketIO(server);

// Socket.IO events
io.on('connection', (socket) => {
    // Handle connection
    socket.on('joinRoom', (roomId) => {
        // Join room
        socket.join(roomId);
    });

    socket.on('sendMessage', (message) => {
        // Send message
        io.to(message.roomId).emit('newMessage', message);
    });

});