const { Products } = require("../model/productdb")
const { Category } = require("../model/category")
const { User } = require("../model/userdb");
const multer = require("multer");
const async = require("hbs/lib/async");
const { localsAsTemplateData } = require("hbs");



const adminlogin = (req,res)=>{
    if (req.session.adminlogged) {
        req.session.adminlogerror = false;
    res.render("adminhome",{layout:"partials/adminlayout"});
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
   
    res.render("adminhome",{layout:"partials/adminlayout"});
  }else{
    req.session.adminlogerror = true;
    res.redirect("/admin/adminlogin")
  }
};



const adminhome =(req,res)=>{
   
    res.render("adminhome")
  };


const admindogcatagory = (req,res)=>{
    res.render("admindogcatagory");
}
const addproduct =async(req,res)=>{
  let category = await Category.find()
    res.render("admin-product-add",{layout:"partials/adminlayout",category});
}
const postAddProduct = async (req, res) => {
  console.log(req.body);
  let Categories = req.body.category;
  console.log(Categories);
  const category = await Category.findOne({ name: Categories })
  if (!category) {
    console.log("category invalid");
  }
  if (category) {
    let data = category.id.toString();
    const product = new Products({

      name: req.body.name,
      description: req.body.description,
      image: req.file.filename,
      price: req.body.price,
      category: data,
      countInStock: req.body.countInStock,
      
     

    });
    product.save().then((productsadded) => {
      console.log(productsadded);
      

      res.redirect('/admin/adminhome')

    })
  }
}





  const addcategory = async(req,res)=>{
    let category = await Category.find()
      res.render("admin-category-add",{category,layout:"partials/adminlayout"});
    }
    
   

   const postaddcategory= (req,res)=>{
    console.log(req.body);
    const category = new Category ({
      name:req.body.name,
      image:req.file.filename,
     description:req.body.description
    })
    category.save().then((data)=>{
      console.log(data);
      res.redirect("/admin/admin-category-add");
    })
  }
  
const userlist = async(req,res)=>{
await  User.find().then((details)=>{
  console.log(details);
  res.render("userlist",{details,layout:"partials/adminlayout"})
})
};

const productlist = async(req,res)=>{
 
   res.render("productlist",{layout:"partials/adminlayout"})
  
}

 
  





module.exports={
    adminlogin,
    adminhome,
    admindogcatagory,
    addproduct,
  
  
   postadmincart,
   
   
   addcategory,
   postaddcategory,
    userlist,
    productlist,
    postAddProduct,
  

  
}