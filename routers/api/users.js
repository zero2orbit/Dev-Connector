const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravator = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../../models/Users')

// @route          POST api/users
// @Description    Register User
// @assess         Public
router.post('/', [
    check('name', 'Name is Required').not().isEmpty(),
    check('email','Please Enter A valid Email Id').isEmail(),
    check('password','Password Should be 6 or More Charecter').isLength({ min:3 })
], async(req, res) =>{
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({error: error.array()})
    }

    const { name, email, password } = req.body;

    try {
        
        let user = await User.findOne({ email })
        if (user) {
           return res.status(400).json({ error:[{ msg: 'User Is Already Exist' }] })
        }

        // Global Avatar Set Up
        const avatar = gravator.url(email, {
            s:'200',
            r:'pg',
            d:'mm'
        })

        // Create User Object To Save
        user = new User({
            name,
            email,
            avatar,
            password
        })

        // Password Hashing
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        // Save The User
        await user.save();

        // Return Token For Login
        // Create Payload
        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtKey'),
            { expiresIn: 360000},
            (err, token) => {
                if (err) {
                    throw err
                }
                res.json({ token });
            })

            console.log('Sucess');
            
    } catch (e) {
        console.error(e.message)
        res.status(500).send('Internal Server Error')
    }

    
})


module.exports = router;