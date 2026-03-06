const getUsers = async (req, res) => {
    try {
        res.status(200).json({ message: "Users fetched successfully (placeholder)" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

module.exports = {
    getUsers
};
