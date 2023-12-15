const { default: mongoose } = require('mongoose');
const {User,Bill,product}=require('../models/userModel');
const jwt=require('jsonwebtoken');
const {validationResult}=require('express-validator');

exports.createUser=async(req,res)=>{

   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
      const { userId, email, pwd } = req.body;
      const newUser = new User({ userId, email, pwd });
      await newUser.save();

      res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUser = async (req, res) => {
   try {
       const users = await User.find();
       console.log(users);
       res.status(200).json(users);
   } catch (error) {
       console.error("Error retrieving users:", error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
};

exports.getLogin=async(req,res)=>{

   const { email, pwd } = req.body;

   try {
       const user = await User.findOne({ email, pwd });
   
       if (user) {
           console.log('Login successful for user:', user);
           const token = jwt.sign({ email: user.email }, "vivek", { expiresIn: '1h' });
           res.json({message:token}); 
         } else {
           console.log('Login failed. Invalid credentials');
           res.status(401).json({ error: 'Invalid credentials' });
       }
   } catch (error) {
       console.error('Error during login:', error);
       res.status(500).json({ error: 'Internal Server Error' });
   }
};

exports.getme=async(req,res)=>{
     try{
      res.status(200).json({message:"Token for mini used"});
     }
     catch(error)
     {
      res.status(500).json(error);
     }
};
exports.purchase = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }
      const user = await User.findOne({ email: req.locals.value });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const data = req.body;
      const ar = data.products;
      
  
      const prices = await Promise.all(ar.map(async (n) => {
      
        
        const prod = await product.findOne({ pid: n.pid });
        console.log(prod.price);
        return n.quantity * prod.price;
      }));
  
      const total = prices.reduce((acc, price) => acc + price, 0);
       
      const newBill = {
        email:req.locals.value,
        billId:isNaN(Bill.length) ? 0 + 1 : Bill.length + 1,
        total:total,
        product:ar,
        timestamp: new Date()
      };
  
      const bill=new Bill(newBill);
  
      await bill.save();
  
      res.status(200).json({ message: "Purchase successful", newBill: bill });
    } catch (error) {
      console.error('Error during purchase:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
 
exports.getInvoice=async(req,res)=>{
    
    try{
    const bill=await Bill.find({email : req.locals.value}).sort({timestamp:-1});
    if(!bill)
    {
        return res.status(401).json({message:"not bill"});
    }
     res.status(200).json(bill);
    }
    catch(error)
    {
        console.log(error);
    }
};





