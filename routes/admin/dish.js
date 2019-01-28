/**
 * 菜品相关的路由
 */
const express=require("express");
const pool=require("../../pool");
const router=express.Router();
module.exports=router

/**
 * API  GET /admin/dish
 * 获取所有的菜品(按类别进行分类)
 * 返回数据类型
 * [
 *    {cid:1,cname:"",dishList:[{},{},{}]}
 *    {cid:2,cname:"",dishList:[{},{},{}]}
 * ]
 */

 router.get("/",(req,res)=>{
    var sql="select cid,cname from xfn_category"; 
    pool.query(sql,(err,result)=>{
        if(err) throw err
        var categoryList=result
        var count=0;
        for(var c of categoryList){
            var sql="select * from xfn_dish categoryId=?";
            pool.query(sql,c.cid,(err,result)=>{
                if(err) throw err
                c.dishList=result
                count++;
                
            })
        }
        if(count==categoryList.length){
            res.send(categoryList)
        }
    })
 })