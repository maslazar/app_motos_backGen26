const { User, userStatus } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/jws");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//?Login user - methos POST /signin
exports.login = catchAsync(async (req, res, next) => {
  const { user } = req;

  const token = await generateJWT(user.id);

  return res.status(200).json({
    status: "succes",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//?Create user  method POST
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  return res.status(201).json({
    status: "success",
    message: "User created successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//?Update user - method PATCH :id
exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, currentPassword, newPassword } = req.body;

  if (currentPassword === newPassword) {
    return next(new AppError("The password cannot be equals", 400));
  }

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError("Incorrect password", 401));
  }

  const salt = await bcrypt.genSalt(12);
  const ecryptedPassword = await bcrypt.hash(newPassword, salt);

  const userUpdate = await user.update({
    name,
    password: ecryptedPassword,
  });
  return res.status(200).json({
    status: "success",
    message: "User update successfully",
    user: {
      id: userUpdate.id,
      name: userUpdate.name,
      email: userUpdate.email,
    },
  });
});

//?Find all users - method GET
exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: "available",
    },
    attributes: {
      exclude: ["password"],
    },
  });
  return res.status(200).json({
    status: "success",
    message: "Users retrieved successfully",
    users,
  });
});
//?Find one user - method GET :id
exports.findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  return res.status(200).json({
    status: "success",
    message: "User retrieved succesfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});
//?Soft delete user - method DELETE :id
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const userDelete = await user.update({
    status: userStatus.disabled,
    attributes: {
      exclude: ["password"],
    },
  });

  return res.status(200).json({
    status: "success",
    message: `User with id ${userDelete.id} deleted successfully`,
    result: userDelete,
  });
});
