const express = require("express");
const { updateUserRole } = require("../controllers/adminController");
const authenticate  = require("../middleware/auth");
const authorize  = require("../middleware/admin");

const router = express.Router();

router.put("/:id/updateRole", authenticate, authorize("SUPERADMIN"), updateUserRole);

module.exports = router;
