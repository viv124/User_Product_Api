const { product ,User}=require('../models/userModel');
const {validationResult}=require('express-validator');

exports.createProduct=async(req,res)=>{
    try{
          const error=validationResult(req);
          if(!error.isEmpty())
          {
            return res.status(400).json({ errors: error.array() });
          }
          console.log("product");
          const {pid,name,price}=req.body;
          const prodCreate = new product({ pid,name,price });
          await prodCreate.save();
          res.status(201).json({ message: 'User created successfully', prod: prodCreate });
    }catch(error)
    {
        console.log(error);
    }

};



exports.sortProduct=async(req,res)=>{
   
    const {sort, pageNumber1, limit,sortKey } = req.query;
    try {
        const pageNumber = parseInt(pageNumber1) || 1
        const val=parseInt(sort) || 1;
        const l=parseInt(limit) || 2;
        const skip=(pageNumber-1)*l;
        if(!(val===1 || val==-1))
        {
            return res.status(400).json({message:"sort by only -1 or 1"});
        }
        const sortp = sortKey || "price";
        const sortObj={};
        sortObj[sortp]=val;

        const totalItems = await product.countDocuments();

        const adjustedLimit = Math.min(l, totalItems - skip);

        if (adjustedLimit <= 0) {
            return res.json({ message: "No more data available" });
        }


        const prod = await product.find().sort(sortObj).skip(skip).limit(adjustedLimit).exec();
        if(!prod)
        {
            return res.status(400).json({message:"product not found"});
        }
        res.status(200).json({prod});
    } catch (error) {
        console.error(error);
    }
};

exports.postComment = async (req, res) => {
     
     const {pid,rating,comment}=req.query;
     var email=req.locals.value;
     const ratingU=parseFloat(rating);
     try{
           const prod=await product.findOne({pid:pid});
           if(!prod)
           {
              return res.status(400).json({message:"Not found product "});
           }
           const user=await User.findOne({email});
           if(!user)
           {
              return res.status(400).json({message:"Not found user "});
           }

           prod.Comment.push({email,ratingU,comment});
           await prod.save();
       
           const totalRatingUSum = prod.Comment.reduce((sum, comment) => {
            return sum + (comment.ratingU || 0);
        }, 0);
        const averageRatingU = totalRatingUSum / prod.Comment.length;
        
        await product.updateOne({pid:pid},{$set:{rating:averageRatingU}});
        res.status(201).json({ message: 'Comment posted successfully', prod});
           
     }
     catch(error)
     {
        console.log(error);
     } 
};




