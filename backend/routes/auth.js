
const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');   //REQUIRED FOR VALIDATING DATA
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchuser');


//ROUTE:1 CREATE A NEW USER AND ADD VALDATION USING POST /api/auth/createuser

router.post('/createuser',        //1st parameter is path afte routes
    [body('name').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),    //2nd parameter is for validating data
    body('email').isEmail()],
    async (req, res) => {         //3rd parameter is to get response/request
                   
        //find the errors in valdation & return it in object
        const errors = validationResult(req);   
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //HASH PASSWORD AND ADDING SALT IN PASSWORD
        const salt = await bcrypt.genSalt(5);
        const hashPass = await bcrypt.hash(req.body.password, salt);



        //CHECK THE USER IS ALREADY EXIST OR NOT
        let everyNewUser = await User.findOne({ email: req.body.email })
        if (everyNewUser) {
            return res.status(400).json({ error: "User with this email is already exists" })
        }
        //CREATING A NEW USER USER IN DB
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
        })
        //GENERATING TOKEN FOR SECURE COMMUNICATION USING JSON WEBTOKEN
        const JWT_SECRET = 'eddkljikrjiireoi';   // CREATING A JWT SECRET STRING
        const data = {
            user:{
                id:user._id
            }
        }

        const token = jwt.sign(data, JWT_SECRET)
        res.json({ token })
    });

//ROUTE:2 AUTHENTICATE A USER ON LOGIN PAGE USING POST /api/auth/longin
router.post('/login', [
    body('password', "Please enter a valid password").exists(),
    body('email', "Invalid Email Format").isEmail()
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }


    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Please enter a valid  email" })
        }


        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please enter correct information" })
        }
        const payload = {
            id: user.id
        }
        const JWT_SECRET = 'eddkljikrjiireoi';   // CREATING A JWT SECRET STRING
        const token = jwt.sign(payload, JWT_SECRET)
        res.json({ token })
    } catch (error) {
        console.log(error.message);
    }
})

//ROUTE:3 GET USER DETAIL USING POST /api/auth/getuser

router.post('/getuser', fetchUser, async (req, res) => {

    try {
        uId = req.id;
        const user = await User.findById(uId).select('-password')
      res.json(user);
        
    } catch (error) {
        console.log(error.message);
    }
   
})


module.exports = router; 