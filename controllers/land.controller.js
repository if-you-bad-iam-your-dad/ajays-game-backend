const agriService = require('../services/agri.service');

exports.getLands = async (req, res) => {
  try {
    const lands = await agriService.getUserLands(req.user.id);
    res.status(200).json({
      success: true,
      data: lands,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'LANDS_FETCH_FAILED', message: error.message },
    });
  }
};

exports.createFarmPlan = async (req, res) => {
  try {
    const plan = await agriService.createFarmPlan(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Farm plan created successfully',
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'FARM_PLAN_FAILED', message: error.message },
    });
  }
};

exports.getActiveSeason = async (req, res) => {
  try {
    const season = await agriService.getActiveSeason();
    res.status(200).json({
      success: true,
      data: season,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'SEASON_FETCH_FAILED', message: error.message },
    });
  }
};
