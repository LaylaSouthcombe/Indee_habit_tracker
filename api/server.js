const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());

const usersRoutes = require('./routes/users')
const carersRoutes = require('./routes/carers')
const habitsRoutes = require('./routes/habits')
const intsRoutes = require('./routes/int_entries')
const blnsRoutes = require('./routes/bln_entries')
server.use('/users', usersRoutes)
server.use('/carers', carersRoutes)
server.use('/habits', habitsRoutes)
server.use('/ints', intsRoutes)
server.use('/blns', blnsRoutes)


server.get('/', (req, res) => res.send('Welcome to Indey'))

module.exports = server