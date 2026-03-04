const engineService = require('../services/engine.service');
const seasonalService = require('../services/seasonal.service');

exports.triggerMonthlyEngine = async (req, res) => {
  try {
    const result = await engineService.processMonthlyEngine();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.triggerDailyEngine = async (req, res) => {
  try {
    const result = await engineService.processDailyEngine();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.triggerGlobalEvents = async (req, res) => {
  try {
    const state = await engineService.processGlobalEvents();
    res.status(200).json({ success: true, data: state });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.triggerSeasonResolution = async (req, res) => {
  try {
    const { seasonId } = req.body;
    const results = await seasonalService.resolveSeason(seasonId);
    res.status(200).json({ success: true, message: 'Season resolved', data: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
