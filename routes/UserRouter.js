const express=require('express');
const router=express.Router();
const useController=require("../controller/UserController");
const auth=require("../middleware/auth");
const {body}=require('express-validator');


const uservalidation = [
    body('userId').optional(),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('pwd').notEmpty().withMessage('Password is required'),
];

const validatePurchase = (req, res, next) => {
    const { products } = req.body;
  
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'At least one product must be provided' });
    }
  
    for (const product of products) {
      if (!product.pid || !product.quantity || isNaN(product.quantity) || product.quantity <= 0) {
        return res.status(400).json({ error: 'Each product must have a valid pid and a quantity greater than 0' });
      }
    }
  
    next();
  };

router.post('/create',uservalidation,useController.createUser);
router.get('/user',useController.getUser);
router.post('/login',useController.getLogin);
router.post('/purchase',validatePurchase,auth,useController.purchase);
router.get('/me',auth,useController.getme);
router.get('/invoice',auth,useController.getInvoice)


module.exports=router;