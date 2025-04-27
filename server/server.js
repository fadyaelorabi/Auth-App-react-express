const express = require('express');   // Use require() in CommonJS
const mongoose = require('mongoose'); // Use require() in CommonJS
const bcrypt = require('bcrypt');     // Use require() in CommonJS
const User = require('./models/User'); // Use require() in CommonJS
const jwt = require('jsonwebtoken');  // Use require() in CommonJS
const cors = require('cors');          // Use require() in CommonJS
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
));

/*
This specifies the allowed origin(s). In this case, only requests coming from http://localhost:5173 (your frontend running on port 5173) are allowed to access resources from your backend.
*/
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb+srv://root:root@cluster0.x5vov.mongodb.net/signup?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Register API

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // 2. Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken.' });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new instance of the User model
    const user = new User({ name, email, password: hashedPassword });

    // 5. Save the user to the database
    await user.save();

    // 6. Send a success response
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation error occurred.', details: error.errors });
    }

    res.status(500).json({ message: 'Registration failed. Please try again later.' });
  }
});

// Login API (without JWT)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 3. Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 4. Generate a JWT token (set an expiration time as needed)
    const token = jwt.sign({ userId: user._id, email: user.email , name: user.name}, 'JWT_SECRET', { expiresIn: '1h' });
    res.cookie('token', token);
    // 5. Send the token as a response
    res.status(200).json({ message: 'Login successful!', token });

  } catch (error) {
    console.error('Error logging in user:', error);

    // Handle validation errors from Mongoose (if any)
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation error occurred.', details: error.errors });
    }

    // General error handler
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
});

// JWT Verification Middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, 'JWT_SECRET', (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not valid" });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

// Protected Route
app.get('/', verifyUser, (req, res) => {
    // Protected content here
    res.json({ Status: "Success", name: req.name });
});

//logout Route
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});


const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
