const loanService = require('../services/loan.service');

exports.getLoans = async (req, res) => {
  try {
    const loans = await loanService.getUserLoans(req.user.id);
    res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'LOANS_FETCH_FAILED', message: error.message },
    });
  }
};

exports.applyLoan = async (req, res) => {
  try {
    const loan = await loanService.applyLoan(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Loan approved and funds disbursed successfully',
      data: loan,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'LOAN_APPLICATION_FAILED', message: error.message },
    });
  }
};

exports.repayLoan = async (req, res) => {
  try {
    const { id: installmentId } = req.params;
    const result = await loanService.repayInstallment(req.user.id, installmentId);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: { code: 'LOAN_REPAYMENT_FAILED', message: error.message },
    });
  }
};
