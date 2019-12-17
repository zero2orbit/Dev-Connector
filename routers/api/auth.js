const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
  


// @route  GET     api/auth
// @Description    Test Router
// @assess         Public
router.get('/', auth, async(req, res) =>{
   
    try {
        const user = await User.findById(req.user.id).select('-password')

        if (!user) {
            throw Error ('Error')
        }

        res.json(user);

    } catch (e) {
        res.status(500).json({ msg:'Error'})
    }

})




router.post('/', [
   
    check('email','Please Enter A valid Email Id').isEmail(),
    check('password','Password is Required').exists()
], async(req, res) =>{
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({error: error.array()})
    }

    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email })
        if (!user) {
           return res.status(400).json({ error:[{ msg: 'Invalid Credential' }] })
        }

        // Match Pasword to token
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ error:[{ msg: 'Invalid Credential' }] })
        }


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


    } catch (e) {
        res.status(500).send('Internal Server Error')
    }

    
})





module.exports = router;