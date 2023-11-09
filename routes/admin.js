var express = require('express');
var router = express.Router();
const multer = require('../middlewares/multer')
const { ifAdmin,ifAdminLogout, ifAdminAxios } = require('../middlewares/sessionHandle')

const {
  adminLogin,
  adminViewProduct,
  adminlog,
  adminSignup,
  adminHome,
  adminAddProduct,
  adminViewUsers,
  adminLogout,
  addCategory,
  adminViewCategory,
  deleteProduct,
  listProducts,
  deleteCategory,
  editProduct,
  editCategory,
  updateCategory,
  updateProduct,
  postCreateCoupon,
  manageCoupons,
  adminViewWish,
  manageOrder,
  deleteCoupon,
  UpdateProfile,
  sales,
  orderedUsers,
  orderUdetails,
  orderAction,
  deleteOrder, 
  getChart
  
} = require("../controller/admin");

const { axios } = require('axios');





//admin log routes
router.get('/',ifAdmin,adminHome)
router.get('/adminlogin',ifAdminLogout,adminlog)
router.post('/adminlogin',adminLogin)
router.post('/adminsignup',adminSignup)
router.post('/logout',adminLogout)

//update profile
router.get('/updateprofile',ifAdmin,UpdateProfile)

//manage users
router.get('/adminviewusers',ifAdmin,adminViewUsers)
router.get('/orderedUsers',ifAdmin,orderedUsers)
router.get('/orderedUsers/:id',ifAdmin,orderUdetails)

//manage products
router.get('/adminviewproducts',ifAdmin,adminViewProduct)
router.get('/viewproductsC/:id',ifAdmin,listProducts)
router.post('/addproduct',ifAdmin,multer.single("image"),adminAddProduct)
router.get('/productedit/:id',ifAdmin,editProduct)
router.post('/updateproduct/:id',multer.single("image"),updateProduct)
router.get('/delete/:id',ifAdmin,deleteProduct)


//manage category
router.post('/addcategory',ifAdmin,multer.single("image"),addCategory)
router.get('/adminviewcategories',ifAdmin,adminViewCategory)
router.get("/deleteCat/:id",ifAdmin,ifAdminAxios, deleteCategory)
router.get('/editcat/:id',ifAdmin,editCategory)
router.post('/updatecategory/:id',ifAdmin,multer.single("image"),updateCategory)
// router.delete('/deleteCat/:id',ifAdminAxios,deleteCategory)

//manage coupons
router.post('/addcoupon',ifAdmin,postCreateCoupon)
router.get('/managecoupons',ifAdmin,manageCoupons)
router.get('/deletecoupon/:id',ifAdmin,deleteCoupon)

//view wishlisted products
router.get('/viewwishlisted/:id',adminViewWish)

//manage orders
router.get('/getorder',ifAdmin,manageOrder)
router.post('/update-order-status/:orderId',orderAction)
router.get('/deleteOrder/:orderId',deleteOrder)
//manage sales
router.get('/total-sales',getChart)
router.get('/sales',ifAdmin,sales)

module.exports = router;
