const { Knexgame } = require("../config/db_config");

const farmerstable = 'farmers';
const seedstable = 'seeds';
const cropstable = 'crops';


exports.getFarmers = async (req, res) => {
    try {
        res.status(200).json({ message: "Farmers fetched successfully (placeholder)" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching farmers", error: error.message });
    }
};

// get seeds for a farmer (placeholder)

exports.getFarmerSeeds = async (req, res) => {
    try {
const [seeds] = await Knexgame(seedstable).select('*').from(seedstable);
        

        res.status(200).json({ message: "Farmer seeds fetched successfully (placeholder)", data: seeds });
    } catch (error) {
        res.status(500).json({ message: "Error fetching farmer seeds", error: error.message });
    }
};
``
// get crops for a farmer (placeholder)
exports.getFarmerCrops = async (req, res) => {
    try {
        res.status(200).json({ message: "Farmer crops fetched successfully (placeholder)" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching farmer crops", error: error.message });
    }
};
