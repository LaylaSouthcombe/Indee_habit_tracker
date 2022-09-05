const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const server = express();
server.use(cors());
server.use(express.json());

const db = require('./dbConfig/init');

const usersRoutes = require('./routes/users')
const carersRoutes = require('./routes/carers')
const habitsRoutes = require('./routes/habits')
const intsRoutes = require('./routes/int_entries')
const blnsRoutes = require('./routes/bln_entries')
const requestsRoutes = require('./routes/requests')
const authRoutes = require('./routes/auth')
server.use('/users', usersRoutes)
server.use('/carers', carersRoutes)
server.use('/habits', habitsRoutes)
server.use('/ints', intsRoutes)
server.use('/blns', blnsRoutes)
server.use('/requests', requestsRoutes)
server.use('/auth', authRoutes)



server.get('/', (req, res) => res.send('Welcome to Indee'))


//CREATE NEW ENTRY FOR EACH USER EVERYDAY
async function addHabitEntryForEveryUser() {
    return new Promise (async (resolve, reject) => {
        try {
            const users = await db.query(`SELECT * FROM users;`)
            for (i = 0; i < users.rows.length; i++) {
                const habitsInfo = await db.query('SELECT * FROM habits_info WHERE user_id = $1', [users.rows[i].id]);
                for(let j = 0; j < habitsInfo.rows.length; j++){
                    if(habitsInfo.rows[j].type === "int"){
                        await db.query(`INSERT INTO int_entries (habit_int_id) VALUES ($1);`, [habitsInfo.rows[j].id]);
                        console.log("data entered for int habit", habitsInfo.rows[j].id)
                    }
                    if(habitsInfo.rows[j].type === "boolean"){
                        await db.query(`INSERT INTO boolean_entries (habit_bln_id) VALUES ($1);`, [habitsInfo.rows[j].id]);
                        console.log("data entered for bln habit", habitsInfo.rows[j].id)
                    }
                }
                console.log(`user entries created for ${users.rows[i].id}`)    
            }
            resolve(`User entries created for users`);
        } catch (err) {
            console.log(err);
            reject('Entry could not be created');
        }
    })
}
// addHabitEntryForEveryUser()
// const job = schedule.scheduleJob('*/1 * * * *', function(){
//     addHabitEntryForEveryUser()
// });


module.exports = server