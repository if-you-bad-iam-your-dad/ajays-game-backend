const advancedService = require('../services/advanced.service');

exports.buyInsurance = async (req, res) => {
  try {
    const policy = await advancedService.buyInsurance(req.user.id, req.body);
    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const membership = await advancedService.joinGroup(req.user.id, req.body.groupId);
    res.status(201).json({ success: true, data: membership });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.setBudget = async (req, res) => {
  try {
    const budget = await advancedService.setBudget(req.user.id, req.body);
    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.invest = async (req, res) => {
  try {
    const investment = await advancedService.invest(req.user.id, req.body);
    res.status(201).json({ success: true, data: investment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
