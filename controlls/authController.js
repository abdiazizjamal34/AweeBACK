    const User = require('../model/User');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');


    // Register a new user

    const Register = async (req , res)  =>{
        const {name, email, password, phone} = req.body;

        try{
          const  userExists = await User.findOne({email});
            if(userExists){
                return res.status(400).json({message : 'User already exists'});
            }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            phone
        });
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {
            expiresIn : '7d'
        });


        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            phone : user.phone,
            role : user.role,
            token
        });



        } catch (error) {
            console.error(error); // Logs to terminal
            return res.status(500).json({ 
                message: 'Server error',
                error: error.message || error.toString()
            });
        }
        

    };


    // Login a user

    const Login = async (req, res) => {
        const { email, password } = req.body;
      
        try {
          // Check if user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }
      
          // Compare passwords
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }
      
          // Create JWT token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
          });
      
          // Respond with user data and token
          res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token,
          });
        } catch (error) {
          console.error('Login Error:', error);
          res.status(500).json({
            message: 'Server error',
            error: error.message,
          });
        }
      };
      
    module.exports = { 
        Register,
        Login
    };
