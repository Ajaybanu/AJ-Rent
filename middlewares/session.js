
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


module.exports={ ifAdmin,ifUser};
