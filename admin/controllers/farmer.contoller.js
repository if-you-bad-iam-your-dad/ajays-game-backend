const { Knexgame } = require("../config/db_config");

const farmerstable = 'farmers';


exports.getFarmers = async (req, res) => {
    try {
        res.status(200).json({ message: "Farmers fetched successfully (placeholder)" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching farmers", error: error.message });
    }
};


