var express = require('express');
var router = express.Router();
const{ ifUser, ifUserLogout ,ifCart, ifUserAxios,userCart}= require('../middlewares/sessionHandle')
const {
      userLogin,
      aboutPage,
      contactPage,
      homePage,
      profilePage,
      cartPage,
      checkoutPage,
      faqPage,
      viewProducts,
      userSignup,
      postSignIn,
      userLogout,
      addToCart,
      getSearch,
      getCategory,
      productDetails,
      wish,
      deleteWishlist,
      cartDelete,
      placeOrder,
      proceedOrder,
      getOrderCount,
      getOrders,
      deleteOrder,
      UpdateProfile,
      orderSuccessCOD,
      wishlistCount,
      orderSuccessOnline,
      getAllCategory,
      paymentVerified,
      
      
     
} = require("../controller/user");

//login and sign in
router.post('/signup',userSignup)
router.post('/login',postSignIn)
router.get('/login',ifUserLogout,userLogin);
router.get('/',homePage);

//pages
router.get('/faq',faqPage)
router.get('/about',aboutPage);
router.get('/contact',ifUser,contactPage);


//search
router.get('/search',getSearch)

//views
router.get('/productdetails/:id',productDetails)
router.get('/viewallproducts',viewProducts)
router.get('/getcategory/:id',getCategory)
router.get('/getAllCategory',getAllCategory)
router.get('/profile',ifUser,profilePage);
router.post('/updataprofile',ifUser,UpdateProfile)

//wishlist
router.post('/wishlist',ifUser,wishlistCount)
router.get('/Wishlist',ifUser,wish);
router.post('/deletewish/:id',ifUser,deleteWishlist)



//cart
router.post('/addtocart/:id',ifUser,addToCart)
router.get('/Cart',userCart,ifUser,cartPage);
router.post('/deletecart/:id',ifUser,cartDelete)


//checkout
router.get('/checkout',userCart,ifUser,checkoutPage)
router.post('/checkout',ifUser,checkoutPage)
router.get('/proceedOrder',userCart,ifUser,placeOrder)
router.post('/placeOrder',ifUser,placeOrder)
router.get('/thank-you',orderSuccessCOD)

//orders
router.get('/viewOrders',ifUser,getOrders)
router.post('/cancelOrder/:id',ifUser,deleteOrder)

//logout
router.post('/logout',userLogout)
router.post('/success',ifUser,orderSuccessOnline)
router.get('/confirmation/:id',paymentVerified)



module.exports = router;
