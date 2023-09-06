var express = require('express');
var router = express.Router();
var { ifUser,userCart } =require("../middlewares/session");
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
  toypage,
  deletewishlist,
  viewpage,
  checkout,
  deletecart,
  postwishlist,
  checkoutPage,
  placeorder,
  orderSuccess,
  orderSuccessVerified,
  getAccessories,
  food,
  
} = require("../controller/user");

router.get("/",ifUser,home);
router.get("/login",login);
router.get("/usersignup",signup);
router.post("/postsignup",postsignup);
router.post("/postlogin",postlogin); 
router.get("/getproductsC/:id",dp);
router.get("/toypage/:id",toypage);
router.get("/viewpage/:id",viewpage);
                                      
router.get("/usercart",userCart,ifUser,usercart);
router.post('/usercart/:id',ifUser,addToCart);
router.post("/deletecart/:id",ifUser,deletecart);
                                       
router.get("/userwishlist",ifUser,wishlist);
router.post("/wishlist",ifUser,postwishlist); 
router.post("/deletewish/:id",ifUser,deletewishlist);  



router.post("/checkout",checkoutPage);
router.post('/placeOrder',placeorder);
router.post('/success',orderSuccess)
router.get('/confirmation/:id',orderSuccessVerified)


router.get('/getAccessories/:id',getAccessories)

router.get('/food/:id',food)

router.get('/viewpage',viewpage)



module.exports = router;
