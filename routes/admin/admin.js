/**
 * 管理相关的路由
 */
const express=require("express");
const pool=require("../../pool");
var router=express.Router()
module.exports=router

/**
 * 管理员登录
 * API:    GET /admin/login
 * 请求数据:{aname:"xxx",aowd:"xxx"}   get请求有请求主体吗？没有
 *         完成用户登录验证 （提示有的项目在此处选择post请求）
 * 返回数据：
 *      {code:200,msg:"login success"}
 *      {code:400,msg:"anme or apwd err"}
 */
router.get("/:aname/:apwd",(req,res)=>{
    var aname=req.params.aname;
    var apwd=req.params.apwd;
    var sql="select aid from xfn_admin where aname=? and apwd=password(?)"
    pool.query(sql,[aname,apwd],(err,result)=>{
        if(err) throw err
        if(result.length>0){  //查询到一行 登录成功
            res.send({code:200,msg:"login success"})
        }else{  //没有查询到 登录失败
            res.send({code:400,msg:"anme or apwd err"})
        }
    })

})

/**
 * 修改用户
 * API:    PATCH/admin   PATCH和PUT区别：PUT把整行数据修改了 PATCH只是修改部分属性是非幂等
 * 请求数据: {aname:"xxx",oldpwd:"xxx",newpwd:"xxx"}
 * 返回数据：
 *      {code:200,msg:"login success"}
 *      {code:400,msg:"anme or apwd err"}
 *      {code:401,msg:"apwd is not modified"}
 */
router.patch("/",(req,res)=>{
    var data=req.body;
    //首先根据aname和oldpwd查询用户名是否存在 去过查询到了用户名 在修改其密码
    var sql="select aname from xfn_admin where aname=? and apwd=password(?)";
    pool.query(sql,[data.aname,data.oldpwd],(err,result)=>{
        if(err) throw err
        if(result.length>0){
            var sql="update xfn_admin set apwd=password(?) where aname=?"
            pool.query(sql,[data.newpwd,data.aname],(err,result)=>{
                if(err) throw err
                if(result.changedRows>0){ //密码修改完成
                    res.send({code:200,msg:"login success"})
                }else{ //新旧密码一样 未做修改
                    res.send({code:401,msg:"apwd is not modified"})
                }
            })
        }else{
            res.send({code:400,msg:"aname or apwd err"})
        }
    })
})