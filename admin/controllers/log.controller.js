const { Knexgame } = require("../config/db_config");

const logtable = 'logs';



// get all logs

exports.getLogs = async (req, res) => {
    try{
        const logs = await Knexgame.select().from(logtable);
        res.status(200).json({ message: "Logs fetched successfully", data: logs });
    }catch(error){
        res.status(500).json({ message: "Error fetching logs", error: error.message });
    }
};