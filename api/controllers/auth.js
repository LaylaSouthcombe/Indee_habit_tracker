const bcrypt = require('bcrypt');
const User = require('../models/User')
const Carer = require('../models/Carer')

async function registerUser (req, res) { 
    try {
        const user = await User.findUsersByEmail(req.body.email)
        const carer = await Carer.findCarersByNameOrEmail(req.body.email)
        if(!user.length && !carer.length){
            const salt = await bcrypt.genSalt();
            const hashed = await bcrypt.hash(req.body.password, salt);
            console.log(hashed)
            let person = await User.create({...req.body, password: hashed});
            await User.updateLoginDate(person.id)
            res.status(201).json({msg: 'User created', person: {...person, role: "user"}});
        }else {
            throw new Error
        }
    } catch (err) {
        res.status(500).json({err: "This email is already in use, please either login with this email or register with a different one"});
    }
}

 async function registerCarer (req, res) { 
    try {
        const user = await User.findUsersByEmail(req.body.email)
        const carer = await Carer.findCarersByNameOrEmail(req.body.email)
        if(!user.length && !carer.length){
            const salt = await bcrypt.genSalt();
            const hashed = await bcrypt.hash(req.body.password, salt);
            console.log(hashed)
            let person = await Carer.create({...req.body, password: hashed});
            res.status(201).json({msg: 'Carer created', person: {...person, role: "carer"}});
        }else {
            throw new Error('Error in token generation')
        }
    } catch (err) {
        res.status(500).json({err});
    }
}

async function loginUser (req, res) {
    try {
        const user = await User.findUsersByEmail(req.body.email)
        const carer = await Carer.findCarersByNameOrEmail(req.body.email)
        let authed
        let person
        let role
        if(user.length === 1){
            authed = bcrypt.compare(req.body.password, user[0].password_digest)
            person = user[0]
            role = "user"
        }
        if(carer.length === 1){
            authed = bcrypt.compare(req.body.password, carer[0].password_digest)
            person = carer[0]
            role = "carer"
        }
        if(authed){
            if(role === "user"){
                await User.updateLoginDate(person.id)
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