const { Repair } = require("../models/repair.model");
const catchAsync = require("../utils/catchAsync");

//?Find all repairs with status pending - method GET
exports.findAllRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    where: {
      status: "pending",
    },
  });
  return res.status(200).json({
    status: "succes",
    message: "Repairs retrieved successfully",
    repairs,
  });
});

//?Create repair - method POST
exports.createRepair = catchAsync(async (req, res, next) => {
  const { id: userId } = req.sessionUser;
  const { date, motorsNumber, description } = req.body;
  const repair = await Repair.create({
    date,
    userId,
    motorsNumber,
    description,
  });
  return res.status(201).json({
    status: "success",
    message: "Repair created successfully",
    repair,
  });
});

//?Find one repair - method GET :id
exports.findOneRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;
  return res.status(200).json({
    status: "success",
    message: "Repair retrieved successfully",
    repair,
  });
});

//?Update repair, only status pending to complete - method PATCH :id
exports.updateRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  const repairUpdate = await repair.update({
    status: "completed",
  });

  return res.status(200).json({
    status: "success",
    message: "Repair update successfully to completed",
    repairUpdate,
  });
});

//?Cancel repair, only status pendindg to completed - method DELETE :id
exports.deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  if (repair.status === "completed") {
    return res.status(404).json({
      staus: "error",
      message: "Repair with status completed cannot be a canceled",
    });
  }

  const repairDelete = await repair.update({
    status: "cancelled",
  });

  return res.status(200).json({
    status: "succes",
    message: `Repair with id ${repairDelete.id} cancelled successfully`,
    result: repairDelete,
  });
});
