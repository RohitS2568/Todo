const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token = require("../middleware/auth");
// ADD New User (Sign-UP) //
router.post("/sign-up",async (req, res) => {

    // Get user input //
        const {  email, password } = req.body;
    
         //Encrypt user password
        const hashPassword = await bcrypt.hash(password, 10); 
    
        // Create user in our database
        const newUser = new User({
          
            email,
            password: hashPassword
        });
    
         // check if user already exist
    //    Validate if user exist in our database
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
    
        // Create token
        const token = jwt.sign(
            { user_id: newUser._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          //save user token
          newUser.token = token;
      
    
        try{
        const savedUser  = await newUser.save();
        res.status(201).json(savedUser);
        
    } catch(err) {
        res.status(500).json(err);
        }
    });
    
    
// LOGIN (Sign-in) //
router.post("/sign-in",async (req,res) => {
        const {email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ error: "Email and password required"});
        }
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'invalid email or password'});
            }
             // SIGN token
    
            const token = jwt.sign(
            { user_id: user._id, email,  },
            
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          // save user token
          user.token = token;
    // Check Password //
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid email or password'});
            }
            return res.json({ message: 'user logged in succesfully','user':user});
    0    } catch (error) {
        return res.status(500).json({ error: error.message});
    }
    });

   
 module.exports = router;