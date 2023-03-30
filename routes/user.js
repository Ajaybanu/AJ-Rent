var express = require('express');
var router = express.Router();
var { ifUser } =require("../middlewares/session")
var multer = require("multer");

const{
  home,
  dp,
  cp,
  bp,
  fp,
  login,
  dog,
  signup,
  postsignup,
  postlogin,
  usercart,
  dogcart,
  catcart,
  wishlist,
  addToCart,
  birdcart,
  fishcart,
  dogfood,
  dogclothes,
  dogshampo,
  dogtoy,
  dogaccessories,
  
  

} = require("../controller/user");

router.get("/",ifUser,home);
router.get("/login",login);
router.get("/usersignup",signup)
router.post("/postsignup",postsignup)
router.post("/postlogin",postlogin) 
router.get("/d-p",dp);
router.get("/c-p",cp);
router.get("/f-p",fp);
router.get("/b-p",bp);
router.get("/dog",dog);
router.get("/",usercart);
router.post('/usercart',addToCart);
router.get("/dogcart",dogcart);
router.get("/catcart",catcart);
router.get("/userwishlist",wishlist);

router.get("/birdcart",birdcart);
router.get("/fishcart",fishcart);
router.get("/dogfood",dogfood);
router.get("/dogclothes",dogclothes);
router.get("/dogshampo",dogshampo);
router.get("/dogtoy",dogtoy);
router.get("/dogaccessories",dogaccessories);

module.exports = router;
