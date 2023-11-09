const {  Users }=require("../model/user_Schema")
const ifAdmin= (req,res,next)=>{
    if(req.session.admin_id){
    next();
}
else{
    res.redirect("/admin/adminlogin")
}
}

const ifUser = (req,res,next)=>{
    if(req.session.user_id){
    next();
}
else{
    res.redirect("/login")
}
}
const ifUserLogout = async (req,res,next)=>{
    if(req.session.user_id){
       res.redirect('/')
    }
    next()
   }
const ifCart = (req, res, next) => {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    next();
  };


const ifAdminAxios= async(req,res,next)=>{
    if(req.session.admin_id){
        next() 
    }
     else{
        res.send({msg_login:true})
     }   
    }



const ifUserAxios= async(req,res,next)=>{
    if(req.session.user_id){
        if (await Users.findOne({ _id: req.session.user_id, status: true })){
        next() 
        }
        else{
            req.session.loginuser=false
        }
}
else{
    
    res.send({msg_login:true})
}
}

// const ifUser= async(req,res,next)=>{
//     if(req.session.loginuser){
//         if (await users.findOne({ _id: req.session.userId, status: true })){
//         next() 
//         }
//         else{
//             req.session.loginuser=false
//         }
// }
// else{
    
//     if(req.path=="/cart"){
//         req.session.loginTocart=true
        
//     }
//     else if(req.path=="/wishList"){
//         req.session.loginToWishList=true
//     }
//     res.redirect("/")
// }
// }
const ifAdminLogout = async (req,res,next)=>{
 if(req.session.admin_id){
    res.redirect('/admin')
 }
 next()
}

let userCart =(req, res, next) => {
    if (req.session.user_id) {
      Users.findById(req.session.user_id).then(user => {
    
  
        const totalPrice = user.cart.reduce((total, item) => {
          return total + item.total 
        }, 0);
  
        res.locals.totalPrice = totalPrice;
        next();
      });
    } else {
      res.locals.totalPrice = 0;
      next();
    }
  };
module.exports={ ifAdmin,ifUser,ifAdminLogout,ifUserLogout,ifCart,ifUserAxios,ifAdminAxios,userCart}
// ifAdminAxios