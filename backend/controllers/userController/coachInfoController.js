const Coach = require("../../models/coach");

const getCoachList = async (req, res) => {
    try {
        const coaches = await Coach.find().populate('accountId');
        res.status(200).json(coaches);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getCoachDetail = async (req, res) => {
    try {
        // const { id } = req.params.id;
        const coach = await Coach.findById(req.params.id).populate("accountId");
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }
        res.status(200).json(coach);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCoachList,
    getCoachDetail,
}


