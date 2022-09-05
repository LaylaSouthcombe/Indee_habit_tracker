const bcrypt = require('bcrypt');
const User = require('../models/User')
const Carer = require('../models/Carer')

async function registerUser (req, res) { 
// assuming a body of eg. { username: 'Gingertonic', email: 'email@address.com, password: 'weak-password!' }
    try {
        console.log(req.body)
        const salt = await bcrypt.genSalt(); // generate salt
        const hashed = await bcrypt.hash(req.body.password, salt); // hash password and add salt
        console.log(hashed)
        let person = await User.create({...req.body, password: hashed}); // insert new user into db
        await User.updateLoginDate(person.id)
        console.log("created person", person)
        res.status(201).json({msg: 'User created', person: {...person, role: "user"}});
    } catch (err) {
        res.status(500).json({err});
    }
}

 async function registerCarer (req, res) { 
    // assuming a body of eg. { username: 'Gingertonic', email: 'email@address.com, password: 'weak-password!' }
    try {
        const salt = await bcrypt.genSalt(); // generate salt
        const hashed = await bcrypt.hash(req.body.password, salt); // hash password and add salt
        let person = await Carer.create({...req.body, password: hashed}); // insert new user into db
        res.status(201).json({msg: 'Carer created', person: {...person, role: "carer"}});
    } catch (err) {
        res.status(500).json({err});
    }
}

async function loginUser (req, res) {
// assuming a body of eg. { email: 'email@address.com, password: 'weak-password!' }
console.log(req.body.email)
    try {
        const user = await User.findUsersByEmail(req.body.email)
        const carer = await Carer.findCarersByNameOrEmail(req.body.email) // find user record
        let authed
        let person
        let role
        console.log("user in auth", user)
        if(user.length === 1){
            authed = bcrypt.compare(req.body.password, user[0].password_digest) // compare given password to stored hashed password
            person = user[0]
            role = "user"
        }
        if(carer.length === 1){
            authed = bcrypt.compare(req.body.password, carer[0].password_digest) // compare given password to stored hashed password
            person = carer[0]
            role = "carer"
        }
        if(authed){
            if(role === "user"){
                console.log("person.id", person.id)
                const lastLogin = await User.updateLoginDate(person.id)
                // console.log(lastLogin)
            }
            res.status(200).json({msg: 'Logged in', person: { ...person, role: role }})
        } else {
            throw new Error('User could not be authenticated')  
        }
    } catch (err) {
        res.status(403).json({ err });
    }
}

module.exports = {registerCarer, registerUser, loginUser}