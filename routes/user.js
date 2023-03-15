var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});


router.get('/usersignup',(req,res)=>{
  res.render('usersignup')
})

router.get('/adminlogin',(req,res)=>{
  res.render("adminlogin")
})

router.get("/userlogin",(req,res)=>{
  res.render("userlogin")
})

router.post("/submit",(req,res)=>{
  res.redirect("/userlogin")
})
router.get("/signup",(req,res)=>{
  res.redirect("/usersignup")

})
router.get("/d-p",(req,res)=>{
  res.render("dog-catagory")
})
router.get("/c-p",(req,res)=>{
  res.render("cat-catagory")
})
router.get("/f-p",(req,res)=>{
  res.render("fish-catagory")
})
router.get("/b-p",(req,res)=>{
  res.render("bird-catagory")
})
router.get("/dog",(req,res)=>{
  res.render("dogcart")
})

module.exports = router;
