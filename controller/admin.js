const { Dog } = require("../model/dogdb");
const { Cat } = require("../model/catdb");
const { Bird } = require("../model/birddb");
const { Fish } = require("../model/fishdb");
const { User } = require("../model/userdb");
const multer = require("multer");



const adminlogin = (req,res)=>{
    if (req.session.adminlogged) {
        req.session.adminlogerror = false;
    res.render("admincart",{layout:"partials/adminlayout"});
}else{
    req.session.adminlogin = true;
    console.log("Admin login reached");
    res.render("adminlogin", { message: req.session.adminlogerror });
}
};

const adminemail = "ajaybanu7@gmail.com";
const adminpassword = 123;
const postadmincart=(req,res)=>{
    console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;
  
  let data = {
    email: email,
    password: password,
  };if(
    (adminemail == data.email && adminpassword == data.password) ||
    req.session.adminlogged
  ){
    console.log("admin home reached");
    req.session.adminlogged = true;
   
    res.render("admincart",{layout:"partials/adminlayout"});
  }else{
    req.session.adminlogerror = true;
    res.redirect("/admin/adminlogin")
  }
};



const admincart =(req,res)=>{
   
    res.render("admincart")
  };


const admindogcatagory = (req,res)=>{
    res.render("admindogcatagory");
}
const dogaddcart = (req,res)=>{
    res.render("dogaddcart",{layout:"partials/adminlayout"});
}
const postdogaddcart= async (req,res)=>{
  console.log(req.body,"kkkkkkkkkkkkkkkkkkkkkkkk");
  const dog = new Dog({
    breed:req.body.breed,
    age:req.body.age,
   gender:req.body.gender,
    catagory:req.body.catagory,
    price:req.body.price,
    image:req.file.filename,
  })
await dog.save().then((result)=>
  {
    res.redirect("/admin/dogaddcart");
  })
 
  
 }
 
const cataddcart = (req,res)=>{
    res.render("cataddcart",{layout:"partials/adminlayout"});
}
const postcataddcart = (req,res)=>{
  console.log(req.body);
  const cat = new Cat({
    breed:req.body.breed,
    age:req.body.age,
   gender:req.body.gender,
    catagory:req.body.catagory,
    price:req.body.price,
    image:req.file.filename,
  })
  cat.save().then((result)=>{
    res.redirect("/admin/cataddcart");
  })
 }

const birdaddcart =(req,res)=>{
  
    res.render("birdaddcart",{layout:"partials/adminlayout"});
}
const postAddBird = (req,res)=>{
  console.log(req.body);
  const bird = new Bird({
    breed:req.body.breed,
    age:req.body.age,
   gender:req.body.gender,
   catagory:req.body.catagory,
    price:req.body.price,
    image:req.file.filename,
  })
   bird.save().then((result)=>{
    res.redirect("/admin/birdaddcart");
   })
}
const fishaddcart=(req,res)=>{
    res.render("fishaddcart",{layout:"partials/adminlayout"})
}
const postfishaddcart = (req,res)=>{
  console.log(req.body);
  const fish = new Fish({
    breed:req.body.breed,
    age:req.body.age,
    gender:req.body.gender,
    catagory:req.body.catagory,
    price:req.body.price,
   image:req.file.filename,
    aquarium:req.body.aquarium,

  })

  fish.save().then((result)=>{
    res.redirect("/admin/fishaddcart")
  })
}
  const adddogproduct = (req,res)=>{
    res.render("dogproductadd",{layout:"partials/adminlayout"});
   }

   const postadddogproduct = (req,res)=>{
    console.log(req.body);
    const dogproduct = new Dog ({
      breed:req.body.breed,
      catagory:req.body.catagory,
      price:req.body.price,
      image:req.file.filename,
    })
    dogproduct.save().then((result)=>{
      res.redirect("/admin/dogproductadd");
    })
  }
  
const userlist = async(req,res)=>{
await  User.find().then((details)=>{
  console.log(details);
  res.render("userlist",{details,layout:"partials/adminlayout"})
})
   
 
};

 
  





module.exports={
    adminlogin,
    admincart,
    admindogcatagory,
    dogaddcart,
   cataddcart,
   birdaddcart,
   fishaddcart,
   postadmincart,
   postdogaddcart,
   postcataddcart,
   postAddBird,
   postfishaddcart,
   adddogproduct,
   postadddogproduct,
    userlist,
  

  
}