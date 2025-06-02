const { EntityNotFoundError, InvalidOperationError } = require("../errors")
const Meal = require("../models/meal.model");
const User = require("../models/user.model")
const MealEvent = require("../models/mealEvent.model")
const publisher = require("../publishers/mealQueue.publisher")

async function create(req, res, next){
    //Manual Validation
    ////OfferedBy Validation
    const eventName = "MealCreated"
    let offeredBy = await User.findOne({"email": req.body.offeredBy})
    if(offeredBy == null){
        next(new EntityNotFoundError("Could not find offeredBy email"))
    }

    let model = req.body
    model.offeredBy = offeredBy


    const newMeal = new Meal(model)
    try{
        await newMeal.validate();
        await newMeal.save()
        let result = newMeal.toObject()
        result.participants = await _getParticipants(newMeal)
        publisher.postToExchange(JSON.stringify(result), eventName)
        res.status(201).json(result)
    }
    catch(err){
        next(err);
    }
}

async function update(req, res, next){
    const eventName = "MealUpdated"
    let mealToUpdate = await Meal.findOne({"_id": req.params.id});
    req.body._id = req.params.id
    try{
        if(mealToUpdate){
            mealToUpdate.set(req.body)
            await mealToUpdate.validate()
            await mealToUpdate.save()
            await mealToUpdate.populate("offeredBy")
            let result = mealToUpdate.toObject()
            result.participants = await _getParticipants(mealToUpdate)
            publisher.postToExchange(JSON.stringify(result), eventName)
            res.status(201).json(result)
        }
        else{
            throw new EntityNotFoundError("Could not find mealId.")
        }
    }
    catch(err){
        next(err)
    }
}

async function getAll(req, res, next){
    try{
        let meals = await Meal.find(req.query)
        res.status(200).json(meals);
    }
    catch(err){
        next(err)
    }
}

async function getById(req, res, next){
    try{
        let meal = await Meal.findById(req.params.id)
        if(meal){
            await meal.populate("offeredBy")
            let result = meal.toObject()
            result.participants = await _getParticipants(meal)
            res.status(200).json(result)
        }
        else{
            throw new EntityNotFoundError("Could not find meal")
        }
    }
    catch(err){
        next(err)
    }
}

async function deleteById(req, res, next){
    const eventName = "MealDeleted"
    try{
        let deletedMeal = await Meal.findByIdAndDelete(req.params.id)
        if(deletedMeal){
            await deletedMeal.populate("offeredBy")
            let result = deletedMeal.toObject()
            result.participants = await _getParticipants(deletedMeal)
            publisher.postToExchange(JSON.stringify(result), eventName)
            res.status(200).json(result)
        }
        else{
            throw new EntityNotFoundError("Could not find meal")
        }
    }
    catch(err){
        next(err)
    }

}

async function userJoinMeal(req, res, next){
    const eventName = "UserJoinedMeal"
    try{
        let user = await User.findOne({"email": req.body.userEmail})        
        let meal = await Meal.findOne({"_id": req.body.mealId})
        if(user == null) throw new EntityNotFoundError("Could not find user")
        if(meal == null) throw new EntityNotFoundError("Could not find meal")

        let currentParticipants = await _getParticipants(meal)
        if(!currentParticipants.includes(user.email)){
            await meal.populate("offeredBy")
            let result = {user, meal: meal.toObject()}
            currentParticipants.push(user.email)
            result.meal.participants = currentParticipants
            publisher.postToExchange(JSON.stringify(result), eventName)
            res.status(200).json(result)
        }
        else{
            throw new InvalidOperationError("User is already participating in meal")
        }
    }
    catch(err){
        next(err)
    }
}

async function userLeavesMeal(req, res, next){
    const eventName = "UserLeavesMeal"
    try{
        let user = await User.findOne({"email": req.body.userEmail})        
        let meal = await Meal.findOne({"_id": req.body.mealId})
        if(user == null) throw new EntityNotFoundError("Could not find user")
        if(meal == null) throw new EntityNotFoundError("Could not find meal")

        let currentParticipants = await _getParticipants(meal)
        if(currentParticipants.includes(user.email)){
            await meal.populate("offeredBy")
            let result = {user, meal: meal.toObject()}
            result.meal.participants = await currentParticipants.filter((p)=>p != user.email)
            publisher.postToExchange(JSON.stringify(result), eventName)
            res.status(200).json(result)
        }
        else{
            throw new InvalidOperationError("User isn't participating in meal")
        }
    }
    catch(err){
        next(err)
    }
}

async function _getParticipants(meal){
    let participants = []
    let events = await MealEvent.find({meal: meal.id}).sort({date: 1})
    events.forEach((e)=>{
        if(e.type == "LEAVED"){
            participants = participants.filter((p)=>(p != e.email))
        }
        else if(e.type == "JOINED"){
            if(!participants.includes(e.email)){
                participants.push(e.email)
            }
        }
    })
    return participants
}

module.exports = {
    create,
    update,
    getAll,
    getById,
    deleteById,
    userJoinMeal,
    userLeavesMeal
}