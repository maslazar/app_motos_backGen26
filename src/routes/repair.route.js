const express = require("express");
const router = express.Router();

//Controllers
const repairController = require("../controllers/repair.controller");
//Middlewares
const repairMiddleware = require("../middlewares/repair.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware.protect);

router.post(
  "/",
  validationMiddleware.createRepairValidation,
  repairController.createRepair
);

router.use(authMiddleware.allowTo("employee"));

router.get("/", repairController.findAllRepairs);

router
  .route("/:id")
  .get(repairMiddleware.validRepair, repairController.findOneRepair)
  .patch(repairMiddleware.validRepair, repairController.updateRepair)
  .delete(repairMiddleware.validRepair, repairController.deleteRepair);

module.exports = router;
