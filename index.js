/**
 * 小肥牛扫码点餐项目API子系统
 */

const PORT = 8090;
const express=require("express");
const cors=require("cors");
const bodyParser=require("body-parser")

const categotyRouter=require("./routes/admin/category")
const adminRouter=require("./routes/admin/admin")

//创建http应用服务器
var app=express();
app.listen(PORT,()=>{
    console.log("server listening "+PORT);
})

//跨域
app.use(cors({
    origin:["http://localhost:5500","http://127.0.0.1:5500"],
    credentials:true //要求客户端必须带cookie
}))
//
app.use(bodyParser.json())  //把json格式的请求主体数据解析出来放入res.body中
//挂载服务器
app.use("/admin/category",categotyRouter);
app.use("/admin/login",adminRouter)

