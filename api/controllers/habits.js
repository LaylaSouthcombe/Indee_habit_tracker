const Habit = require('../models/Habit');

async function index (req, res) {
    try {
        const habits = await Habit.all;
        res.status(200).json(habits)
    } catch (err) {
        res.status(500).json({err})
    }
}

async function showUsersHabitsAndCurrent(req, res) {
    try {
        // console.log(req.body.user_id)
        const habits = await Habit.getUsersHabitsAndCurrent(req.body.user_id);
        // console.log(habits)
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

// async function destroy (req, res) {
//     try {
//         const habit = await Habit.findById(req.body.id);
//         await habit.destroy();
//         res.status(204).end();
//     } catch (err) {
//         res.status(404).json({err});
//     };
// }

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

async function showWeekMetrics (req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(200).json(habit)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function showMonthMetrics(req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(200).json(habit)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function showAlltimeMetrics (req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(200).json(habit)
    } catch (err) {
        res.status(422).json({err})
    }
}

async function showSummary (req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(200).json(habit)
    } catch (err) {
        res.status(422).json({err})
    }
}

module.exports = { index, update, create, showWeekMetrics, showMonthMetrics, showAlltimeMetrics, showSummary, showUsersHabitsAndCurrent, deleteHabit }
