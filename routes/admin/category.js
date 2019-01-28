/**
 * 菜品类别相关的路由
 */
const express = require("express")
const pool = require("../../pool.js")

var router = express.Router()
module.exports = router

/**
 * 查询
 *  API : GET /admin/category
 *  含义: 客户端获取所有菜品类别名称 按编号升序排列
 *  返回值如下：
 *      [{code:1,cname:"..."}]
 */
router.get("/", (req, res) => {
    var sql = "select * from xfn_category order by cid"
    pool.query(sql, (err, result) => {
        if (err) throw err
        res.send(result)
    })
})


/**
 * 删除
*  API : DELETE /admin/category/cid
*  含义: 客户端获取所有菜品类别名称 删除该商品
*  返回值如下：
*      [{code:200,msg：1，cname:"..."}]
*/
router.delete("/:cid", (req, res) => {
    //注意在删除菜品类别之前必须先把该类的菜品类别编号设置为none
    var cid = req.params.cid
    var sql = "update xfn_dish set categoryId=null where categoryId=?"
    pool.query(sql, cid, (err, result) => {
        if (err) throw err
        //至此指定类别的菜品已经修改完毕
        var sql = "delete from xfn_category where cid=?"
        pool.query(sql, cid, (err, result) => {
            if (err) throw err
            //获取delete在数据影响的函数
            if (result.affectedRows > 0) {
                res.send({ code: 200, msg: "1 category deleted" })
            } else {
                res.send({ code: 400, msg: "0 category deleted" })
            }

        })
    })
})
/**
 * 添加
 *  API :POST /admin/category
 *      请求参数：{cname:"xxx"} 
 *  含义: 添加新的菜品类别
 *  返回值如下：
 *      {code:200,msg:"1 category added"}
 */
router.post("/",(req,res)=>{
    var data=req.body; //添加{cname:"恐龙类"}
    var sql="insert into xfn_category set ?"
    pool.query(sql,data,(err,result)=>{
        if(err) throw err
        res.send({code:200,msg:"1 category added"})
    })
})

/**
 * 修改
 *  API : PUT /admin/category
 *      请求主体：{cid:xx,cname:"xxx"} 
 *  含义: 根据菜品类别修改该类别
 *  返回值如下：
 *      {code:200,msg:1 category modified}
 *      {code:400,msg:"1 category modified,not exists"}
 *      {code:401,msg:"1 category modified,not modification"}
 */
router.put("/",(req,res)=>{
    var data=req.body    //{cid:"xx",cname:"xxx"}
    //此处可以对输入数据进行检验
    var sql="update xfn_category set ? where cid=?"
    pool.query(sql,[data,data.cid],(err,result)=>{
        if(err) throw err
        if(result.changedRows>0){
            res.send({code:200,msg:"1 category modified"})
        }else if(result.affectedRows==0){
            res.send({code:400,msg:"1 category modified,not exists"})
        }else if(result.affectedRows==1&&result.changedRows==0){
            res.send({code:401,msg:"1 category modified,not modification"})
        }
    })
})
