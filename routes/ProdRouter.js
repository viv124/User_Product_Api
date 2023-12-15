const express=require('express');
const router=express.Router();
const prodController=require('../controller/prodController');
const {body} = require('express-validator');
const auth=require('../middleware/auth');

const prodValidator=[
    body('pid').isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('name').isLength({min:3,max:20}).withMessage("character size must 3 to 20"),
    body('price').isInt().withMessage("price must be integer")
];

router.post('/create',prodValidator,prodController.createProduct);
router.get('/',prodController.sortProduct);
router.post('/comment',auth,prodController.postComment);

module.exports=router;