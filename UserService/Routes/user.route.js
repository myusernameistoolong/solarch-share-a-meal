const express = require("express");
const router = express.Router();
const user = require("../Models/user.model")();
const userController = require("../Controllers/user.controller");
const SpecialUserController = new userController(user);

//gets all the subscription of a user
router.get("/", SpecialUserController.getUsers);
router.get("/:id", SpecialUserController.getUserById);
router.post("/create", SpecialUserController.create);

module.exports = router;