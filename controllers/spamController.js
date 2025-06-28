const { SpamReport } = require("../models");

exports.reportSpam = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    await SpamReport.create({ phone, reporterId: req.user.id });
    res.status(201).json({ message: "Number marked as spam" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as spam", error });
  }
};
