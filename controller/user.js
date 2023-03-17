const database = require("../config/server");
const { User } =require("../model/userdb");
const bcrypt = require("bcrypt");


const postsignup= async(req,res,next)=>{
try{
    console.log(req.body);
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        address:req.body.address,
        number:req.body.number,
        password:req.body.password,
    });
    user.save().then(result=>{
        console.log(result);
        res.redirect('/login');
    })
}
catch(err){
    next(err);
}
}

 const postlogin = async (req,res)=>{
    try{
        console.log(req.body);
        const user = await User.findOne({email:req.body.email})
        if(user){
            console.log(user)
            let data = await bcrypt.compare(req.body.password,user.password)
            if(data) {
                res.redirect("/")
            }
        }else{
            res.send("notpassword")
        }

    }
    catch{
        res.send("NOT ALLOWED")
    }
}
const home = (req,res)=>{
    res.render("home");
}
const login = (req,res)=>{
    res.render("userlogin")
}
const dp = (req,res)=>{
    res.render("dog-catagory")
}

const cp = (req,res)=>{
    res.render("cat-catagory")
}
const bp = (req,res)=>{
    res.render("bird-catagory")
}
const fp = (req,res)=>{
    res.render("fish-catagory")
}
const adminlogin = (req,res)=>{
    res.render("adminlogin")
}
const dog = (req,res)=>{
    res.render("dogcart")
}

const signup = (req,res)=>{
    res.render("usersignup")
}
    


module.exports={
   
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
    postlogin

}