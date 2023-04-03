var express = require('express');
var router = express.Router();
var { ifUser } =require("../middlewares/session");
var multer = require("multer");

const{
  home,
  dp,
  login,
  signup,
  postsignup,
  postlogin,
  usercart,
  addToCart,
  wishlist,

  postwishlist,
} = require("../controller/user");

router.get("/",ifUser,home);
router.get("/login",login);
router.get("/usersignup",signup);
router.post("/postsignup",postsignup);
router.post("/postlogin",postlogin); 
router.get("/getproductsC/:id",dp);

router.get("/",usercart);
router.post('/usercart',addToCart);
router.get("/userwishlist",wishlist)
router.post("/postwishlist/:id",postwishlist);


module.exports = router;
