const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

// @route GET api/auth
// @desc Test Route
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = User.findById(req.user.id).select('-password').catch(() =>{});
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});


router.post('/',[
    check('email', 'Please include a valid Email').isEmail(),
    check('password', 'Password is required').exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }   

    const { email, password} = req.body;

    try {

        let user = User.findOne({ email }).catch(() => {});

        if(!user) {
            console.log("Test 1");
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials '}] });
            
        }

        const isMatch = bcrypt.compare(password, user.password).catch(() => {})
        
        if(!isMatch) {
            console.log("Test 1");
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials '}] });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            });
            
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
});

module.exports = router;