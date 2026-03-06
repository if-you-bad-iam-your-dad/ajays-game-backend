const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const usersRoutes = require('./admin/routes/users.routes');
const farmerRoutes = require('./admin/routes/farmer.routes');

app.use('/admin/users', usersRoutes);
app.use('/admin/farmer', farmerRoutes);

app.use('/', (req, res) => {
    res.send('Welcome to ajays game backend server');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


