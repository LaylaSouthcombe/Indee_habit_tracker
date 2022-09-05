const Habit = require('../models/Habit');

async function showUsersHabitsAndCurrent(req, res) {
    try {
        const habits = await Habit.getUsersHabitsAndCurrent(req.body.user_id);
        res.status(200).json(habits)
    } catch (err) {
        res.status(500).json({err})
    }
}

async function create (req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(200).json(habit)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function deleteHabit (req, res) {
    try {
        console.log(req.body)
        const habit = await Habit.destroy(req.body);
        res.status(200).json(habit)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function update (req, res) {
    try {
        const habit = await Habit.update(req.body);
        res.status(200).json(habit)
    } catch (err) {
        res.status(422).json({err})
    }
}

module.exports = { update, create, showUsersHabitsAndCurrent, deleteHabit }
