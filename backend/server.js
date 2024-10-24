const express = require('express'); 
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const socketIO = require('socket.io');
const session = require('express-session');
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for sessions
app.use(session({
    secret: 'yjgjyfyutfuysr54y354yuyfu6e', 
    resave: false,
    saveUninitialized: false
}));

// Connect to MongoDB

mongoose.connect('mongodb://localhost:27017/alumni_connect')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));  // Separate route for auth-related endpoints
app.use('/api/chat', require('./routes/chat'));  // Separate route for chat-related endpoints

// Base route
app.get("/", (req, res) => {
    res.send("API is running");
});

// Socket.IO setup
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle joining a room
    socket.on('joinRoom', (roomId) => {
        console.log(`Client joined room: ${roomId}`);
        socket.join(roomId);
    });

    // Handle sending a message
    socket.on('sendMessage', (message) => {
        console.log('Message received:', message);
        io.to(message.roomId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
