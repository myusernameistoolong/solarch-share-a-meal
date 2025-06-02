const express = require('express')
const router = express.Router()

const CrudController = require('../controllers/mealRating')
const RatingController = require('../controllers/rating')

const RatingCrudController = new CrudController()
const GenericRatingController = new RatingController()

// create a rating
router.post('/', RatingCrudController.create)

// get all ratings
router.get('/', RatingCrudController.getAll)

// get a rating
router.get('/:id', RatingCrudController.getOne)

// update a rating
router.put('/:id', RatingCrudController.update)

// remove a rating
router.delete('/:id', RatingCrudController.delete)

// get average rating
router.get('/average-rating/:id/', GenericRatingController.getAverageRatingByMealId)

module.exports = router
