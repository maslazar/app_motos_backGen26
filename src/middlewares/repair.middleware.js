const { Repair, repairStatus } = require("../models/repair.model");
const AppError = require("../utils/appError");

exports.validRepair = async (req, res, next) => {
  const { id } = req.params;
  const repair = await Repair.findOne({
    where: {
      id,
      status: repairStatus.pending,
    },
  });

  if (!repair) {
    return next(new AppError(`Repair with id ${id} not found`, 404));
  }

  req.repair = repair;
  next();
};
