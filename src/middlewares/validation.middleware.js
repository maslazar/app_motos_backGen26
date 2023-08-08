const { body, validationResult } = require("express-validator");
const { User } = require("../models/user.model");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.mapped(),
    });
  }

  next();
};

exports.createUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("The format has to be a email")
    .custom(
      async (value) => {
        const email = await User.findOne({
          where: {
            email: value,
          },
        });
        if (email) {
          throw new Error(`Email ${value} already exists`);
        }
      }
      // User.findOne({ where: { email: value } }).then((email) => {
      //   if (email) {
      //     return Promise.reject(`Email ${value} already exists`);
      //   }
      // })

      // return User.findOne({
      //   where: {
      //     email: value,
      //   },
      // }).then((email) => {
      //   if (email) {
      //     return Promise.reject(`Email ${value} already exists`);
      //   }
      // });
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must have a least 8 characters")
    .matches(/[a-zA-z]/)
    .withMessage("Password must have contain a least one letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  validateFields,
];

exports.updateUserValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must have a least 8 characters")
    .matches(/[a-zA-z]/)
    .withMessage("Password must have contain a least one letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),
  validateFields,
];

exports.loginUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("The format has to be a email"),
  body("password").notEmpty().withMessage("Password is required"),
  validateFields,
];

exports.createRepairValidation = [
  body("date").notEmpty().withMessage("Date is required"),
  body("motorsNumber").notEmpty().withMessage("Motor number is required"),
  body("description").notEmpty().withMessage("Description is required"),
  validateFields,
];
