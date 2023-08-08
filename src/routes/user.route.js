const express = require("express");
const router = express.Router();

//Controllers
const userController = require("../controllers/user.controller");

//Middlewares
const userMiddleware = require("../middlewares/user.middleware");
const validationMiddlewares = require("../middlewares/validation.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router
  .route("/")
  .get(userController.findAllUsers)
  .post(validationMiddlewares.createUserValidation, userController.createUser);

router.post(
  "/login",
  validationMiddlewares.loginUserValidation,
  userMiddleware.validLoginUser,
  userController.login
);

router.use(authMiddleware.protect);

router
  .route("/:id")
  .get(userMiddleware.validUser, userController.findOneUser)
  .patch(
    validationMiddlewares.updateUserValidation,
    userMiddleware.validUser,
    authMiddleware.protectAccountOwner,
    userController.updateUser
  )
  .delete(
    userMiddleware.validUser,
    authMiddleware.protectAccountOwner,
    userController.deleteUser
  );

module.exports = router;
