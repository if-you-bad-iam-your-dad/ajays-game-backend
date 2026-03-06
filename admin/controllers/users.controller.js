const { Knexgame } = require("../config/db_config");
const bcrypt = require('bcryptjs');

let usertable = 'users';
let roletable = 'roles';


exports.getUsers = async (req, res) => {
    try {
        const users = await Knexgame.select().from(usertable);
        res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// user resgistration

exports.registerUser = async (req, res) => {
    try {
        const { email, username, password, role_id, language, is_active, status } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, username, password: hashedPassword, role_id, language, is_active, status };
        const [id] = await Knexgame(usertable).insert(newUser);
        res.status(201).json({ message: "User registered successfully", data: { id, ...newUser } });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// user login

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Knexgame(usertable).where({ email }).first();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Here you would normally compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ message: "User logged in successfully", data: user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};

exports.getroles = async (req, res) => {
    try {
        const roles = await Knexgame.select().from(roletable);
        res.status(200).json({ message: "Roles fetched successfully", data: roles });
    } catch (error) {
        res.status(500).json({ message: "Error fetching roles", error: error.message });
    }
};
