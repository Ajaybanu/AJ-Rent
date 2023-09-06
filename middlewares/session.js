const { User } = require("../model/userdb");
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
        req.session.userLogged
    next();
}
else{
    res.redirect("/login")
}
}
let userCart =(req, res, next) => {
    if (req.session.user_id) {
      User.findById(req.session.user_id).then(user => {
    
  
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

module.exports={ ifAdmin,ifUser,userCart};
