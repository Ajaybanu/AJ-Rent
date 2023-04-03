var express = require('express');
var router = express.Router();
var multer = require("../middlewares/multer")
var { ifAdmin } =require("../middlewares/session")
const{
  adminlogin,
  adminhome,
  admindogcatagory,
  addproduct,
  postadmincart,
 addcategory,
  postaddcategory,
  userlist,
  productlist,
  postAddProduct
}= require("../controller/admin");
router.get("/adminlogin",adminlogin);
router.get("/adminhome",ifAdmin,adminhome);
router.get("/admindogcatagory",admindogcatagory); 
router.get("/admin-product-add",addproduct);
router.post("/postaddproduct",multer.single("image"),postAddProduct);
router.post("/adminhome",postadmincart);
router.get("/admin-category-add",addcategory);
router.post("/postaddcategory",multer.single("image"),postaddcategory);
router.get("/userlist",userlist);
router.get("/productlist",productlist);





module.exports = router;
