var express = require('express');
var router = express.Router();

const{
 
  
  home,
  dp,
  cp,
  bp,
  fp,
  adminlogin,
  login,
  dog,
  signup,
  postsignup,
  postlogin,
 
} = require("../controller/user");


router.get("/",home);
router.get("/login",login);
router.get("/usersignup",signup)
router.post("/postsignup",postsignup)
router.post("/postlogin",postlogin)




  
  
router.get("/d-p",dp);

router.get("/c-p",cp);

router.get("/f-p",fp);

router.get("/b-p",bp);

router.get("/dog",dog);

router.get("/adminlogin",adminlogin);

module.exports = router;
