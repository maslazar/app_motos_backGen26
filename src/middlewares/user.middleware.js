const { User, userStatus } = require("../models/user.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({
    where: {
      id,
      status: userStatus.active,
    },
  });
  if (!user) {
    return next(new AppError(`User with id ${id} not found`, 404));
  }

  req.user = user;
  next();
});

exports.validLoginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: userStatus.active,
    },
  });

  if (!user) {
    return next(new AppError(`User with email: ${email} not found`, 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Password or email is wrong", 401));
  }

  req.user = user;
  next();
});
