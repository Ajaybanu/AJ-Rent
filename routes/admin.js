var express = require('express');
var router = express.Router();
var multer = require("../middlewares/multer")
var { ifAdmin } =require("../middlewares/session")
const{
  adminlogin,
  admincart,
  admindogcatagory,
  dogaddcart,
  cataddcart,
  birdaddcart,
  fishaddcart,
  postadmincart,
  postdogaddcart,
  postcataddcart,
  postAddBird,
  postfishaddcart,
  adddogproduct,
  postadddogproduct,
  userlist,
  
}= require("../controller/admin");
router.get("/adminlogin",adminlogin);
router.get("/admincart",ifAdmin,admincart);
router.get("/admindogcatagory",admindogcatagory); 
router.get("/dogaddcart",dogaddcart);
router.get("/cataddcart",cataddcart);
router.get("/birdaddcart",birdaddcart);
router.get("/fishaddcart",fishaddcart);
router.post("/admincart",postadmincart);
router.post("/dogaddcart",multer.single("image"),postdogaddcart);
router.post("/cataddcart",multer.single("image"),postcataddcart);
router.post("/birdaddcart",multer.single("image"),postAddBird);
router.post("/postfishaddcart",multer.single("image"),postfishaddcart);
router.get("/dogproductadd",adddogproduct);
router.post("/dogproductadd",multer.single("image"),postadddogproduct);
router.get("/userlist",userlist);





module.exports = router;
