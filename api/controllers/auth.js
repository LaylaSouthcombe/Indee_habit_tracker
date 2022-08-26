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
    try {
        const user = await User.findByEmail(req.body.email) // find user record
        const authed = bcrypt.compare(req.body.password, user.passwordDigest) // compare given password to stored hashed password
        if (authed){
            res.status(200).json({ user })
        } else {
            throw new Error('User could not be authenticated')  
        }
    } catch (err) {
        res.status(403).json({ err });
    }
}

module.exports = {registerCarer, registerUser, loginUser}