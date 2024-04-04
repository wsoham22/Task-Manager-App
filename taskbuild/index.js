const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Connect to MongoDB
const password = process.env.MONGODB_PASSWORD || '';
const URL = process.env.MONGODB_URL.replace('password', password);

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        maxlength: 25,
        minlength: 10,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

// Home Page
app.get('/', (req, res) => {
    res.end("This is the home page!");
});
const taskRouter = require("./routes/taskroutes"); // Replace with the actual path to your task router file
app.use('/api',taskRouter);
// Mount the task router at a specific path
// app.post('/createtask', taskRouter);
// app.get('/gettasks',taskRouter);
// app.get('/gettask/:id',taskRouter);
// User Registration (Signup)
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email ||!password === "") {
            return res.status(400).json({ error: 'Enter valid credentials!' });
        }

        // Check if the passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword });

        // Save the user to the database
        await user.save();

        // Return a success response
        res.status(201).json({ message: 'User registered successfully' }).then(console.log("User registered successfully!"));
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    };
})

// User Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Enter details first' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate and send a JWT token for authentication
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("User logged!");
        // Redirect to the /dashboard route
        res.redirect('/dashboard');
        // Alternatively, you can send the token in the response if needed
        // res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Dashboard Route
app.get('/dashboard', (req, res) => {
    // Handle logic for the /dashboard route
    res.end("This is the dashboard!");
});
// Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});