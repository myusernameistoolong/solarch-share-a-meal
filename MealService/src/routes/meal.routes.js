const express = require('express')
const router = express.Router()

const mealController = require("../controllers/meal.controller")

router.get("/", mealController.getAll)
router.get("/:id", mealController.getById)
router.post("/", mealController.create)
router.put("/:id", mealController.update)
router.delete("/:id",  mealController.deleteById)
router.post("/join", mealController.userJoinMeal)
router.post("/leave", mealController.userLeavesMeal)

module.exports = router
