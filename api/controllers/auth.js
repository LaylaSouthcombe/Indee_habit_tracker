const bcrypt = require('bcrypt');
const User = require('../models/User')
const Carer = require('../models/Carer')

async function registerUser (req, res) { 
// assuming a body of eg. { username: 'Gingertonic', email: 'email@address.com, password: 'weak-password!' }
    try {
        const salt = await bcrypt.genSalt(); // generate salt
        const hashed = await bcrypt.hash(req.body.password, salt); // hash password and add salt
        console.log(hashed)
        await User.create({...req.body, password: hashed}); // insert new user into db
        res.status(201).json({msg: 'User created'});
    } catch (err) {
        res.status(500).json({err});
    }
}

 async function registerCarer (req, res) { 
    // assuming a body of eg. { username: 'Gingertonic', email: 'email@address.com, password: 'weak-password!' }
    try {
        const salt = await bcrypt.genSalt(); // generate salt
        const hashed = await bcrypt.hash(req.body.password, salt); // hash password and add salt
        await Carer.create({...req.body, password: hashed}); // insert new user into db
        res.status(201).json({msg: 'Carer created'});
    } catch (err) {
        res.status(500).json({err});
    }
}

async function loginUser (req, res) {
// assuming a body of eg. { email: 'email@address.com, password: 'weak-password!' }
// console.log(req)
    try {
        const user = await User.findUsersByNameOrEmail(req.body.email)
        const carer = await Carer.findCarersByNameOrEmail(req.body.email) // find user record
        console.log("auth controller user", user)
        console.log("auth controller carer", carer)
        let authed
        let person
        let role
        if(user.length === 1){
            console.log("user used")
            authed = bcrypt.compare(req.body.password, user[0].password_digest) // compare given password to stored hashed password
            person = user[0]
            role = "user"
        }
        if(carer.length === 1){
            console.log("carer used")
            authed = bcrypt.compare(req.body.password, carer[0].password_digest) // compare given password to stored hashed password
            person = carer[0]
            role = "carer"
        }
        console.log(person)
        if (authed){
            console.log("authed")
            res.status(200).json({ ...person, role: role })
        } else {
            throw new Error('User could not be authenticated')  
        }
    } catch (err) {
        res.status(403).json({ err });
    }
}

module.exports = {registerCarer, registerUser, loginUser}