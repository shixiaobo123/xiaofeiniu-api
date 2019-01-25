/**
 * 小肥牛扫码点餐系统
 */
const PORT=8090;
const express=require("express");

var app=express();
app.listen(PORT,()=>{
    console.log("Server listening"+"PORT")
})