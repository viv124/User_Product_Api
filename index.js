const express=require('express');
const connectDb=require('./config/connectDb');
const UseRoute=require("./routes/UserRouter");
const ProdRouter=require("./routes/ProdRouter");
const bodyParser=require("body-parser");
// const mongoose=require('mongoose');


// async function main() {
//     await connectDb();
//   }
  
// main();
const app=express();
app.use(bodyParser.json());
app.use('/api',UseRoute);
app.use('/prod',ProdRouter);
app.listen(3050,()=>{
    console.log(`server is running on port`);
});


